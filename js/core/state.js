/**
 * CRÓNICAS DEL LOTO ETERNO - CORE STATE v7.0
 * "El Alma del Sistema"
 * * Este módulo maneja toda la información persistente del juego.
 * Implementa el patrón Observer para que la UI reaccione automáticamente a los cambios.
 */

const DEFAULT_STATE = {
    // 1. DATOS DEL JUGADOR (El Protagonista)
    player: {
        id: "player_001",
        name: "Desconocido",
        age: 16,
        lifespan: 80, // Años mortales base
        
        // Progreso de Cultivo
        realm: {
            id: 0,          // 0 = Mortal
            name: "Mortal",
            stage: 0        // Nivel dentro del reino
        },
        experience: 0,      // Qi acumulado
        maxExperience: 100, // Qi para subir nivel
        
        // Anatomía Sagrada (Valores numéricos)
        stats: {
            qi: 0,
            maxQi: 0,
            hp: 100,
            maxHp: 100,
            vigor: 100,     // Stamina
            soul: 10        // Fuerza del alma
        },

        // El Hardware (Se llena al crear personaje)
        attributes: {
            root: null,     // ID de la Raíz Espiritual (ej: 'root_fire')
            physique: null, // ID del Físico (ej: 'phys_tyrant')
            aptitude: 0     // Talento numérico (RNG)
        },

        // Inventario y Recursos
        inventory: [],
        wallet: {
            spiritStones: 0,
            gold: 0,
            contributionPoints: 0
        },

        // Legado (Samsara)
        legacy: {
            generation: 1,
            ancestors: [],
            karma_points: 0,  // Sistema fractal de Karma
            reputation_type: "Neutral"  // Ortodoxo, Demoníaco, Neutral
        },

        // Trucos Ocultos (Golden Finger)
        cheat: {
            active: false,
            id: null,
            progress: 0
        }
    },

    // 2. DATOS DEL MUNDO (El Escenario)
    world: {
        globalTick: 0,      // Tiempo absoluto del servidor/juego
        date: {
            year: 1,
            month: 1,
            day: 1,
            hour: 0
        },
        weather: "sunny",   // sunny, rain, spirit_storm
        era: "AGE_OF_CHAOS",
        
        // Telar del Samsara (Ecos Persistentes)
        samsara_weave: [],  // Array de ecos: {id, type, location, influence, duration}
        
        // Noticias y Eventos Activos
        activeEvents: [],
        newsLog: []         // "La secta X declaró la guerra a Y"
    },

    // 3. ESTADO DEL SISTEMA (Configuración)
    system: {
        version: "0.7.0",
        lastSave: null,
        settings: {
            autoSave: true,
            textSpeed: "normal"
        }
    }
};

// js/core/state.js
// ... (imports y DEFAULT_STATE se quedan igual) ...

class GameState {
    constructor() {
        this._state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this._listeners = [];
        this._currentUser = null; // Para saber en qué slot guardar
    }

    // --- MÉTODOS DEL PATRÓN OBSERVADOR ---

    /**
     * Suscribe una función que se ejecutará cada vez que el estado cambie.
     * @param {function} listener - Función que recibe el nuevo estado.
     */
    subscribe(listener) {
        this._listeners.push(listener);
    }

    /**
     * Actualiza el estado aplicando una función modificadora y notifica a los suscriptores.
     * @param {function} updater - Función que recibe el estado actual y lo modifica.
     */
    update(updater) {
        updater(this._state);
        this._notify();
    }

    /**
     * Notifica a todos los suscriptores que el estado cambió.
     */
    _notify() {
        this._listeners.forEach(listener => listener(this._state));
    }

    // --- ACCESORES ---

    /**
     * Obtiene el estado completo.
     */
    get() {
        return this._state;
    }

    /**
     * Obtiene solo los datos del jugador.
     */
    getPlayer() {
        return this._state.player;
    }

    // --- CONFIGURACIÓN DE USUARIO ---
    
    /**
     * Define quién está jugando para cargar su partida específica.
     */
    setUser(username) {
        this._currentUser = username;
        console.log(`[CORE] Usuario activo establecido: ${username}`);
    }

    // ... (get, getPlayer, update, subscribe se quedan igual) ...

    // --- PERSISTENCIA INTELIGENTE ---

    save() {
        if (!this._currentUser) {
            console.warn("⚠️ [CORE] No se puede guardar: Usuario no definido.");
            return;
        }
        
        this._state.system.lastSave = Date.now();
        const saveKey = `lotus_v7_save_${this._currentUser}`; // Clave única por usuario
        localStorage.setItem(saveKey, JSON.stringify(this._state));
        console.log(`💾 [CORE] Guardado en: ${saveKey}`);
    }

    load() {
        if (!this._currentUser) return false;

        const saveKey = `lotus_v7_save_${this._currentUser}`;
        const saved = localStorage.getItem(saveKey);
        
        if (saved) {
            try {
                this._state = JSON.parse(saved);
                console.log(`📂 [CORE] Partida cargada: ${saveKey}`);
                this._notify(); // Avisar a la UI que los datos cambiaron
                return true; // Éxito: Existe partida
            } catch (e) {
                console.error("❌ [CORE] Save corrupto:", e);
                return false;
            }
        }
        return false; // No existe partida
    }
}

export const state = new GameState();