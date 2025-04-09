// Получаем информацию о странице
//document.getElementById('page-info').textContent = 
  //`URL: ${window.parent.location.href}\nTitle: ${window.parent.document.title}`;
//console.log('sDFSDFsdv')


// Кнопка закрытия
document.getElementById("close-btn").addEventListener("click", () => {
  // Закрываем iframe (отправляем сообщение родителю или просто скрываем)
  window.parent.postMessage({ action: "close-iframe" }, "*");
});

// Анализ страницы
document.getElementById('analyze-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'ANALYZE_PAGE',
    url: window.parent.location.href
  }, (response) => {
    alert(`Analysis complete: ${response.result}`);
  });
});

// Выбор цвета
document.getElementById('color-picker').addEventListener('input', (e) => {
  window.parent.postMessage({
    type: 'SET_HIGHLIGHT_COLOR',
    color: e.target.value
  }, '*');
});

window.addEventListener("message", (event) => {
  if (event.data.type === "TO_IFRAME") {
    console.log("Получено из background.js:", event.data.data);
    document.getElementById('kek').textContent = event.data.data;
  }
});

let disabled = false;
const easyBtn = document.getElementById("easy")

easyBtn.addEventListener("click", async () => {
    alert('aaa');
    if(disabled) {
        return;
    }

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