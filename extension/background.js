function openPopup(tabId) {
  chrome.action.openPopup();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processSelection") {
        chrome.storage.local.set({ selectedText: request.text });
        
        chrome.windows.getCurrent(w => {
            chrome.action.openPopup();
        });

    }
});
