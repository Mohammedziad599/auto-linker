let oldUrl = window.location.href;
let configurations = [];

const getPullRequestElement = (href) => {
  if (href.includes('/commits')) {
    return document.querySelector('h1[data-component="PH_Title"] .markdown-title');
  } else {
    return document.querySelector('bdi.js-issue-title.markdown-title');
  }
}

const getRepoInfoFromUrl = (url) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return {
      githubUsername: match[1],
      repositoryName: match[2]
    };
  }
  return null;
};

const findMatchingConfigurations = (url) => {
  const repoInfo = getRepoInfoFromUrl(url);
  if (!repoInfo) return null;

  return configurations.filter(config =>
    config.githubUsername === repoInfo.githubUsername &&
    config.repositoryName === repoInfo.repositoryName
  );
};

const getJiraUrl = (url, Ticket) => {
  const hasTicketKeyPlaceholder = url.includes('{{Ticket}}');

  if (!hasTicketKeyPlaceholder) {
    return `${url}${url.endsWith('/') ? '' : '/'}${Ticket}`;
  }

  return url.replace('{{Ticket}}', Ticket);
}

function performLinking() {
  const matchingConfigs = findMatchingConfigurations(window.location.href);
  if (!matchingConfigs?.length) return;


  const expectedPath = `github.com/${matchingConfigs[0].githubUsername}/${matchingConfigs[0].repositoryName}/pull`;
  if (!window.location.href.includes(expectedPath)) return;

  let pullRequestTitleElement = getPullRequestElement(window.location.href);
  let pullRequestTitleText = pullRequestTitleElement?.textContent;
  let pullRequestTitleContent = pullRequestTitleElement?.innerHTML;

  if (!pullRequestTitleText || pullRequestTitleContent?.includes('</a>')) {
    return;
  }

  for (const matchingConfig of matchingConfigs) {
    const regex = new RegExp(matchingConfig.regexPattern, 'g');
    const tickets = new Set(pullRequestTitleText.match(regex) ?? []);

    [...tickets].forEach((issueTicket) => {
      let issueTicketLink = document.createElement('a');
      issueTicketLink.setAttribute('href', `${getJiraUrl(matchingConfig.jiraUrl, issueTicket)}`);
      issueTicketLink.innerHTML = issueTicket;
      pullRequestTitleText = pullRequestTitleText.replaceAll(new RegExp(`\\b${issueTicket}\\b`, 'g'), issueTicketLink.outerHTML);
    });
  }

  pullRequestTitleElement.innerHTML = pullRequestTitleText;
}

function getSettings() {
  function setSettings(results) {
    if (results?.configurations?.length > 0) {
      configurations = results.configurations;
    }
    performLinking();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let gettingSettings = browser.storage.local.get();
  gettingSettings.then(setSettings, onError);
}

setInterval(() => {
  let pullRequestTitleElement = getPullRequestElement(window.location.href);
  let pullRequestTitleContent = pullRequestTitleElement?.innerHTML;

  if (oldUrl !== window.location.href || !pullRequestTitleContent?.includes('</a>')) {
    oldUrl = window.location.href;
    performLinking();
  }
}, 500);

window.onload = performLinking;
document.addEventListener("DOMContentLoaded", performLinking);
browser.storage.local.onChanged.addListener(getSettings);
getSettings();