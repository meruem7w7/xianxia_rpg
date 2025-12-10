// js/character.js
import { itemsData } from "./data.js";
import {
  loadPlayerData,
  savePlayerData,
  getCurrentUsername,
} from "./persistence.js";
import { showMessage } from "./ui.js"; // Importado para mensajes

const DEFAULT_CHARACTER = {
  name: "Sin Nombre",
  level: 1,
  experience: 0,
  health: 100,
  maxHealth: 100,
  attack: 10,
  defense: 5,
  inventory: {
    espada_madera: 1,
    pocion_curacion: 3,
  },
  equipment: {
    weapon: null,
    armor: null,
  },
  gold: 100,
  sect: null,
};

let character = null;

function loadCharacterForCurrentUser() {
  const username = getCurrentUsername();
  if (!username) return null;

  const data = loadPlayerData(username);
  if (data && data.character) {
    character = { ...DEFAULT_CHARACTER, ...data.character };
  } else {
    // Si no hay personaje, se crea uno por defecto al iniciar el juego
    createNewCharacter(username);
  }
  return character;
}

function createNewCharacter(name) {
  const username = getCurrentUsername();
  if (!username) {
    console.error("No hay usuario activo para crear personaje.");
    return null;
  }

  character = {
    ...DEFAULT_CHARACTER,
    name: name,
  };

  persistCharacter();
  showMessage(`Nuevo personaje creado: ${character.name}.`, 'exito');
  return character;
}

function persistCharacter() {
  const username = getCurrentUsername();
  if (username && character) {
    savePlayerData(username, {
      password: loadPlayerData(username).password, // Mantiene la contraseña
      character: character,
    });
  }
}

function healCharacter(amount) {
  if (!character) return;
  character.health = Math.min(character.maxHealth, character.health + amount);
  persistCharacter();
  showMessage(`Salud restaurada en ${amount}. Salud actual: ${character.health}`, 'exito');
}

function damageCharacter(amount) {
  if (!character) return;
  character.health = Math.max(0, character.health - amount);
  persistCharacter();
  showMessage(`Recibiste ${amount} de daño. Salud actual: ${character.health}`, 'alerta');
}

function equipItem(itemKey) {
    if (!character) return;
    const item = itemsData[itemKey];
    if (!item) return;

    if (item.type === 'weapon' || item.type === 'armor') {
        const slot = item.type;
        const currentEquipped = character.equipment[slot];
        
        // 1. Desequipar el item actual (si existe) y devolverlo al inventario
        if (currentEquipped) {
            if (character.inventory[currentEquipped]) {
                character.inventory[currentEquipped]++;
            } else {
                character.inventory[currentEquipped] = 1;
            }
        }
        
        // 2. Equipar el nuevo item
        character.equipment[slot] = itemKey;
        
        // 3. Quitar el nuevo item del inventario
        if (character.inventory[itemKey]) {
            character.inventory[itemKey]--;
            if (character.inventory[itemKey] <= 0) {
                delete character.inventory[itemKey];
            }
        }
        
        // Lógica de recalculo de stats (simplificado)
        character.attack = DEFAULT_CHARACTER.attack + (item.attack || 0); 
        character.defense = DEFAULT_CHARACTER.defense + (item.defense || 0);

        persistCharacter();
        showCharacterProfile();
        showMessage(`Equipado: ${item.name}.`, 'progreso');
    } else {
        showMessage(`El ítem ${item.name} no se puede equipar.`, 'alerta');
    }
}


function showCharacterProfile() {
  const profileDiv = document.getElementById("character-profile");
  if (!profileDiv) return;
  if (!character) {
    profileDiv.innerHTML = "<p>No hay personaje cargado.</p>";
    return;
  }

  const equippedWeapon =
    character.equipment.weapon && itemsData[character.equipment.weapon]
      ? itemsData[character.equipment.weapon].name
      : "Ninguna";

  const equippedArmor =
    character.equipment.armor && itemsData[character.equipment.armor]
      ? itemsData[character.equipment.armor].name
      : "Ninguna";

  profileDiv.innerHTML = `
    <h2>${character.name}</h2>
    <p>Nivel: ${character.level}</p>
    <p>Exp: ${character.experience}</p>
    <p>Salud: ${character.health} / ${character.maxHealth}</p>
    <p>Ataque: ${character.attack}</p>
    <p>Defensa: ${character.defense}</p>
    <p>Oro: ${character.gold}</p>
    <p>Secta: ${character.sect || "Ninguna"}</p>
    <p>Arma Equipada: ${equippedWeapon}</p>
    <p>Armadura Equipada: ${equippedArmor}</p>
  `;
}

export {
  character,
  loadCharacterForCurrentUser,
  createNewCharacter,
  persistCharacter,
  healCharacter,
  damageCharacter,
  showCharacterProfile,
  equipItem
};
