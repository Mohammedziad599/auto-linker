
let saveSettings = (event) => {
  event.preventDefault();
  browser.storage.sync.set({
    regex: document.querySelector("#regex").value,
    username: document.querySelector("#username").value,
    repoName: document.querySelector("#repo-name").value,
    jiraLink: document.querySelector("#jira-link").value,
  });
}

let restoreSettings = () => {
  let setValues = (result) => {
    document.querySelector("#regex").value = result.regex || "TEST-[0-9]+";
    document.querySelector("#username").value = result.username || "Test";
    document.querySelector("#repo-name").value = result.repoName || "Test";
    document.querySelector("#jira-link").value = result.jiraLink || "https://test.atlassian.com/browse/";
  }

  let onError = (error) => {
    console.log(`Error: ${error}`);
  }

  let getData = browser.storage.sync.get();
  getData.then(setValues, onError);
}

document.addEventListener("DOMContentLoaded", restoreSettings);
document.querySelector("#form").addEventListener("submit", saveSettings);