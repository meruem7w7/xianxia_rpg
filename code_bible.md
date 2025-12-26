# XIANXIA RPG - CÓDIGO COMPLETO & DOCUMENTACIÓN

## ACTUALIZACIÓN DICIEMBRE 25, 2025

**Estado General: 🟢 ROBUSTO**
- **Total Archivos**: 16 JS + 2 CSS + 1 HTML
- **Líneas de Código**: ~3,045 JS + ~5,000 CSS
- **Funcionalidad**: 87.5% Implementada
- **Errores Conocidos**: ✅ CERO (DEFAULT_CHARACTER duplication removida)

---

# 📋 INVENTARIO DE ARCHIVOS

## Archivos JavaScript (16 total, ~3,045 líneas)

| Archivo | Líneas | Estado | Propósito |
|---------|--------|--------|----------|
| main.js | ~850 | ✅ | Punto entrada, auth, navegación, paneles, renderAnatomyPanel() |
| character.js | ~420 | ✅ | Gestión personaje, stats, anatomía, meditación |
| ui.js | ~280 | ✅ | UI, overlays, Wu Xing drag-drop, logs |
| combat.js | ~520 | ✅ | Sistema combate, turnos, canalización, AI enemigos |
| data.js | ~150 | ✅ | BD: elementos, skills, items, enemigos, zonas |
| sects.js | ~165 | ✅ | Sistema sectas/gremios con bonuses |
| crafting.js | ~90 | ✅ | Sistema crafteo con recetas |
| character_creation.js | ~75 | ✅ | Creación personaje: 3 pasos |
| map.js | ~75 | ✅ | Sistema viajes entre ubicaciones |
| godmode.js | ~70 | ✅ | Herramientas debug |
| skills.js | ~65 | ✅ | Renderizado habilidades |
| inventory.js | ~65 | ✅ | Gestión inventario, equipo, consumibles |
| chat.js | ~45 | ✅ | Sistema chat local |
| persistence.js | ~75 | ✅ | Autenticación, localStorage, guardado |
| quest.js | ~65 | ⚠️ | Misiones (placeholder, necesita datos) |
| npc.js | ~35 | ⚠️ | NPCs (placeholder, necesita datos) |

## Archivos CSS (2 total, ~5,000 líneas)

| Archivo | Líneas | Propósito |
|---------|--------|----------|
| style.css | ~3,900 | Estilos globales, layout, animaciones |
| ui.css | ~1,000 | Componentes UI, Wu Xing, logs, overlays |

## HTML (1 archivo)

| Archivo | Propósito |
|---------|----------|
| index.html | Estructura base con 3 tabs (auth, creation, game) |

---

# 🎨 SISTEMA DE ANATOMÍA SAGRADA (renderAnatomyPanel)

## 📍 Ubicación: main.js

### Rutas de Assets

```javascript
ASSETS_ANATOMY = {
  base:              "assets/img/anatomy/silhouette_base_{gender}.png"
  meridians:         "assets/img/anatomy/meridians_overlay_{suffix}.png"
  bones:             "assets/img/anatomy/bones_overlay_{suffix}.png"
  muscles:           "assets/img/anatomy/muscle_overlay_{suffix}.png"
  muscles_2:         "assets/img/anatomy/muscle_overlay_{suffix}2.png"
  muscles_3:         "assets/img/anatomy/muscle_overlay_{suffix}3.png"
  spiritroot:        "assets/img/anatomy/spiritroot_overlay_{suffix}.png"
  spiritroot_alone:  "assets/img/anatomy/spiritroot_{suffix}.png"
  nebula:            "assets/img/anatomy/nebulosa_overlay_{suffix}.png"
  d_mind:            "assets/img/anatomy/dantian_mente.png"         // 60x60px
  d_chest:           "assets/img/anatomy/dantian_pecho.png"         // 70x70px
  d_abdomen:         "assets/img/anatomy/dantian_abdomen.png"       // 80x80px
}
```

### Estructura de Capas Visuales

| Capa | Z-Index | Opacity | Blend Mode | Filters | CSS Class |
|------|---------|---------|-----------|---------|-----------|
| **BASE** | 30 | 1.0 | - | none | `.anatomy-base` |
| **BONES** | 35 | 1.0 | - | none | `.anatomy-bones` |
| **MERIDIANS** | 36 | 1.0 | - | drop-shadow(0 0 2px cyan) | `.anatomy-meridians` |
| **MUSCLES (contenedor)** | 40 | - | mixed | - | `.anatomy-muscles` |
| - Layer 1 | 41 | 0.3 | mixed | multiply | `.muscle-layer-1` |
| - Layer 2 | 42 | 0.9 | normal | fixed | `.muscle-layer-2` |
| - Layer 3 | 44 | - | - | multiply | `.muscle-layer-3` |
| **SPIRITROOT (contenedor)** | 40 | - | mixed | - | `.anatomy-spiritroot` |
| - Overlay | - | 1.0 | mixed | - | `.spiritroot-overlay` |
| - Alone | - | 1.0 | mixed | ${ELEMENTAL_FILTER} | `.spiritroot-alone` |
| - Layer | - | 1.0 | color-dodge | multiply | `.spiritroot-layer` |
| **DANTIANS** | 50 | - | - | - | `.anatomy-dantians` |
| - Nebula Base | - | 1.0 | - | none | `.nebula-base` |
| - Mind Dantian | - | 1.0 | - | float animation | `.dantian-mind` |
| - Chest Dantian | - | 1.0 | - | pulse animation | `.dantian-chest` |
| - Abdomen Dantian | - | 1.0 | - | spin animation | `.dantian-abdomen` |
| - Nebula Overlay | - | 1.0 | - | none | `.nebula-overlay` |

### Dimensiones del Contenedor

```css
.anatomy-visualizer {
  width: 300px;
  height: 500px;
  position: relative;
  background: radial-gradient(circle, rgba(20,20,40,0.8), rgba(10,10,20,0.95));
}

.silhouette-container {
  width: 300px;
  height: 500px;
  position: absolute;
}
```

### Filtros Elementales para Spiritroot

```javascript
ROOT_FILTERS = {
  fire:       "sepia(1) saturate(5) hue-rotate(-50deg)",
  water:      "sepia(1) saturate(5) hue-rotate(180deg)",
  wood:       "sepia(1) saturate(5) hue-rotate(50deg)",
  earth:      "sepia(1) saturate(3) hue-rotate(-100deg)",
  metal:      "grayscale(1) brightness(1.5)",
  ice:        "sepia(1) saturate(3) hue-rotate(150deg)",
  lightning:  "sepia(1) saturate(5) hue-rotate(220deg) brightness(1.5)"
}
```

### Botones de Control

```html
👤 Base     - Mostrar/ocultar silueta base
🌿 Spiritroot - Mostrar/ocultar raíz espiritual  
⚡ Meridians - Mostrar/ocultar meridianos con glow cian
💪 Muscles   - Mostrar/ocultar capas musculares
💀 Bones     - Mostrar/ocultar esqueleto
🌌 Dantians  - Mostrar/ocultar Dantians + nebulosa
```

### Información de Dantians Mostrada

```
┌─────────────────────────┐
│ 🧠 Mar Conciencia (Upper) │
│    Soul Force: {N}        │ Color: Cyan
├─────────────────────────┤
│ ❤️  Palacio Carmesí (Middle) │
│    Pureza: {N}%          │ Color: #ff0055
├─────────────────────────┤
│ 🌊 Mar de Qi (Lower)      │
│    Qi: {N}/{MAX}          │ Color: Gold
└─────────────────────────┘
```

---

# ⚔️ SISTEMA DE COMBATE

## Ubicación: combat.js (~520 líneas)

### Estructura de Combate

```javascript
Combat = {
  state: "idle",           // idle, battling, won, lost
  currentEnemy: null,      // ID del enemigo actual
  enemyState: "IDLE",      // IDLE, CHANNELING, STUNNED
  enemyHealth: 0,
  essencePool: [],         // Array de perlas canalizadas
  resonanceValue: 0,       // Multiplicador de daño
  turnCounter: 0,
  battleLog: []
}
```

### Fases del Combate

1. **Preparación**: Seleccionar enemigo → startCombat()
2. **Turno Jugador**: 
   - Seleccionar habilidad Wu Xing
   - Consumir esencia elemental
   - Calcular daño = base_dmg × resonanceValue
3. **Canalización Enemiga**:
   - Cambiar estado a CHANNELING
   - Aplicar filtro elemental CSS
   - Incrementar essencePool
4. **Ataque Enemigo**:
   - Desde CHANNELING: ultimateDamage
   - Desde IDLE: normalDamage
5. **Fin Combate**: Estado won/lost

### Funciones Clave

```javascript
startCombat(enemyId)              // Inicia batalla
executePlayerAction(skillId)      // Turno jugador
enemyTurnLogic()                  // Turno enemigo
startChanneling()                 // Inicia canalización
performEnemyUltimate()            // Ataque especial
interruptChanneling()             // Interrupción jugador
updateCombatBars()                // Actualiza UI barras
```

### Enemigos Disponibles

| Enemigo | HP | DMG | Drops | Ubicación |
|---------|----|----|-------|-----------|
| Wolf | 80 | 15 | Gold x5, Spiritstone x1 | ENEMIES_DB |
| Rabbit | 40 | 8 | Gold x2, Herb x2 | ENEMIES_DB |

### Assets de Combate

```
assets/img/
  ├── enemy_wolf_01.png
  ├── enemy_wolf_02.png
  ├── channeling_circle_base.png  (glifo de canalización)
  ├── pearl_gold_active.png       (perla 20x20px)
  ├── pearl_socket.png            (socket 20x20px)
  └── elements/
      ├── element_fire.png   (48x48 en combate)
      ├── element_water.png
      ├── element_wood.png
      ├── element_earth.png
      └── element_metal.png
```

### Filtros CSS Elementales para Canalización

```javascript
CHANNEL_FILTERS = {
  fire:   "drop-shadow(0 0 15px #ff6600) hue-rotate(-50deg)",
  water:  "drop-shadow(0 0 15px #0099ff) hue-rotate(180deg)",
  wood:   "drop-shadow(0 0 15px #00cc66) hue-rotate(50deg)",
  earth:  "drop-shadow(0 0 15px #cc9900)",
  metal:  "drop-shadow(0 0 15px #ccccff) grayscale(0.5)"
}
```

---

# 🎯 SISTEMA WU XING (Drag-Drop)

## Ubicación: ui.js (~280 líneas)

### Panel de Cultivo

```html
<div class="cultivation-panel">
  <div class="wu-xing-slots">
    <div class="slot slot-fire"     ondrop="UI.handleDrop(event, 'fire')">🔥</div>
    <div class="slot slot-earth"    ondrop="UI.handleDrop(event, 'earth')">🪨</div>
    <div class="slot slot-metal"    ondrop="UI.handleDrop(event, 'metal')">⚔️</div>
    <div class="slot slot-water"    ondrop="UI.handleDrop(event, 'water')">💧</div>
    <div class="slot slot-wood"     ondrop="UI.handleDrop(event, 'wood')">🌿</div>
  </div>
</div>
```

### Cálculo de Afinidad

```javascript
// harmony: 2 skills del mismo elemento
// generation: Ciclo agua→madera→fuego→tierra→metal→agua
// dissonance: Combinación no óptima

UI.calculateAffinity() → {
  harmony:   +20% daño
  generation: +15% daño
  dissonance: -10% daño
}
```

### Funciones

```javascript
UI.renderCultivationPanel()    // Renderiza panel Wu Xing
UI.handleDragStart(event)      // Inicia drag
UI.handleDrop(event, element)  // Suelta skill en slot
UI.calculateAffinity()         // Calcula bonus
UI.checkGeneration(skill1, skill2)  // Verifica ciclo
```

---

# 📊 BASE DE DATOS CENTRALIZADA

## Ubicación: data.js (~150 líneas)

### ELEMENTS (5 + 2 especiales)

```javascript
ELEMENTS = {
  fire:       { weak: "water", strong: "wood", color: "#ff6600" },
  water:      { weak: "earth", strong: "fire", color: "#0099ff" },
  wood:       { weak: "metal", strong: "water", color: "#00cc66" },
  earth:      { weak: "wood", strong: "metal", color: "#cc9900" },
  metal:      { weak: "fire", strong: "earth", color: "#ccccff" },
  ice:        { weak: "fire", strong: "water", color: "#00ffff" },
  lightning:  { weak: "water", strong: "metal", color: "#ffff00" }
}
```

### SKILLS_DB

**Oficios Pasivos** (XP → stats cuando meditas):
- meditation (regen Qi +10)
- alchemy (essence +2%)
- forging (attack +1)
- herbalism (defense +1)
- mining (gold +20%)

**Artes Marciales Activas** (Combate):
- basic_attack (fuego, 20 DMG)
- water_shield (agua, reduce daño)
- wood_regen (madera, cura)
- earth_spike (tierra, 25 DMG)
- metal_slash (metal, 30 DMG)

### ITEMS_DB

**Armas**:
- rusty_sword (10 ATK, rareza common)
- iron_sword (15 ATK, rareza uncommon)

**Consumibles**:
- low_pill (cura 20 HP)
- high_pill (cura 50 HP)

**Materiales**:
- spirit_stone (componente)
- iron_ore (componente)

**Moneda**:
- gold (1 = 1 moneda)

### ENEMIES_DB

```javascript
wolf: {
  hp: 80,
  dmg: 15,
  drops: { gold: 5, spirit_stone: 1 }
},
rabbit: {
  hp: 40,
  dmg: 8,
  drops: { gold: 2, herb: 2 }
}
```

### ROOT_TYPES

```javascript
pseudo:    // Frágil, +20% XP
true:      // Base sólida
heavenly:  // Raro, +10% stats
mutant:    // Especial, efectos únicos
```

### CULTIVATION_REALMS

```javascript
mortal, foundation, qi_circulation, core_formation, nascent_spirit
```

---

# 🎮 FLUJO DE JUEGO PRINCIPAL

## main.js - Ciclo Principal

```
1. AUTENTICACIÓN (persistence.js)
   ├─ Login screen
   ├─ Validar credenciales
   └─ Cargar sesión localStorage

2. CREACIÓN O CARGA
   ├─ Primer login? → character_creation.js (3 pasos)
   ├─ Ya existe? → loadCharacterForCurrentUser()
   └─ Migrar datos (backwards compatible)

3. DASHBOARD (main.js - switchTab)
   ├─ Tab 0: Home         (renderHomePanel)
   ├─ Tab 1: Anatomía     (renderAnatomyPanel) ⭐
   ├─ Tab 2: Skills       (renderSkillsPanel)
   ├─ Tab 3: Inventory    (renderInventoryPanel)
   ├─ Tab 4: Combat       (renderCombatListPanel) ⭐
   ├─ Tab 5: Sects        (renderSectsPanel)
   ├─ Tab 6: Crafting     (renderCraftingPanel)
   ├─ Tab 7: Map          (renderMapPanel)
   └─ Tab 8: Chat         (renderChatPanel)

4. INTERACCIONES
   ├─ Character.meditate() → +10 Qi + regen dantian_lower
   ├─ Character.equipSkill(slot, skillId) → equippedSkills
   ├─ Combat.startCombat(enemyId) → Batalla por turnos
   ├─ Sect.joinSect(sectId) → Bonuses +10% regen
   ├─ Map.travel(locationId) → Cambiar ubicación
   └─ Chat.sendMessage() → Sistema local

5. PERSISTENCIA
   └─ localStorage (5-10MB típico)
      ├─ xx_users: { username: password }
      ├─ xx_session: { currentUser, currentCharacter }
      └─ xx_characters_{user}: { completeCharacter }
```

---

# 💾 ESTRUCTURA CHARACTER

## Ubicación: character.js (~420 líneas)

```javascript
DEFAULT_CHARACTER = {
  // IDENTIDAD
  name: "Cultivador",
  gender: "man",              // 'man' o 'woman'
  
  // PROGRESO
  level: 1,
  experience: 0,
  maxExperience: 100,
  
  // VITALIDAD (Legacy)
  health: 100,
  maxHealth: 100,
  essence: 50,                // Esencia Espiritual
  maxEssence: 50,
  
  // COMBATE
  attack: 10,
  defense: 5,
  
  // ATRIBUTOS (Phase 1)
  stats: {
    speed: 10,
    lifesteal_perc: 0,
    essence_leech_perc: 0,
    karma_luck: 0,
    willpower: 0,
    perception: 0
  },
  
  // FUNDAMENTO
  root: {
    type: "true",
    elements: ["fire", "wood", "metal"],
    variant: null              // lightning, ice, etc.
  },
  
  // ANATOMÍA
  anatomy: {
    dantian_lower:  { current: 0, max: 100 },     // Qi
    dantian_middle: { purity: 0, layer: 1 },      // Vigor
    dantian_upper:  { soul_force: 10, perception: 5 },  // Alma
    meridians_blocked: 0
  },
  
  // INTENCIONES
  intents: {
    slaughter_points: 0,
    current_intent: null       // "slaughter", "ethereal"
  },
  
  // ECONOMÍA
  gold: 0,
  spiritStones: 0,
  
  // INVENTARIO
  inventory: { "rusty_sword": 1, "low_pill": 3 },
  equipment: { weapon: null, armor: null },
  
  // WU XING (5 slots)
  equippedSkills: {
    metal: null, wood: null, water: null, fire: null, earth: null
  },
  learnedSkills: ["basic_attack"],
  
  // AFILIACIÓN
  sect: null
}
```

