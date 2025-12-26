// js/data/roots.js
// Definición de las Raíces Espirituales (Hardware del Cultivador)

export const SPIRITUAL_ROOTS = {
    // --- A. LOS CINCO ELEMENTOS (El Ciclo Mortal) ---
    METAL: {
        id: "root_metal_sovereign",
        name: "Raíz del Oro Negro Soberano (Metal)",
        type: "TRUE",
        rarity: "Común",
        lore: "Tu Qi no fluye; corta. Tus meridianos resuenan con el sonido de espadas chocando. Naciste para la guerra, pero tu rigidez te hace quebradizo ante la adversidad emocional.",
        buffs: { critDmg: 1.2, physDef: 1.1 },
        debuffs: { qiRegen: 0.9 },
        visual: "Un orbe de Plata Líquida con picos afilados que intentan perforar el contenedor del Dantian. Destellos blancos estroboscópicos.",
        modifiers: { cultSpeed: 0.9, attack: 1.25, def: 1.1 }
    },
    WOOD: {
        id: "root_wood_ancient",
        name: "Raíz del Bosque de los Mil Años (Madera)",
        type: "TRUE",
        rarity: "Común",
        lore: "La vida se desborda en ti como una plaga benigna. Tu sangre huele a savia y tierra mojada. Eres difícil de matar, pero tu naturaleza pacífica duda al asestar el golpe final.",
        buffs: { healing: 1.3, hpMax: 1.1 },
        debuffs: { attack: 0.9 },
        visual: "Una semilla de Verde Esmeralda Neón flotando, con raíces de luz que se extienden suavemente hacia los otros meridianos.",
        modifiers: { cultSpeed: 1.0, healing: 1.3, hpMax: 1.1 }
    },
    WATER: {
        id: "root_water_abyss",
        name: "Raíz del Abismo Insondable (Agua)",
        type: "TRUE",
        rarity: "Común",
        lore: "Tu espíritu es vasto, profundo y aterradoramente silencioso. Absorbes el Qi como el océano traga barcos. Tu fuerza radica en la erosión constante, no en el impacto súbito.",
        buffs: { qiMax: 1.2, qiRegen: 1.15 },
        debuffs: { physDef: 0.9 },
        visual: "Un vórtice de Azul Zafiro Profundo. No emite luz hacia afuera, sino que parece absorber la luz ambiental de la UI.",
        modifiers: { cultSpeed: 1.0, qiMax: 1.2, recovery: 1.15 }
    },
    FIRE: {
        id: "root_fire_heart",
        name: "Raíz de la Llama del Corazón Verdadero (Fuego)",
        type: "TRUE",
        rarity: "Común",
        lore: "Una brasa que nunca se apaga arde en tu vientre. Tu temperamento es explosivo y tu Qi quema las impurezas con violencia. El poder es tuyo, pero corres el riesgo de consumirte a ti mismo.",
        buffs: { attack: 1.25, cultSpeed: 1.1 },
        debuffs: { stability: 0.9, selfDmgRisk: 0.05 },
        visual: "Una esfera de Rojo/Naranja Neón inestable, pulsando violentamente como una estrella a punto de colapsar.",
        modifiers: { cultSpeed: 1.1, attack: 1.25, stability: 0.9 }
    },
    EARTH: {
        id: "root_earth_mountain",
        name: "Raíz de la Montaña Inmortal (Tierra)",
        type: "TRUE",
        rarity: "Común",
        lore: "Pesado. Inamovible. Tu presencia suprime el aire alrededor. Mientras tengas los pies en el suelo, eres invencible, pero tu espíritu carece de la ligereza para ascender rápidamente.",
        buffs: { physDef: 1.3, debuffResist: 1.2 },
        debuffs: { speed: 0.8, cultSpeed: 0.8 },
        visual: "Un cubo perfecto de Ámbar Dorado sólido, girando lenta y pesadamente. Grietas de luz amarilla.",
        modifiers: { cultSpeed: 0.8, def: 1.3, speed: 0.8 }
    },

    // --- B. LAS MUTACIONES (Las Anomalías de la Tormenta) ---
    ICE: {
        id: "root_ice_lotus",
        name: "Raíz del Loto de Escarcha (Hielo - Mutación de Agua)",
        type: "MUTANT",
        rarity: "Raro",
        lore: "Una anomalía cruel. Tu cuerpo está perpetuamente frío al tacto. Tu Qi detiene la entropía, preservando la juventud pero congelando las emociones. Un camino solitario hacia la perfección.",
        buffs: { freezeChance: 0.2, mentalDef: 1.1 },
        debuffs: { socialAffinity: 0.3 },
        visual: "Un cristal de hielo fracturado en forma de loto, color Cian Pálido. Emite neblina que 'congela' los bordes de la UI del Dantian.",
        modifiers: { cultSpeed: 1.15, social: 0.7, control: 1.2 }
    },
    LIGHTNING: {
        id: "root_lightning_tribulation",
        name: "Raíz de la Tribulación Celestial (Rayo - Mutación de Fuego/Metal)",
        type: "MUTANT",
        rarity: "Raro",
        lore: "Llevas el castigo de los cielos en tus venas. Tu Qi es errático, doloroso y devastador. Eres la encarnación del juicio divino. Matas rápido, o mueres rápido.",
        buffs: { attackSpeed: 1.4, critChance: 1.2 },
        debuffs: { selfDmg: 0.05 },
        visual: "Arcos de electricidad Violeta/Blanco que saltan caóticamente, rompiendo la silueta del Dantian momentáneamente.",
        modifiers: { cultSpeed: 1.2, crit: 1.2, selfDmg: 0.05 }
    },
    WIND: {
        id: "root_wind_gale",
        name: "Raíz del Vendaval de los Nueve Cielos (Viento - Mutación de Madera/Fuego)",
        type: "MUTANT",
        rarity: "Raro",
        lore: "No tienes forma. Tu Qi es invisible y corta desde todas las direcciones. Detestas las ataduras y las reglas de las sectas. Libertad absoluta a cambio de una base inestable.",
        buffs: { evasion: 1.4, mapSpeed: 1.2 },
        debuffs: { areaDef: 0.8 },
        visual: "Un remolino de Verde Pálido Transparente. Apenas visible, distorsiona el fondo como una ola de calor.",
        modifiers: { cultSpeed: 1.1, evasion: 1.4, def: 0.8 }
    },

    // --- C. LAS RAÍCES CELESTIALES (Las Leyendas del 1%) ---
    HEAVENLY_YIN: {
        id: "root_yin_pure",
        name: "Raíz del Yin Lunar Puro (Celestial)",
        type: "CELESTIAL",
        rarity: "Legendario",
        lore: "La esencia de la muerte tranquila y la noche eterna. Atraes a los espíritus y las sombras te obedecen. Tu cultivo es 10 veces más rápido bajo la luz de la luna, pero el sol te debilita.",
        buffs: { lifesteal: 0.1, beastControl: true },
        debuffs: { fireDmgTaken: 1.5 },
        visual: "Un agujero negro rodeado de un halo Púrpura Oscuro. 'Gotea' sombras líquidas hacia abajo.",
        modifiers: { cultSpeed: 2.0, lifesteal: 0.1, sunWeakness: 1.5 }
    },
    HEAVENLY_YANG: {
        id: "root_yang_supreme",
        name: "Raíz del Yang Solar Supremo (Celestial)",
        type: "CELESTIAL",
        rarity: "Legendario",
        lore: "Eres un segundo sol. Tu mera presencia quema a los demonios y purifica la corrupción. Tu destino es gobernar, pues nadie puede mirarte directamente sin cegarse.",
        buffs: { poisonImmune: true, auraDmg: 0.05 },
        debuffs: { stealth: 0.0 },
        visual: "Una esfera de Oro Blanco Cegador. Rayos de luz sólida atraviesan toda la pantalla de la UI.",
        modifiers: { cultSpeed: 2.0, immune: true, stealth: 0.0 }
    },
    VOID: {
        id: "root_void_hungry",
        name: "Raíz del Vacío Hambriento (Espacio - Ultra Rara)",
        type: "MYTHICAL",
        rarity: "Mítico",
        lore: "Tú no existes. Eres un error en el tejido de la realidad. Tu Qi no se cultiva; se roba. Puedes devorar ataques, objetos y suerte ajena. El universo te odia por existir.",
        buffs: { nullifyDmg: 0.1, inventorySize: 10 },
        debuffs: { karma: -50 },
        visual: "Ausencia total de píxeles. Un círculo donde se ve el 'fondo' de la página web o negro absoluto (#000000), con un borde de 'glitch' digital cromático.",
        modifiers: { cultSpeed: 0.0, special: "DEVOUR", karma: -50 }
    },
    TIME: {
        id: "root_time_river",
        name: "Raíz del Río del Tiempo (Tiempo - Única)",
        type: "MYTHICAL",
        rarity: "Único",
        lore: "Ves el fluir del Samsara. Para ti, un segundo es un siglo. Tu cuerpo envejece y rejuvenece aleatoriamente. Comprendes que la muerte es solo un trámite administrativo.",
        buffs: { turnReset: true, offlineCult: 5.0 },
        debuffs: { statRng: true },
        visual: "Un reloj de arena de Polvo de Estrellas que fluye hacia arriba en lugar de hacia abajo.",
        modifiers: { cultSpeed: 5.0, special: "RESET", rng: "MAX" }
    }
};
