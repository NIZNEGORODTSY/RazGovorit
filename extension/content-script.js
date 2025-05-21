// Создаем кнопку и добавляем в DOM
const popupButton = document.createElement('button');
popupButton.className = 'selection-popup';
document.body.appendChild(popupButton);

const popupImg = document.createElement('img');
popupImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAABY0lEQVR4nNWUwSqFQRTHf3GjLBQLD3Drlp1HYHvZkmRNFq6tlVhZ3CXFI4gnsLDTzcbCA4gFiSRyEyVGU/+b43Pvd+f75rPwr1Mzc+b0mzlz5gCsAE3AZbQmUCOD8kCcgQWrFZRVLmtcWkBeX9eA0JT9H5DXPPAOzPCtbe05MmsuFjSr+RNQAaaAD8HHigR5HWjt2pT/Gj/ligANAOfGdwr0FA2qAIdtCuAMeInpIM6AtvQWfv4IzAHTwF1E93CtDmJBl8AbsAOMmFsOR4JcEjQkG09JcdKu9BW8XaSBYpqqAzbNYdbTQLVI2Kgq0lsZ+OwESktRt9SdyDdh0n38F6Al+XZVQF4LRYNeVTgllf+9xoMd/tsvbQS+zb72l/Q2ZY299kJAobBJ7a0Ci7KqWQsCea2mQG51+j7gwaz7btIP9AI3oaCkbFBDN6i3OURdvkYRIJfDghXzqZ+zgPJ2EA9Z/gJDb3nHQsi62AAAAABJRU5ErkJggg==');
popupButton.appendChild(popupImg);

let selectionTimeout;

// Обработчик выделения текста
document.addEventListener('selectionchange', function() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
        clearTimeout(selectionTimeout);

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        popupButton.style.display = 'block';
        popupButton.style.top = `${window.scrollY + rect.top - 40}px`;
        popupButton.style.left = `${window.scrollX + rect.left + rect.width/2 - 50}px`;

        selectionTimeout = setTimeout(() => {
        popupButton.style.display = 'block';
        }, 100);
    } else {
        selectionTimeout = setTimeout(() => {
        popupButton.style.display = 'none';
        }, 200);
    }
});

// Обработчик клика по кнопке
popupButton.addEventListener('click', function() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
        // Отправляем сообщение в background script
        chrome.runtime.sendMessage({
            action: "processSelection",
            text: selectedText
        });
    }
    
    popupButton.style.display = 'none';
});