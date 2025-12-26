/**
 * js/ui/dashboard.js
 * El Cuerpo Principal. Maneja la interfaz del juego.
 */

import { state } from '../core/state.js';
// Importamos logoutUser de persistence para limpiar la sesión
import { logoutUser } from '../persistence.js'; 

export const DashboardUI = {
    elements: {
        container: null,
        navButtons: [],
        panels: {},
        logoutBtn: null // Nueva referencia
    },

    init() {
        console.log("[UI] Inicializando Dashboard...");
        
        this.elements.container = document.getElementById('game-container');
        this.elements.logoutBtn = document.getElementById('logout-button');
        
        // 1. Configurar Navegación (Tabs)
        const btns = document.querySelectorAll('.nav-btn');
        btns.forEach(btn => {
            // Ignoramos el botón de salir aquí, tiene su propia lógica abajo
            if (btn.id === 'logout-button') return;
            
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                this.switchTab(targetId);
            });
            this.elements.navButtons.push(btn);
        });

        // 2. Configurar Botón Salir (Logout)
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // 3. Suscribirse a cambios del Estado
        state.subscribe((newState) => {
            this.updateHUD(newState);
        });
    },

    handleLogout() {
        if(confirm("¿Deseas romper el vínculo espiritual y salir?")) {
            console.log("[UI] Cerrando sesión...");
            logoutUser(); // Borra credenciales de localStorage
            location.reload(); // Recarga la página para volver al Login limpio
        }
    },

    show() {
        // Validación de seguridad: Si init no corrió, intentamos recuperarnos
        if (!this.elements.container) {
            this.elements.container = document.getElementById('game-container');
        }

        // Ocultar pantallas anteriores
        const authScreen = document.getElementById('auth-screen');
        const creationScreen = document.getElementById('screen-creation');
        
        if(authScreen) authScreen.classList.add('hidden');
        if(creationScreen) creationScreen.classList.add('hidden');
        
        // Mostrar juego
        if (this.elements.container) {
            this.elements.container.classList.remove('hidden');
            // Forzar display flex si el CSS lo requiere
            this.elements.container.style.display = 'flex'; 
        }
        
        // Cargar primera pestaña por defecto
        this.switchTab('panel-home');
        
        // Render inicial
        this.updateHUD(state.get());
        
        console.log("🌸 ¡Bienvenido al Mundo de Cultivo!");
    },

    switchTab(targetId) {
        // Ocultar todos los paneles
        document.querySelectorAll('.tab-content').forEach(p => p.classList.add('hidden'));
        
        // Desactivar botones
        this.elements.navButtons.forEach(b => b.classList.remove('active'));

        // Mostrar target
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.remove('hidden');

        // Activar botón
        const targetBtn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
        if (targetBtn) targetBtn.classList.add('active');
    },

    updateHUD(gameState) {
        if (!gameState || !gameState.player) return;

        const p = gameState.player;
        
        // Actualizar Textos Básicos
        // Usamos optional chaining (?.) para seguridad
        const elName = document.getElementById('sidebar-name');
        if (elName) elName.textContent = p.name;

        // Actualizar Barras
        this._setBar('hp', p.stats.hp, p.stats.maxHp);
        this._setBar('qi', p.stats.qi, p.stats.maxQi || 100);
        this._setBar('essence', p.stats.vigor, 100); // Asumiendo vigor como esencia por ahora

        // Textos de Barras
        if(document.getElementById('val-hp')) document.getElementById('val-hp').textContent = `${Math.floor(p.stats.hp)}/${p.stats.maxHp}`;
        if(document.getElementById('val-qi')) document.getElementById('val-qi').textContent = `${Math.floor(p.stats.qi)}/${p.stats.maxQi}`;
        
        // Stats Numéricos
        if(document.getElementById('stat-level')) document.getElementById('stat-level').textContent = p.realm.stage;
        if(document.getElementById('stat-attack')) document.getElementById('stat-attack').textContent = 10 + (p.realm.stage * 2); // Fórmula temporal
    },

    _setBar(type, current, max) {
        const percent = Math.min(100, Math.max(0, (current / max) * 100));
        const bar = document.getElementById(`bar-${type}`);
        if (bar) bar.style.width = `${percent}%`;
    }
};