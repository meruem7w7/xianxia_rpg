// js/ui.js - Versión FINAL
// Funciones de UI para manejar mensajes y el overlay de modales.

/**
 * Muestra un mensaje en el log del juego (#log-messages) y en consola.
 * Tipos: 'normal', 'exito', 'alerta', 'progreso', 'combate'.
 */
function showMessage(message, type = 'normal') {
  console.log(`[LOG - ${type.toUpperCase()}] ${message}`);
  
  const logDiv = document.getElementById('log-messages');
  if (logDiv) {
      const p = document.createElement('p');
      p.textContent = `[${type.toUpperCase()}] ${message}`;
      p.classList.add(`log-${type}`); 
      logDiv.appendChild(p);
      logDiv.scrollTop = logDiv.scrollHeight; 
      
      // Opcional: limitar el número de mensajes
      if (logDiv.children.length > 50) {
          logDiv.removeChild(logDiv.firstChild);
      }
  }
}

/**
 * Muestra u oculta el overlay general (#ui-overlay) para modales.
 * @param {boolean} show - True para mostrar, false para ocultar.
 * @param {HTMLElement} content - Contenido HTML a inyectar en el overlay.
 */
function toggleOverlay(show, content = null) {
  const overlay = document.getElementById("ui-overlay");
  if (!overlay) return;
  
  if (show) {
    overlay.classList.remove('hidden');
    // Limpiar y añadir el contenido del modal
    overlay.innerHTML = '';
    if (content) {
        overlay.appendChild(content);
    }
  } else {
    overlay.classList.add('hidden');
    // Opcional: limpiar el contenido al cerrar
    overlay.innerHTML = ''; 
  }
}

export { showMessage, toggleOverlay };
