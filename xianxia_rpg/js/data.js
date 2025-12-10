// data.js
// Datos base del mundo, items, NPCs, quests y rankings mock.

const itemsData = {
  espada_madera: {
    key: 'espada_madera',
    name: 'Espada de Madera',
    description: 'Una espada simple hecha de madera.',
    type: 'weapon',
    attack: 5
  },
  pocion_curacion: {
    key: 'pocion_curacion',
    name: 'Poción de Curación',
    description: 'Restaura una pequeña cantidad de salud.',
    type: 'consumable',
    heal: 20
  },
  piedra: {
    key: 'piedra',
    name: 'Piedras Espirituales Menores',
    description: 'Cristales que almacenan un débil Qi espiritual.',
    type: 'material'
  },
  rama: {
    key: 'rama',
    name: 'Ramas Secas',
    description: 'Restos de ramas del Bosque Susurrante.',
    type: 'material'
  },
  espada_piedra: {
    key: 'espada_piedra',
    name: 'Espada de Piedra',
    description: 'Arma pesada tallada en roca, vibra levemente con Qi.',
    type: 'weapon',
    attack: 10
  }
};

const npcData = {
  anciano_aldea: {
    key: 'anciano_aldea',
    name: 'Anciano de la Aldea',
    role: 'Guía',
    dialogueLines: [
      'Bienvenido, joven cultivador. El camino hacia la inmortalidad está lleno de espinas.',
      'Escucha al viento, siente el Qi de la tierra bajo tus pies.'
    ],
    quest: 'ayuda_aldea',
    aiBehavior: 'mentor'
  },
  mercader_errante: {
    key: 'mercader_errante',
    name: 'Mercader Errante',
    role: 'Comerciante',
    dialogueLines: [
      'He cruzado nueve montañas y trece ríos espirituales para llegar aquí.',
      'Todo tiene un precio, incluso los secretos de los cielos.'
    ],
    aiBehavior: 'trader'
  }
};

const questData = {
  ayuda_aldea: {
    key: 'ayuda_aldea',
    name: 'Ayuda a la Aldea',
    description: 'El anciano necesita ayuda con las bestias espirituales que acechan los cultivos.',
    location: 'bosque_susurrante',
    rewards: {
      experience: 120,
      gold: 30,
      items: { piedra: 3 }
    }
  }
};


export { itemsData, npcData, questData };
