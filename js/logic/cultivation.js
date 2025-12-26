// js/logic/cultivation.js
// Lógica de Cultivo y Progreso Espiritual

import { state } from '../core/state.js';

/**
 * Sistema de Consolidación de Pureza
 * Al subir nivel, el jugador elige entre pureza o impureza
 */
export class CultivationSystem {
    static gainExperience(amount) {
        const player = state.get().player;
        player.experience += amount;

        // Verificar si sube nivel
        if (player.experience >= player.maxExperience) {
            this.levelUp();
        }

        state.update(state => state);
    }

    static levelUp() {
        const player = state.get().player;
        const currentRealm = player.realm;
        const currentStage = currentRealm.stage;

        // Reset experience
        player.experience = 0;
        player.maxExperience *= 1.5; // Escalar dificultad

        // Calcular nuevo stage
        let newStage = currentStage + 1;
        let newRealm = currentRealm.id;

        // Lógica de reinos (simplificada)
        const realmThresholds = [10, 20, 30, 50, 100]; // Stages por reino
        if (newStage >= realmThresholds[currentRealm.id]) {
            newRealm += 1;
            newStage = 0;
        }

        // Mostrar opciones de consolidación
        this.showConsolidationChoice(newRealm, newStage);
    }

    static showConsolidationChoice(newRealm, newStage) {
        // Aquí se mostraría un modal/UI para elegir pureza
        // Por ahora, asumimos elección automática (para testing)
        const choice = Math.random() > 0.5 ? 'pure' : 'impure';
        this.applyConsolidation(choice, newRealm, newStage);
    }

    static applyConsolidation(choice, newRealm, newStage) {
        const player = state.get().player;

        if (choice === 'pure') {
            // Bonos de pureza: +20% stats pero -10% exp gain
            player.stats.maxQi *= 1.2;
            player.stats.maxHp *= 1.2;
            // Agregar debuff de exp gain
        } else {
            // Bonos de impureza: +50% exp gain pero -10% stats
            // Más fácil pero más débil
        }

        // Actualizar reino
        player.realm.id = newRealm;
        player.realm.stage = newStage;
        player.realm.name = this.getRealmName(newRealm);

        state.update(state => state);
    }

    static getRealmName(realmId) {
        const realms = [
            "Mortal",
            "Refinado de Cuerpo",
            "Refinado de Órganos",
            "Refinado de Sangre",
            "Refinado de Médula"
        ];
        return realms[realmId] || "Desconocido";
    }
}

/**
 * Sistema de Karma Fractal
 */
export class KarmaSystem {
    static addKarma(points, type = 'neutral') {
        const legacy = state.get().player.legacy;

        // Karma fractal: puntos se multiplican por reputación
        let multiplier = 1.0;
        if (legacy.reputation_type === 'Ortodoxo') {
            multiplier = type === 'good' ? 1.5 : 0.5;
        } else if (legacy.reputation_type === 'Demoníaco') {
            multiplier = type === 'evil' ? 1.5 : 0.5;
        }

        legacy.karma_points += points * multiplier;

        // Actualizar tipo de reputación basado en karma
        this.updateReputationType();

        state.update(state => state);
    }

    static updateReputationType() {
        const karma = state.get().player.legacy.karma_points;

        if (karma > 1000) {
            state.get().player.legacy.reputation_type = 'Ortodoxo';
        } else if (karma < -1000) {
            state.get().player.legacy.reputation_type = 'Demoníaco';
        } else {
            state.get().player.legacy.reputation_type = 'Neutral';
        }
    }
}

/**
 * Telar del Samsara - Ecos Persistentes
 */
export class SamsaraWeave {
    static addEcho(echo) {
        // echo: {id, type, location, influence, duration}
        const weave = state.get().world.samsara_weave;
        weave.push({
            ...echo,
            created: state.get().world.globalTick
        });

        // Limitar a 100 ecos máximo
        if (weave.length > 100) {
            weave.shift();
        }

        state.update(state => state);
    }

    static processEchos() {
        const weave = state.get().world.samsara_weave;
        const currentTick = state.get().world.globalTick;

        // Filtrar ecos expirados
        const activeEchos = weave.filter(echo =>
            currentTick - echo.created < echo.duration
        );

        state.get().world.samsara_weave = activeEchos;
        state.update(state => state);
    }

    static getEchoInfluence(location) {
        const weave = state.get().world.samsara_weave;
        return weave
            .filter(echo => echo.location === location)
            .reduce((total, echo) => total + echo.influence, 0);
    }
}