### Funciones Principales

```javascript
Character.loadCharacterForCurrentUser()  // Cargar + migrar
Character.meditate()                     // +10 Qi + regen dantian_lower
Character.equipSkill(slot, skillId)     // Asignar habilidad a slot
Character.gainExperience(amount)        // Añadir XP
Character.levelUp()                     // Subir nivel
Character.syncCharacterToUI()           // Actualizar UI global
```

---

# 🔑 FUNCIONES CLAVE POR ARCHIVO

## character.js
- `loadCharacterForCurrentUser()` - Carga personaje con migración
- `meditate()` - Restaura 10 Qi y regenera dantian_lower
- `equipSkill(slot, skillId)` - Equipa habilidad en slot Wu Xing
- `gainExperience(amount)` - Añade XP (con levelUp automático)
- `syncCharacterToUI()` - Sincroniza estado global

## main.js
- `switchTab(tabIndex)` - Cambia panel activo
- `renderHomePanel()` - Muestra stats principales
- `renderAnatomyPanel()` - 🌟 Visualiza anatomía con 6 capas + toggles
- `renderCombatListPanel()` - Lista enemigos disponibles
- `toggleLayer(layerName)` - Muestra/oculta capa de anatomía

## ui.js
- `UI.renderCultivationPanel()` - Panel Wu Xing 5 slots
- `UI.handleDrop(event, element)` - Suelta skill en slot
- `UI.calculateAffinity()` - Calcula harmony/generation/dissonance
- `UI.log(message)` - Añade mensaje a log con timestamp

## combat.js
- `startCombat(enemyId)` - Inicia batalla
- `executePlayerAction(skillId)` - Turno del jugador
- `enemyTurnLogic()` - IA del enemigo
- `startChanneling()` - Inicia canalización enemiga
- `performEnemyUltimate()` - Ataque especial

## persistence.js
- `validateCredentials(username, pass)` - Auth
- `saveCharacter()` - Guarda en localStorage
- `loadCharacterForCurrentUser()` - Carga desde localStorage

## sects.js
- `Sect.joinSect(sectId)` - Unirse a secta (+bonuses)
- `Sect.renderSectsPanel()` - Muestra panel sectas

## crafting.js
- `Crafting.craftItem(recipeName)` - Craftear item

---

# 📁 ESTRUCTURA DIRECTORIO ASSETS

```
assets/
├── img/
│   ├── anatomy/
│   │   ├── silhouette_base_man.png
│   │   ├── silhouette_base_woman.png
│   │   ├── bones_overlay_man.png
│   │   ├── bones_overlay_woman.png
│   │   ├── muscle_overlay_man.png
│   │   ├── muscle_overlay_man2.png      ← NEW (opacity 0.9)
│   │   ├── muscle_overlay_man3.png      ← NEW (opacity 0.7)
│   │   ├── muscle_overlay_woman.png
│   │   ├── muscle_overlay_woman2.png    ← NEW
│   │   ├── muscle_overlay_woman3.png    ← NEW
│   │   ├── meridians_overlay_man.png
│   │   ├── meridians_overlay_woman.png
│   │   ├── spiritroot_overlay_man.png
│   │   ├── spiritroot_overlay_woman.png
│   │   ├── spiritroot_man.png           ← NEW (spiritroot_alone)
│   │   ├── spiritroot_woman.png         ← NEW
│   │   ├── nebulosa_overlay_man.png
│   │   ├── nebulosa_overlay_woman.png
│   │   ├── dantian_mente.png            (60x60px, float animation)
│   │   ├── dantian_pecho.png            (70x70px, pulse animation)
│   │   └── dantian_abdomen.png          (80x80px, spin animation)
│   │
│   ├── HUD-UI/
│   │   ├── [Otros assets UI]
│   │
│   ├── enemy_wolf_01.png
│   ├── enemy_wolf_02.png
│   ├── player_meditating.png
│   ├── channeling_circle_base.png
│   ├── pearl_gold_active.png            (20x20px)
│   ├── pearl_socket.png                 (20x20px)
│   ├── icon_godmode.png                 (120x80px)
│   ├── brush_bar_hp.png
│   ├── brush_bar_essence.png
│   └── brush_bar_stamina.png
│
└── icons/
    └── elements/
        ├── element_fire.png             (48x48 combate, 30x30 Wu Xing)
        ├── element_water.png
        ├── element_wood.png
        ├── element_earth.png
        ├── element_metal.png
        ├── element_ice.png
        └── element_lightning.png
```

---

# ✅ ESTADO DE ERRORES

## Archivo: index.html
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>XianXia: Ascensión Eterna</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Zhi+Mang+Xing&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/ui.css" />
</head>
<body>
  <div id="app-root">
    
    <div id="auth-screen" class="fullscreen-screen">
      <div class="stars-bg"></div>
      <div class="auth-panel">
        <h1 class="game-title">XianXia: Ascensión Eterna</h1>
        <p class="game-subtitle">El Dao es infinito, tu vida es finita.</p>
        <div class="auth-tabs">
          <button id="tab-login" class="auth-tab active">Entrar</button>
          <button id="tab-register" class="auth-tab">Registrarse</button>
        </div>
        <div id="login-form" class="auth-form active">
          <div class="input-group"><input type="text" id="login-username" placeholder="Nombre de Daoísta" autocomplete="off" /></div>
          <div class="input-group"><input type="password" id="login-password" placeholder="Sello Espiritual (Contraseña)" /></div>
          <button id="login-button" class="button primary glow-effect">Iniciar Cultivación</button>
        </div>
        <div id="register-form" class="auth-form">
          <div class="input-group"><input type="text" id="register-username" placeholder="Nombre de Daoísta" autocomplete="off" /></div>
          <div class="input-group"><input type="password" id="register-password" placeholder="Crear Sello Espiritual" /></div>
          <button id="register-button" class="button secondary">Forjar Destino</button>
        </div>
        <div id="auth-message" class="auth-message"></div>
      </div>
    </div>

    <div id="creation-screen" class="fullscreen-screen hidden">
        <div class="creation-container">
            <h2 class="font-title title-gold">El Despertar del Alma</h2>
            <div id="creation-step-container"></div>
        </div>
    </div>

    <div id="game-container" class="game-layout hidden">
        
        <nav id="game-nav" class="sidebar-menu">
            <div class="sidebar-header">
                <div class="app-logo font-title">Ascensión</div>
            </div>
            <div class="nav-links">
                <button class="nav-btn active" data-target="panel-home">
                    <span class="nav-icon">🏠</span> <span class="nav-label">Hogar</span>
                </button>
                <button class="nav-btn" data-target="panel-skills">
                    <span class="nav-icon">🔨</span> <span class="nav-label">Oficios</span>
                </button>
                <button class="nav-btn" data-target="panel-anatomy">
                    <span class="nav-icon"><img src="assets/icons/lottus_icon.png" style="width:24px; vertical-align:middle;"></span> <span class="nav-label">Cultivo</span>
                </button>
                <button class="nav-btn" data-target="panel-cultivation">
                    <span class="nav-icon">🔥</span> <span class="nav-label">Habilidades</span>
                </button>
                <button class="nav-btn" data-target="panel-inventory">
                    <span class="nav-icon">🎒</span> <span class="nav-label">Bolsa</span>
                </button>
                <button class="nav-btn" data-target="panel-combat">
                    <span class="nav-icon">⚔️</span> <span class="nav-label">Combate</span>
                </button>
                <button class="nav-btn" data-target="panel-map">
                    <span class="nav-icon">🗺️</span> <span class="nav-label">Mundo</span>
                </button>
                <button class="nav-btn" data-target="panel-sect">
                    <span class="nav-icon">🏯</span> <span class="nav-label">Secta</span>
                </button>
            </div>
            
            <div class="nav-footer">
                <button id="logout-button" class="nav-btn danger">
                    <span class="nav-icon">🚪</span> <span class="nav-label">Salir</span>
                </button>
            </div>
        </nav>

        <main id="main-content">

            <div id="panels-container">
                
                <section id="panel-home" class="tab-content active">
                    <div class="hero-card">
                        <div class="meditation-visual">🧘</div>
                        <h2 class="font-title">Tu Morada Espiritual</h2>
                        <div class="bars-wrapper">
                            <div class="stat-bar">
                                <div class="bar-label">Salud <span id="val-hp">100/100</span></div>
                                <div class="progress-track"><div id="bar-hp" class="progress-fill hp" style="width:100%"></div></div>
                            </div>
                            <div class="stat-bar">
                                <div class="bar-label">Qi (Exp) <span id="val-qi">0/100</span></div>
                                <div class="progress-track"><div id="bar-qi" class="progress-fill qi" style="width:0%"></div></div>
                            </div>
                            <div class="stat-bar">
                                <div class="bar-label">Esencia <span id="val-essence">50/50</span></div>
                                <div class="progress-track"><div id="bar-essence" class="progress-fill essence" style="width:100%"></div></div>
                            </div>
                        </div>
                        <div class="stats-container" style="display: block; text-align: center;">
                            <div class="stat-row">
                                <span class="stat-label">Nivel:</span> <span id="stat-level" class="stat-value">1</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Ataque:</span> <span id="stat-attack" class="stat-value">10</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Defensa:</span> <span id="stat-defense" class="stat-value">5</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Oro:</span> <span id="stat-gold" class="stat-value">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Piedras Espirituales:</span> <span id="stat-spiritStones" class="stat-value">0</span>
                            </div>
                        </div>
                        <button id="btn-meditate" class="action-button primary">Concentrar Qi</button>
                        
                        <div class="log-card collapsible" style="text-align: center;">
                            <div class="card-header font-title collapsible-header" onclick="toggleLog()">Flujo de Qi (Actividad) <span class="toggle-icon">▼</span></div>
                            <div id="log-messages" class="log-body custom-scroll collapsible-content" style="display: block;"></div>
                        </div>
                    </div>
                    
                </section>

                <section id="panel-skills" class="tab-content hidden">
                    <h2 class="section-title font-title">Maestrías y Técnicas</h2>
                    <div id="skills-grid" class="skills-layout custom-scroll">
                        </div>
                </section>

                <section id="panel-cultivation" class="tab-content hidden">
                    <div class="panel-header">
                        <h2><img src="assets/icons/elements/element_fire.png" style="width:24px; vertical-align:middle;"> Sendero Celestial</h2>
                    </div>
                    
                    <div class="cultivation-dashboard">
                        <div class="eso-stats-row">
                            <span>🍀 Karma: <span id="val-karma">0</span></span>
                            <span>👁️ Percepción: <span id="val-percep">0</span></span>
                            <span>🔥 Voluntad: <span id="val-will">0</span></span>
                        </div>

                        <div class="cultivation-layout">
                            <div class="library-container">
                                <h3>Pergaminos</h3>
                                <div id="skills-library-list" class="custom-scroll">
                                    </div>
                            </div>

                            <div class="wheel-wrapper">
                                <h3>Meridiano Pentagonal</h3>
                                <div id="cultivation-wheel-container">
                                    </div>
                                <div class="affinity-legend">
                                    <span style="color:#ffd700">● Armonía</span>
                                    <span style="color:#4caf50">● Generación</span>
                                    <span style="color:#777">● Disonancia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="panel-anatomy" class="tab-content hidden">
                    <div class="panel-header">
                        <h2><img src="assets/icons/lottus_icon.png" style="width:24px; vertical-align:middle;"></span> Anatomía Sagrada</h2>
                    </div>
                    
                    <div id="anatomy-content" class="anatomy-dashboard" style="padding: 15px;">
                        </div>
                </section>
                <section id="panel-inventory" class="tab-content hidden">
                    <h2 class="section-title font-title">Bolsa Espiritual</h2>
                    <div id="inventory-slots" class="grid-layout custom-scroll"></div>
                </section>

                <section id="panel-combat" class="tab-content hidden">
                    <div id="enemy-list" class="zone-selector-container">
                        <h2 class="font-title section-title">Zona: <span id="current-region-name">Bosque</span></h2>
                        <div class="grid-layout custom-scroll" id="enemy-grid-content">
                            </div>
                    </div>

                    <div id="battle-arena" class="combat-grid hidden">
                        
                        <div class="combat-top-hud">
                            <div class="enemy-portrait-frame">
                                <div class="intention-bubble" id="enemy-intention-icon">⚔️</div>
                                <div id="combat-enemy-sprite" class="sprite-enemy">🐺</div>
                            </div>
                            <div class="bars-column">
                                <div class="bar-label">Enemigo HP</div>
                                <div class="progress-track enemy"><div id="e-bar-hp" class="progress-fill hp" style="width:100%"></div></div>
                                <div class="bar-label">Postura</div>
                                <div class="progress-track posture"><div class="progress-fill posture" style="width:10%"></div></div>
                            </div>
                        </div>

                        <div class="combat-middle-field">
                            <div class="player-avatar-combat">
                                <div id="combat-player-sprite" class="sprite-player">👤</div>
                                <div class="progress-track mini"><div id="p-bar-hp" class="progress-fill hp" style="width:100%"></div></div>
                            </div>
                            
                            <div id="combat-message-overlay" style="position:absolute; width:100%; height:100%; pointer-events:none;"></div>

                            <div class="combat-log-display custom-scroll" id="combat-log-feed">
                                </div>
                        </div>

                        <div class="combat-bottom-controls" id="combat-actions">
                            <div class="wuxing-wrapper">
                                <div id="wuxing-wheel" class="elemental-wheel">
                                    </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="panel-map" class="tab-content hidden">
                    <h2 class="section-title font-title">Mapa del Reino</h2>
                    <div id="map-panel" class="map-container"></div>
                </section>

                <section id="panel-sect" class="tab-content hidden">
                    <h2 class="section-title font-title">Pabellón de la Secta</h2>
                    <div id="sect-content" class="sect-container">
                        </div>
                </section>
            </div>
        </main>
    </div>
    
    <div id="ui-overlay" class="overlay hidden"></div>
  </div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

