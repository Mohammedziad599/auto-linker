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

function performLinking() {
  if (window.location.href.includes(href)) {
    let pullRequestTitleElement = document.querySelector('bdi.js-issue-title.markdown-title');
    let pullRequestTitleText = pullRequestTitleElement?.textContent;
    if (!pullRequestTitleText || pullRequestTitleText?.includes('</a>')) {
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
  let pullRequestTitleElement = document.querySelector('bdi.js-issue-title.markdown-title');
  let pullRequestTitleText = pullRequestTitleElement?.textContent;
  let pullRequestNotLinked = false;

  if (!pullRequestTitleText?.includes('</a>')) {
    pullRequestNotLinked = true;
  }

  if (oldUrl !== window.location.href || pullRequestNotLinked) {
    oldUrl = window.location.href;
    performLinking();
  }
}, 500);

window.onload = performLinking;
document.addEventListener("DOMContentLoaded", performLinking);
browser.storage.onChanged.addListener(getSettings);
getSettings();