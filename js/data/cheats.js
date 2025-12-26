// js/data/cheats.js
// ANOMALÍAS DE SISTEMA ("DEDO DORADO" / CHEATS) - CLASIFICADO (0.1%)

export const HIDDEN_CHEATS = {
    BOTTLE: {
        id: "cheat_bottle",
        name: "Pequeña Botella Verde",
        desc: "Condensa líquido espiritual por la noche.",
        type: "ITEM",
        bonus: { growth_mult: 100 } // x100 velocidad hierbas
    },
    SYSTEM: {
        id: "cheat_system",
        name: "Sistema de Ascensión Suprema",
        desc: "IA en tu cabeza. Misiones y Datos.",
        type: "INTERFACE",
        bonus: { xp_mult: 2.0 } // Doble XP
    },
    GRANDPA: {
        id: "cheat_grandpa",
        name: "Remanente de Alma Venerable",
        desc: "Maestro alquimista en un anillo.",
        type: "MENTOR",
        bonus: { recipes_unlocked: true }
    }
};