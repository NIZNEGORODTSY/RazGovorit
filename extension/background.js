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







    //Отправить запрос на API






    return number+'(+background)';
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


    if (request.type === "translatethis_toback") {
      console.log("КНОПКАААААААААААААА", request.text);
      sendResponse({reply: "Message received!"});

      // Отправка обратно в popup
      chrome.runtime.sendMessage({
        type: "translatethis_topop",
        data: "Processed: " + square(request.text)
      });
      return true;
    }

    if (request.type === "ping") {
      fetchUserData(request.userId)
      .then(result => {        sendResponse({ success: true, data: result });      })
      .catch(error => {        sendResponse({ success: false, error: error.message });      });

      }

  });

  async function fetchUserData(userId) {
    // Ваша логика получения данных
    return { name: "John Doe", id: userId };
  }

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "my-connection") {
      console.log("Новое соединение установлено");

      // Обработка входящих сообщений
      port.onMessage.addListener((msg) => {
      if (msg.type==="translate_to_back") {
        port.postMessage({type:"result_translate",data: square(msg.data)});
        console.log("Получено:", msg);
      }
      });
    }
  });