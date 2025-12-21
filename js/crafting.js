// js/crafting.js
import { itemsData } from './data.js';
import { character, persistCharacter } from './character.js';
import { showInventory } from './inventory.js'; 
import { showMessage, toggleOverlay } from './ui.js'; 

// Recetas actualizadas a la nueva DB
const craftingRecipes = {
    "iron_sword": {
        name: "Espada de Hierro",
        ingredients: {
            "iron_ore": 3,
            "wood_log": 1
        },
        result: "iron_sword", 
        successRate: 0.9 
    }
};

function showCraftingModal() {
    const modalContent = document.createElement('div');
    modalContent.className = 'menu modal-box'; // Usamos estilo modal-box
    
    let html = '<h2 class="font-cinzel text-gold">Forja Espiritual</h2>';
    html += '<div class="craft-list">';

    for (const key in craftingRecipes) {
        const recipe = craftingRecipes[key];
        const resultItem = itemsData[recipe.result];
        if (!resultItem) continue;
        
        let ingredientsList = [];
        let hasMaterials = true;
        
        for(const ingredientKey in recipe.ingredients) {
            const required = recipe.ingredients[ingredientKey];
            const current = character.inventory[ingredientKey] || 0;
            const matName = itemsData[ingredientKey] ? itemsData[ingredientKey].name : ingredientKey;
            
            if (current < required) hasMaterials = false;
            ingredientsList.push(`${matName}: ${current}/${required}`);
        }
        
        const btnClass = hasMaterials ? 'button primary' : 'button';
        const btnText = hasMaterials ? 'Forjar' : 'Faltan Materiales';
        const disabledAttr = hasMaterials ? '' : 'disabled';
        
        html += `
            <div class="card" style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:${hasMaterials ? '#fff' : '#666'}">${resultItem.name}</strong>
                        <div style="font-size:0.8rem; color:#888;">${ingredientsList.join(', ')}</div>
                    </div>
                    <button class="${btnClass} small" data-recipe="${key}" ${disabledAttr}>${btnText}</button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    html += '<button class="button secondary" style="width:100%; margin-top:10px;" id="btn-close-crafting">Cerrar</button>'; 
    
    modalContent.innerHTML = html;
    
    // Listeners
    modalContent.querySelector('#btn-close-crafting').addEventListener('click', () => toggleOverlay(false));
    
    modalContent.querySelectorAll('button[data-recipe]').forEach(button => {
        button.addEventListener('click', (e) => {
            craftItem(e.target.dataset.recipe);
            toggleOverlay(false); // Cerrar tras craftear para simplificar
            showCraftingModal(); // O reabrir para actualizar
        });
    });

    toggleOverlay(true, modalContent);
}

function craftItem(recipeKey) {
    const recipe = craftingRecipes[recipeKey];
    if (!recipe) return;

    // Consumir
    for (const ing in recipe.ingredients) {
        character.inventory[ing] -= recipe.ingredients[ing];
        if (character.inventory[ing] <= 0) delete character.inventory[ing];
    }

    // Resultado
    const success = Math.random() < recipe.successRate;
    if (success) {
        character.inventory[recipe.result] = (character.inventory[recipe.result] || 0) + 1;
        showMessage(`¡Éxito! Forjaste ${recipe.name}`, 'exito');
    } else {
        showMessage(`Fallaste al forjar ${recipe.name}. Materiales perdidos.`, 'alerta');
    }

    persistCharacter();
    showInventory();
}

export { showCraftingModal };