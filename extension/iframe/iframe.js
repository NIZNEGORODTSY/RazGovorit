// Получаем информацию о странице
//document.getElementById('page-info').textContent = 
  //`URL: ${window.parent.location.href}\nTitle: ${window.parent.document.title}`;
//console.log('sDFSDFsdv')


// Кнопка закрытия
document.getElementById("close-btn").addEventListener("click", () => {
  // Закрываем iframe (отправляем сообщение родителю или просто скрываем)
  window.parent.postMessage({ action: "close-iframe" }, "*");

});




//document.getElementById("demo").innerHTML = 'erfgergXEP';
// Слушаем сообщения из content script
window.addEventListener('message', (event) => {
  //document.getElementById("demo").innerHTML = event.data.type;
  // Проверяем origin сообщения
  //
  //
  // document.getElementById("test").innerHTML = "dfg";
  //document.getElementById("demo").innerHTML = event.data.data;
  // Обработка данных
  document.getElementById("trans").innerHTML = event.data.type;
  if (event.data.type === 'text') {
    document.getElementById("text").innerHTML = event.data.data;
  }
  if (event.data.type === 'trans') {

    document.getElementById("trans").innerHTML = event.data.data;


    let disabled = false;
    const easyTextBtn = document.getElementById('easy')

    easyTextBtn.addEventListener("click", async () => {
        if(disabled) {
            return;
        }

        let outputArea = document.getElementById("trans");
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

  }

});