// js/godmode.js - V1.6
import { combatState, updateCombatBars } from './combat.js';
import { character, persistCharacter } from './character.js';

export function initGodMode() {
    if (document.getElementById('god-mode-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'god-mode-panel';
    panel.style.cssText = `
        position: fixed; bottom: 90px; right: 20px; width: 220px;
        background: rgba(0,0,0,0.9); border: 2px solid gold;
        color: white; padding: 10px; z-index: 10000;
        font-family: monospace; display: none; border-radius: 8px;
    `;

    panel.innerHTML = `
        <h3 style="margin:0 0 10px 0; color:gold; text-align:center;">GOD MODE</h3>
        <label>Escala</label><input type="range" id="gm-scale" min="0.5" max="2.0" step="0.1" value="1" style="width:100%">
        <label>X</label><input type="range" id="gm-pos-x" min="-300" max="300" step="10" value="0" style="width:100%">
        <label>Y</label><input type="range" id="gm-pos-y" min="-200" max="200" step="10" value="0" style="width:100%">
        <hr style="margin:10px 0; border-color:#333;">
        <button id="gm-kill" style="width:100%; background:#900; color:white; padding:5px; cursor:pointer;">☠️ Matar</button>
        <button id="gm-heal" style="width:100%; background:#090; color:white; padding:5px; margin-top:5px; cursor:pointer;">💖 Curar</button>
        <div style="position:absolute; top:5px; right:5px; color:red; cursor:pointer;" onclick="this.parentElement.style.display='none'">X</div>
    `;
    document.body.appendChild(panel);

    const openBtn = document.createElement('img');
    openBtn.id = 'god-mode-toggle';
    openBtn.src = 'assets/img/icon_god_mode-.png'; 
    openBtn.style.cssText = "position:fixed; bottom:20px; right:20px; width:120px; height:80px; cursor:pointer; z-index:9999; filter: drop-shadow(0 0 5px gold);";
    openBtn.onclick = () => { panel.style.display = 'block'; };
    openBtn.onerror = () => { openBtn.style.display='none'; };
    
    document.body.appendChild(openBtn);

    const root = document.documentElement;
    document.getElementById('gm-scale').oninput = (e) => root.style.setProperty('--enemy-scale', e.target.value);
    document.getElementById('gm-pos-x').oninput = (e) => root.style.setProperty('--enemy-pos-x', e.target.value + 'px');
    document.getElementById('gm-pos-y').oninput = (e) => root.style.setProperty('--enemy-pos-y', e.target.value + 'px');

    document.getElementById('gm-kill').onclick = () => {
        if(combatState.enemy) {
            combatState.enemy.hp = 0;
            updateCombatBars();
            if(window.forceUpdateAll) window.forceUpdateAll();
        }
    };

    document.getElementById('gm-heal').onclick = () => {
        if(character) {
            character.health = character.maxHealth;
            persistCharacter();
            if(window.forceUpdateAll) window.forceUpdateAll();
        }
    };
}