// Navigation history
let history = [];
let current = -1;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ apis: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAPIs") {
    chrome.storage.sync.get("apis", (data) => {
      sendResponse(data.apis || []);
    });
  } else if (request.action === "saveAPIs") {
    chrome.storage.sync.set({ apis: request.data }, () => {
      sendResponse({ success: true });
    });
  } else if (request.action === "navigate") {
    if (request.direction === "back" && current > 0) {
      current--;
      sendResponse({ api: history[current] });
    } else if (request.direction === "forward" && current < history.length - 1) {
      current++;
      sendResponse({ api: history[current] });
    }
  }
  return true;
});
