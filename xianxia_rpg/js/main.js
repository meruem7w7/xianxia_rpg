// js/main.js - Versión FINAL con integración de módulos y lógica de botones
import { showCharacterProfile, loadCharacterForCurrentUser } from './character.js';
import { showMap } from './map.js';
import { showSectOptions } from './sects.js';
import { showCraftingModal } from './crafting.js';
import { initChatUI } from './chat.js';
import { showInventory } from './inventory.js';
// No se importan directamente: data, npc, quest, ui (usados por otros módulos)
import { registerUser, loginUser, logoutUser, getCurrentSession } from './persistence.js';
import { showMessage, toggleOverlay } from './ui.js'; // Importación crítica de UI

document.addEventListener('DOMContentLoaded', () => {

    // 1. OBTENCIÓN DE ELEMENTOS CRÍTICOS (Autenticación)
    const authScreen = document.getElementById('auth-screen');
    const gameRoot = document.getElementById('game-container'); // Contenedor principal del juego

    // Auth Forms y Pestañas
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const authMessage = document.getElementById('auth-message');

    function initializeGame(username) {
        showMessage(`¡Bienvenido, ${username}! Tu camino de cultivación ha comenzado.`, 'exito');

        // Cargar y mostrar datos del personaje y UI
        loadCharacterForCurrentUser();
        showCharacterProfile();
        initChatUI();
        showInventory(); // Mostrar inventario al iniciar
        showMap(); // Mostrar mapa/escena inicial

        // OBTENCIÓN TARDÍA de botones de juego (solo existen en #game-root)
        const logoutButton = document.getElementById('logout-button');
        const btnOpenSect = document.getElementById('btn-open-sect');
        const btnOpenCrafting = document.getElementById('btn-open-crafting');
        const btnOpenQuests = document.getElementById('btn-open-quests');
        const btnOpenLore = document.getElementById('btn-open-lore');

        const btnCultivar = document.getElementById('btn-cultivar');
        const btnCombatir = document.getElementById('btn-combatir');

        // Logout
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                logoutUser();
                gameRoot.classList.add('hidden');
                authScreen.classList.remove('hidden');
                showMessage("Sesión cerrada.", 'alerta');
            });
        }

        // Botones de Modales (Footer)
        if (btnOpenSect) btnOpenSect.addEventListener("click", showSectOptions);
        if (btnOpenCrafting) btnOpenCrafting.addEventListener("click", showCraftingModal);

        // Botones Pendientes (usan la UI para mostrar mensaje)
        if (btnOpenQuests) btnOpenQuests.addEventListener("click", () => showMessage("Misiones clickeado (Lógica pendiente)", 'normal'));
        if (btnOpenLore) btnOpenLore.addEventListener("click", () => showMessage("Crónicas del Mundo clickeado (Lógica pendiente)", 'normal'));

        // Botones de Acción
        if (btnCultivar) btnCultivar.addEventListener("click", () => showMessage("Estás cultivando Qi... (Lógica pendiente)", 'progreso'));
        if (btnCombatir) btnCombatir.addEventListener("click", () => showMessage("Iniciando combate... (Lógica pendiente)", 'combate'));
    }

    // 2. Lógica de Autenticación (Pestañas, Login y Register)
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            authMessage.textContent = "";
        });

        registerTab.addEventListener('click', () => {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            authMessage.textContent = "";
        });
    }

    // Registro
    if (registerButton) registerButton.addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const result = registerUser(username, password);
        authMessage.textContent = result.message;
        if (result.success) loginTab.click();
    });

    // Login
    if (loginButton) loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const result = loginUser(username, password);

        if (result.success) {
            authScreen.classList.add('hidden');
            gameRoot.classList.remove('hidden');
            initializeGame(result.username);
        } else {
            authMessage.textContent = result.message;
        }
    });

    // 3. Comprobar Sesión Existente
    const session = getCurrentSession();
    if (session && session.username) {
        authScreen.classList.add('hidden');
        gameRoot.classList.remove('hidden');
        initializeGame(session.username);
    } else {
        authScreen.classList.remove('hidden');
        gameRoot.classList.add('hidden');
    }
});
