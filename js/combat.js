/**
 * Archivo: combat.js
 * Propósito: Gestiona el sistema de combate del juego, incluyendo el estado del combate,
 * la lógica de turnos, el renderizado de la interfaz de batalla, y las interacciones
 * entre el jugador y los enemigos. Implementa mecánicas como resonancia elemental,
 * aturdimiento y canalización de energía.
 */

// js/combat.js - v1.6 (Fixed Glyph & Bars)
import { character, persistCharacter } from './character.js';
import { SKILLS_DB, ENEMIES_DB, ELEMENTS } from './data.js';
import { initGodMode } from './godmode.js';

// Filtros CSS para colorear el glifo de canalización según el elemento
const ELEMENT_FILTERS = {
    fire: "sepia(1) saturate(5) hue-rotate(-50deg)", // Rojo
    wood: "sepia(1) saturate(5) hue-rotate(50deg)",  // Verde
    water: "sepia(1) saturate(5) hue-rotate(180deg)",// Azul
    earth: "sepia(1) saturate(3) hue-rotate(-100deg)",// Marrón
    metal: "grayscale(1) brightness(1.5)"            // Plata
};

// Estado global del combate, almacena información sobre el combate actual
export let combatState = {
    inCombat: false,
    enemy: null,
    resonance: null,
    turnCount: 0,
    phase: 'IDLE',
    stunDuration: 0,
    channelingElement: null
};

/**
 * Inicia un combate contra un enemigo específico.
 * @param {string} enemyId - El ID del enemigo a combatir.
 * @returns {void}
 */
export function startCombat(enemyId) {
    const enemyTemplate = ENEMIES_DB[enemyId];
    if (!enemyTemplate) return;

    // Inicializar estado del combate con el enemigo seleccionado
    combatState = {
        inCombat: true,
        enemy: JSON.parse(JSON.stringify(enemyTemplate)),
        resonance: null,
        turnCount: 1,
        phase: 'IDLE',
        stunDuration: 0,
        channelingElement: null
    };
    // Asignar esencia máxima y actual al enemigo
    combatState.enemy.maxEssence = 100;
    combatState.enemy.essence = 100;
    combatState.enemy.hp = combatState.enemy.stats.hp_max;

    renderCombatStructure(enemyId);
    renderWuXingInterface();
    updateCombatBars();
    initGodMode();

    log(`¡Duelo contra ${combatState.enemy.name}!`, 'warning');
    setTimeout(enemyTurnLogic, 1000);
}

/**
 * Actualiza las barras de salud y esencia tanto del enemigo como del jugador en la interfaz.
 * @returns {void}
 */
export function updateCombatBars() {
    // Enemy Bars
    const eHp = document.getElementById('bar-enemy-hp');
    const eEssence = document.getElementById('bar-enemy-essence');
    const eTxt = document.getElementById('txt-enemy-hp');
    
    // Player Bars
    const pHp = document.getElementById('bar-player-hp');
    const pEssence = document.getElementById('bar-player-essence'); // Esta será ahora la barra de ESENCIA
    const pTxt = document.getElementById('txt-player-hp');

    // --- ACTUALIZAR ENEMIGO ---
    if (combatState.enemy && eHp) {
        const hpPct = Math.max(0, (combatState.enemy.hp / combatState.enemy.stats.hp_max) * 100);
        eHp.style.width = `${hpPct}%`;
        
        // Texto HP Enemigo
        if(eTxt) eTxt.innerText = `${Math.floor(combatState.enemy.hp)}/${combatState.enemy.stats.hp_max}`;
        
        // Esencia Enemigo
        if(eEssence) eEssence.style.width = `${Math.max(0, (combatState.enemy.essence / combatState.enemy.maxEssence) * 100)}%`;
    }

    // --- ACTUALIZAR JUGADOR ---
    if (character && pHp) {
        // 1. Vitalidad (Barra Roja)
        const hpPct = Math.max(0, (character.health / character.maxHealth) * 100);
        pHp.style.width = `${hpPct}%`;
        if(pTxt) pTxt.innerText = `${Math.floor(character.health)}/${character.maxHealth}`;
        
        // 2. Esencia (Barra Azul/Verde - Antes usaba XP)
        if(pEssence) {
            // Usamos essence y maxEssence (con fallback a 50 si no existe)
            const essenceVal = character.essence || 0;
            const maxEssenceVal = character.maxEssence || 50;
            
            const essPct = Math.max(0, (essenceVal / maxEssenceVal) * 100);
            
            pEssence.style.width = `${essPct}%`;
            
            // IMPORTANTE: Forzamos la clase para que use la textura correcta (bar_qi_fill_01.png)
            // Esto sobrescribe 'fill-qi' (amarillo) por 'fill-essence' (azul)
            pEssence.className = 'brush-fill-img fill-essence';
        }
    }
}

