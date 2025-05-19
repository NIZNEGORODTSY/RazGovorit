const host = "http://46.29.160.85:5000";

const divContent = document.getElementById("content");

const inputArea = document.getElementById("textInput");

const easyTextBtn = document.getElementById("easyText");
const superEasyTextBtn = document.getElementById("superEasyText");

const fileInput = document.getElementById("file-upload");
const fileUploadBtn = document.getElementById("file-send");
const fileInfo = document.getElementById("file-info");

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

let disabled = false;

easyTextBtn.addEventListener("click", async () => {
    if(disabled) {
        return;
    }

    checkOutputField();

    let outputArea = document.getElementById("textOutput");

    // Блокируем кнопку на время выполнения запроса
    disabled = true;
    outputArea.textContent = "Упрощаем...";

    await fetch(`${host}/simplify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: inputArea.value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        const data = response.json();
        outputArea.textContent = data.result;
    })
    .catch(exception => {
        console.error("simplify failed:", exception);
    });
    // Разблокируем кнопку
    disabled = false;
});


superEasyTextBtn.addEventListener("click", async () => {
    if(disabled) {
        return;
    }

    checkOutputField();

    let outputArea = document.getElementById("textOutput");

    // Блокируем кнопку на время выполнения запроса
    disabled = true;
    outputArea.textContent = "Упрощаем...";

    await fetch(`${host}/clearize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: inputArea.value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = response.json();
        outputArea.textContent = data.result;
    })
    .catch(exception => {
        console.error("simplify failed:", exception);
    });

    // Разблокируем кнопку
    disabled = false;
});

let file = null;

// Файл выбран
fileInput.addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
        file = event.target.files[0];
        displayFileInfo(file);
    }
});

function displayFileInfo(file) {
    fileInfo.innerHTML = `
            <p><strong>Name:</strong> ${file.name}</p>
            <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
        `;
}

fileUploadBtn.addEventListener("click", async () => {
    if (!file.name.endsWith(".docx")) {
        alert("Поддерживается только .docx формат\nПожалуйста, выберите другой файл");
        return;
    }
    const formData = new FormData();
    formData.append("docxFile", file);

    // TODO отправка запроса на сервер, получение ответа в виде файла и скачивание его пользователю
    await fetch(`${host}/processFile`, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            const data = response.json()
            throw new Error(`Ошибка сервера: ${data}`);
        }

        /*const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return response.blob();
        }*/
    })
    /*.then(data => {
        if (data instanceof Blob) {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = "processed.txt";
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    })*/
    .catch(exception => {
        console.error('file simplify failed:', exception);
    })
});

let isSettings = false;

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
        toggleAutoBtn.textContent = "В разработке" /*"Автоматическое упрощение"*/

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

        svg.setAttribute("class", "bi bi-gear");
        path1.setAttribute("d", "M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0");
        path1.setAttribute("fill-rule", "");
        path2.setAttribute("d", "M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z");

    }
});

chrome.storage.local.get(['selectedText'], (result) => {
    if (result.selectedText) {
        inputArea.textContent = result.selectedText;
    }
});
