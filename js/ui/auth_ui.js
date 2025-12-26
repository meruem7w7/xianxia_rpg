/**
 * js/ui/auth_ui.js
 * Controlador de la Pantalla de Autenticación (Login/Register).
 */

import { state } from '../core/state.js';
import { CreationUI } from './creation_ui.js';
// Importamos la persistencia antigua temporalmente para no romper la base de datos local
// Asumimos que persistence.js sigue existiendo en js/persistence.js
import { loginUser, registerUser, getCurrentSession } from '../persistence.js'; 
import { DashboardUI } from './dashboard.js'; // Asegúrate de importar esto arriba

export const AuthUI = {
    elements: {
        screen: null,
        loginForm: null,
        registerForm: null,
        tabLogin: null,
        tabRegister: null,
        msgBox: null
    },

    init() {
        console.log("[UI] Inicializando Autenticación...");
        
        // 1. Capturar elementos
        this.elements.screen = document.getElementById('auth-screen');
        this.elements.loginForm = document.getElementById('login-form');
        this.elements.registerForm = document.getElementById('register-form');
        this.elements.tabLogin = document.getElementById('tab-login');
        this.elements.tabRegister = document.getElementById('tab-register');
        this.elements.msgBox = document.getElementById('auth-message');

        // 2. Eventos de Botones
        const btnLogin = document.getElementById('login-button');
        const btnRegister = document.getElementById('register-button');

        // CORRECCIÓN AQUÍ: Añadimos 'e' y 'e.preventDefault()'
        if (btnLogin) {
            btnLogin.addEventListener('click', (e) => {
                e.preventDefault(); 
                this.handleLogin();
            });
        }

        if (btnRegister) {
            btnRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        // 3. Eventos de Pestañas
        if (this.elements.tabLogin) {
            this.elements.tabLogin.addEventListener('click', () => this.switchTab('login'));
        }
        if (this.elements.tabRegister) {
            this.elements.tabRegister.addEventListener('click', () => this.switchTab('register'));
        }

        // 4. Auto-login si hay sesión
        this.checkSession();
    },

    switchTab(tab) {
        if (tab === 'login') {
            this.elements.loginForm.classList.add('active');
            this.elements.registerForm.classList.remove('active');
            this.elements.tabLogin.classList.add('active');
            this.elements.tabRegister.classList.remove('active');
        } else {
            this.elements.registerForm.classList.add('active');
            this.elements.loginForm.classList.remove('active');
            this.elements.tabRegister.classList.add('active');
            this.elements.tabLogin.classList.remove('active');
        }
        if (this.elements.msgBox) this.elements.msgBox.textContent = '';
    },

    handleLogin() {
        const u = document.getElementById('login-username').value;
        const p = document.getElementById('login-password').value;
        
        // Usamos la lógica antigua de persistence.js por ahora
        const res = loginUser(u, p);
        
        if (res.success) {
            this.onLoginSuccess(res.username);
        } else {
            this.showError(res.message);
        }
    },

    handleRegister() {
        const u = document.getElementById('register-username').value;
        const p = document.getElementById('register-password').value;

        const res = registerUser(u, p);
        if (res.success) {
            this.switchTab('login');
            this.showError("Cuenta creada con éxito. Por favor inicia sesión.", "success");
        } else {
            this.showError(res.message);
        }
    },

    onLoginSuccess(username) {
        console.log(`[AUTH] Login exitoso: ${username}`);
        
        // 1. Decirle al Estado quién es el usuario
        state.setUser(username);
        
        // 2. Intentar cargar partida existente
        const hasSaveGame = state.load();

        // 3. Ocultar pantalla de login
        if (this.elements.screen) this.elements.screen.classList.add('hidden');

        // 4. Bifurcación del Destino
        if (hasSaveGame) {
            // CAMINO A: El veterano vuelve -> Ir al Dashboard
            console.log("[AUTH] Partida encontrada. Viajando al Hogar...");
            DashboardUI.show();
        } else {
            // CAMINO B: Nuevo cultivador -> Ir a Creación
            console.log("[AUTH] Nueva alma detectada. Iniciando reencarnación...");
            document.getElementById('screen-creation').classList.remove('hidden');
            document.getElementById('screen-creation').classList.add('active');
            
            // Pre-llenar el nombre en el input de creación para comodidad
            const nameInput = document.getElementById('inp-creation-name');
            if(nameInput) nameInput.value = username;
        }
    },


    checkSession() {
        const session = getCurrentSession();
        if (session && session.username) {
            console.log("[AUTH] Sesión encontrada. Login automático.");
            this.onLoginSuccess(session.username);
        }
    },

    showError(msg, type = 'error') {
        if (this.elements.msgBox) {
            this.elements.msgBox.textContent = msg;
            this.elements.msgBox.style.color = type === 'success' ? '#4caf50' : '#ff5555';
        }
    }
};