/**
 * Renderiza la estructura HTML de la arena de combate, incluyendo HUDs, botones y elementos visuales.
 * @param {string} enemyId - El ID del enemigo para determinar sprites y elementos.
 * @returns {void}
 */
function renderCombatStructure(enemyId) {
    const arena = document.getElementById('battle-arena');
    const enemyList = document.getElementById('enemy-list');
    
    enemyList.classList.add('hidden');
    arena.classList.remove('hidden');
    
    let spriteUrl = 'assets/icons/elements/element_fire.png';
    if (enemyId.includes('wolf')) spriteUrl = 'assets/img/enemy_wolf_01.png';
    if (enemyId.includes('rabbit')) spriteUrl = 'assets/img/enemy_wolf_02.png';

    const elemKey = combatState.enemy.element || 'wood';
    const elemIcon = `assets/icons/elements/element_${elemKey}.png`;
    
    // Color del glifo según elemento
    const elemColor = ELEMENTS[elemKey] ? ELEMENTS[elemKey].color : 'gold';

    // Renderizar la estructura HTML completa de la arena de combate
    arena.innerHTML = `
        <button id="btn-toggle-log">📜</button>
        <div id="combat-log-container" class="combat-log-popup">
            <div class="log-header"><span>Registro</span><button id="btn-close-log" style="background:none;border:none;color:#fff;">X</button></div>
            <div id="combat-log-content" class="log-content custom-scroll"></div>
        </div>

        <div class="combat-enemy-zone">
            <div id="channeling-layer" class="channeling-container" style="color:${elemColor};"></div>
            
            <div id="combat-enemy-sprite">
                <img src="${spriteUrl}" class="anim-breathe enemy-render" alt="Enemigo">
            </div>
        </div>

        <div class="combat-controls-zone">
            <div class="enemy-hud-container">
                <div class="brush-bar-wrapper">
                    <div class="bar-text-overlay">
                        <span style="display:flex; align-items:center;">
                            <img src="${elemIcon}" style="width:20px; margin-right:5px;"> ${combatState.enemy.name}
                        </span>
                        <span id="txt-enemy-hp"></span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div id="bar-enemy-hp" class="brush-fill-img fill-hp" style="width: 100%;"></div>
                    </div>
                </div>
                <div class="brush-bar-wrapper" style="height:15px; width:90%; margin:0 auto;">
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container" style="top:2px; bottom:2px;">
                        <div id="bar-enemy-essence" class="brush-fill-img fill-qi-enemy" style="width: 100%;"></div>
                    </div>
                </div>
            </div>

            <div class="wuxing-wrapper" id="wuxing-wheel-container">
                <svg class="pentagon-svg" viewBox="0 0 200 200">
                    <polygon points="100,10 190,75 155,180 45,180 10,75" class="pentagon-lines" />
                    <path d="M100,20 L180,80 L150,170 L50,170 L20,80 Z" class="cycle-path" />
                </svg>
                <div id="wuxing-buttons-layer" style="position:absolute; width:100%; height:100%; top:0; left:0;"></div>
                
                <div class="flee-btn-wrapper">
                    <button id="btn-flee-combat" title="Huir">🏃</button>
                </div>
            </div>
        </div>

        <div class="player-hud-container">
            <div class="brush-bar-wrapper">
                <div class="bar-text-overlay"><span>${character.name}</span><span id="txt-player-hp"></span></div>
                <div class="brush-bg"></div>
                <div class="brush-fill-container">
                    <div id="bar-player-hp" class="brush-fill-img fill-hp" style="width: 100%;"></div>
                </div>
            </div>
            <div class="brush-bar-wrapper" style="margin-top:5px;">
                <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem; color:#aaa;"><span>Esencia</span></div>
                <div class="brush-bg"></div>
                <div class="brush-fill-container">
                    <div id="bar-player-essence" class="brush-fill-img fill-qi-player" style="width: 100%;"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-toggle-log').onclick = () => document.getElementById('combat-log-container').classList.toggle('active');
    document.getElementById('btn-close-log').onclick = () => document.getElementById('combat-log-container').classList.remove('active');
    document.getElementById('btn-flee-combat').onclick = () => endCombat(false);
}

/**
 * Renderiza la interfaz del pentagrama Wu Xing con botones elementales y perlas de resonancia.
 * @returns {void}
 */
function renderWuXingInterface() {
    const container = document.getElementById('wuxing-buttons-layer');
    if(!container) return;
    container.innerHTML = ''; 

    const positions = [
        { id: "metal", x: 120, y: 12, skill: "skill_metal_01" },
        { id: "fire", x: 228, y: 90, skill: "skill_fire_01" },
        { id: "wood", x: 186, y: 216, skill: "skill_wood_01" },
        { id: "water", x: 54, y: 216, skill: "skill_water_01" },
        { id: "earth", x: 12, y: 90, skill: "skill_earth_01" }
    ];

    positions.forEach(pos => {
        const wrapper = document.createElement('div');
        wrapper.className = `element-wrapper`;
        wrapper.style.left = `${pos.x}px`;
        wrapper.style.top = `${pos.y}px`;

        const btn = document.createElement('button');
        btn.className = 'element-btn-img';
        btn.innerHTML = `<img src="assets/icons/elements/element_${pos.id}.png" alt="${pos.id}">`;
        btn.onclick = () => executePlayerAction(pos.skill);
        
        const pearl = document.createElement('div');
        pearl.className = 'pearl-socket';
        const isActive = (combatState.resonance === pos.id);
        const pearlImg = isActive ? 'assets/img/pearl_gold_active.png' : 'assets/img/pearl_socket.png';
        pearl.innerHTML = `<img src="${pearlImg}" style="width:100%; height:100%;">`; 

        wrapper.appendChild(btn);
        wrapper.appendChild(pearl);
        container.appendChild(wrapper);
    });
}

/**
 * Ejecuta la acción del jugador basada en una habilidad elemental.
 * @param {string} skillId - El ID de la habilidad a usar.
 * @returns {void}
 */
function executePlayerAction(skillId) {
    if(!combatState.inCombat) return;
    const skill = SKILLS_DB[skillId];
    
    // Establecer resonancia elemental basada en la habilidad usada
    combatState.resonance = skill.element;
    renderWuXingInterface();

    // Verificar si se interrumpe la canalización del enemigo
    if (combatState.phase === 'CHANNELING') {
        const weakness = ELEMENTS[combatState.channelingElement].weak;
        if (skill.element === weakness) {
            interruptEnemy();
            return;
        }
    }

    // Calcular y aplicar daño al enemigo
    let damage = Math.floor(skill.base_damage + (character.attack * 0.5));
    combatState.enemy.hp = Math.max(0, combatState.enemy.hp - damage);

    log(`Usas ${skill.name} (${damage} daño)`);
    showFloatingDamage(damage);
    updateCombatBars();

    // Verificar si el enemigo ha sido derrotado
    if (combatState.enemy.hp <= 0) {
        endCombat(true);
    } else {
        setTimeout(enemyTurnLogic, 800);
    }
}

/**
 * Maneja la lógica del turno del enemigo, incluyendo ataques normales o inicio de canalización.
 * @returns {void}
 */
function enemyTurnLogic() {
    if (!combatState.inCombat) return;

    // Manejar estado de aturdimiento
    if (combatState.phase === 'STUNNED') {
        if (combatState.stunDuration > 0) {
            combatState.stunDuration--;
            log(`${combatState.enemy.name} está aturdido.`, 'warning');
            return;
        } else {
            combatState.phase = 'IDLE';
        }
    }

    // Decidir acción: canalizar o atacar
    const roll = Math.random();
    if (roll < 0.3 && combatState.phase === 'IDLE') {
        startChanneling();
    } else {
        // Realizar ataque normal
        const dmg = Math.max(1, combatState.enemy.stats.attack - 2);
        character.health = Math.max(0, character.health - dmg);
        log(`${combatState.enemy.name} ataca (-${dmg} HP)`, 'danger');
        
        updateCombatBars();
        persistCharacter();
        
        if (character.health <= 0) endCombat(false);
    }
}

/**
 * Inicia la fase de canalización del enemigo, aplicando filtros visuales al glifo.
 * @returns {void}
 */
function startChanneling() {
    combatState.phase = 'CHANNELING';
    
    // Aseguramos que el enemigo tenga elemento, si no, default 'wood'
    const element = combatState.enemy.element || 'wood';
    combatState.channelingElement = element;
    
    log(`¡${combatState.enemy.name} carga energía ${element}!`, 'warning');
    
    const layer = document.getElementById('channeling-layer');
    if(layer) {
        // Diccionario de colores (Filtros CSS)
        const elementFilters = {
            fire: "sepia(1) saturate(5) hue-rotate(-50deg)",   // Rojo
            wood: "sepia(1) saturate(5) hue-rotate(50deg)",    // Verde
            water: "sepia(1) saturate(5) hue-rotate(180deg)",  // Azul
            earth: "sepia(1) saturate(3) hue-rotate(-100deg)", // Marrón
            metal: "grayscale(1) brightness(1.5)"              // Gris Plata
        };

        // Obtenemos el filtro según el elemento
        const currentFilter = elementFilters[element] || "none";

        // Inyectamos la imagen con el filtro aplicado directamente en el estilo
        // Nota: Asegúrate que en CSS #channeling-layer tenga dimensiones fijas (ej. 350px) y border-radius: 50%
        layer.innerHTML = `<img src="assets/img/channeling_circle_base.png" 
                                class="channeling-glyph" 
                                style="width:100%; height:100%; object-fit:contain; filter: ${currentFilter};">`;
        
        layer.classList.add('active'); 
    }
}

/**
 * Interrumpe la canalización del enemigo, causando aturdimiento y daño adicional.
 * @returns {void}
 */
function interruptEnemy() {
    combatState.phase = 'STUNNED';
    combatState.stunDuration = 1;
    log("¡INTERRUPCIÓN! Enemigo aturdido.", 'crit');
    
    const layer = document.getElementById('channeling-layer');
    if(layer) {
        layer.classList.remove('active');
        layer.innerHTML = '';
    }
    
    const bonusDmg = 20;
    combatState.enemy.hp = Math.max(0, combatState.enemy.hp - bonusDmg);
    showFloatingDamage(bonusDmg + "!", true);
    updateCombatBars();
}

/**
 * Agrega una entrada al registro de combate.
 * @param {string} msg - El mensaje a registrar.
 * @param {string} type - El tipo de mensaje (normal, warning, danger, crit).
 * @returns {void}
 */
function log(msg, type='normal') {
    const box = document.getElementById('combat-log-content');
    if(box) {
        const div = document.createElement('div');
        div.className = `log-entry log-${type}`;
        div.textContent = msg;
        box.prepend(div);
    }
}

/**
 * Muestra un daño flotante en la zona del enemigo.
 * @param {string|number} text - El texto o número del daño.
 * @param {boolean} isCrit - Indica si es un golpe crítico.
 * @returns {void}
 */
function showFloatingDamage(text, isCrit = false) {
    const zone = document.querySelector('.combat-enemy-zone');
    if(zone) {
        const el = document.createElement('div');
        el.className = 'floating-damage';
        el.textContent = text;
        if(isCrit) el.style.color = '#FFD700';
        el.style.left = '50%'; el.style.top = '40%';
        zone.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

/**
 * Finaliza el combate, mostrando el resultado y restaurando la interfaz.
 * @param {boolean} victory - Indica si el jugador ganó el combate.
 * @returns {void}
 */
function endCombat(victory) {
    combatState.inCombat = false;
    const arena = document.getElementById('battle-arena');
    const list = document.getElementById('enemy-list');
    
    if(victory) {
        // Mostrar mensaje de victoria y restaurar interfaz después de un delay
        log("¡VICTORIA!", "crit");
        showFloatingDamage("VICTORIA", true);
        setTimeout(() => {
            arena.classList.add('hidden');
            list.classList.remove('hidden');
            if(window.forceUpdateAll) window.forceUpdateAll();
        }, 1500);
    } else {
        // Mostrar mensaje de huida y restaurar interfaz inmediatamente
        log("Huiste...", "normal");
        arena.classList.add('hidden');
        list.classList.remove('hidden');
        if(window.forceUpdateAll) window.forceUpdateAll();
    }
}