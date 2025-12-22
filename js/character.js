/**
 * Archivo: character.js
 * Propósito: Gestiona el estado del personaje, carga/guardado y estadísticas.
 * Actualizado V3.0: Soporte para Anatomía Sagrada, Raíces y Dantians.
 */
import { itemsData } from "./data.js";
import { loadPlayerData, savePlayerData, getCurrentUsername } from "./persistence.js";
import { showMessage } from "./ui.js";
import { showInventory } from "./inventory.js";

// Plantilla por defecto V3.0 (Anatomía Sagrada)
const DEFAULT_CHARACTER = {
  name: "Cultivador",
  gender: "man",
  
  // --- PROGRESO BÁSICO ---
  level: 1,
  experience: 0,       // Qi acumulado
  maxExperience: 100,  // Qi para subir nivel
  
  // --- VITALIDAD (Legacy/Compatibilidad UI) ---
  health: 100,
  maxHealth: 100,
  essence: 50,         // Energía Espiritual (Mana)
  maxEssence: 50,
  
  // --- ATRIBUTOS CORE (Combate Físico) ---
  attack: 10,
  defense: 5,
  
  // --- ATRIBUTOS ESOTÉRICOS (Fase 1) ---
  stats: {
      speed: 10,
      lifesteal_perc: 0,      // % Robo de Vida
      essence_leech_perc: 0,  // % Robo de Esencia
      karma_luck: 0,          // Suerte (Drop Rate)
      willpower: 0,           // Resistencia Mental
      perception: 0           // Probabilidad Crítico
  },

  // --- NUEVO: FUNDAMENTO (RAÍZ ESPIRITUAL) ---
  root: {
      type: "pseudo",      // Por defecto: Pseudo-Espiritual (La peor)
      elements: ["fire", "water", "wood", "earth"], // Elementos impuros
      variant: null        // null, 'lightning', 'ice', etc.
  },

  // --- NUEVO: ANATOMÍA SAGRADA (Dantians) ---
  anatomy: {
      // Dantian Inferior (Mar de Qi): Vinculado a la Esencia
      dantian_lower: { current: 0, max: 100 }, 
      
      // Dantian Medio (Palacio Carmesí): Vinculado al Cuerpo/Vigor
      dantian_middle: { purity: 0, layer: 1 }, 
      
      // Dantian Superior (Mar Conciencia): CRÍTICO PARA COMBATE MENTAL
      dantian_upper: { 
          soul_force: 10,   // "Poder de Alma" (Para Supresión de enemigos)
          perception: 5     // Bonus de detección
      },
      
      meridians_blocked: 0 // % de bloqueo (Si es alto, fallan skills)
  },

  // --- NUEVO: INTENCIONES (Buffs Permanentes por Logros) ---
  intents: {
      slaughter_points: 0, // Se acumula al matar
      current_intent: null // Ej: "slaughter" (Daño+), "ethereal" (Evasión+)
  },

  // --- ECONOMÍA ---
  gold: 0,
  spiritStones: 0,
  
  // --- INVENTARIO Y EQUIPO ---
  inventory: { "rusty_sword": 1, "low_pill": 3 },
  equipment: { weapon: null, armor: null },
  
  // --- SISTEMA WU XING (Slots de Habilidades) ---
  equippedSkills: { 
      metal: null, wood: null, water: null, fire: null, earth: null 
  },
  learnedSkills: ["basic_attack"], 
  sect: null
};

let character = null;

/**
 * Carga el personaje e INYECTA la nueva estructura si falta (Migración V3.0)
 */
function loadCharacterForCurrentUser() {
  const username = getCurrentUsername();
  if (!username) return null;

  const data = loadPlayerData(username);
  if (data && data.character) {
    character = { ...DEFAULT_CHARACTER, ...data.character };
    
    // --- RUTINA DE MIGRACIÓN (EVITA CRASHES) ---
    // 1. Inyectar Stats Fase 1 (Si faltan)
    if (!character.stats) character.stats = JSON.parse(JSON.stringify(DEFAULT_CHARACTER.stats));
    if (!character.equippedSkills) character.equippedSkills = JSON.parse(JSON.stringify(DEFAULT_CHARACTER.equippedSkills));
    if (!character.learnedSkills) character.learnedSkills = ["basic_attack"];

    // 2. Inyectar Anatomía Fase 2 (NUEVO)
    if (!character.root) character.root = JSON.parse(JSON.stringify(DEFAULT_CHARACTER.root));
    if (!character.anatomy) character.anatomy = JSON.parse(JSON.stringify(DEFAULT_CHARACTER.anatomy));
    if (!character.intents) character.intents = JSON.parse(JSON.stringify(DEFAULT_CHARACTER.intents));
    
    // Sincronización inicial básica (Legacy -> Anatomy)
    // Si la anatomy.dantian_lower está a 0 pero tenemos essence, sincronizamos
    if(character.anatomy.dantian_lower.current === 0 && character.essence > 0) {
        character.anatomy.dantian_lower.current = character.essence;
        character.anatomy.dantian_lower.max = character.maxEssence;
    }
    // -------------------------------------------
    
  } else {
    createNewCharacter(username);
  }
  updateUI(); 
  return character;
}

