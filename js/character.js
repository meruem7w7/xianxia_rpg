/**
 * Archivo: character.js
 * Propósito: Gestiona el estado y las operaciones del personaje del jugador,
 * incluyendo carga, creación, persistencia, actualización de UI y acciones
 * como meditar, equipar items y curar. Define el personaje por defecto y
 * maneja el progreso del nivel.
 */

// js/character.js
import { itemsData } from "./data.js";
import { loadPlayerData, savePlayerData, getCurrentUsername } from "./persistence.js";
import { showMessage } from "./ui.js";
import { showInventory } from "./inventory.js";

// Plantilla por defecto para un nuevo personaje
const DEFAULT_CHARACTER = {
  name: "Cultivador",
  level: 1,
  experience: 0,
  maxExperience: 100,
  health: 100,
  maxHealth: 100,
  essence: 50,
  maxEssence: 50,
  attack: 10,
  defense: 5,
  gold: 0,
  spiritStones: 0,
  inventory: { "rusty_sword": 1, "low_pill": 3 },
  equipment: { weapon: null, armor: null },
  sect: null,
  skills: {} // Nuevo objeto para habilidades
};

// Instancia global del personaje actual
let character = null;

/**
 * Carga el personaje para el usuario actual desde el almacenamiento persistente.
 * @returns {object|null} El personaje cargado o null si no hay usuario.
 */
function loadCharacterForCurrentUser() {
  const username = getCurrentUsername();
  if (!username) return null;

  const data = loadPlayerData(username);
  if (data && data.character) {
    character = { ...DEFAULT_CHARACTER, ...data.character };
  } else {
    createNewCharacter(username);
  }
  updateUI(); 
  return character;
}

/**
 * Crea un nuevo personaje con datos proporcionados o un nombre simple.
 * @param {string|object} dataOrName - Nombre del personaje o objeto con datos.
 * @returns {object} El personaje creado.
 */
function createNewCharacter(dataOrName) {
  if (typeof dataOrName === 'string') {
      character = { ...DEFAULT_CHARACTER, name: dataOrName };
  } else {
      character = { ...DEFAULT_CHARACTER, ...dataOrName };
  }
  persistCharacter();
  updateUI();
  return character;
}

/**
 * Persiste el personaje actual en el almacenamiento local.
 * @returns {void}
 */
function persistCharacter() {
  const username = getCurrentUsername();
  if (username && character) {
    savePlayerData(username, {
      password: loadPlayerData(username).password,
      character: character,
    });
  }
  updateUI();
}

/**
 * Actualiza toda la interfaz visual con los datos del personaje.
 * @returns {void}
 */
