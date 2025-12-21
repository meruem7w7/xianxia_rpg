/**
 * Archivo: main.js
 * Propósito: Punto de entrada principal del juego. Inicializa la aplicación,
 * maneja la autenticación de usuarios, la navegación entre paneles, y coordina
 * las interacciones entre módulos como combate, inventario, mapa, etc.
 * Gestiona el ciclo de vida de la aplicación desde el login hasta el gameplay.
 */

// js/main.js - v1.6
import { loadCharacterForCurrentUser, meditate, character } from './character.js';
import { startCreationProcess } from './character_creation.js';
import { showInventory } from './inventory.js';
import { renderSkills } from './skills.js';
import { showMap } from './map.js';
import { showSectOptions } from './sects.js';
import { registerUser, loginUser, logoutUser, getCurrentSession } from './persistence.js';
import { showMessage, toggleLog } from './ui.js';
import { startCombat, updateCombatBars } from './combat.js'; 
import { ZONES, ENEMIES_DB } from './data.js';
import { initGodMode } from './godmode.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Elements
    const authScreen = document.getElementById('auth-screen');
    const gameContainer = document.getElementById('game-container');
    const authMessage = document.getElementById('auth-message');
    const loginBtn = document.getElementById('login-button');
    const registerBtn = document.getElementById('register-button');
    
    // Tabs Auth
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- MANEJO DE PESTAÑAS (Login/Register) ---
    if(tabLogin && tabRegister) {
        tabLogin.onclick = () => {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            authMessage.textContent = '';
        };
        tabRegister.onclick = () => {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            authMessage.textContent = '';
        };
    }

    // --- NAVEGACIÓN PRINCIPAL ---
    function switchTab(targetId) {
        tabContents.forEach(t => t.classList.add('hidden'));
        navButtons.forEach(b => b.classList.remove('active'));

        const targetSec = document.getElementById(targetId);
        if(targetSec) targetSec.classList.remove('hidden');

        const activeBtn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
        if(activeBtn) activeBtn.classList.add('active');

        if(targetId === 'panel-home') renderHomePanel();
        if(targetId === 'panel-skills') renderSkills();
        if(targetId === 'panel-inventory') showInventory();
        if(targetId === 'panel-map') showMap();
        if(targetId === 'panel-sect') showSectOptions();
        if(targetId === 'panel-combat') renderCombatList();
    }

// En js/main.js

