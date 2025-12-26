import { state } from './core/state.js';
import { AuthUI } from './ui/auth_ui.js';
import { CreationUI } from './ui/creation_ui.js';
import { DashboardUI } from './ui/dashboard.js';

window.addEventListener('load', () => {
    console.log("🌸 Crónicas del Loto Eterno v7.1 - Arrancando...");

    // 1. PRIMERO: Inicializamos las referencias de UI (Dashboard y Creación)
    // Así, cuando AuthUI llame a .show(), los elementos ya estarán capturados.
    DashboardUI.init(); 
    CreationUI.init();

    // 2. SEGUNDO: Inicializamos Auth, que podría disparar el juego inmediatamente
    AuthUI.init();

    // Corrección visual inicial (por seguridad)
    const authScreen = document.getElementById('auth-screen');
    const creationScreen = document.getElementById('screen-creation');
    const gameContainer = document.getElementById('game-container');

    if(authScreen) authScreen.classList.remove('hidden');
    if(creationScreen) creationScreen.classList.add('hidden');
    if(gameContainer) gameContainer.classList.add('hidden');

    console.log("✅ Sistema Listo.");
});