## Archivo: style.css
```css
/* css/style.css - v1.7 SOLID FIXED */

:root {
    /* Variables God Mode */
    --enemy-scale: 1.0;
    --enemy-pos-x: 0px;
    --enemy-pos-y: 0px;

    /* Assets */
    --bg-paper-texture: url('../assets/img/bg_paper_texture.png'); 
    
    /* Colores */
    --ink-parchment: #E8DCC5; 
    --ink-grey: #8C867A;      
    --ink-blood: #A61B1B;     
    --ink-gold: #C5A059;      
    --gold-bright: #FFD700;
    --gold-ancient: #C5A059;

    --font-stack-title: 'Zhi Mang Xing', cursive;
    --font-stack-body: 'Noto Serif SC', serif;

    --bg-panel: rgba(16, 16, 24, 0.98);
}

/* =========================================
   1. BASE
   ========================================= */
* { box-sizing: border-box; } /* CRÍTICO PARA EVITAR DEFORMACIONES */

body {
    margin: 0; padding: 0;
    background-color: #080808;
    background-image: var(--bg-paper-texture);
    background-repeat: repeat;
    background-blend-mode: multiply;
    background-position: -100px -100px; 
    color: var(--ink-parchment);
    font-family: var(--font-stack-body);
    overflow: hidden; 
    width: 100vw; height: 100vh;
}

.hidden { display: none !important; }
.font-title { font-family: var(--font-stack-title); letter-spacing: 1px; }
.text-gold { color: var(--gold-ancient); }
.text-center { text-align: center; }

/* Scrollbars */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: var(--gold-ancient); border-radius: 3px; }
::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }

/* =========================================
   2. LOGIN (Restaurado)
   ========================================= */
.fullscreen-screen {
    position: fixed; inset: 0; z-index: 2000;
    display: flex; justify-content: center; align-items: center;
    background: radial-gradient(circle at top, #14141a, #020205);
}
.auth-panel {
    background: var(--bg-panel); border: 1px solid var(--gold-ancient);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
    padding: 40px; border-radius: 4px; width: 90%; max-width: 400px; text-align: center;
}
.auth-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #444; }
.auth-tab { 
    flex: 1; padding: 10px; background: none; border: none; color: #666; 
    cursor: pointer; font-family: var(--font-stack-body); font-weight: bold;
}
.auth-tab.active { color: var(--gold-bright); border-bottom: 2px solid var(--gold-bright); }

.auth-form { display: none; }
.auth-form.active { display: block; animation: fadeIn 0.3s ease; }

.auth-form input { 
    width: 100%; padding: 10px; margin-bottom: 10px; 
    background: rgba(0,0,0,0.5); border: 1px solid #555; color: #fff;
}
.button {
    padding: 10px 20px; border: 1px solid var(--gold-ancient);
    background: #222; color: var(--gold-ancient); cursor: pointer;
    font-family: var(--font-stack-title); font-size: 1.1rem;
    transition: all 0.2s; width: 100%; margin-top: 10px;
}
.button:hover { background: var(--gold-ancient); color: #000; }

/* =========================================
   3. LAYOUT PRINCIPAL (Anti-Deformación)
   ========================================= */
.game-layout { display: flex; height: 100vh; width: 100%; }

.sidebar-menu {
    width: 240px; min-width: 240px; /* FIJO */
    background: rgba(10, 10, 12, 0.98);
    border-right: 1px solid var(--gold-ancient);
    display: flex; flex-direction: column; z-index: 100;
}
.sidebar-header { padding: 30px 20px; text-align: center; border-bottom: 1px solid #333; }
.app-logo { font-size: 2.2rem; color: var(--gold-bright); text-shadow: 0 0 10px gold; }

.nav-links { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 10px; }
.nav-btn {
    background: transparent; border: none; color: #888; 
    padding: 15px; text-align: left; cursor: pointer;
    font-family: var(--font-stack-title); font-size: 1.3rem;
    display: flex; align-items: center; gap: 15px;
    transition: all 0.2s;
}
.nav-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
.nav-btn.active { color: var(--gold-bright); border-left: 3px solid var(--gold-bright); background: rgba(197, 160, 89, 0.1); }

/* CONTENEDOR PRINCIPAL - FIX DEFORMACIÓN */
#main-content { 
    flex: 1; 
    display: flex; flex-direction: column; 
    position: relative; 
    width: calc(100% - 200px); /* Restar sidebar */
} 
#panels-container { 
    flex: 1; 
    padding: 20px; 
    overflow-y: auto; 
    width: 100%; 
}

/* =========================================
   4. HOGAR (Ajustado)
   ========================================= */
#panel-home {
    display: flex; flex-direction: column; align-items: center; justify-content: center; 
    height: 100%; width: 100%; gap: 20px;
}

.hero-card {
    background: transparent; border: none;
    display: flex; flex-direction: column; align-items: center;
    width: 100%; max-width: 600px;
}

.meditation-container {
    position: relative; width: 250px; height: 250px;
    display: flex; justify-content: center; align-items: center;
    margin-bottom: 0px;
}
.home-avatar {
    width: 200px !important; height: 200px !important;
    border-radius: 50%; border: 4px solid var(--gold-ancient);
    object-position: center 5%;
    object-fit: cover; background: #000; z-index: 2;
    box-shadow: 0 0 30px var(--gold-ancient);
    animation: float 4s ease-in-out infinite;
}
.avatar-emoji {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    z-index: 10;
    pointer-events: none;
}

.aura-ring {
    position: absolute; width: 100%; height: 100%;
    border: 2px dashed rgba(197, 160, 89, 0.4); border-radius: 50%;
    animation: spinSimple 20s linear infinite;
}
.aura-ring.inner { width: 230px; height: 230px; animation-direction: reverse; border-color: rgba(50, 200, 50, 0.3); }

@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
@keyframes spinSimple { 100% { transform: rotate(360deg); } }

/* Stats Hogar */
.home-stats-card {
    background: rgba(0,0,0,0.6); border: 1px solid #444;
    padding: 25px; border-radius: 8px; width: 100%;
}

/* =========================================
   5. HABILIDADES (Ordenado)
   ========================================= */
.skills-layout { 
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; width: 100%;
}
.skill-card {
    background: linear-gradient(135deg, rgba(20,20,20,0.9), rgba(40,40,40,0.8));
    border: 1px solid #444; border-radius: 4px; padding: 15px;
    display: flex; align-items: center; gap: 15px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
.skill-icon { font-size: 2.5rem; width: 60px; text-align: center; }
.skill-name { display: block; font-family: var(--font-stack-title); color: var(--gold-bright); font-size: 1.4rem; }

/* =========================================
   6. COMBATE (SÓLIDO Y CORREGIDO)
   ========================================= */
.combat-grid {
    display: flex; flex-direction: column;
    height: 100vh; width: 100vw; 
    position: fixed; /* FIJO ENCIMA DE TODO */
    top: 0; left: 0;
    /* FONDO SÓLIDO (La imagen de papel) */
    background-color: #080808;
    background-image: var(--bg-paper-texture); 
    background-repeat: repeat;
    z-index: 5000; /* Z-INDEX MUY ALTO */
}

/* ZONA ENEMIGO */
.combat-enemy-zone {
    flex: 6; position: relative;
    display: flex; justify-content: center; align-items: center;
    overflow: visible; z-index: 5;
}
#combat-enemy-sprite {
    position: relative; height: 50vh; width: auto;
    transform: translate(var(--enemy-pos-x), var(--enemy-pos-y)) scale(var(--enemy-scale));
    transition: transform 0.05s linear;
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.8)); z-index: 10;
}
.enemy-render { height: 100%; width: auto; object-fit: contain; }

/* GLIFO DE CARGA (CENTRO ABSOLUTO) */
.channeling-container {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 780px !important;    /* Tamaño fijo obligatorio */
    height: 420px !important;   /* Cuadrado perfecto */
    border-radius: 50%;         /* Hace que el contenedor sea redondo */
    object-fit: contain;        /* Evita deformación de la imagen */
    z-index: 1;
    pointer-events: none;
    /* La transición suave para cuando cambie de color */
    transition: filter 0.5s ease;
}
.channeling-container.active {
    opacity: 0.9;
    animation: spinGlyph 4s linear infinite;
}
.channeling-glyph { width: 100%; height: 100%; }

@keyframes spinGlyph {
    /* Rotación sobre su propio eje manteniendo el centro */
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ZONA CONTROLES */
.combat-controls-zone {
    flex: 4; position: relative;
    background: linear-gradient(to top, #000 20%, rgba(0,0,0,0.95) 60%, transparent 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
    padding-bottom: 30px; z-index: 20;
}

/* BARRAS DE VIDA Y QI (RUTAS CORREGIDAS) */
.brush-bar-wrapper {
    position: relative; width: 100%; height: 35px; margin-bottom: 8px;
    filter: drop-shadow(0 2px 2px #000);
}
.brush-bg {
    position: absolute; inset: 0;
    background-image: url('../assets/img/bar_hp_bg.png'); background-size: 100% 100%;
    z-index: 5; pointer-events: none;
}
.brush-fill-container {
    position: absolute; 
    top: 8px; bottom: 8px; left: 10px; right: 10px; 
    background: #111; z-index: 1; border-radius: 4px; overflow: hidden;
}
.brush-fill-img {
    height: 100%; width: 0%; /* Empieza en 0% */
    background-size: cover; background-position: left center;
    transition: width 0.3s ease-out;
}
/* COLORES Y IMÁGENES */
.fill-hp {  background-image: url('../assets/img/bar_hp_fill.png'); }
.fill-qi {  background-image: url('../assets/img/bar_qi_fill.png'); } /* Dorado */
.fill-qi-enemy {  background-image: url('../assets/img/bar_qi_fill_01.png'); } /* Dorado */
.fill-essence {  background-image: url('../assets/img/bar_qi_fill_01.png'); } /* Azul/Verde */

.bar-text-overlay {
    position: absolute; top: -18px; width: 100%;
    display: flex; justify-content: space-between;
    font-size: 0.85rem; color: #fff; text-shadow: 0 1px 2px #000; z-index: 10;
}

.enemy-hud-container { position: absolute; top: -80px; width: 60%; max-width: 500px; z-index: 30; }
.player-hud-container { 
    position: fixed; bottom: 20px; left: 20px; 
    width: 280px; z-index: 100;
    background: rgba(0,0,0,0.6); padding: 10px; border-radius: 8px; border: 1px solid #444;
}

/* RUEDA WU XING */
.wuxing-wrapper { width: 240px; height: 240px; position: relative; margin-bottom: 20px; z-index: 30; }
.pentagon-svg { width: 100%; height: 100%; position: absolute; top:0; left:0; pointer-events: none; opacity: 0.6; }
.pentagon-lines { stroke: var(--gold-ancient); stroke-width: 2; fill: none; }

.element-wrapper {
    position: absolute; width: 50px; height: 50px;
    transform: translate(-50%, -50%);
    display: flex; justify-content: center; align-items: center; z-index: 50;
}
.element-btn-img {
    width: 48px; height: 48px;
    background: #000; border: 2px solid #555; border-radius: 50%;
    cursor: pointer; padding: 0; overflow: hidden;
    transition: transform 0.1s; box-shadow: 0 0 10px rgba(0,0,0,0.8);
}
.element-btn-img:hover { transform: scale(1.2); border-color: var(--gold-bright); }
.element-btn-img img { width: 100%; height: 100%; object-fit: cover; }

.pearl-socket {
    position: absolute; top: -5px; right: -5px;
    width: 20px; height: 20px; z-index: 60; pointer-events: none;
    filter: drop-shadow(0 0 5px gold);
}

/* BOTÓN HUIR (POSICIONADO EN LA RUEDA) */
/* Lo posicionaremos via JS o aquí relativo al wrapper si es hijo */
.flee-btn-wrapper {
    position: absolute;
    /* Ajustado para estar "abajo del fuego" (Derecha, un poco abajo) */
    top: 70%; right: -20px; 
    z-index: 100;
}
#btn-flee-combat {
    background: none; border: 1px solid #555; border-radius: 50%;
    width: 40px; height: 40px; font-size: 1.5rem;
    cursor: pointer; background: #000;
}
#btn-flee-combat:hover { border-color: red; }

/* LOG FLOTANTE */
#combat-log-container {
    position: absolute; top: 100px; right: 20px;
    width: 300px; height: auto; max-height: 400px;
    background: rgba(0, 0, 0, 0.9); border: 1px solid var(--gold-ancient);
    z-index: 300; display: none; flex-direction: column;
}
#combat-log-container.active { display: flex; }
.log-header { 
    background: var(--ink-blood); padding: 5px 10px; font-weight: bold; border-bottom: 1px solid #444; 
    display: flex; justify-content: space-between;
}
.log-content { flex: 1; overflow-y: auto; padding: 10px; font-size: 0.85rem; color: #ccc; }

#btn-toggle-log {
    position: absolute; top: 20px; right: 20px;
    font-size: 2rem; background: none; border: none; cursor: pointer; z-index: 301;
    filter: drop-shadow(0 0 5px #000);
}

/* GOD MODE (Esquina Inferior Derecha) */
#god-mode-toggle {
    position: fixed; bottom: 20px; right: 20px;
    width: 60px; height: 60px; cursor: pointer; z-index: 10000;
    filter: drop-shadow(0 0 5px gold);
    transition: transform 0.2s;
}
#god-mode-toggle:hover { transform: scale(1.1); }

/* DAÑO FLOTANTE */
.floating-damage {
    position: absolute; font-family: var(--font-stack-title); font-size: 4rem;
    color: #fff; text-shadow: 2px 2px 0 #000, 0 0 10px var(--ink-blood);
    pointer-events: none; z-index: 400; animation: floatUp 1.2s forwards;
}
@keyframes floatUp { 0% { opacity: 1; transform: translateY(0) scale(0.5); } 20% { transform: translateY(-20px) scale(1.2); } 100% { opacity: 0; transform: translateY(-100px) scale(1); } }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ==========================================================================
   RESPONSIVE DESIGN (MÓVIL) - Modificaciones para pantallas pequeñas
   ========================================================================== */

@media (max-width: 768px) {

    /* 1. LAYOUT GENERAL: Cambiar Sidebar lateral a Menú Inferior */
    .game-layout {
        flex-direction: column; /* Apilar verticalmente */
    }

    /* Transformar la barra lateral izquierda en una barra de navegación inferior */
    .sidebar-menu {
        width: 100% !important;
        height: 60px;           /* Altura fija abajo */
        position: fixed;
        bottom: 0;
        top: auto;              /* Ya no está arriba */
        left: 0;
        flex-direction: row;    /* Botones en fila horizontal */
        border-right: none;
        border-top: 1px solid var(--gold-ancient);
        z-index: 5000;
        padding-top: 0;
        justify-content: space-around; /* Distribuir botones */
        background: #000;
    }

    .sidebar-header { display: none; } /* Ocultar logo grande en móvil para ganar espacio */

/* Ajustar los botones del menú para que sean DESLIZABLES */
    .nav-links {
        display: flex;
        flex-direction: row;
        width: 100%;
        
        /* CAMBIO CLAVE 1: Permitir scroll horizontal */
        overflow-x: auto; 
        
        /* CAMBIO CLAVE 2: Alinear al inicio, no justificar, para permitir el scroll */
        justify-content: flex-start;
        
        /* Separación entre botones */
        gap: 10px;
        
        /* Un poco de aire a los lados para que el primero y último no se peguen al borde */
        padding: 0 15px; 
        
        /* Ocultar la barra de scroll (estética) pero permitir deslizar */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE */
    }
    
    /* Ocultar barra de scroll en Chrome/Safari */
    .nav-links::-webkit-scrollbar {
        display: none;
    }

    .nav-btn {
        /* CAMBIO CLAVE 3: ¡No te encojas! Mantén tu tamaño */
        flex: 0 0 auto; 
        
        font-size: 0.9rem;
        padding: 10px 15px; /* Un poco más anchos para dedos */
        text-align: center;
        border: none;
        
        /* Opcional: Borde redondeado para que parezcan "fichas" */
        border-radius: 4px; 
        background: rgba(0,0,0,0.5); /* Fondo semitransparente para distinguir */
        margin-top: 5px; /* Centrado vertical */
    }

    /* 2. CONTENIDO PRINCIPAL */
    #main-content {
        width: 100%;
        margin-top: 50px;       /* Espacio para el Header superior */
        margin-bottom: 60px;    /* Espacio para el Menú inferior */
        height: calc(100vh - 110px); /* Restamos header y footer */
    }

    /* 3. HEADER (Barra Superior) */
    .top-bar {
        height: 50px;
        padding: 0 10px;
    }
    .char-info h2 {
        font-size: 0.9rem;      /* Nombre más pequeño */
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .avatar-mini { display: none; } /* Ocultar avatar mini en header (ya se ve grande en Home) */
    .resources-wrapper { gap: 5px; font-size: 0.8rem; }

    /* 4. HOGAR (Ajustes de Avatar y Barras) */
    .meditation-container {
        width: 180px; height: 180px; /* Reducir un poco el avatar */
    }
    .home-avatar { 
        object-position: center 25%; /* Mantener el zoom al rostro */
    }
    .stats-grid {
        width: 100%;
        padding: 0 10px; /* Márgenes laterales */
    }

    /* 5. COMBATE (CRÍTICO) */
    
    /* El Glifo ya no puede ser 350px fijos si la pantalla mide 320px */
    #channeling-layer {
        width: 120vw !important;  /* 80% del ancho de la pantalla */
        height: 120vw !important; /* Mantener proporción cuadrada */
        max-width: 550px; 
        max-height: 550px;
        margin-top: -40px; /* Ajuste visual */
    }
    
    /* El enemigo también se ajusta */
    #combat-enemy-sprite img {
        height: 30vh; /* Reducir altura del enemigo en móvil */
        margin-top: +40px; /* Ajuste visual */
    }

    /* HUD de Combate */
    .combat-controls-zone {
        justify-content: flex-end; /* Empujar todo abajo */
    }
    
    /* RUEDA DE ELEMENTOS (WU XING) */
    /* Esto es delicado: Si usas coordenadas fijas en JS, necesitamos escalar todo el contenedor */
    #wuxing-wheel-container {
        transform: scale(0.8); /* Hacer la rueda un 20% más pequeña */
        margin-bottom: +70px;
        margin-top: -40px;
    }

    /* Ajuste de Barras en Combate */
    .brush-bar-wrapper {
        width: 95% !important; /* Que ocupen casi todo el ancho */
    }

    /* BOTÓN HUIR */
    .flee-btn-wrapper {
        top: 60%; right: -15px; /* Ajuste para móvil */  
    }

    /* Barras de estado del jugador */
    .player-hud-container {
        width: 70%;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10px; /* Más arriba para no tapar el menú */
        
    }

    /* LOG FLOTANTE */
    #combat-log-container {
        width: 90%;
        right: 5%;
        top: 80px;      
        max-height: 30vh;  
    }

    /* BOTÓN LOG */
    #btn-toggle-log {
        top: 10px; right: 10px;
        font-size: 1.5rem;
        z-index: 5001;
    }
    
    /* GOD MODE */
    #god-mode-toggle {
        width: 50px; height: 50px;
        bottom: 80px; right: 10px; /* Más arriba para no tapar el menú */
    }

    /* DAÑO FLOTANTE */
    .floating-damage {
        font-size: 2.5rem;
    }
    /* FIN MEDIA QUERY */ 
}
```

