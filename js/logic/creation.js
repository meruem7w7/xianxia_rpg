/**
 * js/logic/creation.js
 * Lógica pura para la generación procedural del personaje.
 * Conecta los Datos (Roots/Physiques) con el Estado (State).
 */

import { state } from '../core/state.js';
import { SPIRITUAL_ROOTS } from '../data/roots.js';
import { PHYSIQUES } from '../data/physiques.js';
import { HIDDEN_CHEATS } from '../data/cheats.js';

// --- CONFIGURACIÓN DE PROBABILIDADES ---
const ROOT_CHANCES = {
    // La suma no necesita ser 100, funciona por peso relativo
    "TRUE": 70,       // Raíces comunes (Metal, Madera, etc.)
    "MUTANT": 25,     // Mutaciones (Hielo, Rayo)
    "CELESTIAL": 4,   // Celestiales (Yin, Yang)
    "MYTHICAL": 1     // Míticas (Vacío, Tiempo)
};

const CHEAT_CHANCE = 0.001; // 0.1% Probabilidad de "Dedo Dorado"

export const CreationLogic = {

    /**
     * Genera un nuevo personaje basado en el nombre y respuestas (opcionales)
     * @param {string} name - Nombre del personaje
     */
    createCharacter(name) {
        // 1. Determinar Raíz Espiritual (RNG Ponderado)
        const root = this._rollWeightedRoot();
        
        // 2. Determinar Físico (RNG Ponderado basado en rareza interna)
        const physique = this._rollPhysique();

        // 3. Determinar Aptitud (Talento numérico 1-100)
        // Bonus si la raíz es rara
        let baseAptitude = Math.floor(Math.random() * 60) + 10; // 10-70 base
        if (root.type === "CELESTIAL") baseAptitude += 20;
        if (root.type === "MYTHICAL") baseAptitude += 30;

        // 4. ¿Tiene Dedo Dorado? (El milagro)
        const cheat = this._rollForCheat();

        // 5. INYECTAR EN EL ESTADO (El momento de la verdad)
        state.update((s) => {
            s.player.name = name || "Cultivador Anónimo";
            s.player.attributes.root = root.id;
            s.player.attributes.physique = physique.id;
            s.player.attributes.aptitude = baseAptitude;
            
            // Inicializar stats derivados (HP, Qi) según datos
            // Por ahora valores base, luego se calculan dinámicamente
            s.player.stats.maxHp = 100 * (root.modifiers.hpMax || 1) * (physique.modifiers.hpMax || 1);
            
            // Guardar Cheat si existe
            if (cheat) {
                s.player.cheat = {
                    active: true,
                    id: cheat.id,
                    progress: 0
                };
                console.log(`%c[DESTINO] ¡ANOMALÍA DETECTADA! ${cheat.name}`, "color: gold; font-size: 12px;");
            } else {
                s.player.cheat = { active: false, id: null };
            }

            // Resetear mundo para nueva partida
            state.save(); // Guardar antes de resetear
            s.world.globalTick = 0;
            s.world.era = "AGE_OF_AWAKENING";
        });

        console.log(`[CREATION] Personaje generado y GUARDADO: ${root.name} | Físico: ${physique.name}`);
        return state.getPlayer(); // Devolver datos para que la UI los muestre
    },

    // --- MÉTODOS PRIVADOS (Helpers de RNG) ---

    _rollWeightedRoot() {
        // 1. Elegir TIERRAS (True, Mutant, Celestial...)
        const tierPool = [];
        for (let [type, weight] of Object.entries(ROOT_CHANCES)) {
            for (let i = 0; i < weight; i++) tierPool.push(type);
        }
        const selectedTier = tierPool[Math.floor(Math.random() * tierPool.length)];

        // 2. Elegir una raíz específica de ese Tier
        const rootsInTier = Object.values(SPIRITUAL_ROOTS).filter(r => r.type === selectedTier);
        
        // Fallback de seguridad (si no hay raíces de ese tipo, devolver una común)
        if (rootsInTier.length === 0) return SPIRITUAL_ROOTS.METAL;

        return rootsInTier[Math.floor(Math.random() * rootsInTier.length)];
    },

    _rollPhysique() {
        // Los físicos tienen su rareza definida dentro de 'physiques.js'
        // Usaremos un sistema de probabilidad inversa (menor rareza = más difícil)
        // Pero para simplificar en esta versión, elegimos al azar del pool total ponderado
        // Asumimos que data/physiques tiene una propiedad "rarity" (0-1 o peso)
        
        const allPhysiques = Object.values(PHYSIQUES);
        // Implementación simple: Elegir uno al azar
        // TODO: Implementar peso real en v7.1
        return allPhysiques[Math.floor(Math.random() * allPhysiques.length)];
    },

    _rollForCheat() {
        if (Math.random() <= CHEAT_CHANCE) {
            const cheats = Object.values(HIDDEN_CHEATS);
            return cheats[Math.floor(Math.random() * cheats.length)];
        }
        return null;
    }
};