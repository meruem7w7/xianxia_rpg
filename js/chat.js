// js/chat.js
import { getCurrentUsername } from "./persistence.js";
import { showMessage } from "./ui.js";

function sendMessage(message) {
  if (!message || message.trim() === "") return;
  const sender = getCurrentUsername() || "Anónimo";
  
  // En un juego real, aquí se enviaría a un servidor.
  // Por ahora, solo lo mostramos en el chat local y en el log.
  showMessage(`[Chat] ${sender}: ${message}`, 'normal');
  displayMessage(message, sender);
}

/**
 * Añade un mensaje al panel de chat.
 */
function displayMessage(message, sender = "Sistema") {
  const chatMessagesDiv = document.getElementById("chat-messages");
  if (!chatMessagesDiv) return;
  
  const p = document.createElement('p');
  p.innerHTML = `<span class="chat-sender">${sender}:</span> ${message}`;
  
  chatMessagesDiv.appendChild(p);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // Auto-scroll
}

/**
 * Inicializa los eventos del chat (input + botón).
 */
function initChatUI() {
  const input = document.getElementById("chat-input");
  const btn = document.getElementById("chat-send"); // ID del botón
  
  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    sendMessage(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage(input.value);
      input.value = "";
    }
  });
}

export { sendMessage, displayMessage, initChatUI };
