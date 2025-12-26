/**
 * js/ui/creation_ui.js
 * Controlador de la Pantalla de Creación.
 * Maneja los eventos del DOM y muestra los datos generados.
 */

import { state } from '../core/state.js';
import { CreationLogic } from '../logic/creation.js';
import { DashboardUI } from './dashboard.js';

export const CreationUI = {
    // Referencias a elementos del DOM
    elements: {
        screen: null,
        nameInput: null,
        startBtn: null,
        resultContainer: null,
        rootDisplay: null,
        physiqueDisplay: null
    },

    init() {
        console.log("[UI] Inicializando Pantalla de Creación...");
        
        // 1. Capturar elementos
        this.elements.screen = document.getElementById('screen-creation');
        this.elements.nameInput = document.getElementById('inp-creation-name');
        this.elements.startBtn = document.getElementById('btn-creation-start');
        this.elements.resultContainer = document.getElementById('creation-results');
        
        // 2. Asignar eventos
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.handleCreateClick());
        } else {
            console.error("❌ [UI] No se encontró el botón de crear (#btn-creation-start)");
        }
        
        // 3. Suscribirse a cambios del estado (Reactividad)
        // Cada vez que el estado cambie, actualizamos la vista
        state.subscribe((newState) => {
            this.render(newState);
        });
    },

    handleCreateClick() {
        const name = this.elements.nameInput.value.trim() || "Daoista Anónimo";
        
        // Llamamos a la Lógica (El Espíritu)
        const player = CreationLogic.createCharacter(name);
        
        // La UI no necesita hacer nada más aquí, porque el state.subscribe
        // detectará el cambio y llamará a this.render() automáticamente.
    },

    render(gameState) {
        const player = gameState.player;
        
        // Si el jugador ya tiene raíz, mostramos los resultados
        if (player.attributes.root) {
            // Ocultar input y botón, mostrar resultados
            if (this.elements.resultContainer) {
                this.elements.resultContainer.classList.remove('hidden');
                
                // Actualizar textos
                document.getElementById('out-player-name').textContent = player.name;
                document.getElementById('out-player-root').textContent = player.attributes.root; // Mostrará el ID por ahora
                document.getElementById('out-player-physique').textContent = player.attributes.physique;
                
                    // --- NUEVO: CONECTAR EL BOTÓN ---
                const btnEnter = document.getElementById('btn-enter-world');
                // Clonamos el botón para limpiar eventos viejos (truco rápido) o simplemente asignamos onclick
                btnEnter.onclick = () => {
                    DashboardUI.show(); // <--- ¡AQUÍ ESTÁ LA MAGIA!
                };

                // Feedback visual si hay Cheat
                if (player.cheat && player.cheat.active) {
                    this.elements.resultContainer.classList.add('divine-glow');
                    alert("¡Una anomalía ha descendido!");
                }
            }
        }
    }
};