function createNewCharacter(dataOrName) {
  if (typeof dataOrName === 'string') {
      character = JSON.parse(JSON.stringify(DEFAULT_CHARACTER)); 
      character.name = dataOrName;
  } else {
      character = { ...DEFAULT_CHARACTER, ...dataOrName };
  }
  persistCharacter();
  updateUI();
  return character;
}

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
 * Vincula una técnica al Pentágono Wu Xing
 */
export function equipSkill(slotElement, skillId, affinityType) {
    if (!character) return;
    character.equippedSkills[slotElement] = { 
        id: skillId, 
        affinity: affinityType 
    };
    persistCharacter();
    showMessage(`Técnica vinculada al meridiano ${slotElement} (${affinityType})`, "exito");
}

/**
 * Desvincula una técnica (Clic Derecho)
 */
export function unequipSkill(slotElement) {
    if (!character) return;
    
    if (character.equippedSkills && character.equippedSkills[slotElement]) {
        character.equippedSkills[slotElement] = null;
        persistCharacter();
        // Usamos try-catch por seguridad si UI no está lista
        try { showMessage(`Meridiano ${slotElement} purgado.`, "normal"); } catch(e) {}
    }
}

// --- MÉTODOS EXISTENTES Y HELPERS ---

function updateUI() {
    if(!character) return;
    // La UI principal se actualiza desde main.js/UI.render...
    // Aquí mantenemos actualizaciones críticas de estado si fuera necesario
}

export function meditate() {
    if (!character) return;
    
    // V3.0: Meditación ahora cultiva el Dantian Inferior también
    const expGain = 10;
    
    character.experience += expGain;
    
    // Regeneración pasiva al meditar
    if(character.anatomy && character.anatomy.dantian_lower) {
        character.anatomy.dantian_lower.current = Math.min(
            character.anatomy.dantian_lower.max, 
            character.anatomy.dantian_lower.current + 5
        );
        // Sync Legacy
        character.essence = character.anatomy.dantian_lower.current;
    }

    character.gold += 1;
    showMessage(`Cultivas el Dao... (+${expGain} Qi)`, "progreso");
    
    if (character.experience >= character.maxExperience) {
        levelUp();
    }
    persistCharacter();
}

function levelUp() {
    character.level++;
    character.experience = 0;
    character.maxExperience = Math.floor(character.maxExperience * 1.5);
    
    character.maxHealth += 20;
    character.health = character.maxHealth;
    character.attack += 2;
    
    // V3.0: Crecimiento de Dantians
    if(character.anatomy) {
        character.anatomy.dantian_lower.max += 10;
        character.anatomy.dantian_upper.soul_force += 1; // El alma se fortalece
    }
    // Sync Legacy
    character.maxEssence = character.anatomy.dantian_lower.max;
    character.essence = character.maxEssence;

    showMessage(`¡RUPTURA! Alcanzaste el Nivel ${character.level}`, "exito");
}

function healCharacter(amount) {
  if (!character) return;
  character.health = Math.min(character.maxHealth, character.health + amount);
  persistCharacter();
  showMessage(`Recuperaste ${amount} HP.`, 'exito');
}

function equipItem(itemKey) {
    if (!character) return;
    const item = itemsData[itemKey];
    if (!item) return;
    const slot = item.type; 
    if (slot !== 'weapon' && slot !== 'armor') return;

    if (character.equipment[slot]) {
        const oldItem = character.equipment[slot];
        character.inventory[oldItem] = (character.inventory[oldItem] || 0) + 1;
    }
    character.equipment[slot] = itemKey;
    character.inventory[itemKey]--;
    if (character.inventory[itemKey] <= 0) delete character.inventory[itemKey];

    persistCharacter();
    showInventory();
    showMessage(`Equipaste: ${item.name}`, 'exito');
}

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