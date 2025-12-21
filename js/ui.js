/**
 * Archivo: ui.js
 * Propósito: Maneja las funciones de interfaz de usuario, incluyendo la visualización
 * de mensajes en el log, el toggle del overlay, y otras interacciones de UI.
 * Gestiona el registro de mensajes con tipos específicos y limita el número de mensajes.
 */

// js/ui.js

/**
 * Muestra un mensaje en el log de la interfaz con un tipo específico.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - El tipo de mensaje (normal, exito, alerta, danger, progreso, warning, critical).
 * @returns {void}
 */
export function showMessage(message, type = 'normal') {
    const logDiv = document.getElementById('log-messages');
    if (!logDiv) return;

    const p = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let cssClass = 'log-entry';
    let icon = '•';

    switch (type) {
        case 'exito': cssClass += ' log-success'; icon = '✓'; break;
        case 'alerta': 
        case 'danger': cssClass += ' log-danger'; icon = '⚔️'; break;
        case 'progreso': cssClass += ' log-progress'; icon = '✨'; break;
        case 'warning': cssClass += ' log-warning'; icon = '⚠️'; break;
        case 'critical': cssClass += ' log-crit'; icon = '💥'; break;
    }

    p.className = cssClass;
    p.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-icon">${icon}</span> ${message}`;

    logDiv.appendChild(p);

    // --- CORRECCIÓN LOG: LÍMITE A 20 MENSAJES ---
    if (logDiv.children.length > 20) {
        logDiv.removeChild(logDiv.firstChild);
    }

    logDiv.scrollTop = logDiv.scrollHeight;
}

/**
 * Muestra u oculta el overlay de la interfaz.
 * @param {boolean} show - Si true, muestra el overlay; si false, lo oculta.
 * @param {string|HTMLElement} content - El contenido a mostrar en el overlay.
 * @returns {void}
 */
export function toggleOverlay(show, content = null) {
    const overlay = document.getElementById("ui-overlay");
    if (!overlay) return;
    
    if (show) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = '';
        if (content) {
            if (content instanceof HTMLElement) {
                overlay.appendChild(content);
            } else {
                overlay.innerHTML = content;
            }
        }
    } else {
        overlay.classList.add('hidden');
        overlay.innerHTML = ''; 
    }
}

/**
 * Alterna la visibilidad del log plegable en la interfaz.
 * @returns {void}
 */
export function toggleLog() {
    const content = document.querySelector('.collapsible-content');
    const icon = document.querySelector('.toggle-icon');
    if (content) {
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            if (icon) icon.textContent = '▼';
        } else {
            content.style.display = 'none';
            if (icon) icon.textContent = '▶';
        }
    }
}