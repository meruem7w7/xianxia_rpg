// js/npc.js
import { npcData } from "./data.js";
import { showMessage, toggleOverlay } from "./ui.js";
import { getCurrentUsername } from "./persistence.js";

function interactWithNPC(npcKey) {
  const npc = npcData[npcKey];

  if (!npc) {
    showMessage(`NPC no encontrado: ${npcKey}`, 'alerta');
    return;
  }

  // Lógica simple de diálogo con modal
  const modalContent = document.createElement('div');
  modalContent.className = 'menu';
  
  modalContent.innerHTML = `
    <h2>${npc.name} (${npc.role})</h2>
    <p>"${npc.dialogueLines[Math.floor(Math.random() * npc.dialogueLines.length)]}"</p>
    ${npc.quest ? `<p>¡Este NPC tiene una misión!</p><button id="btn-accept-quest" class="button">Aceptar Misión</button>` : ''}
    <button class="close-button button" id="btn-close-npc">Cerrar</button>
  `;
  
  modalContent.querySelector('#btn-close-npc').addEventListener('click', () => toggleOverlay(false));

  if (npc.quest) {
    modalContent.querySelector('#btn-accept-quest').addEventListener('click', () => {
      import("./quest.js").then((module) => {
        module.acceptQuest(npc.quest);
        toggleOverlay(false);
      });
    });
  }
  
  toggleOverlay(true, modalContent);
}

export { interactWithNPC };
