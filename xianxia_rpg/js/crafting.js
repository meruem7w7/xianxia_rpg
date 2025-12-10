// js/crafting.js - Versión FINAL con modal
import { itemsData } from './data.js';
import { character, persistCharacter } from './character.js';
import { showInventory } from './inventory.js'; 
import { showMessage, toggleOverlay } from './ui.js'; 

const craftingRecipes = {
    "espada_piedra": {
        name: "Espada de Piedra",
        ingredients: {
            "piedra": 5,
            "rama": 2
        },
        result: "espada_piedra", 
        successRate: 0.8 
    }
};

/**
 * Genera y muestra el menú de Crafteo como un modal.
 */
function showCraftingModal() {
    const modalContent = document.createElement('div');
    modalContent.className = 'menu'; 
    
    let html = '<h2>Estación de Crafteo</h2>';
    html += '<p>Recetas disponibles:</p>';
    html += '<ul>';

    for (const key in craftingRecipes) {
        const recipe = craftingRecipes[key];
        const resultItem = itemsData[recipe.result] ? itemsData[recipe.result].name : 'Item Desconocido';
        
        let ingredientsList = [];
        let hasMaterials = true;
        for(const ingredientKey in recipe.ingredients) {
            const required = recipe.ingredients[ingredientKey];
            const current = character.inventory[ingredientKey] || 0;
            if (current < required) hasMaterials = false;
            ingredientsList.push(`${required}x ${itemsData[ingredientKey].name} (${current})`);
        }
        
        const buttonText = hasMaterials ? 'Craftear' : 'Faltan Materiales';
        
        html += `
            <li>
                <b>${resultItem}</b> (Éxito: ${recipe.successRate * 100}%)<br>
                Requiere: ${ingredientsList.join(', ')}
                <button class="craft-button button small" data-recipe="${key}" ${hasMaterials ? '' : 'disabled'}>${buttonText}</button>
            </li>
        `;
    }
    
    html += '</ul>';
    html += '<button class="close-button button" id="btn-close-crafting">Cerrar</button>'; 
    
    modalContent.innerHTML = html;
    
    // Agregar listeners
    modalContent.querySelector('#btn-close-crafting').addEventListener('click', () => toggleOverlay(false));
    
    modalContent.querySelectorAll('.craft-button').forEach(button => {
        button.addEventListener('click', (e) => {
            craftItem(e.target.dataset.recipe);
            // Re-renderizar el modal para actualizar el estado de los ingredientes
            showCraftingModal(); 
        });
    });

    toggleOverlay(true, modalContent);
}

/**
 * Lógica principal de crafteo.
 */
function craftItem(recipeKey) {
    const recipe = craftingRecipes[recipeKey];

    if (!recipe) {
        showMessage(`Receta no encontrada: ${recipeKey}`, 'alerta');
        return;
    }
    // ... (El resto de la lógica de craftItem que tenías en crafting.txt)
    // ... (Se omite por brevedad, asumiendo que tu lógica interna es correcta)

    // Lógica completa de crafteo (verificando y restando items)
    for (const ingredientKey in recipe.ingredients) {
        const requiredQuantity = recipe.ingredients[ingredientKey];
        if (!character.inventory[ingredientKey] || character.inventory[ingredientKey] < requiredQuantity) {
            showMessage(`No tienes suficientes ${itemsData[ingredientKey].name} para craftear ${recipe.name}`, 'alerta');
            return;
        }
    }

    for (const ingredientKey in recipe.ingredients) {
        character.inventory[ingredientKey] -= recipe.ingredients[ingredientKey];
        if (character.inventory[ingredientKey] <= 0) {
            delete character.inventory[ingredientKey];
        }
    }

    const success = Math.random() < recipe.successRate;

    if (success) {
        if (character.inventory[recipe.result]) {
            character.inventory[recipe.result]++;
        } else {
            character.inventory[recipe.result] = 1;
        }
        showMessage(`¡Crafteo exitoso! Creaste ${recipe.name}.`, 'exito');
        showInventory(); 
    } else {
        showMessage(`¡El crafteo de ${recipe.name} falló!`, 'alerta'); 
    }

    persistCharacter(); 
}

export { craftItem, showCraftingModal };
