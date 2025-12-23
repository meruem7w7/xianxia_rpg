// js/data.js - BASE DE DATOS UNIFICADA

// 1. AFINIDADES ELEMENTALES
export const ELEMENTS = {
    metal: { name: "Metal", color: "#f1c40f", icon: "⚔️", weak: "fire", strong: "wood" },
    wood: { name: "Madera", color: "#2ecc71", icon: "🌿", weak: "metal", strong: "earth" },
    earth: { name: "Tierra", color: "#d35400", icon: "🏔️", weak: "wood", strong: "water" },
    water: { name: "Agua", color: "#3498db", icon: "💧", weak: "earth", strong: "fire" },
    fire: { name: "Fuego", color: "#e74c3c", icon: "🔥", weak: "water", strong: "metal" }
};

// 2. ORÍGENES
export const ORIGINS = {
    orphan: { name: "Huérfano de Guerra", stats: { str: 5, def: 2, spi: 1 }, desc: "Creciste luchando por sobras. Fuerte pero inculto." },
    scholar: { name: "Erudito Caído", stats: { str: 1, def: 1, spi: 6 }, desc: "Tu familia fue purgada. Conservas conocimientos prohibidos." },
    merchant: { name: "Hijo de Mercader", stats: { str: 2, def: 2, spi: 3 }, desc: "Tienes recursos y un ojo para los tesoros." }
};

// 3. HABILIDADES (COMBINADAS: OFICIOS + COMBATE)
export const SKILLS_DB = {
    // --- OFICIOS (Passive / Crafting) ---
    "meditation": { name: "Meditación", icon: "🧘", desc: "Aumenta la ganancia de Qi pasiva." },
    "alchemy": { name: "Alquimia", icon: "⚗️", desc: "Creación de píldoras espirituales." },
    "forging": { name: "Forja", icon: "🔨", desc: "Creación de armas y armaduras." },
    "herbalism": { name: "Herbolaria", icon: "🌿", desc: "Recolección de plantas espirituales." },
    "mining": { name: "Minería", icon: "⛏️", desc: "Extracción de minerales." },

    // --- TÉCNICAS DE COMBATE (Active) ---
    "skill_metal_01": {
        id: "skill_metal_01", name: "Tajo de Oro", element: "metal", type: "active",
        icon: "🗡️", desc: "Corte rápido.", qi_cost: 8, base_damage: 18, scaling: { factor: 1.2 }
    },
    "skill_wood_01": {
        id: "skill_wood_01", name: "Toque Vital", element: "wood", type: "active",
        icon: "🍃", desc: "Ataca y sana.", qi_cost: 12, base_damage: 10, scaling: { factor: 0.8 }, effect: { type: "heal_self", value: 15 }
    },
    "skill_water_01": {
        id: "skill_water_01", name: "Ola Azur", element: "water", type: "active",
        icon: "🌊", desc: "Ataque fluido.", qi_cost: 6, base_damage: 12, scaling: { factor: 1.0 }
    },
    "skill_fire_01": {
        id: "skill_fire_01", name: "Palma Loto", element: "fire", type: "active",
        icon: "💥", desc: "Explosión Qi.", qi_cost: 15, base_damage: 25, scaling: { factor: 1.5 }
    },
    "skill_earth_01": {
        id: "skill_earth_01", name: "Postura Montaña", element: "earth", type: "active",
        icon: "🛡️", desc: "Golpe defensivo.", qi_cost: 10, base_damage: 8, scaling: { factor: 1.0 }
    },
    "basic_attack": {
        id: "basic_attack", name: "Golpe Marcial", element: "physical", type: "active",
        icon: "👊", desc: "Golpe simple.", qi_cost: 0, base_damage: 5, scaling: { factor: 1.0 }
    }
};

// 4. ÍTEMS
export const itemsData = {
    "rusty_sword": { id: "rusty_sword", name: "Espada Oxidada", type: "weapon", rarity: "common", icon: "🗡️", stats: { atk: 2 } },
    "iron_sword": { id: "iron_sword", name: "Espada de Hierro", type: "weapon", rarity: "common", icon: "⚔️", stats: { atk: 5 } },
    "low_pill": { id: "low_pill", name: "Píldora Menor", type: "consumable", rarity: "common", icon: "💊", effect: { hp: 20 } },
    "spirit_stone": { id: "spirit_stone", name: "Piedra Espiritual", type: "currency", rarity: "common", icon: "💎" },
    "wolf_fur": { id: "wolf_fur", name: "Piel de Lobo", type: "material", rarity: "common", icon: "🧶" },
    "iron_ore": { id: "iron_ore", name: "Mineral de Hierro", type: "material", rarity: "common", icon: "🪨" },
    "wood_log": { id: "wood_log", name: "Madera Ancestral", type: "material", rarity: "common", icon: "🪵" }
};

// 5. ENEMIGOS
export const ENEMIES_DB = {
    "enemy_wolf_01": {
        id: "enemy_wolf_01", name: "Lobo Espiritual", element: "wood", icon: "🐺", realm: 1,
        stats: { hp_max: 200, attack: 12, defense: 5 },
        drops: ["wolf_fur"]
    },
    "enemy_rabbit_01": {
        id: "enemy_rabbit_01", name: "Conejo Lunar", element: "wood", icon: "🐇", realm: 1,
        stats: { hp_max: 30, attack: 4, defense: 0 },
        drops: []
    }
};

// 6. ZONAS
export const ZONES = {
    "forest_outer": {
        name: "Bosque Mortal",
        description: "Zona de caza para novatos.",
        enemies: ["enemy_rabbit_01", "enemy_wolf_01"]
    }
};

// 7. TIPOS DE RAÍCES ESPIRITUALES (Fundamento)
export const ROOT_TYPES = {
    PSEUDO: { id: "pseudo", name: "Raíz Pseudo-Espiritual", xp_mult: 0.5, desc: "Impura. 4-5 Elementos." },
    TRUE: { id: "true", name: "Raíz Verdadera", xp_mult: 1.0, desc: "Equilibrada. 2-3 Elementos." },
    HEAVENLY: { id: "heavenly", name: "Raíz Celestial", xp_mult: 2.5, desc: "Pura. 1 Elemento." },
    MUTANT: { id: "mutant", name: "Raíz Mutante", xp_mult: 2.0, desc: "Rayo/Hielo/Viento." }
};

// 8. REINOS DE CULTIVO (Niveles Mayores)
export const REALMS = {
    1: "Condensación de Qi",
    2: "Establecimiento de Fundación",
    3: "Formación del Núcleo",
    4: "Alma Naciente",
    5: "Transformación de Deidad"
};

export const npcData = {};
export const questData = {};