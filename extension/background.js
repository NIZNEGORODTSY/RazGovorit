//import * as ort from 'onnxruntime-web';

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        return new Promise((resolve) => {
            chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
                let url = new URL(details.url);
                if (data.blockedDomains.includes(url.hostname)) {
                    resolve({ cancel: true });
                } else {
                    resolve({ cancel: false });
                }
            });
        });
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.runtime.onInstalled.addListener(() => {
    console.log("Cookie Manager Extension Installed.");
});



function square(number) {
    return number+'(+background)';
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "translatethis_toback") {
      console.log("Message from popup:", request.text);
      sendResponse({reply: "Message received!"});

      // Отправка обратно в popup
      chrome.runtime.sendMessage({
        type: "translatethis_topop",
        data: "Processed: " + square(request.text)
      });
    }

    if (request.type === "content_to_background") {
        console.log("Message from popup:", request.text);
        sendResponse({reply: "Message received!"});

        // Отправка обратно в popup
        chrome.runtime.sendMessage({
          type: "background_to_content",
          data: "Processed: " + square(request.text)
        });
      }
  });

