let oldUrl = window.location.href;
let username = '';
let repoName = '';
let href = '';
let regex = '';
let jiraLink = '';

function performLinking() {
    if (window.location.href.includes(href)) {
        let pullRequestTitleElement = document.querySelector('bdi.js-issue-title.markdown-title');
        let pullRequestTitleText = pullRequestTitleElement.textContent;

        pullRequestTitleText.match(regex).forEach((issueTicket) => {
            let issueTicketLink = document.createElement('a');
            issueTicketLink.setAttribute('href', `${jiraLink}${issueTicket}`);
            issueTicketLink.innerHTML = issueTicket;
            pullRequestTitleText = pullRequestTitleText.replace(issueTicket, issueTicketLink.outerHTML);
        });

        console.info(pullRequestTitleText);
        pullRequestTitleElement.innerHTML = pullRequestTitleText;
    }
};


function getSettings() {
    function setSettings(results) {
        username = results.username || "Test";
        repoName = results.repoName || "Test";
        href = `github.com/${username}/${repoName}/pull`;
        regex = results.regex || "TEST-[0-9]+";
        regex = new RegExp(regex);
        jiraLink = results.jiraLink || "https://test.atlassian.com/browse/";
        performLinking();
    };

    function onError(error) {
        console.log(`Error: ${error}`);
    };

    let gettingSettings = browser.storage.sync.get();
    gettingSettings.then(setSettings, onError);
};


setInterval(() => {
    if (oldUrl !== window.location.href) {
        oldUrl = window.location.href;
        performLinking();
    }
}, 200);

window.onload = performLinking;
document.addEventListener("DOMContentLoaded", performLinking);
browser.storage.onChanged.addListener(getSettings);
getSettings();
