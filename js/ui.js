/**
 * Archivo: ui.js
 * Propósito: Maneja la interfaz de usuario, incluyendo log, overlays y 
 * el sistema de gestión de cultivo (Wu Xing Drag & Drop).
 */

import { character, equipSkill, unequipSkill } from "./character.js";
import { SKILLS_DB } from "./data.js";


// --- FUNCIONES UTILITARIAS EXISTENTES ---

export function showMessage(message, type = 'normal') {
    const logDiv = document.getElementById('log-messages');
    if (!logDiv) return;

    const p = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let cssClass = 'log-entry';
    let icon = '•';

    switch (type) {
        case 'exito': cssClass += ' log-success'; icon = '✓'; break;
        case 'alerta': 
        case 'danger': cssClass += ' log-danger'; icon = '⚔️'; break;
        case 'progreso': cssClass += ' log-progress'; icon = '✨'; break;
        case 'warning': cssClass += ' log-warning'; icon = '⚠️'; break;
        case 'critical': cssClass += ' log-crit'; icon = '💥'; break;
    }

    p.className = cssClass;
    p.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-icon">${icon}</span> ${message}`;

    logDiv.appendChild(p);

    if (logDiv.children.length > 20) {
        logDiv.removeChild(logDiv.firstChild);
    }
    logDiv.scrollTop = logDiv.scrollHeight;
}

export function toggleOverlay(show, content = null) {
    const overlay = document.getElementById("ui-overlay");
    if (!overlay) return;
    
    if (show) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = '';
        if (content) {
            if (content instanceof HTMLElement) {
                overlay.appendChild(content);
            } else {
                overlay.innerHTML = content;
            }
        }
    } else {
        overlay.classList.add('hidden');
        overlay.innerHTML = ''; 
    }
}

export function toggleLog() {
    const content = document.querySelector('.collapsible-content');
    const icon = document.querySelector('.toggle-icon');
    if (content) {
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            if (icon) icon.textContent = '▼';
        } else {
            content.style.display = 'none';
            if (icon) icon.textContent = '▶';
        }
    }
}

// --- NUEVO: SISTEMA DE GESTIÓN DE CULTIVO (Objeto UI) ---

