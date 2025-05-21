function openPopup(tabId) {
  chrome.action.openPopup();
}

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.set({ "settings_popupBtnCond": "1" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processSelection") {
        chrome.storage.local.set({ selectedText: request.text });
        
        chrome.windows.getCurrent(w => {
            chrome.action.openPopup();
        });

    }
});
