// js/skills.js
import { SKILLS_DB } from './data.js';
import { character } from './character.js';
import { toggleOverlay } from './ui.js';

export function renderSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    // Sección OFICIOS
    const secProf = document.createElement('div');
    secProf.innerHTML = '<h3 class="skills-section-title">Oficios del Dao</h3>';
    const gridProf = document.createElement('div');
    gridProf.className = 'skills-layout';
    
    // Sección COMBATE
    const secCombat = document.createElement('div');
    secCombat.innerHTML = '<h3 class="skills-section-title">Artes Marciales</h3>';
    const gridCombat = document.createElement('div');
    gridCombat.className = 'skills-layout';

    Object.keys(SKILLS_DB).forEach(key => {
        const data = SKILLS_DB[key];
        const card = createSkillCard(data, key);
        
        if (['meditation','alchemy','mining','forging','herbalism'].includes(key)) {
            gridProf.appendChild(card);
        } else {
            gridCombat.appendChild(card);
        }
    });

    secProf.appendChild(gridProf);
    secCombat.appendChild(gridCombat);
    
    grid.appendChild(secProf);
    grid.appendChild(secCombat);
}

function createSkillCard(data, key) {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
        <div class="skill-icon">${data.icon}</div>
        <div class="skill-info">
            <span class="skill-name">${data.name}</span>
            <span class="skill-level">${data.element ? data.element.toUpperCase() : 'PASIVA'}</span>
        </div>
    `;
    card.onclick = () => {
        toggleOverlay(true, `
            <div class="menu modal-box text-center">
                <div style="font-size:3rem; margin-bottom:10px">${data.icon}</div>
                <h2 class="text-gold font-cinzel">${data.name}</h2>
                <p style="color:#ccc; margin-bottom:20px">${data.desc || data.description}</p>
                <button class="button secondary" onclick="document.getElementById('ui-overlay').classList.add('hidden')">Cerrar</button>
            </div>
        `);
    };
    return card;
}