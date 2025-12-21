// js/sects.js - FUNCIONALIDAD GARANTIZADA
import { character, persistCharacter } from "./character.js";
import { showMessage, toggleOverlay } from "./ui.js";

const SECTS_DB = {
  montana_eterea: {
    name: "Secta Montaña Etérea",
    desc: "Maestros del flujo de Qi natural y la curación.",
    icon: "🏔️",
    bonus: "+10% Regeneración de Salud"
  },
  puno_atronador: {
    name: "Secta Puño Atronador",
    desc: "Cultivadores corporales que rompen rocas con los puños.",
    icon: "👊",
    bonus: "+5% Daño Físico"
  }
};

export function showSectOptions() {
  const container = document.getElementById('sect-content');
  if (!container) return;

  container.innerHTML = ''; // Limpieza inicial

  // --- ESCENARIO 1: YA ERES MIEMBRO ---
  if (character.sect) {
      const sect = SECTS_DB[character.sect];
      
      // Crear contenedor de la carta
      const card = document.createElement('div');
      card.className = 'card';
      card.style.textAlign = 'center';
      card.style.padding = '30px';
      
      // Contenido estático
      card.innerHTML = `
          <div style="font-size:4rem; margin-bottom:10px;">${sect ? sect.icon : '🏯'}</div>
          <h2 class="text-gold font-cinzel">${sect ? sect.name : character.sect}</h2>
          <p style="color:#aaa; margin-bottom:20px;">Eres un discípulo reconocido.</p>
          <div class="sect-bonuses" style="margin-bottom:30px;">
              <p class="text-cyan">${sect ? sect.bonus : ''}</p>
          </div>
      `;

      // Botón Abandonar (Creado como elemento DOM para asegurar el click)
      const btnLeave = document.createElement('button');
      btnLeave.id = 'btn-leave-sect';
      btnLeave.className = 'btn-leave-sect'; // Clase CSS roja definida anteriormente
      btnLeave.textContent = 'Abandonar Secta';
      
      // Asignación directa del evento (Sin timeouts, sin fallos)
      btnLeave.onclick = () => showLeaveConfirmation(); // Llamada directa

      card.appendChild(btnLeave);
      container.appendChild(card);
      return;
  }

  // --- ESCENARIO 2: LISTA DE SECTAS ---
  const title = document.createElement('h3');
  title.className = 'text-center text-gold mb-4';
  title.style.fontFamily = 'Cinzel';
  title.textContent = 'Sectas Disponibles';
  container.appendChild(title);

  const listDiv = document.createElement('div');
  listDiv.className = 'sect-list';

  for (const [key, sect] of Object.entries(SECTS_DB)) {
      const card = document.createElement('div');
      card.className = 'sect-card';
      
      card.innerHTML = `
          <div style="display:flex; gap:15px; align-items:center;">
              <div style="font-size:2.5rem;">${sect.icon}</div>
              <div>
                  <h4 class="text-gold font-cinzel" style="margin:0;">${sect.name}</h4>
                  <p style="font-size:0.8rem; color:#aaa; margin:5px 0;">${sect.desc}</p>
                  <small class="text-cyan">${sect.bonus}</small>
              </div>
          </div>
      `;

      const btnJoin = document.createElement('button');
      btnJoin.className = 'btn-join-sect';
      btnJoin.textContent = 'Unirse';
      btnJoin.onclick = () => joinSect(key);

      card.appendChild(btnJoin);
      listDiv.appendChild(card);
  }
  
  container.appendChild(listDiv);
}

// Modal de Confirmación Robusto (DOM Puro)
function showLeaveConfirmation() {
    // 1. Crear contenedor del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'menu modal-box text-center';

    // 2. Título y Texto
    const title = document.createElement('h3');
    title.className = 'text-gold font-cinzel';
    title.style.marginBottom = '15px';
    title.textContent = '¿Abandonar el Camino?';

    const desc = document.createElement('p');
    desc.style.marginBottom = '20px';
    desc.style.color = '#ccc';
    desc.innerHTML = 'Si abandonas tu secta ahora, perderás todos tus beneficios.<br><br><span class="text-secondary" style="font-size:0.8rem">Esta acción es irreversible.</span>';

    // 3. Botones de Acción
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '10px';
    btnGroup.style.justifyContent = 'center';

    // Botón SÍ
    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'action-button primary';
    btnConfirm.style.background = '#c0392b'; // Rojo alerta
    btnConfirm.textContent = 'Sí, Abandonar';
    btnConfirm.onclick = () => {
        character.sect = null;
        persistCharacter();
        toggleOverlay(false);
        showSectOptions(); // Recargar panel inmediatamente
        showMessage("Has abandonado tu secta. Ahora eres un errante.", "alerta");
    };

    // Botón NO
    const btnCancel = document.createElement('button');
    btnCancel.className = 'action-button secondary';
    btnCancel.style.border = '1px solid #aaa';
    btnCancel.textContent = 'Cancelar';
    btnCancel.onclick = () => toggleOverlay(false);

    // 4. Ensamblaje
    btnGroup.appendChild(btnConfirm);
    btnGroup.appendChild(btnCancel);
    
    modalContent.appendChild(title);
    modalContent.appendChild(desc);
    modalContent.appendChild(btnGroup);

    // 5. Mostrar
    toggleOverlay(true, modalContent);
}

function joinSect(sectKey) {
    const sect = SECTS_DB[sectKey];
    if (sect) {
        character.sect = sectKey;
        persistCharacter();
        showSectOptions(); 
        showMessage(`¡Te has unido a ${sect.name}!`, 'exito');
    }
}