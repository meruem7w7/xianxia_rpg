// js/data/physiques.js
// Definición de las Constituciones Físicas (Software del Cultivador)

export const PHYSIQUES = {
    // --- A. CONSTITUCIONES MORTALES (Comunes) ---
    MORTAL: {
        id: "phys_mortal",
        name: "Constitución Mortal",
        rarity: "Común",
        lore: "La base de la humanidad. Sin ventajas innatas, pero adaptable a cualquier camino. Eres el lienzo en blanco sobre el que se pinta el destino.",
        advantages: ["Adaptable a cualquier raíz espiritual", "Sin debilidades inherentes"],
        defects: ["Sin bonos naturales", "Cultivo lento sin ayudas externas"],
        buffs: {},
        debuffs: {},
        visual: "Un cuerpo humano estándar, sin marcas especiales. Color piel normal.",
        modifiers: { cultSpeed: 1.0 }
    },
    TYRANT: {
        id: "phys_tyrant",
        name: "Constitución del Tirano",
        rarity: "Común",
        lore: "Tu sangre hierve con ambición. Naciste para conquistar y someter. Tu mera presencia impone respeto, pero tu ira te consume.",
        advantages: ["+50% daño a subordinados", "Intimidación automática"],
        defects: ["-30% resistencia mágica", "Ira incontrolable en combate"],
        buffs: { physDmg: 1.2 },
        debuffs: { magicResist: 0.7 },
        visual: "Venas rojas prominentes, ojos con pupilas verticales. Aura roja sutil.",
        modifiers: { cultSpeed: 1.0, attack: 1.2, magicResist: 0.7 }
    },
    SWORD_BONE: {
        id: "phys_sword_bone",
        name: "Constitución de Hueso de Espada",
        rarity: "Poco Común",
        lore: "Tus huesos son armas vivientes. Cada golpe resuena como metal contra metal. Eres un guerrero nato, pero tu rigidez te hace frágil ante ataques espirituales.",
        advantages: ["+30% daño físico", "Armas naturales (huesos)"],
        defects: ["-50% resistencia espiritual", "Movimientos predecibles"],
        buffs: { physDmg: 1.3, critChance: 1.1 },
        debuffs: { spiritResist: 0.5 },
        visual: "Huesos visibles bajo la piel, con filos plateados. Postura marcial.",
        modifiers: { cultSpeed: 1.0, attack: 1.3, spiritResist: 0.5 }
    },
    JADE_BONE: {
        id: "phys_jade_bone",
        name: "Constitución de Hueso de Jade",
        rarity: "Poco Común",
        lore: "Tu esqueleto es de jade vivo. Absorbes Qi como una esponja, pero tu cuerpo es frágil y se rompe fácilmente bajo presión extrema.",
        advantages: ["+40% absorción de Qi", "Regeneración ósea rápida"],
        defects: ["-40% defensa física", "Frágil ante golpes directos"],
        buffs: { qiAbsorb: 1.4, boneRegen: 2.0 },
        debuffs: { physDef: 0.6 },
        visual: "Piel translúcida verde jade, venas de energía visibles. Fragancia herbal.",
        modifiers: { cultSpeed: 1.1, qiAbsorb: 1.4, def: 0.6 }
    },
    DRAGON_ELEPHANT: {
        id: "phys_dragon_elephant",
        name: "Constitución Dragón-Elefante",
        rarity: "Raro",
        lore: "La fuerza de un dragón antiguo combinada con la resistencia de un elefante inmortal. Tu cuerpo es una fortaleza andante, pero consumes recursos como un pozo sin fondo.",
        advantages: ["+100% fuerza física", "+50% HP máximo"],
        defects: ["-50% eficiencia de recursos", "Movimientos lentos"],
        buffs: { strength: 2.0, hpMax: 1.5 },
        debuffs: { resourceEff: 0.5, speed: 0.7 },
        visual: "Músculos hipertrofiados con escamas doradas sutiles. Presencia imponente.",
        modifiers: { cultSpeed: 0.9, strength: 2.0, hpMax: 1.5, speed: 0.7 }
    },
    IMMORTAL_PHOENIX: {
        id: "phys_immortal_phoenix",
        name: "Constitución Fénix Inmortal",
        rarity: "Raro",
        lore: "Renaces de tus cenizas. Tu sangre contiene el fuego de la vida eterna. Ninguna herida es permanente, pero tu llama interior consume tu vitalidad lentamente.",
        advantages: ["Renacimiento automático", "+60% regeneración HP"],
        defects: ["Auto-daño por fuego interno", "Dependiente de calor extremo"],
        buffs: { regen: 1.6, rebirth: true },
        debuffs: { selfBurn: 0.02, coldWeak: 1.5 },
        visual: "Piel con plumas rojas sutiles, ojos dorados. Aura cálida constante.",
        modifiers: { cultSpeed: 1.2, regen: 1.6, special: "REBIRTH" }
    },

    // --- B. CONSTITUCIONES CELESTIALES (Épicas) ---
    DIVINE_SPIRIT: {
        id: "phys_divine_spirit",
        name: "Constitución Espíritu Divino",
        rarity: "Épico",
        lore: "Tu alma es un fragmento de divinidad. Comprendes las leyes del universo instintivamente, pero tu forma mortal limita tu verdadero potencial.",
        advantages: ["+50% comprensión de técnicas", "Afinidad con todos los elementos"],
        defects: ["-30% poder físico", "Vulnerable a corrupción espiritual"],
        buffs: { comprehension: 1.5, elementalAffinity: 1.2 },
        debuffs: { physDmg: 0.7, spiritVuln: 1.3 },
        visual: "Aura dorada sutil, ojos con pupila estrellada. Presencia sagrada.",
        modifiers: { cultSpeed: 1.3, comprehension: 1.5, attack: 0.7 }
    },
    CHAOS_BODY: {
        id: "phys_chaos_body",
        name: "Constitución Cuerpo del Caos",
        rarity: "Épico",
        lore: "El caos primordial fluye en tus venas. Tu cuerpo se adapta a cualquier situación, pero nunca sabes qué forma tomará esa adaptación.",
        advantages: ["Adaptación aleatoria perfecta", "Inmune a estados alterados"],
        defects: ["Efectos impredecibles", "Inestable en presencia de orden"],
        buffs: { randomBuff: true, statusImmune: true },
        debuffs: { predictability: 0.0 },
        visual: "Cuerpo con colores cambiantes, formas fluidas. Ojos caóticos.",
        modifiers: { cultSpeed: 1.0, special: "CHAOS", immune: true }
    },
    PRIMORDIAL_CHAOS: {
        id: "phys_primordial_chaos",
        name: "Constitución Caos Primordial",
        rarity: "Legendario",
        lore: "Antes del universo, eras. Tu existencia desafía las leyes naturales. Creas realidad con tu voluntad, pero el universo lucha por borrarte.",
        advantages: ["Creación de realidad limitada", "+100% a todos los stats"],
        defects: ["Universo te ataca constantemente", "Existencia inestable"],
        buffs: { allStats: 2.0, realityWarp: true },
        debuffs: { universeHate: 0.1, stability: 0.5 },
        visual: "Forma amorfa de colores imposibles, distorsionando el espacio alrededor.",
        modifiers: { cultSpeed: 2.0, all: 2.0, special: "WARP" }
    },
    ETERNAL_VOID: {
        id: "phys_eternal_void",
        name: "Constitución Vacío Eterno",
        rarity: "Legendario",
        lore: "Eres la nada absoluta. Devoras todo lo que tocas, incluyendo la luz y el sonido. Tu poder es ilimitado, pero nunca podrás llenar el vacío interior.",
        advantages: ["Devoración de ataques", "Inmune a daño elemental"],
        defects: ["Devoras aliados accidentalmente", "Vacío emocional total"],
        buffs: { devour: true, elementalImmune: true },
        debuffs: { allyDmg: 0.2, emotion: 0.0 },
        visual: "Silueta negra absoluta, absorbiendo luz. Ojos como agujeros negros.",
        modifiers: { cultSpeed: 1.5, special: "DEVOUR", immune: true }
    },
    HEAVENLY_DEMON: {
        id: "phys_heavenly_demon",
        name: "Constitución Demonio Celestial",
        rarity: "Mítico",
        lore: "La fusión perfecta de luz y oscuridad. Gobernas tanto el cielo como el infierno. Tu poder es absoluto, pero tu dualidad te desgarra internamente.",
        advantages: ["Control dual (luz/oscuridad)", "+200% daño a opuestos"],
        defects: ["Conflicto interno constante", "Vulnerable a equilibrio"],
        buffs: { dualControl: true, oppositeDmg: 3.0 },
        debuffs: { internalConflict: 0.05, balanceVuln: 2.0 },
        visual: "Alas de luz y sombra, ojos con yin-yang. Aura contradictoria.",
        modifiers: { cultSpeed: 2.5, special: "DUAL", attack: 3.0 }
    },
    SUPREME_YANG: {
        id: "phys_supreme_yang",
        name: "Constitución Yang Supremo",
        rarity: "Único",
        lore: "Eres el sol mismo. Tu presencia quema impurezas y demonios. Ningún mal puede existir cerca de ti, pero tu calor consume todo a tu alrededor.",
        advantages: ["Purificación automática", "Daño continuo a malvados"],
        defects: ["Daña a aliados puros", "No puedes ocultarte"],
        buffs: { purify: true, evilDmg: 2.0 },
        debuffs: { allyBurn: 0.1, stealth: 0.0 },
        visual: "Cuerpo radiante dorado, llamas invisibles. Luz cegadora.",
        modifiers: { cultSpeed: 3.0, special: "PURIFY", stealth: 0.0 }
    }
};