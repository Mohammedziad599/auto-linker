if (typeof browser === "undefined") {
  // browser is where firefox have the browser API's
  // this is to make browser work in chromium based browsers.
  var browser = chrome;
}
let oldUrl = window.location.href;
let username = '';
let repoName = '';
let href = '';
let regex = '';
let jiraLink = '';

const getPullRequestElement = (href) => {
  if (href.includes('/commits')) {
    return document.querySelector('h1[data-component="PH_Title"] .markdown-title');
  } else {
    return document.querySelector('bdi.js-issue-title.markdown-title');
  }
}

function performLinking() {
  if (window.location.href.includes(href)) {
    let pullRequestTitleElement = getPullRequestElement(window.location.href);
    let pullRequestTitleText = pullRequestTitleElement?.textContent;
    let pullRequestTitleContent = pullRequestTitleElement?.innerHTML;
    if (!pullRequestTitleText || pullRequestTitleContent?.includes('</a>')) {
      return;
    }

    const tickets = new Set(pullRequestTitleText.match(regex) ?? []);

    [...tickets].forEach((issueTicket) => {
      let issueTicketLink = document.createElement('a');
      issueTicketLink.setAttribute('href', `${jiraLink}${issueTicket}`);
      issueTicketLink.innerHTML = issueTicket;
      pullRequestTitleText = pullRequestTitleText.replaceAll(new RegExp(`\\b${issueTicket}\\b`, 'g'), issueTicketLink.outerHTML);
    });

    pullRequestTitleElement.innerHTML = pullRequestTitleText;
  }
}

function getSettings() {
  function setSettings(results) {
    username = results.username || "Test";
    repoName = results.repoName || "Test";
    href = `github.com/${username}/${repoName}/pull`;
    regex = new RegExp(results.regex || "TEST-[0-9]+", 'g');
    jiraLink = results.jiraLink || "https://test.atlassian.com/browse/";
    performLinking();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let gettingSettings = browser.storage.sync.get();
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
browser.storage.onChanged.addListener(getSettings);
getSettings();