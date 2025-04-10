let iframe = null;
let currentToolbar = null;
let port = null; // Выносим порт в глобальную область
const translateBtn = document.querySelector('.translate-btn');

// Функция создания/переподключения порта
function connectPort() {
  if (port) {
    try {
      port.disconnect(); // Корректно закрываем предыдущее соединение
    } catch (e) {
      console.warn("Ошибка при отключении порта:", e);
    }
  }

  port = chrome.runtime.connect({
    name: "my-connection"
  });

  // Обработчики сообщений
  port.onMessage.addListener((message) => {
    console.log("Сообщение от background:", message);
    if (message.type === "result_translate") {
      const iframeLoadHandler = () => {
        sendToIframe('trans',message.data);
        iframe.removeEventListener('load', iframeLoadHandler);
      };

      iframe.addEventListener('load', iframeLoadHandler);
      handleRealTimeUpdate(message.data);
    }
  });

  port.onDisconnect.addListener(() => {
    console.log("Соединение разорвано, пробуем переподключиться...");
    setTimeout(connectPort, 1000); // Переподключение через 1 секунду
  });
}

// Инициализация соединения при загрузке
connectPort();

function showToolbar(selection) {
  removeExistingToolbars();

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const toolbar = document.createElement('div');
  toolbar.className = 'text-toolbar';
  currentToolbar = toolbar;

  toolbar.innerHTML = `
    <button class="toolbar-btn translate-btn" title="Перевести">
      <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
    </button>
  `;

  positionToolbar(toolbar, selection);
  setupToolbarHandlers(toolbar, selectedText);
  document.body.appendChild(toolbar);
  setupOutsideClickHandler(toolbar);
}

// Безопасная отправка через порт
function safePortPost(message) {
  if (!port) {
    console.error("Порт не инициализирован");
    return false;
  }

  try {
    port.postMessage(message);
    return true;
  } catch (error) {
    console.error("Ошибка отправки:", error);
    connectPort(); // Пытаемся переподключиться
    return false;
  }
}

window.addEventListener("message", (event) => {
  if (event.data.action === "close-iframe") {
    if (iframe) {
      iframe.remove();
      iframe = null;
    }
  }
});

function toggleIframe(e) {
  if (e) e.stopPropagation();

  if (iframe) {
    iframe.style.opacity = '0';
    iframe.style.transform = 'translateY(10px)';
    setTimeout(() => {
      iframe.remove();
      iframe = null;
    }, 300);
    return;
  }

  iframe = document.createElement('iframe');
  iframe.id = 'extension-iframe';
  iframe.src = chrome.runtime.getURL('extension/iframe/iframe.html');

  iframe.style.cssText = `
    position: fixed;
    bottom: 70px;
    right: 20px;
    width: 300px;
    height: 400px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9999;
    background: white;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(10px);
  `;

  document.body.appendChild(iframe);

  setTimeout(() => {
    iframe.style.opacity = '1';
    iframe.style.transform = 'translateY(0)';
  }, 10);

  const closeHandler = (e) => {
    const clickedElement = e.target;
    const isToolbarBtn = clickedElement.closest('.translate-btn');

    if (iframe && !iframe.contains(clickedElement)) {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(10px)';
      setTimeout(() => {
        iframe.remove();
        iframe = null;
        document.removeEventListener('click', closeHandler);
      }, 300);
    }
  };

  setTimeout(() => {
    document.addEventListener('click', closeHandler);
  }, 100);
}

function sendToIframe(id2 , data) {
  const iframe = document.getElementById('extension-iframe');
  if (!iframe?.contentWindow) return;

  const extensionId = chrome.runtime.id;
  const targetOrigin = `chrome-extension://${extensionId}`;

  try {
    iframe.contentWindow.postMessage(
      { type: id2 , data },
      targetOrigin
    );
  } catch (error) {
    console.error("Ошибка отправки в iframe:", error);
  }
}

function setupToolbarHandlers(toolbar, selectedText) {
  const translateButton = toolbar.querySelector('.translate-btn');

  translateButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleIframe();

    // Проверяем и восстанавливаем соединение при необходимости
    if (!port) {
      connectPort();
    }

    safePortPost({
      type: "translate_to_back",
      data: selectedText
    });

    const iframeLoadHandler = () => {
      sendToIframe('text',selectedText);
      iframe.removeEventListener('load', iframeLoadHandler);
    };

    iframe.addEventListener('load', iframeLoadHandler);
    removeToolbar(toolbar);
  });
}

// Остальные функции остаются без изменений
function positionToolbar(toolbar, selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  toolbar.style.position = 'absolute';
  toolbar.style.top = `${window.scrollY + rect.top - 40}px`;
  toolbar.style.left = `${window.scrollX + rect.left + rect.width / 2 - 75}px`;
}

function removeToolbar(toolbar) {
  toolbar.style.opacity = '0';
  toolbar.style.transform = 'translateY(10px)';
  setTimeout(() => {
    toolbar.remove();
    currentToolbar = null;
  }, 200);
}

function removeExistingToolbars() {
  document.querySelectorAll('.text-toolbar').forEach(toolbar => {
    removeToolbar(toolbar);
  });
}

function setupOutsideClickHandler(toolbar) {
  const clickHandler = (e) => {
    if (!toolbar.contains(e.target)) {
      removeToolbar(toolbar);
      document.removeEventListener('click', clickHandler);
    }
  };

  setTimeout(() => {
    document.addEventListener('click', clickHandler);
  }, 100);
}

document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  if (selection.toString().trim().length > 0 && !isInsideInput(selection.anchorNode)) {
    showToolbar(selection);
  }
});

function isInsideInput(node) {
  if (!node) return false;
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return element.tagName === 'INPUT' ||
         element.tagName === 'TEXTAREA' ||
         element.isContentEditable;
}

port.onMessage.addListener((msg) => {
  if (msg.type==="jk") {
    console.log("Получено:", msg);
  }
  });