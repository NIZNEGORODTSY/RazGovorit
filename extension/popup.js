document.addEventListener("DOMContentLoaded", () => {
    loadBlockedDomains();
});

// document.getElementById("viewCookies").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         let url = tabs[0].url;
//         chrome.cookies.getAll({ url }, (cookies) => {
//             let cookieList = document.getElementById("blockList");
//             cookieList.innerHTML = "";
//             cookies.forEach(cookie => {
//                 let li = document.createElement("li");
//                 li.textContent = `${cookie.name} = ${cookie.value}`;
//                 cookieList.appendChild(li);
//             });
//         });
//     });
// });

// document.getElementById("deleteCookies").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         let url = tabs[0].url;
//         chrome.cookies.getAll({ url }, (cookies) => {
//             cookies.forEach(cookie => {
//                 chrome.cookies.remove({ url, name: cookie.name });
//             });
//             alert("Cookies deleted!");
//         });
//     });
// });

// document.getElementById("blockDomain").addEventListener("click", () => {
//     let domain = document.getElementById("blockDomainInput").value.trim();
//     if (domain) {
//         chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
//             let blockedDomains = new Set(data.blockedDomains);
//             blockedDomains.add(domain);
//             chrome.storage.sync.set({ blockedDomains: Array.from(blockedDomains) }, () => {
//                 loadBlockedDomains();
//                 alert(`Заблокирован ${domain}`);
//             });
//         });
//     }
// });

// function loadBlockedDomains() {
//     chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
//         let blockList = document.getElementById("blockList");
//         blockList.innerHTML = "";
//         data.blockedDomains.forEach(domain => {
//             let li = document.createElement("li");
//             li.textContent = domain;
//             let removeBtn = document.createElement("button");
//             removeBtn.textContent = "Разблокировать";
//             removeBtn.onclick = () => unblockDomain(domain);
//             li.appendChild(removeBtn);
//             blockList.appendChild(li);
//         });
//     });
// }

// function unblockDomain(domain) {
//     chrome.storage.sync.get({ blockedDomains: [] }, (data) => {
//         let blockedDomains = data.blockedDomains.filter(d => d !== domain);
//         chrome.storage.sync.set({ blockedDomains }, () => {
//             loadBlockedDomains();
//             alert(`Разблокирован ${domain}`);
//         });
//     });
// }

var divContent = document.getElementById("content");
var inputArea = document.getElementById("textInput");
var easyTextBtn = document.getElementById("easyText")

var isSettings = false;

function checkOutputField() {
    if (!document.getElementById("textOutput")) {
        const outputArea = document.createElement("textarea");
        const clearButton = document.createElement("button");

        outputArea.setAttribute("id", "textOutput");
        clearButton.setAttribute("id", "clearOutput");
        clearButton.textContent = "Очистить";

        divContent.appendChild(outputArea);
        divContent.appendChild(clearButton);

        clearButton.addEventListener("click", () => {
            let button = document.getElementById("clearOutput");
            let outputArea = document.getElementById("textOutput");
            divContent.removeChild(outputArea);
            divContent.removeChild(button);

        });
    }
}

//  async function processSimple(textCur) {

//     let result;
//     const response = await fetch("http://localhost:5000/simplify", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             text: textCur
//         })
//     })
//     const data = response.json()
//     return data
// }

function processClear(text) {
    return "Ясный текст";
}



let disabled = false;


easyTextBtn.addEventListener("click", async () => {
    if(disabled) {
        return;
    }

    checkOutputField();

    let outputArea = document.getElementById("textOutput");
    try {
        // Блокируем кнопку на время выполнения запроса
        disabled = true;
        outputArea.textContent = "Упрощаем...";

        const response = await fetch('http://46.29.160.85:5000/simplify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: inputArea.value
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        outputArea.textContent = data.result;

    } finally {
        // Разблокируем кнопку
        disabled = false;
    }

    // outputArea.value = processSimple(inputArea.value);
});


document.getElementById("clearText").addEventListener("click", () => {
    checkOutputField();

    let outputArea = document.getElementById("textOutput");
    outputArea.value = processClear(inputArea.value);
});



document.getElementById("settings-btn").addEventListener("click", () => {
    const settingsDiv = document.getElementById("settings");
    const btnDiv = document.getElementById("button");
    const btn = document.getElementById("settings-btn");
    const exit_btn = document.getElementById("exit-btn");
    if (!isSettings) {
        isSettings = true;

        const svg = document.getElementById("svg");
        const path1 = document.getElementById("path1");
        const path2 = document.getElementById("path2");

        const settingsContent = document.createElement("div");
        settingsContent.setAttribute("id", "settings-content")

        const toggleAutoBtn = document.createElement("button");
        toggleAutoBtn.setAttribute("id", "toggle-auto-btn");
        toggleAutoBtn.textContent = "Автоматическое упрощение"

        svg.setAttribute("class", "bi bi-arrow-return-left")
        path1.setAttribute("d", "M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5")
        path1.setAttribute("fill-rule", "evenodd")
        path2.setAttribute("d", "")

        settingsContent.appendChild(toggleAutoBtn);
        settingsDiv.appendChild(settingsContent);
    }
    else {
        isSettings = false;
        settingsDiv.removeChild(document.getElementById("settings-content"));

        svg.setAttribute("class", "bi bi-gear")
        path1.setAttribute("d", "M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0")
        path1.setAttribute("fill-rule", "")
        path2.setAttribute("d", "M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z")

    }
});