function updateUI() {
    if(!character) return;
    
    // 1. Header Info (Barra Superior)
    const nameEl = document.getElementById('sidebar-name'); // En sidebar
    const lvlEl = document.getElementById('sidebar-level'); // En sidebar
    const goldEl = document.getElementById('res-gold'); // Top Header
    const spiritEl = document.getElementById('res-spirit'); // Top Header
    
    // 2. Barras del Panel Hogar
    const hpText = document.getElementById('val-hp');
    const hpBar = document.getElementById('bar-hp');
    const qiText = document.getElementById('val-qi');
    const qiBar = document.getElementById('bar-qi');
    const essenceText = document.getElementById('val-essence');
    const essenceBar = document.getElementById('bar-essence');

    // 3. Nuevos Stats
    const statLevel = document.getElementById('stat-level');
    const statAttack = document.getElementById('stat-attack');
    const statDefense = document.getElementById('stat-defense');
    const statGold = document.getElementById('stat-gold');
    const statSpiritStones = document.getElementById('stat-spiritStones');

    // Asignación segura de elementos de la UI
    if(nameEl) nameEl.textContent = character.name;
    if(lvlEl) lvlEl.textContent = "Nivel " + character.level;
    if(goldEl) goldEl.textContent = character.gold;
    if(spiritEl) spiritEl.textContent = character.spiritStones || 0;

    // Actualizar barra de salud
    if(hpBar) {
        const hpPct = Math.max(0, Math.min(100, (character.health / character.maxHealth) * 100));
        hpBar.style.width = `${hpPct}%`;
        if(hpText) hpText.textContent = `${Math.floor(character.health)}/${character.maxHealth}`;
    }

    // Actualizar barra de qi (experiencia)
    if(qiBar) {
        const qiPct = Math.max(0, Math.min(100, (character.experience / character.maxExperience) * 100));
        qiBar.style.width = `${qiPct}%`;
        if(qiText) qiText.textContent = `${Math.floor(character.experience)}/${character.maxExperience}`;
    }

    // Actualizar barra de esencia
    if(essenceBar) {
        const essencePct = Math.max(0, Math.min(100, (character.essence / character.maxEssence) * 100));
        essenceBar.style.width = `${essencePct}%`;
        if(essenceText) essenceText.textContent = `${Math.floor(character.essence)}/${character.maxEssence}`;
    }

    // Actualizar estadísticas adicionales
    if(statLevel) statLevel.textContent = character.level;
    if(statAttack) statAttack.textContent = character.attack;
    if(statDefense) statDefense.textContent = character.defense;
    if(statGold) statGold.textContent = character.gold;
    if(statSpiritStones) statSpiritStones.textContent = character.spiritStones || 0;
}

/**
 * Acción de meditar para ganar experiencia y oro.
 * @returns {void}
 */
export function meditate() {
    if (!character) return;
    
    // Ganancia simple por meditación
    const expGain = 10;
    const goldGain = 1;
    
    character.experience += expGain;
    character.gold += goldGain;
    
    showMessage(`Meditas profundamente... (+${expGain} Exp, +${goldGain} Oro)`, "progreso");
    
    // Verificar subida de nivel
    if (character.experience >= character.maxExperience) {
        character.level++;
        character.experience = 0;
        character.maxExperience = Math.floor(character.maxExperience * 1.5);
        character.maxHealth += 20;
        character.health = character.maxHealth; // Curar al subir nivel
        character.attack += 2;
        showMessage(`¡ROMPISTE LA BARRERA! Alcanzaste el Nivel ${character.level}`, "exito");
    }
    
    persistCharacter();
}

/**
 * Cura al personaje por una cantidad específica.
 * @param {number} amount - Cantidad de HP a recuperar.
 * @returns {void}
 */
function healCharacter(amount) {
  if (!character) return;
  character.health = Math.min(character.maxHealth, character.health + amount);
  persistCharacter();
  showMessage(`Recuperaste ${amount} HP.`, 'exito');
}

/**
 * Equipa un item en el slot correspondiente (arma o armadura).
 * @param {string} itemKey - Clave del item a equipar.
 * @returns {void}
 */
function equipItem(itemKey) {
    if (!character) return;
    const item = itemsData[itemKey];
    if (!item) return;

    const slot = item.type; 
    if (slot !== 'weapon' && slot !== 'armor') return;

    // Desequipar item anterior si existe
    if (character.equipment[slot]) {
        const oldItem = character.equipment[slot];
        character.inventory[oldItem] = (character.inventory[oldItem] || 0) + 1;
    }

    // Equipar nuevo item
    character.equipment[slot] = itemKey;
    character.inventory[itemKey]--;
    if (character.inventory[itemKey] <= 0) delete character.inventory[itemKey];

    persistCharacter();
    showInventory();
    showMessage(`Equipaste: ${item.name}`, 'exito');
}

// Alias para mostrar perfil del personaje
const showCharacterProfile = updateUI; 

export {
  character,
  loadCharacterForCurrentUser,
  createNewCharacter,
  persistCharacter,
  healCharacter,
  equipItem,
  showCharacterProfile
};