export const UI = {
    /**
     * Renderiza el Panel de Cultivo completo (Pentágono + Lista)
     */
    renderCultivationPanel: function() {
        const container = document.getElementById('cultivation-wheel-container');
        if(!container) return; // Si no estamos en la pestaña correcta, salir
        container.innerHTML = ''; 
        
        // Actualizar Stats Esotéricos
        if(character && character.stats) {
            const elKarma = document.getElementById('val-karma');
            const elPercep = document.getElementById('val-percep');
            const elWill = document.getElementById('val-will');
            
            if(elKarma) elKarma.innerText = character.stats.karma_luck || 0;
            if(elPercep) elPercep.innerText = character.stats.perception || 0;
            if(elWill) elWill.innerText = character.stats.willpower || 0;
        }

        // Definir posiciones del Pentágono
        const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
        
        elements.forEach(elem => {
            // Crear el SLOT (Agujero donde cae la skill)
            const slot = document.createElement('div');
            slot.className = `cultivation-slot slot-${elem}`;
            slot.dataset.element = elem; 
            
            // Eventos Drag & Drop Nativos
            slot.ondragover = (e) => e.preventDefault(); // Permitir soltar
            slot.ondrop = (e) => UI.handleDrop(e);

            // Icono de fondo del elemento (Visual)
            const bgIcon = document.createElement('img');
            bgIcon.src = `assets/icons/elements/element_${elem}.png`;
            bgIcon.className = 'slot-bg-icon';
            // Fallback por si no existe la imagen
            bgIcon.onerror = () => { bgIcon.style.display = 'none'; };
            slot.appendChild(bgIcon);

            // ¿Hay habilidad equipada?
            if (character && character.equippedSkills && character.equippedSkills[elem]) {
                const equipped = character.equippedSkills[elem];
                const skill = SKILLS_DB[equipped.id]; 
                
                if(skill) {
                    const skillImg = document.createElement('div');
                    skillImg.className = `equipped-skill-token affinity-${equipped.affinity}`;
                    skillImg.innerHTML = skill.icon || "📜";
                    skillImg.title = `${skill.name} (${equipped.affinity})`;
                    // --- NUEVO: DESEQUIPAR CON CLIC DERECHO ---
                    skillImg.oncontextmenu = (e) => {
                        e.preventDefault(); // Evita que salga el menú del navegador
                        unequipSkill(elem); // Borra la skill
                        UI.renderCultivationPanel(); // Refresca el panel
                    };
                    slot.appendChild(skillImg);
                }
            }
            container.appendChild(slot);
        });

        UI.renderSkillLibrary();
    },

    /**
     * Renderiza la lista de habilidades disponibles para arrastrar
     */
    renderSkillLibrary: function() {
        const list = document.getElementById('skills-library-list');
        if(!list) return;
        list.innerHTML = '';

        if (!character) return;

        // Obtenemos skills aprendidas. Si no hay lista, usamos todas las de la DB como fallback (para testing)
        const mySkills = character.learnedSkills || Object.keys(SKILLS_DB); 

        mySkills.forEach(skillId => {
            const skill = SKILLS_DB[skillId];
            // Solo mostramos skills activas para equipar
            if(!skill || skill.type !== 'active') return; 

            const item = document.createElement('div');
            item.className = 'skill-library-item';
            item.draggable = true; // ¡Importante para arrastrar!
            
            // Configurar datos para el arrastre
            item.ondragstart = (e) => {
                e.dataTransfer.setData("skillId", skill.id);
                e.dataTransfer.setData("skillElement", skill.element);
            };

            item.innerHTML = `
                <div class="lib-icon">${skill.icon}</div>
                <div class="lib-info">
                    <div class="lib-name">${skill.name}</div>
                    <div class="lib-elem type-${skill.element}">${skill.element}</div>
                </div>
            `;
            list.appendChild(item);
        });
    },

    /**
     * Maneja el evento cuando soltamos una skill en un slot
     */
    handleDrop: function(ev) {
        ev.preventDefault();
        const skillId = ev.dataTransfer.getData("skillId");
        const skillElement = ev.dataTransfer.getData("skillElement");
        
        // Encontrar el slot correcto (a veces el target es la imagen interna)
        let target = ev.target;
        while (!target.classList.contains('cultivation-slot') && target.parentElement) {
            target = target.parentElement;
        }
        
        if (!target.classList.contains('cultivation-slot')) return;
        
        const slotElement = target.dataset.element;
        
        // --- CÁLCULO DE AFINIDAD ---
        let affinity = "dissonance"; // Por defecto: Malo
        
        if (skillElement === slotElement) {
            affinity = "harmony"; // Mismo elemento: Excelente
        } else if (UI.checkGeneration(skillElement, slotElement)) {
            affinity = "generation"; // Elemento Padre -> Hijo: Bueno
        }
        
        // Guardar en el personaje (Función importada de character.js)
        equipSkill(slotElement, skillId, affinity);
        
        // Refrescar visualmente
        UI.renderCultivationPanel(); 
    },

    /**
     * Ciclo de Generación: Agua -> Madera -> Fuego -> Tierra -> Metal -> Agua
     */
    checkGeneration: function(skillElem, slotElem) {
        const cycle = { 
            water: 'wood', 
            wood: 'fire', 
            fire: 'earth', 
            earth: 'metal', 
            metal: 'water' 
        };
        return cycle[skillElem] === slotElem;
    }
};

// Exponemos el objeto UI a la ventana global para que los eventos onclick/ondrop funcionen si es necesario
window.UI = UI;