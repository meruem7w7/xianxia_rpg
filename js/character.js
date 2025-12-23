/**
 * Archivo: character.js
 * Propósito: Gestiona el estado del personaje, carga/guardado y estadísticas.
 * Actualizado V3.0: Soporte para Anatomía Sagrada, Raíces y Dantians.
 *
 * Comentarios detallados:
 * - DEFAULT_CHARACTER: Plantilla base del personaje. Modificar aquí para cambiar valores iniciales.
 * - root: Define el fundamento espiritual. 'type' puede ser 'pseudo', 'spiritual'. 'elements' lista elementos primarios. 'variant' para subelementos como 'lightning'.
 * - anatomy: Estructura de los Dantians. dantian_lower: capacidad de Qi. dantian_middle: pureza y capas. dantian_upper: poder de alma y percepción.
 * - intents: Estados permanentes. slaughter_points acumulan al matar. current_intent afecta buffs (ej: 'slaughter' para daño extra).
 * - equipSkill: Vincula skills al pentágono Wu Xing. SlotElement debe ser 'metal', 'wood', etc.
 * - meditate: Aumenta experiencia y regenera dantians. Ajustar expGain para cambiar ganancia de Qi.
 * - levelUp: Sube nivel cuando experience >= maxExperience. Aumenta stats aquí.
 * - healCharacter: Restaura salud. Usado por items o habilidades.
 * - equipItem: Equipa items del inventario. Verifica tipo (weapon, armor).
 *
 * Notas para assets: Los dantians usan imágenes como 'dantian_mind.png', 'dantian_chest.png', 'dantian_abdomen.png'. Cambiar rutas en main.js si mueves assets.
 * Para cambiar tamaños: En ui.css, clases como .anatomy-visualizer controlan el contenedor. Ajustar width/height allí.
 */
import { itemsData } from "./data.js";
import { loadPlayerData, savePlayerData, getCurrentUsername } from "./persistence.js";
import { showMessage } from "./ui.js";
import { showInventory } from "./inventory.js";

// Plantilla por defecto V3.0 (Anatomía Sagrada)
// NOTA: Esta es la base del personaje. Cambiar valores aquí afecta nuevos personajes.
// Para migración, el código inyecta campos faltantes automáticamente.
const DEFAULT_CHARACTER = {
  name: "Cultivador",
  gender: "man", // 'man' o 'woman' - afecta assets de anatomía (ej: silhouette_base_man.png)
  
  // --- PROGRESO BÁSICO ---
  level: 1,
  experience: 0,       // Qi acumulado - aumenta con meditación/combate
  maxExperience: 100,  // Qi para subir nivel - escala con level
  
  // --- VITALIDAD (Legacy/Compatibilidad UI) ---
  health: 100,         // Salud actual
  maxHealth: 100,      // Salud máxima - aumenta con level
  essence: 50,         // Energía Espiritual (Mana) - usada en skills
  maxEssence: 50,      // Esencia máxima - aumenta con level
  
  // --- ATRIBUTOS CORE (Combate Físico) ---
  attack: 10,          // Daño base
  defense: 5,          // Reducción de daño
  
  // --- ATRIBUTOS ESOTÉRICOS (Fase 1) ---
  stats: {
      speed: 10,              // Velocidad de movimiento/evasión
      lifesteal_perc: 0,      // % Robo de Vida por golpe
      essence_leech_perc: 0,  // % Robo de Esencia
      karma_luck: 0,          // Suerte (Drop Rate) - afecta loot
      willpower: 0,           // Resistencia Mental - contra debuffs
      perception: 0           // Probabilidad Crítico
  },

  // --- NUEVO: FUNDAMENTO (RAÍZ ESPIRITUAL) ---
  // Define el talento innato. 'pseudo' es el peor, limita crecimiento.
  // 'elements' lista elementos primarios; 'variant' añade subelementos (ej: 'lightning' para fire).
  // Cambiar aquí para alterar afinidades elementales.
  root: {
      type: "true",      // 'pseudo' o 'true' o 'heavenly' o 'mutant'
      elements: ["fire","wood","metal"], // Elementos impuros por defecto
      variant: null        // null, 'lightning', 'ice', etc. - añade variantes especiales
  },

  // --- NUEVO: ANATOMÍA SAGRADA (Dantians) ---
  // Representa el cuerpo espiritual. Cultivable para bonuses.
  anatomy: {
      // Dantian Inferior (Mar de Qi): Vinculado a la Esencia
      // current: Qi almacenado, max: capacidad máxima.
      // Aumenta con meditación para más esencia.
      dantian_lower: { current: 0, max: 100 }, 
      
      // Dantian Medio (Palacio Carmesí): Vinculado al Cuerpo/Vigor
      // purity: pureza espiritual (0-100), layer: capas refinadas (1+).
      // Más capas = más resistencia.
      dantian_middle: { purity: 0, layer: 1 }, 
      
      // Dantian Superior (Mar Conciencia): CRÍTICO PARA COMBATE MENTAL
      // soul_force: poder de alma para supresión de enemigos.
      // perception: bonus de detección (críticos, stealth).
      dantian_upper: { 
          soul_force: 10,   // "Poder de Alma"
          perception: 5     // Bonus de detección
      },
      
      // meridians_blocked: % de bloqueo (0-100). Alto = skills fallan.
      // Reduce con purificación o items.
      meridians_blocked: 0
  },

  // --- NUEVO: INTENCIONES (Buffs Permanentes por Logros) ---
  // Estados mentales que dan bonuses permanentes.
  intents: {
      slaughter_points: 0, // Se acumula al matar - desbloquea 'slaughter'
      current_intent: null // Ej: "slaughter" (Daño+), "ethereal" (Evasión+)
  },

  // --- ECONOMÍA ---
  gold: 0,              // Moneda común
  spiritStones: 0,      // Moneda premium
  
  // --- INVENTARIO Y EQUIPO ---
  inventory: { "rusty_sword": 1, "low_pill": 3 }, // Objetos: {itemKey: quantity}
  equipment: { weapon: null, armor: null },       // Slots: weapon, armor
  
  // --- SISTEMA WU XING (Slots de Habilidades) ---
  // Pentágono elemental. Slots: metal, wood, water, fire, earth.
  // Cada slot: {id: skillId, affinity: 'harmony'|'generation'|'dissonance'}
  equippedSkills: { 
      metal: null, wood: null, water: null, fire: null, earth: null 
  },
  learnedSkills: ["basic_attack"], // Lista de skills aprendidas
  sect: null // Secta unida (afecta quests/bonuses)
};