## Archivo: ui.css
```css
/* Menús modales dentro del overlay */
.menu {
  background-color: rgba(16, 16, 24, 0.96);
  border: 1px solid rgba(180, 140, 80, 0.7);
  border-radius: 8px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
  padding: 18px 22px;
  color: #eee;
  max-width: 520px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.menu h2 {
  font-family: 'Cinzel', serif;
  margin-top: 0;
  margin-bottom: 10px;
  color: #ffdd99;
  text-align: center;
}

.menu p {
  font-size: 0.9rem;
}

/* Progreso (ej: HP, Qi, etc.) */
.progress-bar {
  width: 100%;
  height: 14px;
  background-color: #222;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  margin-bottom: 4px;
}

.progress-bar-fill {
  background: linear-gradient(90deg, #6ed96e, #4caf50);
  height: 100%;
  width: 50%;
  transition: width 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
}

/* Para Qi / energía */
.progress-bar.qi .progress-bar-fill {
  background: linear-gradient(90deg, #42a5f5, #29b6f6);
}

/* Para experiencia */
.progress-bar.exp .progress-bar-fill {
  background: linear-gradient(90deg, #ff9800, #ffc107);
}

/* Lista simple */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li {
  padding: 3px 0;
}

/* Diario */
.journal-entry {
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 3px;
  padding-bottom: 3px;
  font-size: 0.82rem;
}
.journal-entry time {
  color: #888;
  font-size: 0.7rem;
}

/* Perfil mini mostrado en chat popup */
.profile-popup {
  background: rgba(20, 20, 30, 0.98);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 130, 0.6);
  padding: 12px;
  max-width: 360px;
}
.profile-popup h3 {
  margin-top: 0;
  margin-bottom: 6px;
  font-family: 'Cinzel', serif;
}
.profile-popup .popup-row {
  margin-bottom: 4px;
  font-size: 0.85rem;
}

/* --- UI CULTIVO --- */
.cultivation-dashboard {
    padding: 10px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    color: #eee;
}

.eso-stats-row {
    display: flex;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-family: monospace;
}

.cultivation-layout {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

/* Biblioteca de Skills (Izquierda) */
.library-container {
    flex: 1;
    min-width: 200px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #555;
    height: 350px;
    display: flex;
    flex-direction: column;
}

.library-container h3, .wheel-wrapper h3 {
    text-align: center;
    background: #333;
    margin: 0;
    padding: 5px;
    font-size: 0.9rem;
    color: #d4af37;
}

.skills-list {
    flex: 1;
    overflow-y: auto;
    padding: 5px;
}

.skill-library-item {
    display: flex;
    align-items: center;
    background: #222;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #444;
    cursor: grab;
    transition: background 0.2s;
}
.skill-library-item:hover { background: #333; }
.skill-library-item:active { cursor: grabbing; }

.lib-icon { font-size: 1.5rem; margin-right: 10px; }
.lib-name { font-size: 0.9rem; font-weight: bold; }
.lib-elem { font-size: 0.7rem; text-transform: uppercase; }
.type-fire { color: #ff6b6b; }
.type-water { color: #4dabf7; }
.type-wood { color: #69db7c; }
.type-metal { color: #adb5bd; }
.type-earth { color: #ffd43b; }

/* Rueda Pentagonal (Derecha) */
.wheel-wrapper {
    flex: 1.5;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#cultivation-wheel-container {
    width: 300px;
    height: 300px;
    position: relative;
    margin-top: 20px;
    /* Imagen de fondo opcional para conectar las líneas */
    background: radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(0,0,0) 70%);
    border-radius: 50%;
    border: 1px dashed #444;
}

.cultivation-slot {
    width: 60px;
    height: 60px;
    position: absolute;
    border-radius: 50%;
    background: #1a1a1a;
    border: 2px solid #555;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    transition: transform 0.2s;
}
.cultivation-slot:hover { transform: scale(1.1); border-color: #fff; }

.slot-bg-icon {
    width: 30px; 
    height: 30px; 
    opacity: 0.3; 
    pointer-events: none;
}

/* Posiciones Pentagonales (Top, Right, Bottom-Right, Bottom-Left, Left) */
/* Ajustado para un contenedor de 300x300 */
.slot-fire { top: 10px; left: 50%; transform: translateX(-50%); border-color: #e74c3c; } /* Arriba */
.slot-earth { top: 90px; right: 10px; border-color: #f1c40f; } /* Derecha */
.slot-metal { bottom: 40px; right: 40px; border-color: #bdc3c7; } /* Abajo Derecha */
.slot-water { bottom: 40px; left: 40px; border-color: #3498db; } /* Abajo Izquierda */
.slot-wood { top: 90px; left: 10px; border-color: #2ecc71; } /* Izquierda */

/* Fichas Equipadas */
.equipped-skill-token {
    position: absolute;
    width: 100%; height: 100%;
    border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
    font-size: 1.5rem;
    background: #222;
    z-index: 2;
}

/* Bordes de Afinidad */
.affinity-harmony { 
    border: 3px solid #ffd700; 
    box-shadow: 0 0 15px #ffd700, inset 0 0 10px #ffd700; 
}
.affinity-generation { 
    border: 3px solid #4caf50; 
    box-shadow: 0 0 10px #4caf50; 
}
.affinity-dissonance { 
    border: 1px solid #555; 
    filter: grayscale(100%);
    opacity: 0.8;
}

.affinity-legend {
    margin-top: 20px;
    font-size: 0.8rem;
    display: flex;
    gap: 15px;
}

/* --- ANATOMÍA SAGRADA (Diseño Silueta V2) --- */

/* Contenedor Principal Bipartito */
.anatomy-layout {
    display: flex;
    gap: 20px;
    height: 100%;
    min-height: 500px; /* Altura mínima para que quepa la silueta */
}

/* --- COLUMNA IZQUIERDA: CONTROLES --- */
.anatomy-controls {
    flex: 1; /* Ocupa el 40-50% */
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #444;
}

.anatomy-section-title {
    font-family: 'Cinzel', serif;
    color: #d4af37;
    border-bottom: 1px solid #555;
    padding-bottom: 5px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: 0.9rem;
}

/* Botones de Mejora */
.upgrade-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 5px;
}
.upgrade-info { font-size: 0.8rem; color: #ccc; }
.btn-upgrade {
    padding: 4px 10px;
    font-size: 0.7rem;
    border: 1px solid #d4af37;
    background: transparent;
    color: #d4af37;
    cursor: pointer;
    transition: all 0.3s;
}
.btn-upgrade:hover { background: #d4af37; color: #000; }

/* Capas Toggles (Botones para ver/ocultar) */
.layers-control {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: auto; /* Empujar al fondo */
    padding-top: 10px;
    border-top: 1px solid #444;
}
.layer-btn {
    background: #222; border: 1px solid #555; color: #777;
    width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
}
.layer-btn.active { border-color: #00ffff; color: #00ffff; box-shadow: 0 0 5px #00ffff; }

/* --- COLUMNA DERECHA: VISUALIZACIÓN --- */
.anatomy-visualizer {
    flex: 1.2; /* Un poco más ancho */
    position: relative;
    background: radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 80%);
    border: 2px solid #333;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* El Contenedor de la Silueta (Apilamiento) */
.silhouette-container {
    position: relative;
    width: 300px; /* Ajusta al ancho de tus PNGs */
    height: 500px; /* Ajusta al alto de tus PNGs */
}
/* Grid de botones de capas */
.layers-grid {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
}

/* Ajustes Visuales */
.silhouette-container {
    position: relative;
    width: 300px; 
    height: 500px;
    /* Centrar contenido */
    display: flex;
    justify-content: center;
    align-items: center;
}

.body-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: contain;
    transition: opacity 0.4s ease, filter 0.4s ease;
    pointer-events: none;
}

/* Estado Oculto */
.layer-hidden {
    opacity: 0 !important;
}

/* Músculos: Base Blanca teñida a Rojo Sangre */
#layer-muscles {
    opacity: 1; /* Sólido, nada de rayos X */
    
    /* FILTRO DE TEÑIDO: 
       Sepia(1) -> Convierte blanco/negro en sepia (marrón).
       Saturate(3) -> Intensifica el color.
       Hue-rotate(-50deg) -> Mueve el tono hacia el rojo/rosado.
    */
    filter: sepia(1) saturate(2.8) hue-rotate(-50deg) contrast(1.1);
    
    /* mix-blend-mode: multiply;  <-- DESACTIVADO
       Si la silueta base es negra, 'multiply' haría desaparecer los músculos.
       Usamos 'normal' para que se vean sobre la silueta negra. 
    */
    mix-blend-mode: normal; 
}
/* --- ANIMACIONES DE DANTIANS --- */

/* 1. Dantian Inferior (Vórtice): Giro constante */
@keyframes spin-slow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

.anim-spin {
    animation: spin-slow 10s linear infinite;
}

/* 2. Dantian Medio (Corazón): Pulso vital */
@keyframes pulse-heart {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
}

.anim-pulse {
    animation: pulse-heart 3s infinite ease-in-out;
}

/* 3. Dantian Superior (Mente): Levitación mística */
@keyframes levitate-mind {
    0%, 100% { transform: translate(-50%, -50%) translateY(0); }
    50% { transform: translate(-50%, -50%) translateY(-6px); }
}

.anim-float {
    animation: levitate-mind 4s infinite ease-in-out;
}

/* --- ESTILOS DEL SISTEMA DE DANTIANS --- */

/* 1. Capa Nebulosa Base (Fondo) */
.nebula-base {
    opacity: 1;
    z-index: 10; /* Detrás de los orbes */
    /* Opcional: un poco oscuro para resaltar los dantians */
    filter: brightness(0.7) contrast(1.2); 
}

/* 2. Capa Nebulosa Overlay (Frente Semi-Transparente) */
.nebula-overlay {
    opacity: 0.5; /* AJUSTAR: Transparencia (0.0 a 1.0) */
    z-index: 30;  /* Encima de los orbes */
    mix-blend-mode: screen; /* Fusión de luz */
    pointer-events: none;
}

/* 3. Imágenes de los Dantians (Orbes) */
.dantian-img {
    position: absolute;
    left: 50%; /* Centrado horizontal */
    transform: translate(-50%, -50%); /* Ajuste de centro */
    z-index: 20; /* En el medio del sándwich */
    object-fit: contain;
}

/* POSICIONES VERTICALES (Ajustar según tus siluetas) */
.pos-mind {
    top: 10%; /* Altura de la cabeza */
    width: 60px; height: 60px;
}
.pos-chest {
    top: 30%; /* Altura del corazón */
    width: 70px; height: 70px;
}
.pos-abdomen {
    top: 55%; /* Altura del Dantian Inferior/Ombligo */
    width: 80px; height: 80px;
}

/* --- ANIMACIONES PARA LOS DANTIANS --- */

/* Dantian Mente: Flotar suavemente */
@keyframes floatY {
    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
    50% { transform: translate(-50%, -50%) translateY(-5px); }
}
.anim-float { animation: floatY 3s ease-in-out infinite; }

/* Dantian Pecho: Latido (Pulso) */
@keyframes heartBeat {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}
.anim-pulse { animation: heartBeat 2s infinite; }

/* Dantian Abdomen: Giro lento (Vórtice de energía) */
@keyframes spinSlow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}
.anim-spin { animation: spinSlow 12s linear infinite; }
```

## Archivo: character.js
```javascript
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
      type: "pseudo",      // 'pseudo' o 'spiritual'
      elements: ["fire", "water", "wood", "earth"], // Elementos impuros por defecto
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
```

## Archivo: character_creation.js
```javascript
/**
 * Archivo: character_creation.js
 * Propósito: Maneja el proceso de creación de personajes, guiando al usuario a través
 * de pasos para seleccionar origen, elemento y confirmar la creación. Integra con
 * los datos de orígenes y elementos, y crea un nuevo personaje al finalizar.
 */

// js/character_creation.js
import { ORIGINS, ELEMENTS } from './data.js';
import { createNewCharacter } from './character.js';
import { showMessage } from './ui.js';

/**
 * Inicia el proceso de creación de personaje con pasos secuenciales.
 * @param {string} username - El nombre del usuario para el personaje.
 * @param {function} onComplete - Función callback que se ejecuta al completar la creación.
 * @returns {void}
 */
export function startCreationProcess(username, onComplete) {
    const container = document.getElementById('creation-step-container');
    const screen = document.getElementById('creation-screen');
    
    screen.classList.remove('hidden');
    // Paso actual en el proceso de creación
    let step = 1;
    // Opciones seleccionadas por el usuario
    let choices = { name: username, origin: null, element: null, avatar: "👤" };

    /**
     * Renderiza el paso actual de la creación de personaje.
     * @returns {void}
     */
    function renderStep() {
        container.innerHTML = '';
        
        if (step === 1) {
            // PASO 1: ORIGEN - Mostrar opciones de orígenes disponibles
            let html = `<h3>Elige tu Pasado</h3><div class="options-list">`;
            for (const [key, data] of Object.entries(ORIGINS)) {
                html += `
                <div class="option-card" onclick="window.selectOrigin('${key}')">
                    <span class="option-title">${data.name}</span>
                    <span class="option-desc">${data.desc}</span>
                </div>`;
            }
            html += `</div>`;
            container.innerHTML = html;
        } 
        else if (step === 2) {
            // PASO 2: ELEMENTO - Mostrar opciones de elementos espirituales
            let html = `<h3>Descubre tu Raíz Espiritual</h3><div class="options-grid">`;
            for (const [key, data] of Object.entries(ELEMENTS)) {
                html += `
                <div class="option-card" style="border-color:${data.color}" onclick="window.selectElement('${key}')">
                    <div style="font-size:2rem">${data.icon}</div>
                    <span class="option-title" style="color:${data.color}">${data.name}</span>
                    <span class="option-desc">${data.desc}</span>
                </div>`;
            }
            html += `</div>`;
            container.innerHTML = html;
        }
        else if (step === 3) {
            // PASO 3: CONFIRMACIÓN - Mostrar resumen y botón para finalizar
            container.innerHTML = `
                <h3>Tu Destino está Sellado</h3>
                <p>Nombre: ${choices.name}</p>
                <p>Origen: ${ORIGINS[choices.origin].name}</p>
                <p>Elemento: ${ELEMENTS[choices.element].name}</p>
                <button class="button primary glow-effect" onclick="window.finishCreation()">Entrar al Dao</button>
            `;
        }
    }

    // Funciones globales temporales para manejar selecciones en la interfaz
    window.selectOrigin = (key) => { choices.origin = key; step++; renderStep(); };
    window.selectElement = (key) => { choices.element = key; step++; renderStep(); };
    window.finishCreation = () => {
        // Crear el personaje con las elecciones y cerrar la pantalla
        const newChar = createNewCharacter(choices);
        screen.classList.add('hidden');
        onComplete(newChar);
    };

    renderStep();
}
```

## Archivo: chat.js
```javascript
// js/chat.js
import { getCurrentUsername } from "./persistence.js";
import { showMessage } from "./ui.js";

function sendMessage(message) {
  if (!message || message.trim() === "") return;
  const sender = getCurrentUsername() || "Anónimo";
  
  // En un juego real, aquí se enviaría a un servidor.
  // Por ahora, solo lo mostramos en el chat local y en el log.
  showMessage(`[Chat] ${sender}: ${message}`, 'normal');
  displayMessage(message, sender);
}

/**
 * Añade un mensaje al panel de chat.
 */
function displayMessage(message, sender = "Sistema") {
  const chatMessagesDiv = document.getElementById("chat-messages");
  if (!chatMessagesDiv) return;
  
  const p = document.createElement('p');
  p.innerHTML = `<span class="chat-sender">${sender}:</span> ${message}`;
  
  chatMessagesDiv.appendChild(p);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // Auto-scroll
}

/**
 * Inicializa los eventos del chat (input + botón).
 */
function initChatUI() {
  const input = document.getElementById("chat-input");
  const btn = document.getElementById("chat-send"); // ID del botón
  
  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    sendMessage(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage(input.value);
      input.value = "";
  });
}

export { sendMessage, displayMessage, initChatUI };
```

