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
import { showMessage, toggleLog, UI } from './ui.js';
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
        if(targetId === 'panel-cultivation') UI.renderCultivationPanel();
        if(targetId === 'panel-anatomy') renderAnatomyPanel();
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
        if(!document.getElementById('panel-cultivation').classList.contains('hidden')) {
            UI.renderCultivationPanel();
        }
        if(!document.getElementById('panel-anatomy').classList.contains('hidden')) {
            renderAnatomyPanel();
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

// --- PANEL ANATOMÍA SAGRADA ---

function renderAnatomyPanel() {
    if(!character) return;
    
    const container = document.getElementById('anatomy-content');
    if(!container) return;

    // 1. DETECTAR GÉNERO Y CONFIGURAR RUTAS
    // Si no tiene género definido (partida vieja), asumimos "man"
    const gender = character.gender || "man"; 
    const suffix = (gender === "woman") ? "women" : "man"; // _men o _women

    const ASSETS_ANATOMY = {
        base: `assets/img/anatomy/silhouette_base_${gender === "woman" ? "woman" : "man"}.png`,
        meridians: `assets/img/anatomy/meridians_overlay_${suffix}.png`,
        bones: `assets/img/anatomy/bones_overlay_${suffix}.png`,
        muscles: `assets/img/anatomy/muscle_overlay_${suffix}.png`,
        spiritroot: `assets/img/anatomy/spiritroot_overlay_${suffix}.png`
    };

    const rootInfo = character.root || { type: "pseudo" };
    const anatomy = character.anatomy || {
        dantian_upper: { soul_force: 0 },
        dantian_middle: { purity: 0 },
        dantian_lower: { current: 0, max: 100 }
    };
    
    // Nombres legibles
    const ROOT_NAMES = {
        "pseudo": "Raíz Pseudo-Espiritual",
        "true": "Raíz Verdadera",
        "heavenly": "Raíz Celestial",
        "mutant": "Raíz Mutante"
    };

    // --- LÓGICA DE TEÑIDO (TINTA) PARA LA RAÍZ ESPIRITUAL ---
    // Usamos filtros CSS para colorear lo blanco (sistema nervioso)
    // El elemento principal de la raíz define el color.
    const mainElement = rootInfo.elements && rootInfo.elements.length > 0 ? rootInfo.elements[0] : "metal";
    
    const ROOT_FILTERS = {
        fire: "sepia(1) saturate(5) hue-rotate(-50deg)",   // Rojo
        water: "sepia(1) saturate(5) hue-rotate(180deg)",  // Azul
        wood: "sepia(1) saturate(5) hue-rotate(50deg)",    // Verde
        earth: "sepia(1) saturate(3) hue-rotate(-100deg)", // Marrón/Oro
        metal: "grayscale(1) brightness(1.5)",             // Plata/Blanco brillante
        ice: "sepia(1) saturate(3) hue-rotate(150deg)",    // Cian Pálido (Mutante)
        lightning: "sepia(1) saturate(5) hue-rotate(220deg) brightness(1.5)" // Violeta (Mutante)
    };
    
    // Si la raíz es "pseudo" (mezcla sucia), la dejamos grisácea o default
    const currentFilter = (rootInfo.type === 'pseudo') ? "sepia(0.5) saturate(0.5)" : (ROOT_FILTERS[mainElement] || "none");

    // --- HTML DEL PANEL ---
    container.innerHTML = `
        <div class="anatomy-layout">
            
            <div class="anatomy-controls custom-scroll">
                <div>
                    <h3 class="font-title text-gold">${character.name}</h3>
                    <div class="cultivation-rank" style="text-align:left;">${ROOT_NAMES[rootInfo.type]}</div>
                    <div style="font-size:0.8rem; color:#888; margin-bottom:10px;">
                        Cuerpo: ${gender === "woman" ? "Yin (Femenino)" : "Yang (Masculino)"}<br>
                        Afinidad Principal: <span style="text-transform:capitalize; color:#eee;">${mainElement}</span>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:5px; margin-bottom:15px;">
                    <div class="anatomy-section-title">Capas de Percepción</div>
                    <div class="layers-grid">
                        <button class="layer-btn active" onclick="toggleLayer('base', this)" title="Silueta Base">👤</button>
                        <button class="layer-btn active" onclick="toggleLayer('spiritroot', this)" title="Raíz Espiritual (Nervios)">🌿</button>
                        <button class="layer-btn" onclick="toggleLayer('meridians', this)" title="Meridianos">⚡</button>
                        <button class="layer-btn" onclick="toggleLayer('muscles', this)" title="Músculos">💪</button>
                        <button class="layer-btn" onclick="toggleLayer('bones', this)" title="Huesos">💀</button>
                    </div>
                </div>

                <div>
                    <div class="anatomy-section-title">Centros de Poder</div>
                    <div class="upgrade-row">
                        <div class="upgrade-info">
                            <span style="color:#00ffff">Mar Conciencia</span><br>
                            <small>Fuerza: ${anatomy.dantian_upper.soul_force}</small>
                        </div>
                        <button class="btn-upgrade" onclick="showMessage('Requiere técnica mental.', 'alerta')">Refinar</button>
                    </div>
                    <div class="upgrade-row">
                        <div class="upgrade-info">
                            <span style="color:#ff0055">Palacio Carmesí</span><br>
                            <small>Pureza: ${anatomy.dantian_middle.purity}%</small>
                        </div>
                        <button class="btn-upgrade" onclick="showMessage('Requiere píldoras de sangre.', 'alerta')">Templar</button>
                    </div>
                    <div class="upgrade-row">
                        <div class="upgrade-info">
                            <span style="color:#ffd700">Mar de Qi</span><br>
                            <small>${Math.floor(anatomy.dantian_lower.current)}/${anatomy.dantian_lower.max} Qi</small>
                        </div>
                        <button class="btn-upgrade" onclick="window.meditate(); window.forceUpdateAll();">Cultivar</button>
                    </div>
                </div>
            </div>

            <div class="anatomy-visualizer">
                <div class="silhouette-container">
                    <img id="layer-base" src="${ASSETS_ANATOMY.base}" class="body-layer">
                    
                    <img id="layer-bones" src="${ASSETS_ANATOMY.bones}" class="body-layer layer-hidden">
                    
                    <img id="layer-muscles" src="${ASSETS_ANATOMY.muscles}" class="body-layer layer-hidden">
                    
                    <img id="layer-spiritroot" src="${ASSETS_ANATOMY.spiritroot}" class="body-layer" 
                         style="filter: ${currentFilter}; mix-blend-mode: screen;">
                    
                    <img id="layer-meridians" src="${ASSETS_ANATOMY.meridians}" class="body-layer layer-hidden"
                         style="filter: drop-shadow(0 0 2px cyan);">
                    
                    <div class="dantian-node node-upper" title="Dantian Superior"></div>
                    <div class="dantian-node node-middle" title="Dantian Medio"></div>
                    <div class="dantian-node node-lower" title="Dantian Inferior"></div>
                </div>
            </div>
        </div>
    `;
}

// --- FUNCIÓN HELPER PARA LOS BOTONES DE CAPAS ---
// Añade esto fuera de renderAnatomyPanel, pero accesible globalmente o en window
window.toggleLayer = function(layerId, btnElement) {
    const img = document.getElementById(`layer-${layerId}`);
    if (img) {
        if (img.classList.contains('layer-hidden')) {
            img.classList.remove('layer-hidden');
            btnElement.classList.add('active');
        } else {
            img.classList.add('layer-hidden');
            btnElement.classList.remove('active');
        }
    }
};
window.toggleLog = toggleLog;