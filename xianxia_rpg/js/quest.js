// js/quest.js
import { questData, itemsData } from "./data.js";
import { showMessage } from "./ui.js";
import { character, persistCharacter, showCharacterProfile } from "./character.js";

let activeQuests = {}; // Mock de misiones activas (debería estar en character.js o persistence.js idealmente)

function acceptQuest(questKey) {
  const quest = questData[questKey];

  if (!quest) {
    showMessage("Misión no encontrada.", 'alerta');
    return;
  }

  if (activeQuests[questKey]) {
      showMessage("Ya tienes esta misión activa.", 'alerta');
      return;
  }

  if (!character) {
    showMessage("No hay personaje para aceptar misiones.", 'alerta');
    return;
  }

  activeQuests[questKey] = {
    name: quest.name,
    description: quest.description,
    completed: false,
    progress: {} // Lógica de progreso futura
  };

  showMessage(`Misión aceptada: ${quest.name}. Objetivo: ${quest.description}`, 'exito');
  // Aquí se llamaría a persistCharacter para guardar activeQuests si estuviera en character.js
}

/**
 * Marca una misión como completada, otorga recompensas y la quita de activas.
 */
function completeQuest(questKey) {
  if (!activeQuests[questKey] || activeQuests[questKey].completed) {
    showMessage("Misión no activa o ya completada.", 'alerta');
    return;
  }

  const quest = questData[questKey];
  if (!quest || !character) return;

  // Otorgar recompensas
  character.experience += quest.rewards.experience || 0;
  character.gold += quest.rewards.gold || 0;
  
  let rewardsMessage = `Misión completada: ${quest.name}. Recibiste: `;
  
  if (quest.rewards.items) {
      for(const itemKey in quest.rewards.items) {
          const quantity = quest.rewards.items[itemKey];
          // Agregar al inventario
          if (character.inventory[itemKey]) {
              character.inventory[itemKey] += quantity;
          } else {
              character.inventory[itemKey] = quantity;
          }
          rewardsMessage += `${quantity}x ${itemsData[itemKey].name}, `;
      }
  }

  // Limpiar y finalizar
  activeQuests[questKey].completed = true;
  persistCharacter();
  showCharacterProfile();
  showMessage(rewardsMessage.slice(0, -2), 'exito');

  // Nota: Para un sistema completo, la misión debería ser movida a un registro de misiones completadas.
}

export { acceptQuest, completeQuest };