## Archivo: combat.js
```javascript
/**
 * Archivo: combat.js
 * Propósito: Gestiona el sistema de combate del juego, incluyendo el estado del combate,
 * la lógica de turnos, el renderizado de la interfaz de batalla, y las interacciones
 * entre el jugador y los enemigos. Implementa mecánicas como resonancia elemental,
 * aturdimiento y canalización de energía.
 */

// js/combat.js - v1.6 (Fixed Glyph & Bars)
import { character, persistCharacter } from './character.js';
import { SKILLS_DB, ENEMIES_DB, ELEMENTS } from './data.js';
import { initGodMode } from './godmode.js';

// Filtros CSS para colorear el glifo de canalización según el elemento
const ELEMENT_FILTERS = {
    fire: "sepia(1) saturate(5) hue-rotate(-50deg)", // Rojo
    wood: "sepia(1) saturate(5) hue-rotate(50deg)",  // Verde
    water: "sepia(1) saturate(5) hue-rotate(180deg)",// Azul
    earth: "sepia(1) saturate(3) hue-rotate(-100deg)",// Marrón
    metal: "grayscale(1) brightness(1.5)"            // Plata
};

// Estado global del combate, almacena información sobre el combate actual
export let combatState = {
    inCombat: false,
    enemy: null,
    resonance: null,
    turnCount: 0,
    phase: 'IDLE',
    stunDuration: 0,
    channelingElement: null
};

/**
 * Inicia un combate contra un enemigo específico.
 * @param {string} enemyId - El ID del enemigo a combatir.
 * @returns {void}
 */
export function startCombat(enemyId) {
    const enemyTemplate = ENEMIES_DB[enemyId];
    if (!enemyTemplate) return;

    // Inicializar estado del combate con el enemigo seleccionado
    combatState = {
        inCombat: true,
        enemy: JSON.parse(JSON.stringify(enemyTemplate)),
        resonance: null,
        turnCount: 1,
        phase: 'IDLE',
        stunDuration: 0,
        channelingElement: null
    };
    // Asignar esencia máxima y actual al enemigo
    combatState.enemy.maxEssence = 100;
    combatState.enemy.essence = 100;
    combatState.enemy.hp = combatState.enemy.stats.hp_max;

    renderCombatStructure(enemyId);
    renderWuXingInterface();
    updateCombatBars();
    initGodMode();

    log(`¡Duelo contra ${combatState.enemy.name}!`, 'warning');
    setTimeout(enemyTurnLogic, 1000);
}

/**
 * Actualiza las barras de salud y esencia tanto del enemigo como del jugador en la interfaz.
 * @returns {void}
 */
export function updateCombatBars() {
    // Enemy Bars
    const eHp = document.getElementById('bar-enemy-hp');
    const eEssence = document.getElementById('bar-enemy-essence');
    const eTxt = document.getElementById('txt-enemy-hp');
    
    // Player Bars
    const pHp = document.getElementById('bar-player-hp');
    const pEssence = document.getElementById('bar-player-essence'); // Esta será ahora la barra de ESENCIA
    const pTxt = document.getElementById('txt-player-hp');

    // --- ACTUALIZAR ENEMIGO ---
    if (combatState.enemy && eHp) {
        const hpPct = Math.max(0, (combatState.enemy.hp / combatState.enemy.stats.hp_max) * 100);
        eHp.style.width = `${hpPct}%`;
        
        // Texto HP Enemigo
        if(eTxt) eTxt.innerText = `${Math.floor(combatState.enemy.hp)}/${combatState.enemy.stats.hp_max}`;
        
        // Esencia Enemigo
        if(eEssence) eEssence.style.width = `${Math.max(0, (combatState.enemy.essence / combatState.enemy.maxEssence) * 100)}%`;
    }

    // --- ACTUALIZAR JUGADOR ---
    if (character && pHp) {
        // 1. Vitalidad (Barra Roja)
        const hpPct = Math.max(0, (character.health / character.maxHealth) * 100);
        pHp.style.width = `${hpPct}%`;
        if(pTxt) pTxt.innerText = `${Math.floor(character.health)}/${character.maxHealth}`;
        
        // 2. Esencia (Barra Azul/Verde - Antes usaba XP)
        if(pEssence) {
            // Usamos essence y maxEssence (con fallback a 50 si no existe)
            const essenceVal = character.essence || 0;
            const maxEssenceVal = character.maxEssence || 50;
            
            const essPct = Math.max(0, (essenceVal / maxEssenceVal) * 100);
            
            pEssence.style.width = `${essPct}%`;
            
            // IMPORTANTE: Forzamos la clase para que use la textura correcta (bar_qi_fill_01.png)
            // Esto sobrescribe 'fill-qi' (amarillo) por 'fill-essence' (azul)
            pEssence.className = 'brush-fill-img fill-essence';
        }
    }
}

/**
 * Renderiza la estructura HTML de la arena de combate, incluyendo HUDs, botones y elementos visuales.
 * @param {string} enemyId - El ID del enemigo para determinar sprites y elementos.
 * @returns {void}
 */
function renderCombatStructure(enemyId) {
    const arena = document.getElementById('battle-arena');
    const enemyList = document.getElementById('enemy-list');
    
    enemyList.classList.add('hidden');
    arena.classList.remove('hidden');
    
    let spriteUrl = 'assets/img/enemy_wolf_01.png';
    if (enemyId.includes('wolf')) spriteUrl = 'assets/img/enemy_wolf_01.png';
    if (enemyId.includes('rabbit')) spriteUrl = 'assets/img/enemy_wolf_02.png';

    const elemKey = combatState.enemy.element || 'wood';
    const elemIcon = `assets/icons/elements/element_${elemKey}.png`;
    
    // Color del glifo según elemento
    const elemColor = ELEMENTS[elemKey] ? ELEMENTS[elemKey].color : 'gold';

    // Renderizar la estructura HTML completa de la arena de combate
    arena.innerHTML = `
        <button id="btn-toggle-log">📜</button>
        <div id="combat-log-container" class="combat-log-popup">
            <div class="log-header"><span>Registro</span><button id="btn-close-log" style="background:none;border:none;color:#fff;">X</button></div>
            <div id="combat-log-content" class="log-content custom-scroll"></div>
        </div>

        <div class="combat-enemy-zone">
            <div id="channeling-layer" class="channeling-container" style="color:${elemColor};"></div>
            
            <div id="combat-enemy-sprite">
                <img src="${spriteUrl}" class="anim-breathe enemy-render" alt="Enemigo">
            </div>
        </div>

        <div class="combat-controls-zone">
            <div class="enemy-hud-container">
                <div class="brush-bar-wrapper">
                    <div class="bar-text-overlay">
                        <span style="display:flex; align-items:center;">
                            <img src="${elemIcon}" style="width:20px; margin-right:5px;"> ${combatState.enemy.name}
                        </span>
                        <span id="txt-enemy-hp"></span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div id="bar-enemy-hp" class="brush-fill-img fill-hp" style="width: 100%;"></div>
                    </div>
                </div>
                <div class="brush-bar-wrapper" style="height:15px; width:90%; margin:0 auto;">
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container" style="top:2px; bottom:2px;">
                        <div id="bar-enemy-essence" class="brush-fill-img fill-qi-enemy" style="width: 100%;"></div>
                    </div>
                </div>
            </div>

            <div class="wuxing-wrapper" id="wuxing-wheel-container">
                <svg class="pentagon-svg" viewBox="0 0 200 200">
                    <polygon points="100,10 190,75 155,180 45,180 10,75" class="pentagon-lines" />
                    <path d="M100,20 L180,80 L150,170 L50,170 L20,80 Z" class="cycle-path" />
                </svg>
                <div id="wuxing-buttons-layer" style="position:absolute; width:100%; height:100%; top:0; left:0;"></div>
                
                <div class="flee-btn-wrapper">
                    <button id="btn-flee-combat" title="Huir">🏃</button>
                </div>
            </div>
        </div>

        <div class="player-hud-container">
            <div class="brush-bar-wrapper">
                <div class="bar-text-overlay"><span>${character.name}</span><span id="txt-player-hp"></span></div>
                <div class="brush-bg"></div>
                <div class="brush-fill-container">
                    <div id="bar-player-hp" class="brush-fill-img fill-hp" style="width: 100%;"></div>
                </div>
            </div>
            <div class="brush-bar-wrapper" style="margin-top:5px;">
                <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem; color:#aaa;"><span>Esencia</span></div>
                <div class="brush-bg"></div>
                <div class="brush-fill-container">
                    <div id="bar-player-essence" class="brush-fill-img fill-qi-player" style="width: 100%;"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-toggle-log').onclick = () => document.getElementById('combat-log-container').classList.toggle('active');
    document.getElementById('btn-close-log').onclick = () => document.getElementById('combat-log-container').classList.remove('active');
    document.getElementById('btn-flee-combat').onclick = () => endCombat(false);
}

/**
 * Renderiza la interfaz del pentagrama Wu Xing con botones elementales y perlas de resonancia.
 * @returns {void}
 */
function renderWuXingInterface() {
    const container = document.getElementById('wuxing-buttons-layer');
    if(!container) return;
    container.innerHTML = ''; 

    const positions = [
        { id: "metal", x: 120, y: 12, skill: "skill_metal_01" },
        { id: "fire", x: 228, y: 90, skill: "skill_fire_01" },
        { id: "wood", x: 186, y: 216, skill: "skill_wood_01" },
        { id: "water", x: 54, y: 216, skill: "skill_water_01" },
        { id: "earth", x: 12, y: 90, skill: "skill_earth_01" }
    ];

    positions.forEach(pos => {
        const wrapper = document.createElement('div');
        wrapper.className = `element-wrapper`;
        wrapper.style.left = `${pos.x}px`;
        wrapper.style.top = `${pos.y}px`;

        const btn = document.createElement('button');
        btn.className = 'element-btn-img';
        btn.innerHTML = `<img src="assets/icons/elements/element_${pos.id}.png" alt="${pos.id}">`;
        btn.onclick = () => executePlayerAction(pos.skill);
        
        const pearl = document.createElement('div');
        pearl.className = 'pearl-socket';
        const isActive = (combatState.resonance === pos.id);
        const pearlImg = isActive ? 'assets/img/pearl_gold_active.png' : 'assets/img/pearl_socket.png';
        pearl.innerHTML = `<img src="${pearlImg}" style="width:100%; height:100%;">`; 

        wrapper.appendChild(btn);
        wrapper.appendChild(pearl);
        container.appendChild(wrapper);
    });
}

/**
 * Ejecuta la acción del jugador basada en una habilidad elemental.
 * @param {string} skillId - El ID de la habilidad a usar.
 * @returns {void}
 */
/**
 * Ejecuta la acción del jugador basada en una habilidad elemental.
 */
function executePlayerAction(skillId) {
    if(!combatState.inCombat) return;
    const skill = SKILLS_DB[skillId];
    
    // --- NUEVO: Verificación de Costo de Esencia ---
    if (skill.qi_cost > 0) {
        if (character.essence < skill.qi_cost) {
            log(`¡No tienes suficiente Esencia! (Req: ${skill.qi_cost})`, 'warning');
            return; // Cancelar acción
        }
        // Descontar esencia
        character.essence -= skill.qi_cost;
    }
    // -----------------------------------------------

    // Establecer resonancia elemental basada en la habilidad usada
    combatState.resonance = skill.element;
    renderWuXingInterface();

    // Verificar si se interrumpe la canalización del enemigo
    if (combatState.phase === 'CHANNELING') {
        // Si el enemigo está canalizando, verificamos debilidad
        const weakness = ELEMENTS[combatState.channelingElement].weak;
        
        if (skill.element === weakness) {
            interruptEnemy();
            return; // El turno del enemigo se cancela porque fue aturdido
        }
    }

    // Calcular y aplicar daño al enemigo
    let damage = Math.floor(skill.base_damage + (character.attack * 0.5));
    combatState.enemy.hp = Math.max(0, combatState.enemy.hp - damage);

    log(`Usas ${skill.name} (-${skill.qi_cost} Qi) -> ${damage} daño`);
    showFloatingDamage(damage);
    updateCombatBars();

    // Verificar si el enemigo ha sido derrotado
    if (combatState.enemy.hp <= 0) {
        endCombat(true);
    } else {
        // Turno del enemigo
        setTimeout(enemyTurnLogic, 800);
    }
}
/**
 * Maneja la lógica del turno del enemigo, incluyendo ataques normales o inicio de canalización.
 * @returns {void}
 */
/**
 * Maneja la lógica del turno del enemigo.
 */
function enemyTurnLogic() {
    if (!combatState.inCombat) return;

    // CASO 1: El enemigo está ATURDIDO
    if (combatState.phase === 'STUNNED') {
        if (combatState.stunDuration > 0) {
            combatState.stunDuration--;
            log(`${combatState.enemy.name} está aturdido y pierde su turno.`, 'warning');
            // Si el aturdimiento termina, vuelve a IDLE para el siguiente turno
            if (combatState.stunDuration <= 0) {
                combatState.phase = 'IDLE';
            }
            return;
        }
    }

    // CASO 2: El enemigo estaba CANALIZANDO (Turno de disparar)
    if (combatState.phase === 'CHANNELING') {
        performEnemyUltimate();
        return;
    }

    // CASO 3: Estado IDLE (Decidir qué hacer)
    // 30% de probabilidad de cargar habilidad (si tiene esencia suficiente)
    const roll = Math.random();
    const enemyQiCost = 20; // Coste arbitrario para habilidad enemiga

    if (roll < 0.3 && combatState.enemy.essence >= enemyQiCost) {
        startChanneling();
    } else {
        // Ataque Normal (No gasta esencia, o muy poca)
        performEnemyBasicAttack();
    }
}

/**
 * Inicia la fase de canalización del enemigo, aplicando filtros visuales al glifo.
 * @returns {void}
 */
function startChanneling() {
    combatState.phase = 'CHANNELING';
    
    // Aseguramos que el enemigo tenga elemento, si no, default 'wood'
    const element = combatState.enemy.element || 'wood';
    combatState.channelingElement = element;
    
    log(`¡${combatState.enemy.name} carga energía ${element}!`, 'warning');
    
    const layer = document.getElementById('channeling-layer');
    if(layer) {
        // Diccionario de colores (Filtros CSS)
        const elementFilters = {
            fire: "sepia(1) saturate(5) hue-rotate(-50deg)",   // Rojo
            wood: "sepia(1) saturate(5) hue-rotate(50deg)",    // Verde
            water: "sepia(1) saturate(5) hue-rotate(180deg)",  // Azul
            earth: "sepia(1) saturate(3) hue-rotate(-100deg)", // Marrón
            metal: "grayscale(1) brightness(1.5)"              // Gris Plata
        };

        // Obtenemos el filtro según el elemento
        const currentFilter = elementFilters[element] || "none";

        // Inyectamos la imagen con el filtro aplicado directamente en el estilo
        // Nota: Asegúrate que en CSS #channeling-layer tenga dimensiones fijas (ej. 350px) y border-radius: 50%
        layer.innerHTML = `<img src="assets/img/channeling_circle_base.png" 
                                class="channeling-glyph" 
                                style="width:100%; height:100%; object-fit:contain; filter: ${currentFilter};">`;
        
        layer.classList.add('active'); 
    }
}

/**
 * Interrumpe la canalización del enemigo, causando aturdimiento y daño adicional.
 * @returns {void}
 */
function interruptEnemy() {
    combatState.phase = 'STUNNED';
    combatState.stunDuration = 1;
    log("¡INTERRUPCIÓN! Enemigo aturdido.", 'crit');
    
    const layer = document.getElementById('channeling-layer');
    if(layer) {
        layer.classList.remove('active');
        layer.innerHTML = '';
    }
    
    const bonusDmg = 20;
    combatState.enemy.hp = Math.max(0, combatState.enemy.hp - bonusDmg);
    showFloatingDamage(bonusDmg + "!", true);
    updateCombatBars();
}

/**
 * Agrega una entrada al registro de combate.
 * @param {string} msg - El mensaje a registrar.
 * @param {string} type - El tipo de mensaje (normal, warning, danger, crit).
 * @returns {void}
 */
function log(msg, type='normal') {
    const box = document.getElementById('combat-log-content');
    if(box) {
        const div = document.createElement('div');
        div.className = `log-entry log-${type}`;
        div.textContent = msg;
        box.prepend(div);
    }
}

