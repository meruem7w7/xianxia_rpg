// js/sects.js - Versión FINAL con modal
import { character, persistCharacter, showCharacterProfile } from "./character.js";
import { showMessage, toggleOverlay } from "./ui.js"; 

const sectData = {
  montana_eterea: {
    name: "Montaña Etérea",
    description:
      "Una secta enfocada en la meditación y la conexión con la naturaleza.",
    requirements: {
      stats: { wisdom: 15 },
    },
  },
  puno_atronador: {
    name: "Puño Atronador",
    description: "Una secta marcial enfocada en el combate y la fuerza bruta.",
    requirements: {
      stats: { strength: 15 },
    },
  },
};

/**
 * Genera y muestra el menú de Sectas como un modal.
 */
function showSectOptions() {
  const modalContent = document.createElement('div');
  modalContent.className = 'menu'; 
  
  let html = '<h2>Elegir Secta</h2>';
  html += `<p>Actualmente en: <b>${character.sect ? sectData[character.sect].name : 'Ninguna'}</b></p>`;
  html += '<ul>';

  for (const key in sectData) {
    const sect = sectData[key];
    
    // Usamos un botón con data-attribute para añadir el listener
    html += `
        <li>
            <b>${sect.name}</b>: ${sect.description}
            <button class="join-sect-button button small" data-sect="${key}">Unirse</button>
        </li>
    `;
  }
  
  html += '</ul>';
  html += '<button class="close-button button" id="btn-close-sect">Cerrar</button>'; 
  
  modalContent.innerHTML = html;
  
  // Agregar listeners dinámicamente
  modalContent.querySelector('#btn-close-sect').addEventListener('click', () => toggleOverlay(false));
  
  modalContent.querySelectorAll('.join-sect-button').forEach(button => {
    button.addEventListener('click', (e) => {
        joinSect(e.target.dataset.sect);
    });
  });

  toggleOverlay(true, modalContent);
}

/**
 * Lógica para unirse a una secta.
 */
function joinSect(sectKey) {
    const sect = sectData[sectKey];
    if (sect) {
        if (character.sect === sectKey) {
            showMessage(`Ya eres parte de la secta ${sect.name}.`, 'alerta');
            return;
        }
        
        character.sect = sectKey;
        persistCharacter();
        showCharacterProfile();
        showMessage(`Te has unido a la secta ${sect.name}!`, 'exito');
        toggleOverlay(false); // Cerrar el modal
    }
}


export { showSectOptions, joinSect };
