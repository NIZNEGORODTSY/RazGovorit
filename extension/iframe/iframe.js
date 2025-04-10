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
  }

});