function renderHomePanel() {
    if(!character) return;
    
    // Sidebar info
    const nameEl = document.getElementById('sidebar-name');
    if(nameEl) nameEl.innerText = character.name;
    
    // Preparar valores seguros (evita errores si son null)
    // NOTA: Si experience es 0, la barra de Qi estará vacía. ¡Es correcto para nivel 1!
    // Si quieres verla llena para probar, sube la XP en la consola: character.experience = 50;
    const hp = character.health || 0;
    const maxHp = character.maxHealth || 100;
    const xp = character.experience || 0;
    const maxXp = character.maxExperience || 100;
    const ess = character.essence || 0; // NUEVO: Esencia
    const maxEss = character.maxEssence || 50; // NUEVO: Máximo base

    const heroCard = document.querySelector('.hero-card');
    if(heroCard) {
        heroCard.innerHTML = `
            <div class="meditation-container">
                <div class="aura-ring"></div>
                <div class="aura-ring inner"></div>
                <object data="assets/img/player_meditating.png" type="image/png" class="home-avatar">
                    <div class="home-avatar avatar-placeholder">🧘</div>
                </object>
            </div>

            
            <h2 class="font-title text-gold mt-2">${character.name}</h2>
            
            <div class="home-stats-card">
                <div class="brush-bar-wrapper" style="height:24px;">
                    <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem;">
                        <span>Vitalidad</span><span>${Math.floor(hp)}/${maxHp}</span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div class="brush-fill-img fill-hp" style="width:${(hp/maxHp)*100}%"></div>
                    </div>
                </div>

                <div class="brush-bar-wrapper" style="height:24px; margin-top:20px;">
                    <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem;">
                        <span>Qi (Cultivo)</span><span>${Math.floor(xp)}/${maxXp}</span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div class="brush-fill-img fill-qi" style="width:${(xp/maxXp)*100}%"></div>
                    </div>
                </div>

                <div class="brush-bar-wrapper" style="height:24px; margin-top:20px;">
                    <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem;">
                        <span>Esencia</span><span>${Math.floor(ess)}/${maxEss}</span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div class="brush-fill-img fill-essence" style="width:${(ess/maxEss)*100}%"></div>
                    </div>
                </div>

                <button id="btn-meditate-inner" class="button primary" style="margin-top:20px;">Concentrar Qi</button>
            </div>
        `;

        // Re-asignar evento botón
        const btn = document.getElementById('btn-meditate-inner');
        if(btn) btn.onclick = () => {
            if(typeof meditate === 'function') meditate();
            if(window.forceUpdateAll) window.forceUpdateAll();
        };
    }
}

    function renderCombatList() {
        const listDiv = document.getElementById('enemy-list');
        const arena = document.getElementById('battle-arena');
        
        if(!arena.classList.contains('hidden')) {
            listDiv.classList.add('hidden');
            return;
        }

        listDiv.classList.remove('hidden');
        listDiv.innerHTML = ''; 

        const zone = ZONES['forest_outer']; 
        if(document.getElementById('current-region-name')) {
            document.getElementById('current-region-name').textContent = zone.name;
        }

        if(zone && zone.enemies) {
            zone.enemies.forEach(enemyId => {
                const enemy = ENEMIES_DB[enemyId];
                if(!enemy) return;

                const card = document.createElement('div');
                card.className = 'card';
                card.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:15px; margin-bottom:10px;";
                
                card.innerHTML = `
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="font-size:2rem;">${enemy.icon}</div>
                        <div>
                            <div class="font-cinzel text-gold">${enemy.name}</div>
                            <div style="font-size:0.8rem; color:#aaa;">Reino ${enemy.realm} • HP: ${enemy.stats.hp_max}</div>
                        </div>
                    </div>
                    <button class="hunt-btn-list button">⚔️ Cazar</button> 
                `;
                
                card.querySelector('.hunt-btn-list').onclick = () => startCombat(enemyId);
                listDiv.appendChild(card);
            });
        }
    }

    // --- GLOBAL SYNC ---
    window.forceUpdateAll = function() {
        if(!character) return;
        
        if(!document.getElementById('panel-home').classList.contains('hidden')) {
            renderHomePanel();
        }
        if(!document.getElementById('battle-arena').classList.contains('hidden')) {
            updateCombatBars();
        }
    };

    // --- INITIALIZATION ---
    function initializeDashboard(char) {
        authScreen.classList.add('hidden');
        document.getElementById('creation-screen').classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initGodMode();
        switchTab('panel-home'); 
        showMessage(`Bienvenido, ${char.name}.`, 'exito');
    }

    // --- EVENT LISTENERS ---
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.id === 'logout-button') return;
            switchTab(btn.dataset.target);
        });
    });

    if(document.getElementById('logout-button')) {
        document.getElementById('logout-button').onclick = (e) => {
            e.preventDefault(); logoutUser(); location.reload(); 
        };
    }

    if(loginBtn) loginBtn.onclick = () => {
        const u = document.getElementById('login-username').value;
        const p = document.getElementById('login-password').value;
        const res = loginUser(u, p);
        if(res.success) {
            let char = loadCharacterForCurrentUser();
            if(!char) {
                authScreen.classList.add('hidden');
                startCreationProcess(res.username, (newChar) => initializeDashboard(newChar));
            } else {
                initializeDashboard(char);
            }
        } else {
            authMessage.textContent = res.message;
        }
    };

    if(registerBtn) registerBtn.onclick = () => {
        const u = document.getElementById('register-username').value;
        const p = document.getElementById('register-password').value;
        const res = registerUser(u, p);
        if(res.success) {
            tabLogin.click();
            authMessage.textContent = "Cuenta creada. Inicia sesión.";
            authMessage.style.color = "#4caf50";
        } else {
            authMessage.textContent = res.message;
        }
    };

    const session = getCurrentSession();
    if(session && session.username) {
        let char = loadCharacterForCurrentUser();
        if(char) initializeDashboard(char);
    }
});

window.toggleLog = toggleLog;