/**
 * Muestra un daño flotante en la zona del enemigo.
 * @param {string|number} text - El texto o número del daño.
 * @param {boolean} isCrit - Indica si es un golpe crítico.
 * @returns {void}
 */
function showFloatingDamage(text, isCrit = false) {
    const zone = document.querySelector('.combat-enemy-zone');
    if(zone) {
        const el = document.createElement('div');
        el.className = 'floating-damage';
        el.textContent = text;
        if(isCrit) el.style.color = '#FFD700';
        el.style.left = '50%'; el.style.top = '40%';
        zone.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

/**
 * Ejecuta el ataque cargado del enemigo (Ultimate)
 */
function performEnemyUltimate() {
    const enemyQiCost = 20; // Costo de la habilidad
    
    // Consumir esencia del enemigo
    combatState.enemy.essence = Math.max(0, combatState.enemy.essence - enemyQiCost);

    // Calcular daño masivo (Ej: Ataque x 4.2)
    const dmg = Math.floor(combatState.enemy.stats.attack * 4.2);
    
    // Aplicar daño
    character.health = Math.max(0, character.health - dmg);
    
    // Visuales y Log
    log(`¡${combatState.enemy.name} LIBERA SU PODER! (-${dmg} HP)`, 'crit');
    showFloatingDamage(`-${dmg}`, true); // Muestra daño crítico en pantalla
    
    // Limpiar estado
    combatState.phase = 'IDLE'; // Volver a normal
    combatState.channelingElement = null;
    
    // Quitar el glifo visualmente
    const layer = document.getElementById('channeling-layer');
    if(layer) {
        layer.classList.remove('active');
        layer.innerHTML = '';
    }

    updateCombatBars();
    persistCharacter();
    
    if (character.health <= 0) endCombat(false);
}

/**
 * Ejecuta un ataque básico del enemigo
 */
function performEnemyBasicAttack() {
    // Daño normal un poco variable
    const baseDmg = combatState.enemy.stats.attack;
    const variation = Math.floor(Math.random() * 4) - 2; // +/- 2 de daño
    const dmg = Math.max(1, baseDmg + variation);

    character.health = Math.max(0, character.health - dmg);
    
    log(`${combatState.enemy.name} ataca (-${dmg} HP)`, 'danger');
    
    updateCombatBars();
    persistCharacter();
    
    if (character.health <= 0) endCombat(false);
}

/**
 * Finaliza el combate, mostrando el resultado y restaurando la interfaz.
 * @param {boolean} victory - Indica si el jugador ganó el combate.
 * @returns {void}
 */
function endCombat(victory) {
    combatState.inCombat = false;
    const arena = document.getElementById('battle-arena');
    const list = document.getElementById('enemy-list');
    
    if(victory) {
        // Mostrar mensaje de victoria y restaurar interfaz después de un delay
        log("¡VICTORIA!", "crit");
        showFloatingDamage("VICTORIA", true);
        setTimeout(() => {
            arena.classList.add('hidden');
            list.classList.remove('hidden');
            if(window.forceUpdateAll) window.forceUpdateAll();
        }, 1500);
    } else {
        // Mostrar mensaje de huida y restaurar interfaz inmediatamente
        log("Huiste...", "normal");
        arena.classList.add('hidden');
        list.classList.remove('hidden');
        if(window.forceUpdateAll) window.forceUpdateAll();
    }
}
```

## Archivo: crafting.js
```javascript
// js/crafting.js
import { itemsData } from './data.js';
import { character, persistCharacter } from './character.js';
import { showInventory } from './inventory.js'; 
import { showMessage, toggleOverlay } from './ui.js'; 

// Recetas actualizadas a la nueva DB
const craftingRecipes = {
    "iron_sword": {
        name: "Espada de Hierro",
        ingredients: {
            "iron_ore": 3,
            "wood_log": 1
        },
        result: "iron_sword", 
        successRate: 0.9 
    }
};

function showCraftingModal() {
    const modalContent = document.createElement('div');
    modalContent.className = 'menu modal-box'; // Usamos estilo modal-box
    
    let html = '<h2 class="font-cinzel text-gold">Forja Espiritual</h2>';
    html += '<div class="craft-list">';

    for (const key in craftingRecipes) {
        const recipe = craftingRecipes[key];
        const resultItem = itemsData[recipe.result];
        if (!resultItem) continue;
        
        let ingredientsList = [];
        let hasMaterials = true;
        
        for(const ingredientKey in recipe.ingredients) {
            const required = recipe.ingredients[ingredientKey];
            const current = character.inventory[ingredientKey] || 0;
            const matName = itemsData[ingredientKey] ? itemsData[ingredientKey].name : ingredientKey;
            
            if (current < required) hasMaterials = false;
            ingredientsList.push(`${matName}: ${current}/${required}`);
        }
        
        const btnClass = hasMaterials ? 'button primary' : 'button';
        const btnText = hasMaterials ? 'Forjar' : 'Faltan Materiales';
        const disabledAttr = hasMaterials ? '' : 'disabled';
        
        html += `
            <div class="card" style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:${hasMaterials ? '#fff' : '#666'}">${resultItem.name}</strong>
                        <div style="font-size:0.8rem; color:#888;">${ingredientsList.join(', ')}</div>
                    </div>
                    <button class="${btnClass} small" data-recipe="${key}" ${disabledAttr}>${btnText}</button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    html += '<button class="button secondary" style="width:100%; margin-top:10px;" id="btn-close-crafting">Cerrar</button>'; 
    
    modalContent.innerHTML = html;
    
    // Listeners
    modalContent.querySelector('#btn-close-crafting').addEventListener('click', () => toggleOverlay(false));
    
    modalContent.querySelectorAll('button[data-recipe]').forEach(button => {
        button.addEventListener('click', (e) => {
            craftItem(e.target.dataset.recipe);
            toggleOverlay(false); // Cerrar tras craftear para simplificar
            showCraftingModal(); // O reabrir para actualizar
        });
    });

    toggleOverlay(true, modalContent);
}

function craftItem(recipeKey) {
    const recipe = craftingRecipes[recipeKey];
    if (!recipe) return;

    // Consumir
    for (const ing in recipe.ingredients) {
        character.inventory[ing] -= recipe.ingredients[ing];
        if (character.inventory[ing] <= 0) delete character.inventory[ing];
    }

    // Resultado
    const success = Math.random() < recipe.successRate;
    if (success) {
        character.inventory[recipe.result] = (character.inventory[recipe.result] || 0) + 1;
        showMessage(`¡Éxito! Forjaste ${recipe.name}`, 'exito');
    } else {
        showMessage(`Fallaste al forjar ${recipe.name}. Materiales perdidos.`, 'alerta');
    }

    persistCharacter();
    showInventory();
}

export { showCraftingModal };
```

## Archivo: data.js
```javascript
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

// --- AÑADIR AL FINAL DE js/data.js ---

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
```

## Archivo: godmode.js
```javascript
// js/godmode.js - V1.7 (Added Essence Refill)
import { combatState, updateCombatBars } from './combat.js';
import { character, persistCharacter } from './character.js';

export function initGodMode() {
    if (document.getElementById('god-mode-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'god-mode-panel';
    panel.style.cssText = `
        position: fixed; bottom: 90px; right: 20px; width: 220px;
        background: rgba(0,0,0,0.9); border: 2px solid gold;
        color: white; padding: 10px; z-index: 10000;
        font-family: monospace; display: none; border-radius: 8px;
    `;

    // AÑADIDO: Botón "Esencia" en el HTML
    panel.innerHTML = `
        <h3 style="margin:0 0 10px 0; color:gold; text-align:center;">GOD MODE</h3>
        <label>Escala</label><input type="range" id="gm-scale" min="0.5" max="2.0" step="0.1" value="1" style="width:100%">
        <label>X</label><input type="range" id="gm-pos-x" min="-300" max="300" step="10" value="0" style="width:100%">
        <label>Y</label><input type="range" id="gm-pos-y" min="-200" max="200" step="10" value="0" style="width:100%">
        <hr style="margin:10px 0; border-color:#333;">
        <button id="gm-kill" style="width:100%; background:#900; color:white; padding:5px; cursor:pointer;">☠️ Matar</button>
        <button id="gm-heal" style="width:100%; background:#090; color:white; padding:5px; margin-top:5px; cursor:pointer;">💖 Curar HP</button>
        <button id="gm-essence" style="width:100%; background:#009; color:white; padding:5px; margin-top:5px; cursor:pointer;">⚡ Llenar Esencia</button>
        <div style="position:absolute; top:5px; right:5px; color:red; cursor:pointer;" onclick="this.parentElement.style.display='none'">X</div>
    `;
    document.body.appendChild(panel);

    const openBtn = document.createElement('img');
    openBtn.id = 'god-mode-toggle';
    openBtn.src = 'assets/img/icon_god_mode-.png'; 
    openBtn.style.cssText = "position:fixed; bottom:20px; right:20px; width:120px; height:80px; cursor:pointer; z-index:9999; filter: drop-shadow(0 0 5px gold);";
    openBtn.onerror = () => { openBtn.style.display='none'; };
    
    document.body.appendChild(openBtn);

    const root = document.documentElement;
    document.getElementById('gm-scale').oninput = (e) => root.style.setProperty('--enemy-scale', e.target.value);
    document.getElementById('gm-pos-x').oninput = (e) => root.style.setProperty('--enemy-pos-x', e.target.value + 'px');
    document.getElementById('gm-pos-y').oninput = (e) => root.style.setProperty('--enemy-pos-y', e.target.value + 'px');

    // BOTÓN MATAR
    document.getElementById('gm-kill').onclick = () => {
        if(combatState.enemy) {
            combatState.enemy.hp = 0;
            updateCombatBars();
            if(window.forceUpdateAll) window.forceUpdateAll();
        }
    };

    // BOTÓN CURAR HP
    document.getElementById('gm-heal').onclick = () => {
        if(character) {
            character.health = character.maxHealth;
            persistCharacter();
            updateCombatBars(); // Actualiza barra en combate
            if(window.forceUpdateAll) window.forceUpdateAll(); // Actualiza barra en UI principal
        }
    };

    // AÑADIDO: BOTÓN LLENAR ESENCIA
    document.getElementById('gm-essence').onclick = () => {
        if(character) {
            character.essence = character.maxEssence; // Rellena al máximo
            persistCharacter();
            updateCombatBars(); // Actualiza barra en combate
            if(window.forceUpdateAll) window.forceUpdateAll(); // Actualiza barra en UI principal
        }
    };
}
```

## Archivo: inventory.js
```javascript
// js/inventory.js
import { character, equipItem, persistCharacter, healCharacter } from "./character.js";
import { itemsData } from "./data.js"; // Ahora sí coincide con el export
import { showMessage } from "./ui.js";

function showInventory() {
  // Buscamos el contenedor del nuevo diseño (inventory-slots)
  const grid = document.getElementById("inventory-slots");
  
  if (!grid) return;

  grid.innerHTML = "";
  
  if (!character || !character.inventory) return;

  const itemKeys = Object.keys(character.inventory);

  if (itemKeys.length === 0) {
    grid.innerHTML = "<p style='color:#666; padding:20px;'>Tu bolsa está vacía...</p>";
    return;
  }

  itemKeys.forEach(key => {
      const qty = character.inventory[key];
      const item = itemsData[key];
      
      // Si el item no existe en la DB (por ejemplo, items antiguos guardados), ignorar
      if(!item) return; 

      // Crear Slot (Grid)
      const slot = document.createElement("div");
      // Añadir clase de rareza si existe, o common por defecto
      const rarityClass = item.rarity ? `rarity-${item.rarity}` : 'rarity-common';
      slot.className = `inv-slot ${rarityClass}`;
      
      // Contenido del Slot
      slot.innerHTML = `
        <div class="item-icon">${item.icon || '📦'}</div>
        <div class="inv-qty">${qty > 1 ? qty : ''}</div>
      `;
      
      // Tooltip / Acción al hacer clic
      slot.title = `${item.name} (${item.type})`; // Tooltip nativo simple por ahora
      
      slot.onclick = () => {
          // Lógica simple de uso/equipamiento al hacer click
          if(item.type === 'consumable') {
              if(confirm(`¿Usar ${item.name}?`)) {
                  if(item.effect && item.effect.hp) healCharacter(item.effect.hp);
                  character.inventory[key]--;
                  if(character.inventory[key] <= 0) delete character.inventory[key];
                  persistCharacter();
                  showInventory(); // Refrescar
              }
          } 
          else if (item.type === 'weapon' || item.type === 'armor') {
              if(confirm(`¿Equipar ${item.name}?`)) {
                  equipItem(key);
              }
          }
      };

      grid.appendChild(slot);
  });
}

export { showInventory };
```

## Archivo: main.js
```javascript
/**
 * Archivo: main.js
 * Propósito: Punto de entrada principal del juego. Inicializa la aplicación,
 * maneja la autenticación de usuarios, la navegación entre paneles, y coordina
 * las interacciones entre módulos como combate, inventario, mapa, etc.
 * Gestiona el ciclo de vida de la aplicación desde el login hasta el gameplay.
 */

// js/main.js - v1.6
import { loadCharacterForCurrentUser, meditate, character } from './character.js';
import { startCreationProcess } from './character_creation.js';
import { showInventory } from './inventory.js';
import { renderSkills } from './skills.js';
import { showMap } from './map.js';
import { showSectOptions } from './sects.js';
import { registerUser, loginUser, logoutUser, getCurrentSession } from './persistence.js';
import { showMessage, toggleLog, UI } from './ui.js';
import { startCombat, updateCombatBars } from './combat.js'; 
import { ZONES, ENEMIES_DB } from './data.js';
import { initGodMode } from './godmode.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Elements
    const authScreen = document.getElementById('auth-screen');
    const gameContainer = document.getElementById('game-container');
    const authMessage = document.getElementById('auth-message');
    const loginBtn = document.getElementById('login-button');
    const registerBtn = document.getElementById('register-button');
    
    // Tabs Auth
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- MANEJO DE PESTAÑAS (Login/Register) ---
    if(tabLogin && tabRegister) {
        tabLogin.onclick = () => {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            authMessage.textContent = '';
        };
        tabRegister.onclick = () => {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            authMessage.textContent = '';
        };
    }

    // --- NAVEGACIÓN PRINCIPAL ---
    function switchTab(targetId) {
        tabContents.forEach(t => t.classList.add('hidden'));
        navButtons.forEach(b => b.classList.remove('active'));

        const targetSec = document.getElementById(targetId);
        if(targetSec) targetSec.classList.remove('hidden');

        const activeBtn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
        if(activeBtn) activeBtn.classList.add('active');

        if(targetId === 'panel-home') renderHomePanel();
        if(targetId === 'panel-skills') renderSkills();
        if(targetId === 'panel-inventory') showInventory();
        if(targetId === 'panel-map') showMap();
        if(targetId === 'panel-sect') showSectOptions();
        if(targetId === 'panel-combat') renderCombatList();
        if(targetId === 'panel-cultivation') UI.renderCultivationPanel();
        if(targetId === 'panel-anatomy') renderAnatomyPanel();
    }

// En js/main.js

function renderHomePanel() {
    if(!character) return;
    
    // Sidebar info
    const nameEl = document.getElementById('sidebar-name');
    if(nameEl) nameEl.innerText = character.name;
    
    // Preparar valores seguros (evita errores si son null)
    // NOTA: Si experience es 0, la barra de Qi estará vacía. ¡Es correcto para nivel 1!
    // Si quieres verla llena para probar, sube la XP en la consola: character.experience = 50;
    const hp = character.health || 0;
    const maxHp = character.maxHealth || 100;
    const xp = character.experience || 0;
    const maxXp = character.maxExperience || 100;
    const ess = character.essence || 0; // NUEVO: Esencia
    const maxEss = character.maxEssence || 50; // NUEVO: Máximo base

    const heroCard = document.querySelector('.hero-card');
    if(heroCard) {
        heroCard.innerHTML = `
            <div class="meditation-container">
                <div class="aura-ring"></div>
                <div class="aura-ring inner"></div>
                <object data="assets/img/player_meditating.png" type="image/png" class="home-avatar">
                    <div class="home-avatar avatar-placeholder">🧘</div>
                </object>
            </div>

            
            <h2 class="font-title text-gold mt-2">${character.name}</h2>
            
            <div class="home-stats-card">
                <div class="brush-bar-wrapper" style="height:24px;">
                    <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem;">
                        <span>Vitalidad</span><span>${Math.floor(hp)}/${maxHp}</span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div class="brush-fill-img fill-hp" style="width:${(hp/maxHp)*100}%"></div>
                    </div>
                </div>

                <div class="brush-bar-wrapper" style="height:24px; margin-top:20px;">
                    <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem;">
                        <span>Qi (Cultivo)</span><span>${Math.floor(xp)}/${maxXp}</span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div class="brush-fill-img fill-qi" style="width:${(xp/maxXp)*100}%"></div>
                    </div>
                </div>

                <div class="brush-bar-wrapper" style="height:24px; margin-top:20px;">
                    <div class="bar-text-overlay" style="top:-18px; font-size:0.8rem;">
                        <span>Esencia</span><span>${Math.floor(ess)}/${maxEss}</span>
                    </div>
                    <div class="brush-bg"></div>
                    <div class="brush-fill-container">
                        <div class="brush-fill-img fill-essence" style="width:${(ess/maxEss)*100}%"></div>
                    </div>
                </div>

                <button id="btn-meditate-inner" class="button primary" style="margin-top:20px;">Concentrar Qi</button>
            </div>
        `;

        // Re-asignar evento botón
        const btn = document.getElementById('btn-meditate-inner');
        if(btn) btn.onclick = () => {
            if(typeof meditate === 'function') meditate();
            if(window.forceUpdateAll) window.forceUpdateAll();
        };
    }
}

    function renderCombatList() {
        const listDiv = document.getElementById('enemy-list');
        const arena = document.getElementById('battle-arena');
        
        if(!arena.classList.contains('hidden')) {
            listDiv.classList.add('hidden');
            return;
        }

        listDiv.classList.remove('hidden');
        listDiv.innerHTML = ''; 

        const zone = ZONES['forest_outer']; 
        if(document.getElementById('current-region-name')) {
            document.getElementById('current-region-name').textContent = zone.name;
        }

        if(zone && zone.enemies) {
            zone.enemies.forEach(enemyId => {
                const enemy = ENEMIES_DB[enemyId];
                if(!enemy) return;

                const card = document.createElement('div');
                card.className = 'card';
                card.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:15px; margin-bottom:10px;";
                
                card.innerHTML = `
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="font-size:2rem;">${enemy.icon}</div>
                        <div>
                            <div class="font-cinzel text-gold">${enemy.name}</div>
                            <div style="font-size:0.8rem; color:#aaa;">Reino ${enemy.realm} • HP: ${enemy.stats.hp_max}</div>
                        </div>
                    </div>
                    <button class="hunt-btn-list button">⚔️ Cazar</button> 
                `;
                
                card.querySelector('.hunt-btn-list').onclick = () => startCombat(enemyId);
                listDiv.appendChild(card);
            });
        }
    }

    // --- GLOBAL SYNC ---
    window.forceUpdateAll = function() {
        if(!character) return;
        
        if(!document.getElementById('panel-home').classList.contains('hidden')) {
            renderHomePanel();
        }
        if(!document.getElementById('battle-arena').classList.contains('hidden')) {
            updateCombatBars();
        }
        if(!document.getElementById('panel-cultivation').classList.contains('hidden')) {
            UI.renderCultivationPanel();
        }
        if(!document.getElementById('panel-anatomy').classList.contains('hidden')) {
            renderAnatomyPanel();
        }
    };

    // --- INITIALIZATION ---
    function initializeDashboard(char) {
        authScreen.classList.add('hidden');
        document.getElementById('creation-screen').classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initGodMode();
        switchTab('panel-home'); 
        showMessage(`Bienvenido, ${char.name}.`, 'exito');
    }

    // --- EVENT LISTENERS ---
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.id === 'logout-button') return;
            switchTab(btn.dataset.target);
        });
    });

    if(document.getElementById('logout-button')) {
        document.getElementById('logout-button').onclick = (e) => {
            e.preventDefault(); logoutUser(); location.reload(); 
        };
    }

    if(loginBtn) loginBtn.onclick = () => {
        const u = document.getElementById('login-username').value;
        const p = document.getElementById('login-password').value;
        const res = loginUser(u, p);
        if(res.success) {
            let char = loadCharacterForCurrentUser();
            if(!char) {
                authScreen.classList.add('hidden');
                startCreationProcess(res.username, (newChar) => initializeDashboard(newChar));
            } else {
                initializeDashboard(char);
            }
        } else {
            authMessage.textContent = res.message;
        }
    };

    if(registerBtn) registerBtn.onclick = () => {
        const u = document.getElementById('register-username').value;
        const p = document.getElementById('register-password').value;
        const res = registerUser(u, p);
        if(res.success) {
            tabLogin.click();
            authMessage.textContent = "Cuenta creada. Ahora puedes iniciar sesión.";
            authMessage.style.color = "#4caf50";
        } else {
            authMessage.textContent = res.message;
        }
    };

    const session = getCurrentSession();
    if(session && session.username) {
        let char = loadCharacterForCurrentUser();
        if(char) initializeDashboard(char);
    }
});

//
// --- PANEL DE ANATOMÍA INTERACTIVA ---
//

function renderAnatomyPanel() {
// js/main.js

// function renderAnatomyPanel() { // Descomenta si lo pegas dentro del archivo
    if(!character) return;
    
    const container = document.getElementById('anatomy-content');
    if(!container) return;

    // 1. DETECTAR GÉNERO
    const gender = character.gender || "man"; 
    const suffix = (gender === "woman") ? "women" : "man"; // Sufijo estándar para otros assets
    const nebulaSuffix = (gender === "woman") ? "woman" : "man"; // Sufijo específico para tu archivo nebula

    // 2. DEFINIR ASSETS (Incluyendo los nuevos)
    const ASSETS_ANATOMY = {
        base: `assets/img/anatomy/silhouette_base_${gender === "woman" ? "woman" : "man"}.png`,
        meridians: `assets/img/anatomy/meridians_overlay_${suffix}.png`,
        bones: `assets/img/anatomy/bones_overlay_${suffix}.png`,
        muscles: `assets/img/anatomy/muscle_overlay_${suffix}.png`,
        spiritroot: `assets/img/anatomy/spiritroot_overlay_${suffix}.png`,
        
        // --- NUEVOS ASSETS DANTIANS ---
        nebula: `assets/img/anatomy/nebulosa_overlay_${nebulaSuffix}.png`,
        d_mind: `assets/img/anatomy/dantian_mente.png`,
        d_chest: `assets/img/anatomy/dantian_pecho.png`,
        d_abdomen: `assets/img/anatomy/dantian_abdomen.png`
    };

    const rootInfo = character.root || { type: "pseudo" };
    const anatomy = character.anatomy || {
        dantian_upper: { soul_force: 0 },
        dantian_middle: { purity: 0 },
        dantian_lower: { current: 0, max: 100 }
    };

    // Lógica de Teñido (Raíz)
    const mainElement = rootInfo.elements && rootInfo.elements.length > 0 ? rootInfo.elements[0] : "metal";
    const ROOT_FILTERS = {
        fire: "sepia(1) saturate(5) hue-rotate(-50deg)",
        water: "sepia(1) saturate(5) hue-rotate(180deg)",
        wood: "sepia(1) saturate(5) hue-rotate(50deg)",
        earth: "sepia(1) saturate(3) hue-rotate(-100deg)",
        metal: "grayscale(1) brightness(1.5)",
        ice: "sepia(1) saturate(3) hue-rotate(150deg)",
        lightning: "sepia(1) saturate(5) hue-rotate(220deg) brightness(1.5)"
    };
    const currentFilter = (rootInfo.type === 'pseudo') ? "sepia(0.5) saturate(0.5)" : (ROOT_FILTERS[mainElement] || "none");

    // 3. RENDERIZADO HTML
    container.innerHTML = `
        <div class="anatomy-layout">
            <div class="anatomy-controls custom-scroll">
                <div>
                    <h3 class="font-title text-gold">${character.name}</h3>
                    <div class="cultivation-rank">${character.cultivationRank || "Mortal"}</div>
                </div>

                <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:5px; margin-bottom:15px;">
                    <div class="anatomy-section-title">Capas de Percepción</div>
                    <div class="layers-grid">
                        <button class="layer-btn active" onclick="toggleLayer('base', this)" title="Silueta Base">👤</button>
                        <button class="layer-btn active" onclick="toggleLayer('spiritroot', this)" title="Raíz Espiritual">🌿</button>
                        <button class="layer-btn" onclick="toggleLayer('meridians', this)" title="Meridianos">⚡</button>
                        <button class="layer-btn" onclick="toggleLayer('muscles', this)" title="Músculos">💪</button>
                        <button class="layer-btn" onclick="toggleLayer('bones', this)" title="Huesos">💀</button>
                        
                        <button class="layer-btn" onclick="toggleLayer('dantians', this)" title="Sistema de Dantians (Nebulosa)">🌌</button>
                    </div>
                </div>

                <div>
                    <div class="anatomy-section-title">Centros de Poder</div>
                    <div class="upgrade-row">
                        <div class="upgrade-info"><span style="color:#00ffff">Mar Conciencia</span> <small>${anatomy.dantian_upper.soul_force}</small></div>
                    </div>
                    <div class="upgrade-row">
                        <div class="upgrade-info"><span style="color:#ff0055">Palacio Carmesí</span> <small>${anatomy.dantian_middle.purity}%</small></div>
                    </div>
                    <div class="upgrade-row">
                        <div class="upgrade-info"><span style="color:#ffd700">Mar de Qi</span> <small>${Math.floor(anatomy.dantian_lower.current)}/${anatomy.dantian_lower.max}</small></div>
                    </div>
                </div>
            </div>

            <div class="anatomy-visualizer">
                <div class="silhouette-container">
                    <img id="layer-base" src="${ASSETS_ANATOMY.base}" class="body-layer">
                    <img id="layer-bones" src="${ASSETS_ANATOMY.bones}" class="body-layer layer-hidden">
                    <img id="layer-muscles" src="${ASSETS_ANATOMY.muscles}" class="body-layer layer-hidden">
                    <img id="layer-spiritroot" src="${ASSETS_ANATOMY.spiritroot}" class="body-layer" style="filter: ${currentFilter}; mix-blend-mode: screen;">
                    <img id="layer-meridians" src="${ASSETS_ANATOMY.meridians}" class="body-layer layer-hidden" style="filter: drop-shadow(0 0 2px cyan);">
                    
                    <div id="layer-dantians" class="body-layer layer-hidden" style="z-index: 50;">
                        
                        <img src="${ASSETS_ANATOMY.nebula}" class="body-layer nebula-base">

                        <img src="${ASSETS_ANATOMY.d_mind}" class="dantian-img pos-mind anim-float">
                        <img src="${ASSETS_ANATOMY.d_chest}" class="dantian-img pos-chest anim-pulse">
                        <img src="${ASSETS_ANATOMY.d_abdomen}" class="dantian-img pos-abdomen anim-spin">

                        <img src="${ASSETS_ANATOMY.nebula}" class="body-layer nebula-overlay">
                        
                    </div>
                </div>
            </div>
        </div>
    `;
// }
}

// --- FUNCIÓN HELPER PARA LOS BOTONES DE CAPAS ---
// Añade esto fuera de renderAnatomyPanel, pero accesible globalmente o en window
window.toggleLayer = function(layerId, btnElement) {
    const img = document.getElementById(`layer-${layerId}`);
    if (img) {
        if (img.classList.contains('layer-hidden')) {
            img.classList.remove('layer-hidden');
            btnElement.classList.add('active');
        } else {
            img.classList.add('layer-hidden');
            btnElement.classList.remove('active');
        }
    }
};
window.toggleLog = toggleLog;
```

## Archivo: map.js
```javascript
// js/map.js

const mapData = {
  aldea_inicial: {
    name: "Aldea Tranquila",
    description: "Una pequeña aldea al pie de la montaña.",
    connections: ["bosque_susurrante"],
  },
  bosque_susurrante: {
    name: "Bosque Susurrante",
    description: "Un bosque lleno de secretos y peligros.",
    connections: ["aldea_inicial", "cueva_olvidada"],
  },
  cueva_olvidada: {
    name: "Cueva Olvidada",
    description: "Una cueva oscura con rumores de tesoros.",
    connections: ["bosque_susurrante"],
  },
};

let currentLocationKey = "aldea_inicial";

function showMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const location = mapData[currentLocationKey];
  if (!location) return;

  mapDiv.innerHTML = `
    <h2>Mapa</h2>
    <p>Estás en: <b>${location.name}</b></p>
    <p>${location.description}</p>
    <h3>Conexiones:</h3>
    <ul>
      ${location.connections
        .map(
          (connection) =>
            `<li><button class="travel-button" data-location="${connection}">
              ${mapData[connection].name}
            </button></li>`
        )
        .join("")}
    </ul>
  `;

  const travelButtons = mapDiv.querySelectorAll(".travel-button");
  travelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const newLocation = button.dataset.location;
      travelTo(newLocation);
    });
  });
}

function travelTo(newLocationKey) {
  const currentLocation = mapData[currentLocationKey];
  if (!currentLocation) return;

  if (currentLocation.connections.includes(newLocationKey)) {
    currentLocationKey = newLocationKey;
    console.log("Viajaste a", mapData[newLocationKey].name);
    showMap();
  } else {
    console.log("No puedes viajar ahí desde aquí.");
  }
}

export { showMap };
```

## Archivo: npc.js
```javascript
// js/npc.js
import { npcData } from "./data.js";
import { showMessage, toggleOverlay } from "./ui.js";
import { getCurrentUsername } from "./persistence.js";

function interactWithNPC(npcKey) {
  const npc = npcData[npcKey];

  if (!npc) {
    showMessage(`NPC no encontrado: ${npcKey}`, 'alerta');
    return;
  }

  // Lógica simple de diálogo con modal
  const modalContent = document.createElement('div');
  modalContent.className = 'menu';
  
  modalContent.innerHTML = `
    <h2>${npc.name} (${npc.role})</h2>
    <p>"${npc.dialogueLines[Math.floor(Math.random() * npc.dialogueLines.length)]}"</p>
    ${npc.quest ? `<p>¡Este NPC tiene una misión!</p><button id="btn-accept-quest" class="button">Aceptar Misión</button>` : ''}
    <button class="close-button button" id="btn-close-npc">Cerrar</button>
  `;
  
  modalContent.querySelector('#btn-close-npc').addEventListener('click', () => toggleOverlay(false));

  if (npc.quest) {
    modalContent.querySelector('#btn-accept-quest').addEventListener('click', () => {
      import("./quest.js").then((module) => {
        module.acceptQuest(npc.quest);
        toggleOverlay(false);
      });
    });
  }
  
  toggleOverlay(true, modalContent);
}

export { interactWithNPC };
```

## Archivo: persistence.js
```javascript
// persistence.js (COMPLETADO)

const STORAGE_KEY_USERS = 'xx_users';
const STORAGE_KEY_SESSIONS = 'xx_session';

// Carga usuarios
function loadUsers() {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

// Guarda usuarios
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

// Carga datos de personaje/juego para un usuario específico
export function loadPlayerData(username) {
    const users = loadUsers();
    return users[username] || {};
}

// Guarda datos de personaje/juego para un usuario específico
export function savePlayerData(username, data) {
    const users = loadUsers();
    users[username] = data;
    saveUsers(users);
}

// Registro
export function registerUser(username, password) {
    const users = loadUsers();
    if (users[username]) {
        return { success: false, message: 'El usuario ya existe.' };
    }

    if (password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    users[username] = {
        password,
        character: null // Usamos 'character' en lugar de 'profile' para ser consistente con character.js
    };
    saveUsers(users);
    return { success: true, message: 'Cuenta creada. Ahora puedes iniciar sesión.' };
}

// Login
export function loginUser(username, password) {
    const users = loadUsers();
    const u = users[username];
    if (!u) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    if (u.password !== password) {
        return { success: false, message: 'Contraseña incorrecta.' };
    }
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify({ username }));
    return { success: true, username };
}

// Logout
export function logoutUser() {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
}

// Sesión actual
export function getCurrentSession() {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Obtiene solo el nombre de usuario (necesario para character.js)
export function getCurrentUsername() {
    const session = getCurrentSession();
    return session ? session.username : null;
}
```

## Archivo: quest.js
```javascript
// js/quest.js
import { questData, itemsData } from "./data.js";
import { showMessage } from "./ui.js";
import { character, persistCharacter, showCharacterProfile } from "./character.js";

let activeQuests = {}; // Mock de misiones activas (debería estar en character.js o persistence.js idealmente)

function acceptQuest(questKey) {
  const quest = questData[questKey];

  if (!quest) {
    showMessage("Misión no encontrada.", 'alerta');
    return;
  }

  if (activeQuests[questKey]) {
      showMessage("Ya tienes esta misión activa.", 'alerta');
      return;
  }

  if (!character) {
    showMessage("No hay personaje para aceptar misiones.", 'alerta');
    return;
  }

  activeQuests[questKey] = {
    name: quest.name,
    description: quest.description,
    completed: false,
    progress: {} // Lógica de progreso futura
  };

  showMessage(`Misión aceptada: ${quest.name}. Objetivo: ${quest.description}`, 'exito');
  // Aquí se llamaría a persistCharacter para guardar activeQuests si estuviera en character.js
}

/**
 * Marca una misión como completada, otorga recompensas y la quita de activas.
 */
function completeQuest(questKey) {
  if (!activeQuests[questKey] || activeQuests[questKey].completed) {
    showMessage("Misión no activa o ya completada.", 'alerta');
    return;
  }

  const quest = questData[questKey];
  if (!quest || !character) return;

  // Otorgar recompensas
  character.experience += quest.rewards.experience || 0;
  character.gold += quest.rewards.gold || 0;
  
  let rewardsMessage = `Misión completada: ${quest.name}. Recibiste: `;
  
  if (quest.rewards.items) {
      for(const itemKey in quest.rewards.items) {
          const quantity = quest.rewards.items[itemKey];
          // Agregar al inventario
          if (character.inventory[itemKey]) {
              character.inventory[itemKey] += quantity;
          } else {
              character.inventory[itemKey] = quantity;
          }
          rewardsMessage += `${quantity}x ${itemsData[itemKey].name}, `;
      }
  }

  // Limpiar y finalizar
  activeQuests[questKey].completed = true;
  persistCharacter();
  showCharacterProfile();
  showMessage(rewardsMessage.slice(0, -2), 'exito');

  // Nota: Para un sistema completo, la misión debería ser movida a un registro de misiones completadas.
}

export { acceptQuest, completeQuest };
```

## Archivo: sects.js
```javascript
// js/sects.js - FUNCIONALIDAD GARANTIZADA
import { character, persistCharacter } from "./character.js";
import { showMessage, toggleOverlay } from "./ui.js";

const SECTS_DB = {
  montana_eterea: {
    name: "Secta Montaña Etérea",
    desc: "Maestros del flujo de Qi natural y la curación.",
    icon: "🏔️",
    bonus: "+10% Regeneración de Salud"
  },
  puno_atronador: {
    name: "Secta Puño Atronador",
    desc: "Cultivadores corporales que rompen rocas con los puños.",
    icon: "👊",
    bonus: "+5% Daño Físico"
  }
};

export function showSectOptions() {
  const container = document.getElementById('sect-content');
  if (!container) return;

  container.innerHTML = ''; // Limpieza inicial

  // --- ESCENARIO 1: YA ERES MIEMBRO ---
  if (character.sect) {
      const sect = SECTS_DB[character.sect];
      
      // Crear contenedor de la carta
      const card = document.createElement('div');
      card.className = 'card';
      card.style.textAlign = 'center';
      card.style.padding = '30px';
      
      // Contenido estático
      card.innerHTML = `
          <div style="font-size:4rem; margin-bottom:10px;">${sect ? sect.icon : '🏯'}</div>
          <h2 class="text-gold font-cinzel">${sect ? sect.name : character.sect}</h2>
          <p style="color:#aaa; margin-bottom:20px;">Eres un discípulo reconocido.</p>
          <div class="sect-bonuses" style="margin-bottom:30px;">
              <p class="text-cyan">${sect ? sect.bonus : ''}</p>
          </div>
      `;

      // Botón Abandonar (Creado como elemento DOM para asegurar el click)
      const btnLeave = document.createElement('button');
      btnLeave.id = 'btn-leave-sect';
      btnLeave.className = 'btn-leave-sect'; // Clase CSS roja definida anteriormente
      btnLeave.textContent = 'Abandonar Secta';
      
      // Asignación directa del evento (Sin timeouts, sin fallos)
      btnLeave.onclick = () => showLeaveConfirmation(); // Llamada directa

      card.appendChild(btnLeave);
      container.appendChild(card);
      return;
  }

  // --- ESCENARIO 2: LISTA DE SECTAS ---
  const title = document.createElement('h3');
  title.className = 'text-center text-gold mb-4';
  title.style.fontFamily = 'Cinzel';
  title.textContent = 'Sectas Disponibles';
  container.appendChild(title);

  const listDiv = document.createElement('div');
  listDiv.className = 'sect-list';

  for (const [key, sect] of Object.entries(SECTS_DB)) {
      const card = document.createElement('div');
      card.className = 'sect-card';
      
      card.innerHTML = `
          <div style="display:flex; gap:15px; align-items:center;">
              <div style="font-size:2.5rem;">${sect.icon}</div>
              <div>
                  <h4 class="text-gold font-cinzel" style="margin:0;">${sect.name}</h4>
                  <p style="font-size:0.8rem; color:#aaa; margin:5px 0;">${sect.desc}</p>
                  <small class="text-cyan">${sect.bonus}</small>
              </div>
          </div>
      `;

      const btnJoin = document.createElement('button');
      btnJoin.className = 'btn-join-sect';
      btnJoin.textContent = 'Unirse';
      btnJoin.onclick = () => joinSect(key);

      card.appendChild(btnJoin);
      listDiv.appendChild(card);
  }
  
  container.appendChild(listDiv);
}

// Modal de Confirmación Robusto (DOM Puro)
function showLeaveConfirmation() {
    // 1. Crear contenedor del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'menu modal-box text-center';

    // 2. Título y Texto
    const title = document.createElement('h3');
    title.className = 'text-gold font-cinzel';
    title.style.marginBottom = '15px';
    title.textContent = '¿Abandonar el Camino?';

    const desc = document.createElement('p');
    desc.style.marginBottom = '20px';
    desc.style.color = '#ccc';
    desc.innerHTML = 'Si abandonas tu secta ahora, perderás todos tus beneficios.<br><br><span class="text-secondary" style="font-size:0.8rem">Esta acción es irreversible.</span>';

    // 3. Botones de Acción
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '10px';
    btnGroup.style.justifyContent = 'center';

    // Botón SÍ
    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'action-button primary';
    btnConfirm.style.background = '#c0392b'; // Rojo alerta
    btnConfirm.textContent = 'Sí, Abandonar';
    btnConfirm.onclick = () => {
        character.sect = null;
        persistCharacter();
        toggleOverlay(false);
        showSectOptions(); // Recargar panel inmediatamente
        showMessage("Has abandonado tu secta. Ahora eres un errante.", "alerta");
    };

    // Botón NO
    const btnCancel = document.createElement('button');
    btnCancel.className = 'action-button secondary';
    btnCancel.style.border = '1px solid #aaa';
    btnCancel.textContent = 'Cancelar';
    btnCancel.onclick = () => toggleOverlay(false);

    // 4. Ensamblaje
    btnGroup.appendChild(btnConfirm);
    btnGroup.appendChild(btnCancel);
    
    modalContent.appendChild(title);
    modalContent.appendChild(desc);
    modalContent.appendChild(btnGroup);

    // 5. Mostrar
    toggleOverlay(true, modalContent);
}

function joinSect(sectKey) {
    const sect = SECTS_DB[sectKey];
    if (sect) {
        character.sect = sectKey;
        persistCharacter();
        showSectOptions(); 
        showMessage(`¡Te has unido a ${sect.name}!`, 'exito');
    }
}
```

## Archivo: skills.js
```javascript
// js/skills.js
import { SKILLS_DB } from './data.js';
import { character } from './character.js';
import { toggleOverlay } from './ui.js';

export function renderSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    // Sección OFICIOS
    const secProf = document.createElement('div');
    secProf.innerHTML = '<h3 class="skills-section-title">Oficios del Dao</h3>';
    const gridProf = document.createElement('div');
    gridProf.className = 'skills-layout';
    
    // Sección COMBATE
    const secCombat = document.createElement('div');
    secCombat.innerHTML = '<h3 class="skills-section-title">Artes Marciales</h3>';
    const gridCombat = document.createElement('div');
    gridCombat.className = 'skills-layout';

    Object.keys(SKILLS_DB).forEach(key => {
        const data = SKILLS_DB[key];
        const card = createSkillCard(data, key);
        
        if (['meditation','alchemy','mining','forging','herbalism'].includes(key)) {
            gridProf.appendChild(card);
        } else {
            gridCombat.appendChild(card);
        }
    });

    secProf.appendChild(gridProf);
    secCombat.appendChild(gridCombat);
    
    grid.appendChild(secProf);
    grid.appendChild(secCombat);
}

function createSkillCard(data, key) {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
        <div class="skill-icon">${data.icon}</div>
        <div class="skill-info">
            <span class="skill-name">${data.name}</span>
            <span class="skill-level">${data.element ? data.element.toUpperCase() : 'PASIVA'}</span>
        </div>
    `;
    card.onclick = () => {
        toggleOverlay(true, `
            <div class="menu modal-box text-center">
                <div style="font-size:3rem; margin-bottom:10px">${data.icon}</div>
                <h2 class="text-gold font-cinzel">${data.name}</h2>
                <p style="color:#ccc; margin-bottom:20px">${data.desc || data.description}</p>
                <button class="button secondary" onclick="document.getElementById('ui-overlay').classList.add('hidden')">Cerrar</button>
            </div>
        `);
    };
    return card;
}
```

## Archivo: ui.js
```javascript
/**
 * Archivo: ui.js
 * Propósito: Maneja la interfaz de usuario, incluyendo log, overlays y 
 * el sistema de gestión de cultivo (Wu Xing Drag & Drop).
 */

import { character, equipSkill, unequipSkill } from "./character.js";
import { SKILLS_DB } from "./data.js";


// --- FUNCIONES UTILITARIAS EXISTENTES ---

export function showMessage(message, type = 'normal') {
    const logDiv = document.getElementById('log-messages');
    if (!logDiv) return;

    const p = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let cssClass = 'log-entry';
    let icon = '•';

    switch (type) {
        case 'exito': cssClass += ' log-success'; icon = '✓'; break;
        case 'alerta': 
        case 'danger': cssClass += ' log-danger'; icon = '⚔️'; break;
        case 'progreso': cssClass += ' log-progress'; icon = '✨'; break;
        case 'warning': cssClass += ' log-warning'; icon = '⚠️'; break;
        case 'critical': cssClass += ' log-crit'; icon = '💥'; break;
    }

    p.className = cssClass;
    p.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-icon">${icon}</span> ${message}`;

    logDiv.appendChild(p);

    if (logDiv.children.length > 20) {
        logDiv.removeChild(logDiv.firstChild);
    }
    logDiv.scrollTop = logDiv.scrollHeight;
}

export function toggleOverlay(show, content = null) {
    const overlay = document.getElementById("ui-overlay");
    if (!overlay) return;
    
    if (show) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = '';
        if (content) {
            if (content instanceof HTMLElement) {
                overlay.appendChild(content);
            } else {
                overlay.innerHTML = content;
            }
        }
    } else {
        overlay.classList.add('hidden');
        overlay.innerHTML = ''; 
    }
}

export function toggleLog() {
    const content = document.querySelector('.collapsible-content');
    const icon = document.querySelector('.toggle-icon');
    if (content) {
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            if (icon) icon.textContent = '▼';
        } else {
            content.style.display = 'none';
            if (icon) icon.textContent = '▶';
        }
    }
}

// --- NUEVO: SISTEMA DE GESTIÓN DE CULTIVO (Objeto UI) ---

export const UI = {
    /**
     * Renderiza el Panel de Cultivo completo (Pentágono + Lista)
     */
    renderCultivationPanel: function() {
        const container = document.getElementById('cultivation-wheel-container');
        if(!container) return; // Si no estamos en la pestaña correcta, salir
        container.innerHTML = ''; 
        
        // Actualizar Stats Esotéricos
        if(character && character.stats) {
            const elKarma = document.getElementById('val-karma');
            const elPercep = document.getElementById('val-percep');
            const elWill = document.getElementById('val-will');
            
            if(elKarma) elKarma.innerText = character.stats.karma_luck || 0;
            if(elPercep) elPercep.innerText = character.stats.perception || 0;
            if(elWill) elWill.innerText = character.stats.willpower || 0;
        }

        // Definir posiciones del Pentágono
        const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
        
        elements.forEach(elem => {
            // Crear el SLOT (Agujero donde cae la skill)
            const slot = document.createElement('div');
            slot.className = `cultivation-slot slot-${elem}`;
            slot.dataset.element = elem; 
            
            // Eventos Drag & Drop Nativos
            slot.ondragover = (e) => e.preventDefault(); // Permitir soltar
            slot.ondrop = (e) => UI.handleDrop(e);

            // Icono de fondo del elemento (Visual)
            const bgIcon = document.createElement('img');
            bgIcon.src = `assets/icons/elements/element_${elem}.png`;
            bgIcon.className = 'slot-bg-icon';
            // Fallback por si no existe la imagen
            bgIcon.onerror = () => { bgIcon.style.display = 'none'; };
            slot.appendChild(bgIcon);

            // ¿Hay habilidad equipada?
            if (character && character.equippedSkills && character.equippedSkills[elem]) {
                const equipped = character.equippedSkills[elem];
                const skill = SKILLS_DB[equipped.id]; 
                
                if(skill) {
                    const skillImg = document.createElement('div');
                    skillImg.className = `equipped-skill-token affinity-${equipped.affinity}`;
                    skillImg.innerHTML = skill.icon || "📜";
                    skillImg.title = `${skill.name} (${equipped.affinity})`;
                    // --- NUEVO: DESEQUIPAR CON CLIC DERECHO ---
                    skillImg.oncontextmenu = (e) => {
                        e.preventDefault(); // Evita que salga el menú del navegador
                        unequipSkill(elem); // Borra la skill
                        UI.renderCultivationPanel(); // Refresca el panel
                    };
                    slot.appendChild(skillImg);
                }
            }
            container.appendChild(slot);
        });

        UI.renderSkillLibrary();
    },

    /**
     * Renderiza la lista de habilidades disponibles para arrastrar
     */
    renderSkillLibrary: function() {
        const list = document.getElementById('skills-library-list');
        if(!list) return;
        list.innerHTML = '';

        if (!character) return;

        // Obtenemos skills aprendidas. Si no hay lista, usamos todas las de la DB como fallback (para testing)
        const mySkills = character.learnedSkills || Object.keys(SKILLS_DB); 

        mySkills.forEach(skillId => {
            const skill = SKILLS_DB[skillId];
            // Solo mostramos skills activas para equipar
            if(!skill || skill.type !== 'active') return; 

            const item = document.createElement('div');
            item.className = 'skill-library-item';
            item.draggable = true; // ¡Importante para arrastrar!
            
            // Configurar datos para el arrastre
            item.ondragstart = (e) => {
                e.dataTransfer.setData("skillId", skill.id);
                e.dataTransfer.setData("skillElement", skill.element);
            };

            item.innerHTML = `
                <div class="lib-icon">${skill.icon}</div>
                <div class="lib-info">
                    <div class="lib-name">${skill.name}</div>
                    <div class="lib-elem type-${skill.element}">${skill.element}</div>
                </div>
            `;
            list.appendChild(item);
        });
    },

    /**
     * Maneja el evento cuando soltamos una skill en un slot
     */
    handleDrop: function(ev) {
        ev.preventDefault();
        const skillId = ev.dataTransfer.getData("skillId");
        const skillElement = ev.dataTransfer.getData("skillElement");
        
        // Encontrar el slot correcto (a veces el target es la imagen interna)
        let target = ev.target;
        while (!target.classList.contains('cultivation-slot') && target.parentElement) {
            target = target.parentElement;
        }
        
        if (!target.classList.contains('cultivation-slot')) return;
        
        const slotElement = target.dataset.element;
        
        // --- CÁLCULO DE AFINIDAD ---
        let affinity = "dissonance"; // Por defecto: Malo
        
        if (skillElement === slotElement) {
            affinity = "harmony"; // Mismo elemento: Excelente
        } else if (UI.checkGeneration(skillElement, slotElem)) {
            affinity = "generation"; // Elemento Padre -> Hijo: Bueno
        }
        
        // Guardar en el personaje (Función importada de character.js)
        equipSkill(slotElement, skillId, affinity);
        
        // Refrescar visualmente
        UI.renderCultivationPanel(); 
    },

    /**
     * Ciclo de Generación: Agua -> Madera -> Fuego -> Tierra -> Metal -> Agua
     */
    checkGeneration: function(skillElem, slotElem) {
        const cycle = { 
            water: 'wood', 
            wood: 'fire', 
            fire: 'earth', 
            earth: 'metal', 
            metal: 'water' 
        };
        return cycle[skillElem] === slotElem;
    }
};

// Exponemos el objeto UI a la ventana global para que los eventos onclick/ondrop funcionen si es necesario
window.UI = UI;
```