let character = null; // Variable global que almacena el estado actual del personaje. Inicializada en null hasta cargar.

/**
 * Carga el personaje del usuario actual y migra la estructura si es necesario (para compatibilidad V3.0).
 * - Busca datos en persistence.js.
 * - Inyecta campos nuevos (root, anatomy, intents) si faltan para evitar crashes.
 * - Sincroniza legacy stats con anatomy.
 * Llama a updateUI() para refrescar la interfaz.
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

/**
 * Crea un nuevo personaje. Si dataOrName es string, usa como nombre; si objeto, mezcla con DEFAULT_CHARACTER.
 * Llama a persistCharacter() para guardar y updateUI() para mostrar.
 */
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
 * Vincula una técnica al Pentágono Wu Xing.
 * - slotElement: 'metal', 'wood', etc.
 * - skillId: ID de la skill (de SKILLS_DB).
 * - affinityType: 'harmony', 'generation', 'dissonance'.
 * Actualiza equippedSkills, guarda y muestra mensaje.
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
 * Desvincula una técnica del slot (clic derecho en UI).
 * Setea a null, guarda y muestra mensaje.
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

/**
 * Actualiza la UI. Llamado después de cambios en character.
 * Actualmente delega a main.js/UI, pero puede extenderse.
 */
function updateUI() {
    if(!character) return;
    // La UI principal se actualiza desde main.js/UI.render...
    // Aquí mantenemos actualizaciones críticas de estado si fuera necesario
}

/**
 * Acción de meditación: Aumenta experiencia, regenera dantian_lower, da oro.
 * - expGain: 10 Qi por defecto. Cambiar aquí para modificar ganancia.
 * - Regenera 5 puntos en dantian_lower.
 * - Si llega a maxExperience, llama levelUp().
 * Muestra mensaje y guarda.
 */
export function meditate() {
    if (!character) return;
    
    // V3.0: Meditación ahora cultiva el Dantian Inferior también
    const expGain = 10; // Cambiar este valor para ajustar ganancia de Qi
    
    character.experience += expGain;
    
    // Regeneración pasiva al meditar
    if(character.anatomy && character.anatomy.dantian_lower) {
        character.anatomy.dantian_lower.current = Math.min(
            character.anatomy.dantian_lower.max, 
            character.anatomy.dantian_lower.current + 5 // Cambiar +5 para ajustar regeneración
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

/**
 * Sube de nivel: Aumenta level, resetea exp, escala maxExperience.
 * - Aumenta maxHealth +20, health a max, attack +2.
 * - Crece dantians: dantian_lower.max +10, soul_force +1.
 * - Sincroniza legacy essence.
 * Muestra mensaje de ruptura.
 */
function levelUp() {
    character.level++;
    character.experience = 0;
    character.maxExperience = Math.floor(character.maxExperience * 1.5); // Escala exp necesaria
    
    character.maxHealth += 20; // Cambiar +20 para ajustar crecimiento de HP
    character.health = character.maxHealth;
    character.attack += 2; // Cambiar +2 para crecimiento de ataque
    
    // V3.0: Crecimiento de Dantians
    if(character.anatomy) {
        character.anatomy.dantian_lower.max += 10; // Aumenta capacidad de esencia
        character.anatomy.dantian_upper.soul_force += 1; // Fortalece el alma
    }
    // Sync Legacy
    character.maxEssence = character.anatomy.dantian_lower.max;
    character.essence = character.maxEssence;

    showMessage(`¡RUPTURA! Alcanzaste el Nivel ${character.level}`, "exito");
}

/**
 * Cura al personaje por 'amount' HP, sin exceder maxHealth.
 * Usado por items o habilidades. Muestra mensaje y guarda.
 */
function healCharacter(amount) {
  if (!character) return;
  character.health = Math.min(character.maxHealth, character.health + amount);
  persistCharacter();
  showMessage(`Recuperaste ${amount} HP.`, 'exito');
}

/**
 * Equipa un item del inventario en slot weapon o armor.
 * - Desequipa el anterior si existe, devolviéndolo al inventario.
 * - Reduce cantidad en inventory, guarda y actualiza UI.
 */
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

const showCharacterProfile = updateUI; // Alias para compatibilidad

export {
  character,
  loadCharacterForCurrentUser,
  createNewCharacter,
  persistCharacter,
  healCharacter,
  equipItem,
  showCharacterProfile
};