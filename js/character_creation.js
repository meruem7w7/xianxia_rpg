/**
 * Archivo: character_creation.js
 * Propósito: Maneja el proceso de creación de personajes, guiando al usuario a través
 * de pasos para seleccionar origen, elemento y confirmar la creación. Integra con
 * los datos de orígenes y elementos, y crea un nuevo personaje al finalizar.
 */

// js/character_creation.js
import { ORIGINS, ELEMENTS } from './data.js';
import { createNewCharacter } from './character.js';
import { showMessage } from './ui.js';

/**
 * Inicia el proceso de creación de personaje con pasos secuenciales.
 * @param {string} username - El nombre del usuario para el personaje.
 * @param {function} onComplete - Función callback que se ejecuta al completar la creación.
 * @returns {void}
 */
export function startCreationProcess(username, onComplete) {
    const container = document.getElementById('creation-step-container');
    const screen = document.getElementById('creation-screen');
    
    screen.classList.remove('hidden');
    // Paso actual en el proceso de creación
    let step = 1;
    // Opciones seleccionadas por el usuario
    let choices = { name: username, origin: null, element: null, avatar: "👤" };

    /**
     * Renderiza el paso actual de la creación de personaje.
     * @returns {void}
     */
    function renderStep() {
        container.innerHTML = '';
        
        if (step === 1) {
            // PASO 1: ORIGEN - Mostrar opciones de orígenes disponibles
            let html = `<h3>Elige tu Pasado</h3><div class="options-list">`;
            for (const [key, data] of Object.entries(ORIGINS)) {
                html += `
                <div class="option-card" onclick="window.selectOrigin('${key}')">
                    <span class="option-title">${data.name}</span>
                    <span class="option-desc">${data.desc}</span>
                </div>`;
            }
            html += `</div>`;
            container.innerHTML = html;
        } 
        else if (step === 2) {
            // PASO 2: ELEMENTO - Mostrar opciones de elementos espirituales
            let html = `<h3>Descubre tu Raíz Espiritual</h3><div class="options-grid">`;
            for (const [key, data] of Object.entries(ELEMENTS)) {
                html += `
                <div class="option-card" style="border-color:${data.color}" onclick="window.selectElement('${key}')">
                    <div style="font-size:2rem">${data.icon}</div>
                    <span class="option-title" style="color:${data.color}">${data.name}</span>
                    <span class="option-desc">${data.desc}</span>
                </div>`;
            }
            html += `</div>`;
            container.innerHTML = html;
        }
        else if (step === 3) {
            // PASO 3: CONFIRMACIÓN - Mostrar resumen y botón para finalizar
            container.innerHTML = `
                <h3>Tu Destino está Sellado</h3>
                <p>Nombre: ${choices.name}</p>
                <p>Origen: ${ORIGINS[choices.origin].name}</p>
                <p>Elemento: ${ELEMENTS[choices.element].name}</p>
                <button class="button primary glow-effect" onclick="window.finishCreation()">Entrar al Dao</button>
            `;
        }
    }

    // Funciones globales temporales para manejar selecciones en la interfaz
    window.selectOrigin = (key) => { choices.origin = key; step++; renderStep(); };
    window.selectElement = (key) => { choices.element = key; step++; renderStep(); };
    window.finishCreation = () => {
        // Crear el personaje con las elecciones y cerrar la pantalla
        const newChar = createNewCharacter(choices);
        screen.classList.add('hidden');
        onComplete(newChar);
    };

    renderStep();
}