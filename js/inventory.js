// js/inventory.js
import { character, equipItem, persistCharacter, healCharacter } from "./character.js";
import { itemsData } from "./data.js"; // Ahora sí coincide con el export
import { showMessage } from "./ui.js";

function showInventory() {
  // Buscamos el contenedor del nuevo diseño (inventory-slots)
  const grid = document.getElementById("inventory-slots");
  
  if (!grid) return;

  grid.innerHTML = "";
  
  if (!character || !character.inventory) return;

  const itemKeys = Object.keys(character.inventory);

  if (itemKeys.length === 0) {
    grid.innerHTML = "<p style='color:#666; padding:20px;'>Tu bolsa está vacía...</p>";
    return;
  }

  itemKeys.forEach(key => {
      const qty = character.inventory[key];
      const item = itemsData[key];
      
      // Si el item no existe en la DB (por ejemplo, items antiguos guardados), ignorar
      if(!item) return; 

      // Crear Slot (Grid)
      const slot = document.createElement("div");
      // Añadir clase de rareza si existe, o common por defecto
      const rarityClass = item.rarity ? `rarity-${item.rarity}` : 'rarity-common';
      slot.className = `inv-slot ${rarityClass}`;
      
      // Contenido del Slot
      slot.innerHTML = `
        <div class="item-icon">${item.icon || '📦'}</div>
        <div class="inv-qty">${qty > 1 ? qty : ''}</div>
      `;
      
      // Tooltip / Acción al hacer clic
      slot.title = `${item.name} (${item.type})`; // Tooltip nativo simple por ahora
      
      slot.onclick = () => {
          // Lógica simple de uso/equipamiento al hacer click
          if(item.type === 'consumable') {
              if(confirm(`¿Usar ${item.name}?`)) {
                  if(item.effect && item.effect.hp) healCharacter(item.effect.hp);
                  character.inventory[key]--;
                  if(character.inventory[key] <= 0) delete character.inventory[key];
                  persistCharacter();
                  showInventory(); // Refrescar
              }
          } 
          else if (item.type === 'weapon' || item.type === 'armor') {
              if(confirm(`¿Equipar ${item.name}?`)) {
                  equipItem(key);
              }
          }
      };

      grid.appendChild(slot);
  });
}

export { showInventory };