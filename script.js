/* =========================================================
   NEXUS RESONANCE
   SCRIPT.JS
   Version gameplay contrôlé par le joueur
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const homeScreen =
  document.getElementById("homeScreen");

const gameScreen =
  document.getElementById("gameScreen");

   const pathScreen =
  document.getElementById("pathScreen");
   
const pathBackground =
  document.getElementById("pathBackground");
   
const pathMessage =
  document.getElementById("pathMessage");

const pathMenuBtn =
  document.getElementById("pathMenuBtn");

const pathHomeBtn =
  document.getElementById("pathHomeBtn");

const pathNodes =
  document.querySelectorAll(".path-node");
const playBtn =
  document.getElementById("playBtn");

  const resetProgressBtn =
  document.getElementById("resetProgressBtn"); 

const homeLevel =
  document.getElementById("homeLevel");

const menuBtn =
  document.getElementById("menuBtn");

const pauseMenu =
  document.getElementById("pauseMenu");

const resumeBtn =
  document.getElementById("resumeBtn");

const restartBtn =
  document.getElementById("restartBtn");

const homeBtn =
  document.getElementById("homeBtn");

const victoryScreen =
  document.getElementById("victoryScreen");

const defeatScreen =
  document.getElementById("defeatScreen");

const nextLevelBtn =
  document.getElementById("nextLevelBtn");

const victoryRestartBtn =
  document.getElementById("victoryRestartBtn");

const defeatRestartBtn =
  document.getElementById("defeatRestartBtn");

const defeatHomeBtn =
  document.getElementById("defeatHomeBtn");

const gameBoard =
  document.getElementById("gameBoard");

const levelNumber =
  document.getElementById("levelNumber");

const scoreDisplay =
  document.getElementById("score");

const objectiveText =
  document.getElementById("objectiveText");

const objectiveCurrent =
  document.getElementById("objectiveCurrent");

const objectiveTarget =
  document.getElementById("objectiveTarget");

const timerBox =
  document.getElementById("timerBox");

const timerDisplay =
  document.getElementById("timer");

const movesBox =
  document.getElementById("movesBox");

const movesDisplay =
  document.getElementById("moves");

const comboDisplay =
  document.getElementById("comboDisplay");

const gameMessage =
  document.getElementById("gameMessage");

const victoryScore =
  document.getElementById("victoryScore");


/* =========================================================
   PARAMÈTRES
========================================================= */

const ROWS = 8;
const COLS = 7;

const MATCH_SIZE = 3;


/* =========================================================
   IMAGES DES OBJECTIFS
========================================================= */

const OBJECTIVE_IMAGES = {
  etoile: "Images/Symboles/Etoile-de-mer.PNG",
  hippocampe: "Images/Symboles/Hippocampe.PNG",
  meduse: "Images/Symboles/Meduse.PNG",
  perle: "Images/Symboles/Perle.PNG",
  poisson: "Images/Symboles/Poisson.PNG",
  poulpe: "Images/Symboles/Poulpe.PNG"
};


/* =========================================================
   AFFICHER LES OBJECTIFS AVEC ICÔNES
========================================================= */

function renderObjectiveDisplay() {

  const level =
    LEVELS[currentLevel];

  const objectives =
    Object.entries(level.objectives);

  objectiveText.innerHTML =
    objectives.map(([symbolId, target]) => {

      const current =
        Math.min(
          collected[symbolId] || 0,
          target
        );

      const imagePath =
        OBJECTIVE_IMAGES[symbolId] || "";

      return `
        <div class="objective-item">
          <img
            class="objective-symbol"
            src="${imagePath}"
            alt="${symbolId}"
          >
          <div class="objective-count">
            ${current} / ${target}
          </div>
        </div>
      `;

    }).join("");

}
   
/* =========================================================
   SYMBOLES
========================================================= */

const SYMBOLS = [

  { 
    id: "etoile",
    image: "Images/Symboles/Etoile-de-mer.PNG",
    name: "étoiles de mer"
  },

  { 
    id: "poulpe",
    image: "Images/Symboles/Poulpe.PNG",
    name: "poulpes"
  },

  { 
    id: "hippocampe",
    image: "Images/Symboles/Hippocampe.PNG",
    name: "hippocampes"
  },

  { 
    id: "poisson",
    image: "Images/Symboles/Poisson.PNG",
    name: "poissons"
  },

  { 
    id: "meduse",
    image: "Images/Symboles/Meduse.PNG",
    name: "méduses"
  },

  { 
    id: "perle",
    image: "Images/Symboles/Perle.PNG",
    name: "perles"
  },

  { 
    id: "tortue",
    image: "Images/Symboles/Tortue.PNG",
    name: "tortues"
  },

  { 
    id: "raie",
    image: "Images/Symboles/Raie.PNG",
    name: "raies"
  },

  { 
    id: "anemone",
    image: "Images/Symboles/Anemone.PNG",
    name: "anémones"
  },

  { 
    id: "triden",
    image: "Images/Symboles/Triden.PNG",
    name: "tridents"
  },

  { 
    id: "corail",
    image: "Images/Symboles/Corail.PNG",
    name: "coraux"
  }

];

/* =========================================================
   GROUPES DE SYMBOLES PAR ZONE
========================================================= */

const SYMBOL_SETS = {

  /* NIVEAUX 1 À 30 */
  1: [
    "etoile",
    "poulpe",
    "hippocampe",
    "poisson",
    "meduse",
    "perle"
  ],

  /* NIVEAUX 31 À 60 */
  2: [
    "etoile",
    "poulpe",
    "hippocampe",
    "tortue",
    "raie",
    "perle"
  ],

  /* NIVEAUX 61 À 90 */
  3: [
    "tortue",
    "raie",
    "anemone",
    "corail",
    "etoile",
    "perle"
  ],

  /* NIVEAUX 91 ET PLUS */
  4: [
    "raie",
    "anemone",
    "corail",
    "trident",
    "hippocampe",
    "perle"
  ]

};


   

/* =========================================================
   NIVEAUX
========================================================= */

const LEVELS = [

  {
    name: "Première résonance",

    mode: "free",

    objectives: {
      etoile: 20
    },

    blockers: []
  },


  {
    name: "Feu intérieur",

    mode: "time",

    time: 60,

    objectives: {
      poulpe: 25
    },

    blockers: []
  },


  {
    name: "Double fréquence",

    mode: "moves",

    moves: 22,

    objectives: {
      hippocampe: 15,
      poisson: 15
    },

    blockers: []
  },


  {
    name: "Cœur de glace",

    mode: "time",

    time: 75,

    objectives: {
      meduse: 25
    },

    clearBlocks: true,

    blockers: [

      {
        row: 2,
        col: 2,
        type: "ice",
        hp: 1
      },

      {
        row: 2,
        col: 4,
        type: "ice",
        hp: 1
      },

      {
        row: 4,
        col: 1,
        type: "ice",
        hp: 1
      },

      {
        row: 4,
        col: 5,
        type: "ice",
        hp: 1
      }

    ]
  },


  {
    name: "Sceau lunaire",

    mode: "moves",

    moves: 28,

    objectives: {
      etoile: 25,
      perle: 15
    },

    blockers: [

      {
        row: 3,
        col: 2,
        type: "lock",
        symbol: "etoile",
        amount: 12
      },

      {
        row: 3,
        col: 3,
        type: "lock",
        symbol: "etoile",
        amount: 12
      },

      {
        row: 3,
        col: 4,
        type: "lock",
        symbol: "etoile",
        amount: 12
      }

    ]
  },


  {
    name: "Nexus fracturé",

    mode: "time",

    time: 90,

    objectives: {
      poisson: 20,
      poulpe: 20
    },

    clearBlocks: true,

    blockers: [

      {
        row: 2,
        col: 1,
        type: "stone",
        hp: 2
      },

      {
        row: 2,
        col: 5,
        type: "stone",
        hp: 2
      },

      {
        row: 4,
        col: 2,
        type: "stone",
        hp: 2
      },

      {
        row: 4,
        col: 4,
        type: "stone",
        hp: 2
      }

    ]
  },

/* =========================================================
   NIVEAU 7
   Perles + méduses
========================================================= */

{
  name: "Jardin des Perles",

  mode: "moves",

  moves: 24,

  objectives: {
    perle: 20,
    meduse: 20
  },

  blockers: []
},


/* =========================================================
   NIVEAU 8
   Hippocampes + glace
========================================================= */

{
  name: "Cristaux du Récif",

  mode: "time",

  time: 80,

  objectives: {
    hippocampe: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 4,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 9
   Poissons + pierres renforcées
========================================================= */

{
  name: "Les Roches Profondes",

  mode: "moves",

  moves: 26,

  objectives: {
    poisson: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 5,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 10
   Niveau plus difficile
   Étoiles + poulpes + cadenas
========================================================= */

{
  name: "Gardien du Nexus",

  mode: "time",

  time: 95,

  objectives: {
    etoile: 20,
    poulpe: 20
  },

  blockers: [

    {
      row: 3,
      col: 1,
      type: "lock",
      symbol: "etoile",
      amount: 10
    },

    {
      row: 3,
      col: 3,
      type: "lock",
      symbol: "etoile",
      amount: 10
    },

    {
      row: 3,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 10
    },

    {
      row: 5,
      col: 2,
      type: "lock",
      symbol: "poulpe",
      amount: 10
    },

    {
      row: 5,
      col: 4,
      type: "lock",
      symbol: "poulpe",
      amount: 10
    }

  ]
},
   /* =========================================================
   NIVEAU 11
========================================================= */

{
  name: "Le Temple Corallien",

  mode: "moves",

  moves: 28,

  objectives: {
    meduse: 20,
    etoile: 20
  },

  blockers: []
},


/* =========================================================
   NIVEAU 12
========================================================= */

{
  name: "Le Récif Lumineux",

  mode: "time",

  time: 85,

  objectives: {
    poisson: 28
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 4,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 13
========================================================= */

{
  name: "La Cascade Bleue",

  mode: "moves",

  moves: 27,

  objectives: {
    perle: 18,
    hippocampe: 20
  },

  blockers: [

    {
      row: 3,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 4,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 14
========================================================= */

{
  name: "Les Galeries Englouties",

  mode: "time",

  time: 90,

  objectives: {
    poulpe: 25,
    meduse: 20
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 15
========================================================= */

{
  name: "Le Sanctuaire",

  mode: "moves",

  moves: 30,

  objectives: {
    etoile: 22,
    perle: 18
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "etoile",
      amount: 10
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "etoile",
      amount: 10
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "perle",
      amount: 8
    }

  ]
},


/* =========================================================
   NIVEAU 16
========================================================= */

{
  name: "Les Jardins Coralliens",

  mode: "time",

  time: 95,

  objectives: {
    hippocampe: 22,
    poisson: 22
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 17
========================================================= */

{
  name: "Le Pont de Lumière",

  mode: "moves",

  moves: 29,

  objectives: {
    meduse: 25,
    poulpe: 20
  },

  blockers: [

    {
      row: 1,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 18
========================================================= */

{
  name: "Les Colonnes Bleues",

  mode: "time",

  time: 100,

  objectives: {
    poisson: 25,
    perle: 20
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 3,
      type: "lock",
      symbol: "poisson",
      amount: 12
    }

  ]
},


/* =========================================================
   NIVEAU 19
========================================================= */

{
  name: "Le Dôme Céleste",

  mode: "moves",

  moves: 32,

  objectives: {
    etoile: 25,
    hippocampe: 20,
    meduse: 15
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "etoile",
      amount: 12
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 12
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "hippocampe",
      amount: 10
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 10
    }

  ]
},


/* =========================================================
   NIVEAU 20
========================================================= */

{
  name: "La Salle des Trésors",

  mode: "time",

  time: 110,

  objectives: {
    perle: 25,
    etoile: 25,
    poulpe: 20
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "lock",
      symbol: "perle",
      amount: 12
    },

    {
      row: 5,
      col: 5,
      type: "lock",
      symbol: "perle",
      amount: 12
    }

  ]
},

   /* =========================================================
   NIVEAU 21
========================================================= */

{
  name: "Les Jardins des Raies",

  mode: "moves",

  moves: 30,

  objectives: {
    poisson: 25,
    meduse: 20
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 22
========================================================= */

{
  name: "Le Passage des Tortues",

  mode: "time",

  time: 100,

  objectives: {
    hippocampe: 25,
    perle: 20
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 23
========================================================= */

{
  name: "Le Couloir des Requins",

  mode: "moves",

  moves: 28,

  objectives: {
    poulpe: 25,
    etoile: 20
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 5,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 24
========================================================= */

{
  name: "La Grotte Prismatique",

  mode: "time",

  time: 105,

  objectives: {
    meduse: 25,
    perle: 22
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 25
========================================================= */

{
  name: "Le Sanctuaire des Courants",

  mode: "moves",

  moves: 31,

  objectives: {
    poisson: 25,
    hippocampe: 22,
    etoile: 18
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "poisson",
      amount: 12
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "poisson",
      amount: 12
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "hippocampe",
      amount: 10
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 10
    }

  ]
},


/* =========================================================
   NIVEAU 26
========================================================= */

{
  name: "Les Colonnes des Abysses",

  mode: "time",

  time: 110,

  objectives: {
    poulpe: 28,
    meduse: 22
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 27
========================================================= */

{
  name: "Le Nexus des Raies",

  mode: "moves",

  moves: 32,

  objectives: {
    etoile: 25,
    poisson: 25,
    perle: 20
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "etoile",
      amount: 12
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "etoile",
      amount: 12
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "perle",
      amount: 10
    }

  ]
},


/* =========================================================
   NIVEAU 28
========================================================= */

{
  name: "Le Dôme des Tortues",

  mode: "time",

  time: 115,

  objectives: {
    hippocampe: 28,
    perle: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 29
========================================================= */

{
  name: "La Faille des Requins",

  mode: "moves",

  moves: 34,

  objectives: {
    poulpe: 28,
    meduse: 25,
    poisson: 20
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "poulpe",
      amount: 12
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "poulpe",
      amount: 12
    }

  ]
},


/* =========================================================
   NIVEAU 30
========================================================= */

{
  name: "Le Cœur des Abysses",

  mode: "time",

  time: 120,

  objectives: {
    etoile: 30,
    perle: 25,
    hippocampe: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 2,
      type: "lock",
      symbol: "perle",
      amount: 12
    },

    {
      row: 5,
      col: 4,
      type: "lock",
      symbol: "etoile",
      amount: 15
    },

    {
      row: 6,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},

 /* =========================================================
   NIVEAU 31
========================================================= */

{
  name: "Le Jardin des Méduses",

  mode: "moves",

  moves: 32,

  objectives: {
    meduse: 30,
    perle: 22
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 32
========================================================= */

{
  name: "Les Ruines de Cristal",

  mode: "time",

  time: 115,

  objectives: {
    etoile: 28,
    poisson: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 33
========================================================= */

{
  name: "Le Passage des Profondeurs",

  mode: "moves",

  moves: 33,

  objectives: {
    hippocampe: 28,
    poulpe: 25
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 4,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 34
========================================================= */

{
  name: "La Chambre des Perles",

  mode: "time",

  time: 120,

  objectives: {
    perle: 30,
    meduse: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 35
========================================================= */

{
  name: "Les Portes du Nexus",

  mode: "moves",

  moves: 34,

  objectives: {
    etoile: 28,
    poisson: 25,
    hippocampe: 20
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "etoile",
      amount: 14
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 14
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "poisson",
      amount: 12
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 10
    }

  ]
},


/* =========================================================
   NIVEAU 36
========================================================= */

{
  name: "Le Palais Englouti",

  mode: "time",

  time: 125,

  objectives: {
    poulpe: 30,
    perle: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 37
========================================================= */

{
  name: "Les Courants Éternels",

  mode: "moves",

  moves: 35,

  objectives: {
    meduse: 30,
    etoile: 25,
    poisson: 22
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "meduse",
      amount: 14
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "meduse",
      amount: 14
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "etoile",
      amount: 12
    }

  ]
},


/* =========================================================
   NIVEAU 38
========================================================= */

{
  name: "La Faille Lumineuse",

  mode: "time",

  time: 130,

  objectives: {
    hippocampe: 30,
    poulpe: 28
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 39
========================================================= */

{
  name: "Le Trône des Abysses",

  mode: "moves",

  moves: 36,

  objectives: {
    perle: 30,
    etoile: 28,
    meduse: 25
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "perle",
      amount: 14
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "etoile",
      amount: 14
    }

  ]
},


/* =========================================================
   NIVEAU 40
========================================================= */

{
  name: "Le Temple des Profondeurs",

  mode: "time",

  time: 135,

  objectives: {
    poisson: 32,
    poulpe: 30,
    hippocampe: 25
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 2,
      type: "lock",
      symbol: "poisson",
      amount: 15
    },

    {
      row: 5,
      col: 4,
      type: "lock",
      symbol: "poulpe",
      amount: 14
    }

  ]
},
   
/* =========================================================
   NIVEAU 41
========================================================= */

{
  name: "La Route des Requins",

  mode: "moves",

  moves: 36,

  objectives: {
    poisson: 32,
    meduse: 28
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 3,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 42
========================================================= */

{
  name: "Le Refuge des Tortues",

  mode: "time",

  time: 135,

  objectives: {
    hippocampe: 32,
    perle: 28
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 5,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 43
========================================================= */

{
  name: "Le Ballet des Raies",

  mode: "moves",

  moves: 37,

  objectives: {
    etoile: 30,
    poulpe: 30
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 5,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 44
========================================================= */

{
  name: "Le Sanctuaire Saphir",

  mode: "time",

  time: 140,

  objectives: {
    meduse: 32,
    perle: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 3,
      type: "lock",
      symbol: "meduse",
      amount: 14
    }

  ]
},


/* =========================================================
   NIVEAU 45
========================================================= */

{
  name: "Les Portes Célestes",

  mode: "moves",

  moves: 38,

  objectives: {
    etoile: 32,
    hippocampe: 28,
    poisson: 25
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "etoile",
      amount: 16
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 16
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "hippocampe",
      amount: 14
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "poisson",
      amount: 12
    }

  ]
},


/* =========================================================
   NIVEAU 46
========================================================= */

{
  name: "La Cathédrale Engloutie",

  mode: "time",

  time: 145,

  objectives: {
    poulpe: 32,
    perle: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 47
========================================================= */

{
  name: "Le Cœur des Courants",

  mode: "moves",

  moves: 39,

  objectives: {
    meduse: 32,
    poisson: 30,
    etoile: 25
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "meduse",
      amount: 16
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "poisson",
      amount: 14
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "etoile",
      amount: 12
    }

  ]
},


/* =========================================================
   NIVEAU 48
========================================================= */

{
  name: "La Mer de Cristal",

  mode: "time",

  time: 150,

  objectives: {
    hippocampe: 34,
    perle: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 49
========================================================= */

{
  name: "Le Dernier Passage",

  mode: "moves",

  moves: 40,

  objectives: {
    poulpe: 34,
    meduse: 30,
    poisson: 28
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "poulpe",
      amount: 16
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "meduse",
      amount: 14
    }

  ]
},


/* =========================================================
   NIVEAU 50
========================================================= */

{
  name: "Le Cœur du Nexus",

  mode: "time",

  time: 160,

  objectives: {
    etoile: 35,
    perle: 32,
    hippocampe: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "lock",
      symbol: "perle",
      amount: 16
    },

    {
      row: 5,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 18
    },

    {
      row: 6,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},
   /* =========================================================
   NIVEAU 51
========================================================= */

{
  name: "Les Portes de l’Abîme",

  mode: "moves",

  moves: 38,

  objectives: {
    meduse: 32,
    poisson: 30
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 52
========================================================= */

{
  name: "Le Sanctuaire des Perles",

  mode: "time",

  time: 145,

  objectives: {
    perle: 32,
    hippocampe: 28
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 53
========================================================= */

{
  name: "Les Courants du Néant",

  mode: "moves",

  moves: 39,

  objectives: {
    poulpe: 32,
    etoile: 30
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 5,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 54
========================================================= */

{
  name: "La Chambre des Cristaux",

  mode: "time",

  time: 150,

  objectives: {
    meduse: 34,
    perle: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 3,
      type: "lock",
      symbol: "meduse",
      amount: 16
    }

  ]
},


/* =========================================================
   NIVEAU 55
========================================================= */

{
  name: "Le Trône des Profondeurs",

  mode: "moves",

  moves: 40,

  objectives: {
    etoile: 32,
    poisson: 30,
    hippocampe: 26
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "etoile",
      amount: 16
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 16
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "poisson",
      amount: 14
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 12
    }

  ]
},


/* =========================================================
   NIVEAU 56
========================================================= */

{
  name: "Le Palais des Ombres Bleues",

  mode: "time",

  time: 155,

  objectives: {
    poulpe: 34,
    perle: 30
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 57
========================================================= */

{
  name: "Le Passage des Échos",

  mode: "moves",

  moves: 41,

  objectives: {
    meduse: 34,
    poisson: 32,
    etoile: 26
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "meduse",
      amount: 16
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "poisson",
      amount: 15
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "etoile",
      amount: 13
    }

  ]
},


/* =========================================================
   NIVEAU 58
========================================================= */

{
  name: "Le Jardin du Silence",

  mode: "time",

  time: 160,

  objectives: {
    hippocampe: 34,
    perle: 32
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 59
========================================================= */

{
  name: "La Faille du Nexus",

  mode: "moves",

  moves: 42,

  objectives: {
    poulpe: 35,
    meduse: 32,
    poisson: 30
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "poulpe",
      amount: 17
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "meduse",
      amount: 15
    }

  ]
},


/* =========================================================
   NIVEAU 60
========================================================= */

{
  name: "Le Nexus Primordial",

  mode: "time",

  time: 170,

  objectives: {
    etoile: 36,
    perle: 34,
    hippocampe: 32
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "lock",
      symbol: "perle",
      amount: 17
    },

    {
      row: 5,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 18
    },

    {
      row: 6,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},

   
   /* =========================================================
   NIVEAU 61
========================================================= */

{
  name: "La Frontière des Abysses",

  mode: "moves",

  moves: 40,

  objectives: {
    etoile: 34,
    poisson: 32
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 4,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 4,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 62
========================================================= */

{
  name: "Le Jardin des Courants",

  mode: "time",

  time: 165,

  objectives: {
    meduse: 34,
    perle: 32
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 1,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 5,
      type: "ice",
      hp: 1
    }

  ]
},


/* =========================================================
   NIVEAU 63
========================================================= */

{
  name: "Les Portes Coralliennes",

  mode: "moves",

  moves: 41,

  objectives: {
    hippocampe: 34,
    poulpe: 32
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 1,
      type: "lock",
      symbol: "hippocampe",
      amount: 16
    },

    {
      row: 4,
      col: 5,
      type: "lock",
      symbol: "poulpe",
      amount: 16
    }

  ]
},


/* =========================================================
   NIVEAU 64
========================================================= */

{
  name: "La Crypte Lumineuse",

  mode: "time",

  time: 170,

  objectives: {
    etoile: 34,
    meduse: 32,
    perle: 24
  },

  clearBlocks: true,

  blockers: [

    {
      row: 2,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 2,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 4,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 65
========================================================= */

{
  name: "Le Sceau des Profondeurs",

  mode: "moves",

  moves: 42,

  objectives: {
    poisson: 34,
    perle: 30,
    etoile: 28
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "poisson",
      amount: 18
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "poisson",
      amount: 18
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "perle",
      amount: 15
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "etoile",
      amount: 14
    }

  ]
},


/* =========================================================
   NIVEAU 66
========================================================= */

{
  name: "Le Palais des Méduses",

  mode: "time",

  time: 175,

  objectives: {
    meduse: 36,
    hippocampe: 32
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 4,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 2,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 4,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 67
========================================================= */

{
  name: "Le Couloir des Échos",

  mode: "moves",

  moves: 43,

  objectives: {
    poulpe: 35,
    poisson: 32,
    meduse: 28
  },

  blockers: [

    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "poulpe",
      amount: 18
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "poisson",
      amount: 16
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "meduse",
      amount: 14
    }

  ]
},


/* =========================================================
   NIVEAU 68
========================================================= */

{
  name: "Les Colonnes du Nexus",

  mode: "time",

  time: 180,

  objectives: {
    perle: 35,
    etoile: 32
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 2,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 4,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 5,
      col: 5,
      type: "stone",
      hp: 2
    }

  ]
},


/* =========================================================
   NIVEAU 69
========================================================= */

{
  name: "La Faille Primordiale",

  mode: "moves",

  moves: 44,

  objectives: {
    etoile: 36,
    hippocampe: 34,
    perle: 30
  },

  blockers: [

    {
      row: 2,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 3,
      type: "stone",
      hp: 2
    },

    {
      row: 2,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "etoile",
      amount: 18
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 16
    }

  ]
},


/* =========================================================
   NIVEAU 70
========================================================= */

{
  name: "Le Sanctuaire du Septième Nexus",

  mode: "time",

  time: 190,

  objectives: {
    etoile: 38,
    perle: 36,
    poulpe: 34
  },

  clearBlocks: true,

  blockers: [

    {
      row: 1,
      col: 1,
      type: "stone",
      hp: 2
    },

    {
      row: 1,
      col: 5,
      type: "stone",
      hp: 2
    },

    {
      row: 3,
      col: 1,
      type: "ice",
      hp: 1
    },

    {
      row: 3,
      col: 5,
      type: "ice",
      hp: 1
    },

    {
      row: 5,
      col: 1,
      type: "lock",
      symbol: "perle",
      amount: 18
    },

    {
      row: 5,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 20
    },

    {
      row: 6,
      col: 3,
      type: "stone",
      hp: 2
    }

  ]
},

/* =========================================================
   NIVEAU 81
========================================================= */

{
  name: "Le Royaume des Hippocampes",
  mode: "moves",
  moves: 44,

  objectives: {
    hippocampe: 38,
    perle: 32
  },

  blockers: [
    { row: 2, col: 2, type: "ice", hp: 1 },
    { row: 2, col: 4, type: "ice", hp: 1 },
    { row: 4, col: 2, type: "stone", hp: 2 },
    { row: 4, col: 4, type: "stone", hp: 2 }
  ]
},


/* =========================================================
   NIVEAU 82
========================================================= */

{
  name: "Les Jardins Lumineux",
  mode: "time",
  time: 180,

  objectives: {
    etoile: 38,
    meduse: 34
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "ice", hp: 1 },
    { row: 1, col: 5, type: "ice", hp: 1 },
    { row: 3, col: 2, type: "stone", hp: 2 },
    { row: 3, col: 4, type: "stone", hp: 2 },
    { row: 5, col: 1, type: "ice", hp: 1 },
    { row: 5, col: 5, type: "ice", hp: 1 }
  ]
},


/* =========================================================
   NIVEAU 83
========================================================= */

{
  name: "La Route des Perles",
  mode: "moves",
  moves: 45,

  objectives: {
    perle: 38,
    poisson: 34
  },

  blockers: [
    { row: 2, col: 1, type: "stone", hp: 2 },
    { row: 2, col: 5, type: "stone", hp: 2 },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "perle",
      amount: 18
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "poisson",
      amount: 16
    }
  ]
},


/* =========================================================
   NIVEAU 84
========================================================= */

{
  name: "Le Temple des Courants",
  mode: "time",
  time: 185,

  objectives: {
    poulpe: 38,
    hippocampe: 35,
    meduse: 28
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 2, type: "stone", hp: 2 },
    { row: 1, col: 4, type: "stone", hp: 2 },
    { row: 3, col: 1, type: "ice", hp: 1 },
    { row: 3, col: 5, type: "ice", hp: 1 },
    { row: 5, col: 2, type: "stone", hp: 2 },
    { row: 5, col: 4, type: "stone", hp: 2 }
  ]
},


/* =========================================================
   NIVEAU 85
========================================================= */

{
  name: "Le Sceau Marin",
  mode: "moves",
  moves: 46,

  objectives: {
    etoile: 40,
    perle: 34,
    poisson: 30
  },

  blockers: [
    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "etoile",
      amount: 20
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 20
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "perle",
      amount: 17
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "poisson",
      amount: 15
    }
  ]
},


/* =========================================================
   NIVEAU 86
========================================================= */

{
  name: "Les Colonnes Englouties",
  mode: "time",
  time: 190,

  objectives: {
    meduse: 40,
    poulpe: 36
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "stone", hp: 2 },
    { row: 1, col: 5, type: "stone", hp: 2 },
    { row: 3, col: 2, type: "ice", hp: 1 },
    { row: 3, col: 4, type: "ice", hp: 1 },
    { row: 5, col: 1, type: "stone", hp: 2 },
    { row: 5, col: 5, type: "stone", hp: 2 }
  ]
},


/* =========================================================
   NIVEAU 87
========================================================= */

{
  name: "La Danse des Hippocampes",
  mode: "moves",
  moves: 47,

  objectives: {
    hippocampe: 42,
    etoile: 34,
    perle: 30
  },

  blockers: [
    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "hippocampe",
      amount: 20
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 20
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "etoile",
      amount: 16
    }
  ]
},


/* =========================================================
   NIVEAU 88
========================================================= */

{
  name: "La Faille des Cristaux",
  mode: "time",
  time: 195,

  objectives: {
    poisson: 40,
    perle: 36
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "ice", hp: 1 },
    { row: 1, col: 5, type: "ice", hp: 1 },
    { row: 2, col: 3, type: "stone", hp: 2 },
    { row: 4, col: 3, type: "stone", hp: 2 },
    { row: 5, col: 1, type: "ice", hp: 1 },
    { row: 5, col: 5, type: "ice", hp: 1 }
  ]
},


/* =========================================================
   NIVEAU 89
========================================================= */

{
  name: "Le Cœur des Hippocampes",
  mode: "moves",
  moves: 48,

  objectives: {
    hippocampe: 42,
    meduse: 36,
    poulpe: 32
  },

  blockers: [
    { row: 2, col: 1, type: "stone", hp: 2 },
    { row: 2, col: 3, type: "stone", hp: 2 },
    { row: 2, col: 5, type: "stone", hp: 2 },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "hippocampe",
      amount: 20
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "meduse",
      amount: 18
    }
  ]
},


/* =========================================================
   NIVEAU 90
========================================================= */

{
  name: "Le Gardien des Profondeurs",
  mode: "time",
  time: 205,

  objectives: {
    etoile: 42,
    perle: 40,
    hippocampe: 36
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "stone", hp: 2 },
    { row: 1, col: 5, type: "stone", hp: 2 },
    { row: 3, col: 1, type: "ice", hp: 1 },
    { row: 3, col: 5, type: "ice", hp: 1 },

    {
      row: 5,
      col: 1,
      type: "lock",
      symbol: "perle",
      amount: 20
    },

    {
      row: 5,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 21
    },

    { row: 6, col: 3, type: "stone", hp: 2 }
  ]
},
/* =========================================================
   NIVEAU 91
========================================================= */

{
  name: "Le Royaume des Poissons-Clowns",
  mode: "moves",
  moves: 46,

  objectives: {
    poisson: 42,
    perle: 34
  },

  blockers: [
    { row: 2, col: 2, type: "ice", hp: 1 },
    { row: 2, col: 4, type: "ice", hp: 1 },
    { row: 4, col: 2, type: "stone", hp: 2 },
    { row: 4, col: 4, type: "stone", hp: 2 }
  ]
},


/* =========================================================
   NIVEAU 92
========================================================= */

{
  name: "Le Jardin des Anémones",
  mode: "time",
  time: 195,

  objectives: {
    poisson: 40,
    meduse: 38
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "ice", hp: 1 },
    { row: 1, col: 5, type: "ice", hp: 1 },
    { row: 3, col: 2, type: "stone", hp: 2 },
    { row: 3, col: 4, type: "stone", hp: 2 },
    { row: 5, col: 1, type: "ice", hp: 1 },
    { row: 5, col: 5, type: "ice", hp: 1 }
  ]
},


/* =========================================================
   NIVEAU 93
========================================================= */

{
  name: "Le Labyrinthe Corallien",
  mode: "moves",
  moves: 47,

  objectives: {
    poulpe: 40,
    etoile: 38
  },

  blockers: [
    { row: 2, col: 1, type: "stone", hp: 2 },
    { row: 2, col: 5, type: "stone", hp: 2 },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "poulpe",
      amount: 20
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "etoile",
      amount: 18
    }
  ]
},


/* =========================================================
   NIVEAU 94
========================================================= */

{
  name: "Les Cascades de Lumière",
  mode: "time",
  time: 200,

  objectives: {
    perle: 40,
    hippocampe: 38,
    meduse: 30
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 2, type: "stone", hp: 2 },
    { row: 1, col: 4, type: "stone", hp: 2 },
    { row: 3, col: 1, type: "ice", hp: 1 },
    { row: 3, col: 5, type: "ice", hp: 1 },
    { row: 5, col: 2, type: "stone", hp: 2 },
    { row: 5, col: 4, type: "stone", hp: 2 }
  ]
},


/* =========================================================
   NIVEAU 95
========================================================= */

{
  name: "Le Sceau des Anémones",
  mode: "moves",
  moves: 49,

  objectives: {
    poisson: 44,
    etoile: 38,
    perle: 34
  },

  blockers: [
    {
      row: 2,
      col: 1,
      type: "lock",
      symbol: "poisson",
      amount: 22
    },

    {
      row: 2,
      col: 5,
      type: "lock",
      symbol: "poisson",
      amount: 22
    },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "etoile",
      amount: 18
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "perle",
      amount: 16
    }
  ]
},


/* =========================================================
   NIVEAU 96
========================================================= */

{
  name: "Le Palais Corallien",
  mode: "time",
  time: 210,

  objectives: {
    poulpe: 42,
    meduse: 40
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "stone", hp: 2 },
    { row: 1, col: 5, type: "stone", hp: 2 },
    { row: 2, col: 3, type: "ice", hp: 1 },
    { row: 4, col: 3, type: "ice", hp: 1 },
    { row: 5, col: 1, type: "stone", hp: 2 },
    { row: 5, col: 5, type: "stone", hp: 2 }
  ]
},


/* =========================================================
   NIVEAU 97
========================================================= */

{
  name: "La Grande Migration",
  mode: "moves",
  moves: 50,

  objectives: {
    poisson: 44,
    hippocampe: 40,
    etoile: 34
  },

  blockers: [
    {
      row: 2,
      col: 2,
      type: "lock",
      symbol: "poisson",
      amount: 22
    },

    {
      row: 2,
      col: 4,
      type: "lock",
      symbol: "hippocampe",
      amount: 20
    },

    {
      row: 4,
      col: 3,
      type: "lock",
      symbol: "etoile",
      amount: 17
    }
  ]
},


/* =========================================================
   NIVEAU 98
========================================================= */

{
  name: "La Grotte des Mille Couleurs",
  mode: "time",
  time: 215,

  objectives: {
    perle: 42,
    etoile: 40
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "ice", hp: 1 },
    { row: 1, col: 5, type: "ice", hp: 1 },
    { row: 3, col: 1, type: "stone", hp: 2 },
    { row: 3, col: 3, type: "stone", hp: 2 },
    { row: 3, col: 5, type: "stone", hp: 2 },
    { row: 5, col: 1, type: "ice", hp: 1 },
    { row: 5, col: 5, type: "ice", hp: 1 }
  ]
},


/* =========================================================
   NIVEAU 99
========================================================= */

{
  name: "La Porte du Centième Nexus",
  mode: "moves",
  moves: 52,

  objectives: {
    meduse: 44,
    poulpe: 40,
    poisson: 38
  },

  blockers: [
    { row: 2, col: 1, type: "stone", hp: 2 },
    { row: 2, col: 3, type: "stone", hp: 2 },
    { row: 2, col: 5, type: "stone", hp: 2 },

    {
      row: 4,
      col: 2,
      type: "lock",
      symbol: "meduse",
      amount: 22
    },

    {
      row: 4,
      col: 4,
      type: "lock",
      symbol: "poulpe",
      amount: 20
    }
  ]
},


/* =========================================================
   NIVEAU 100
========================================================= */

{
  name: "Le Cœur du Grand Nexus",
  mode: "time",
  time: 225,

  objectives: {
    etoile: 46,
    perle: 44,
    hippocampe: 40
  },

  clearBlocks: true,

  blockers: [
    { row: 1, col: 1, type: "stone", hp: 2 },
    { row: 1, col: 3, type: "stone", hp: 2 },
    { row: 1, col: 5, type: "stone", hp: 2 },

    { row: 3, col: 1, type: "ice", hp: 1 },
    { row: 3, col: 5, type: "ice", hp: 1 },

    {
      row: 5,
      col: 1,
      type: "lock",
      symbol: "perle",
      amount: 22
    },

    {
      row: 5,
      col: 5,
      type: "lock",
      symbol: "etoile",
      amount: 23
    },

    { row: 6, col: 3, type: "stone", hp: 2 }
  ]
}






   
 ];


/* =========================================================
   SAUVEGARDE
========================================================= */

const STORAGE_LEVEL =
  "nexusResonance_level";
const STORAGE_UNLOCKED =
  "nexusResonance_unlocked";

/* =========================================================
   VARIABLES
========================================================= */

let board = [];

let currentLevel =
  Number(
    localStorage.getItem(STORAGE_LEVEL)
  ) || 0;

if (
  currentLevel < 0 ||
  currentLevel >= LEVELS.length
) {

  currentLevel = 0;

}

let score = 0;
let movesRemaining = 0;
let timeRemaining = 0;

let timerInterval = null;

let paused = false;
   let pathOpenedFromMenu = false;
let processing = false;
let levelFinished = false;

let cascadeLevel = 1;
let selectedCell = null;

/* =========================================================
   COMPTEURS
========================================================= */

let collected = {

  etoile: 0,
  poulpe: 0,
  hippocampe: 0,
  poisson: 0,
  meduse: 0,
  perle: 0

};


/* =========================================================
   OUTILS
========================================================= */

function sleep(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}


function randomSymbol() {

  return SYMBOLS[
    Math.floor(
      Math.random() *
      SYMBOLS.length
    )
  ].id;

}

/* =========================================================
   SYMBOLE DE DÉPART
   Évite les alignements automatiques de 3
========================================================= */

function startingSymbol(row, col) {

  let possibilities =
    SYMBOLS.map(symbol => symbol.id);


  if (
    col >= 2 &&
    isSymbolCell(board[row][col - 1]) &&
    isSymbolCell(board[row][col - 2]) &&
    board[row][col - 1].symbol ===
    board[row][col - 2].symbol
  ) {

    possibilities =
      possibilities.filter(
        symbol =>
          symbol !==
          board[row][col - 1].symbol
      );

  }


  if (
    row >= 2 &&
    isSymbolCell(board[row - 1][col]) &&
    isSymbolCell(board[row - 2][col]) &&
    board[row - 1][col].symbol ===
    board[row - 2][col].symbol
  ) {

    possibilities =
      possibilities.filter(
        symbol =>
          symbol !==
          board[row - 1][col].symbol
      );

  }


  if (
    possibilities.length === 0
  ) {

    return randomSymbol();

  }


  return possibilities[
    Math.floor(
      Math.random() *
      possibilities.length
    )
  ];

}
function getSymbolData(id) {

  return SYMBOLS.find(
    symbol =>
      symbol.id === id
  );

}


function isSymbolCell(cell) {

  return (
    cell &&
    cell.type === "symbol"
  );

}


function isBlocker(cell) {

  return (
    cell &&
    (
      cell.type === "ice" ||
      cell.type === "stone" ||
      cell.type === "lock"
    )
  );

}


/* =========================================================
   ÉCRANS
========================================================= */

function showHome() {

  stopTimer();

  processing = false;
  paused = false;
  levelFinished = false;

  homeScreen.classList.add("active");

  gameScreen.classList.remove("active");
pathScreen.classList.remove("active");
  pauseMenu.classList.add("hidden");
  victoryScreen.classList.add("hidden");
  defeatScreen.classList.add("hidden");

  if (homeLevel) {

    homeLevel.textContent =
      currentLevel + 1;

  }

}


function showGame() {

  homeScreen.classList.remove("active");

  pathScreen.classList.remove("active");

  gameScreen.classList.add("active");

}


/* =========================================================
   LANCER NIVEAU
========================================================= */

function startLevel(levelIndex) {

  stopTimer();

  currentLevel =
    levelIndex ?? currentLevel;

  if (
    currentLevel < 0 ||
    currentLevel >= LEVELS.length
  ) {

    currentLevel = 0;

  }

  localStorage.setItem(
    STORAGE_LEVEL,
    currentLevel
  );

  score = 0;

  movesRemaining = 0;
  timeRemaining = 0;

  paused = false;
  processing = false;
  levelFinished = false;

  cascadeLevel = 1;
selectedCell = null;
  collected = {

  etoile: 0,
  poulpe: 0,
  hippocampe: 0,
  poisson: 0,
  meduse: 0,
  perle: 0

};

  pauseMenu.classList.add("hidden");
  victoryScreen.classList.add("hidden");
  defeatScreen.classList.add("hidden");

  showGame();

  createBoard();

  configureLevel();

  renderBoard();
renderObjectiveDisplay();
  updateInterface();

  gameMessage.textContent =
  "Déplace un symbole pour aligner au moins 3 symboles identiques.";

  if (
    LEVELS[currentLevel].mode === "time"
  ) {

    startTimer();

  }

}


/* =========================================================
   CONFIGURATION NIVEAU
========================================================= */

function configureLevel() {

  const level =
    LEVELS[currentLevel];

  levelNumber.textContent =
    currentLevel + 1;

  objectiveText.textContent =
    buildObjectiveText();

  if (
    level.mode === "time"
  ) {

    timeRemaining =
      level.time;

    timerBox.classList.remove("hidden");
    movesBox.classList.add("hidden");

  }

  else if (
    level.mode === "moves"
  ) {

    movesRemaining =
      level.moves;

    movesBox.classList.remove("hidden");
    timerBox.classList.add("hidden");

  }

  else {

    timerBox.classList.add("hidden");
    movesBox.classList.add("hidden");

  }

}


/* =========================================================
   OBJECTIF TEXTE
========================================================= */

function buildObjectiveText() {

  const level =
    LEVELS[currentLevel];

  const parts = [];

  Object.entries(
    level.objectives || {}
  ).forEach(([id, amount]) => {

    const data =
      getSymbolData(id);

    if (data) {

      parts.push(
        `${amount} ${data.name}`
      );

    }

  });

  if (
    level.clearBlocks
  ) {

    const count =
      level.blockers.filter(
        blocker =>
          blocker.type === "ice" ||
          blocker.type === "stone"
      ).length;

    if (count > 0) {

      parts.push(
        `${count} bloc${count > 1 ? "s" : ""}`
      );

    }

  }

  return parts.join(" + ");

}


/* =========================================================
   CRÉATION PLATEAU
========================================================= */

function createBoard() {

  board = [];

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    const line = [];

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      line.push(null);

    }

    board.push(line);

  }


  const level =
    LEVELS[currentLevel];


  /* =======================================================
     AJOUT DES BLOCS DU NIVEAU
  ======================================================= */

  level.blockers.forEach(blocker => {

    if (
      blocker.row < 0 ||
      blocker.row >= ROWS ||
      blocker.col < 0 ||
      blocker.col >= COLS
    ) {

      return;

    }


    if (
      blocker.type === "ice"
    ) {

      board[
        blocker.row
      ][
        blocker.col
      ] = {

        type: "ice",

        hp:
          blocker.hp || 1

      };

    }


    else if (
      blocker.type === "stone"
    ) {

      board[
        blocker.row
      ][
        blocker.col
      ] = {

        type: "stone",

        hp:
          blocker.hp || 2

      };

    }


    else if (
      blocker.type === "lock"
    ) {

      board[
        blocker.row
      ][
        blocker.col
      ] = {

        type: "lock",

        unlockSymbol:
          blocker.symbol,

        unlockAmount:
          blocker.amount

      };

    }

  });


  /* =======================================================
     REMPLISSAGE AVEC LES SYMBOLES

     startingSymbol évite d'avoir déjà
     des lignes de 3 au lancement.
  ======================================================= */

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      if (
        board[row][col] === null
      ) {

        board[row][col] = {

          type: "symbol",

          symbol:
            startingSymbol(
              row,
              col
            )

        };

      }

    }

  }


  /* =======================================================
     VÉRIFIER QU'IL EXISTE AU MOINS
     UN DÉPLACEMENT POSSIBLE
  ======================================================= */

  ensurePossibleMove();

}


/* =========================================================
   AFFICHAGE PLATEAU
========================================================= */

function renderBoard() {

  gameBoard.innerHTML = "";

  gameBoard.style.setProperty(
    "--columns",
    COLS
  );


  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      const cell =
        board[row][col];


      const tile =
        document.createElement(
          "button"
        );


      tile.type =
        "button";


      tile.className =
        "tile";


      tile.dataset.row =
        row;


      tile.dataset.col =
        col;


      /* =====================================================
         CASE VIDE
      ===================================================== */

      if (!cell) {

        tile.disabled =
          true;


        tile.classList.add(
          "tile-empty"
        );

      }


      /* =====================================================
         SYMBOLE
      ===================================================== */

      else if (
        cell.type === "symbol"
      ) {


        /* ===================================================
           BOMBE NEXUS
        =================================================== */

        if (
          cell.special ===
          "nexusBomb"
        ) {

          tile.classList.add(
            "nexus-bomb"
          );


          const bomb =
            document.createElement(
              "div"
            );


          bomb.className =
            "nexus-bomb-core";


          bomb.innerHTML =
            "<span>✦</span>";


          tile.appendChild(
            bomb
          );

        }


        /* ===================================================
           ONDE NEXUS
        =================================================== */

        else if (
          cell.special ===
          "nexusLine"
        ) {

          tile.classList.add(
            "nexus-line"
          );


          tile.classList.add(

            cell.direction ===
              "horizontal"

              ? "nexus-line-horizontal"

              : "nexus-line-vertical"

          );


          const wave =
            document.createElement(
              "div"
            );


          wave.className =
            "nexus-line-core";


          wave.innerHTML =
            "<span>✦</span>";


          tile.appendChild(
            wave
          );

        }


        /* ===================================================
           SYMBOLE NORMAL
        =================================================== */

        else {

          const data =
            getSymbolData(
              cell.symbol
            );


          const img =
            document.createElement(
              "img"
            );


          img.className =
            "symbol-img";


          img.src =
            data.image;


          img.alt =
            data.name;


          tile.appendChild(
            img
          );

        }


        /* ===================================================
           CLIC SUR LA CASE
        =================================================== */

        tile.addEventListener(
          "click",
          () => {

            handleTileClick(
              row,
              col
            );

          }
        );

      }


      /* =====================================================
         GLACE
      ===================================================== */

      else if (
        cell.type === "ice"
      ) {

        tile.classList.add(
          "blocked-ice"
        );


        tile.disabled =
          true;


        tile.innerHTML =
          `<span class="symbol">❄️</span>`;

      }


      /* =====================================================
         PIERRE
      ===================================================== */

      else if (
        cell.type === "stone"
      ) {

        tile.classList.add(
          "blocked-stone"
        );


        tile.disabled =
          true;


        tile.innerHTML =
          `<span class="symbol">🪨</span>`;

      }


      /* =====================================================
         CADENAS
      ===================================================== */

      else if (
        cell.type === "lock"
      ) {

        tile.classList.add(
          "locked"
        );


        tile.disabled =
          true;

      }


      gameBoard.appendChild(
        tile
      );

    }

  }

}

/* =========================================================
   CLIC JOUEUR
   DÉPLACEMENT DE DEUX SYMBOLES
========================================================= */

async function handleTileClick(
  row,
  col
) {

  if (
    processing ||
    paused ||
    levelFinished
  ) {

    return;

  }


  const cell =
    board[row][col];

/* =======================================================
   ONDE NEXUS
======================================================= */

if (
  cell &&
  cell.type === "symbol" &&
  cell.special === "nexusLine"
) {

  processing = true;

  selectedCell = null;

  clearSelectedCells();


  const level =
    LEVELS[currentLevel];


  if (
    level.mode === "moves"
  ) {

    movesRemaining--;

  }


  await activateNexusLine(
    row,
    col,
    cell.direction
  );


  if (
    checkVictory()
  ) {

    finishVictory();

    return;

  }


  await gravityAndRefill();


  let matches =
    findAllMatches();


  if (
    matches.length > 0
  ) {

    await resolveMatches(
      matches
    );

  }


  if (
    checkVictory()
  ) {

    finishVictory();

    return;

  }


  if (
    level.mode === "moves" &&
    movesRemaining <= 0
  ) {

    finishDefeat();

    return;

  }


  ensurePossibleMove();


  renderBoard();

  updateInterface();


  gameMessage.textContent =
    "Onde Nexus activée !";


  processing = false;

  return;

}
   
/* =======================================================
   BOMBE NEXUS
======================================================= */

if (
  cell &&
  cell.type === "symbol" &&
  cell.special === "nexusBomb"
) {

  processing = true;

  selectedCell = null;

  clearSelectedCells();


  const level =
    LEVELS[currentLevel];


  if (
    level.mode === "moves"
  ) {

    movesRemaining--;

  }


  await activateNexusBomb(
    row,
    col
  );


  if (
    checkVictory()
  ) {

    finishVictory();

    return;

  }


  await gravityAndRefill();


  let matches =
    findAllMatches();


  if (
    matches.length > 0
  ) {

    await resolveMatches(
      matches
    );

  }


  if (
    checkVictory()
  ) {

    finishVictory();

    return;

  }


  if (
    level.mode === "moves" &&
    movesRemaining <= 0
  ) {

    finishDefeat();

    return;

  }


  ensurePossibleMove();


  renderBoard();

  updateInterface();


  gameMessage.textContent =
    "Bombe Nexus activée !";


  processing = false;

  return;

}

  if (
    !isSymbolCell(cell)
  ) {

    return;

  }


  /* =======================================================
     PREMIER SYMBOLE
  ======================================================= */

  if (
    selectedCell === null
  ) {

    selectedCell = {
      row,
      col
    };


    showSelectedCell();


    gameMessage.textContent =
      "Choisis un symbole juste à côté.";

    return;

  }


  /* =======================================================
     RETOUCHER LE MÊME SYMBOLE
     = ANNULER LA SÉLECTION
  ======================================================= */

  if (
    selectedCell.row === row &&
    selectedCell.col === col
  ) {

    selectedCell = null;


    clearSelectedCells();


    gameMessage.textContent =
      "Déplace un symbole pour aligner au moins 3 symboles.";

    return;

  }


  /* =======================================================
     SI LE SECOND SYMBOLE N'EST PAS VOISIN,
     IL DEVIENT LA NOUVELLE SÉLECTION
  ======================================================= */

  if (
    !areAdjacent(
      selectedCell.row,
      selectedCell.col,
      row,
      col
    )
  ) {

    selectedCell = {
      row,
      col
    };


    clearSelectedCells();


    showSelectedCell();


    gameMessage.textContent =
      "Choisis un symbole juste à côté.";

    return;

  }


  /* =======================================================
     LES DEUX CASES SONT VOISINES :
     ON TENTE L'ÉCHANGE
  ======================================================= */

  processing = true;


  const first = {

    row:
      selectedCell.row,

    col:
      selectedCell.col

  };


  const second = {

    row,
    col

  };


  selectedCell = null;


  clearSelectedCells();


  swapCells(
    first,
    second
  );


  renderBoard();


  await animateSwap(
    first,
    second
  );


  /* =======================================================
     CHERCHER LES ALIGNEMENTS CRÉÉS
  ======================================================= */

  let matches =
    findAllMatches();


  /* =======================================================
     AUCUN ALIGNEMENT
     ON ANNULE LE DÉPLACEMENT
  ======================================================= */

  if (
    matches.length === 0
  ) {

    await animateInvalidSwap(
      first,
      second
    );


    swapCells(
      first,
      second
    );


    renderBoard();


    gameMessage.textContent =
      "Ce déplacement ne crée aucun alignement.";


    processing = false;

    return;

  }


  /* =======================================================
     COUP VALIDE
  ======================================================= */

  const level =
    LEVELS[currentLevel];


  if (
    level.mode === "moves"
  ) {

    movesRemaining--;

  }


  cascadeLevel = 1;


  await resolveMatches(
    matches
  );


  /* =======================================================
     VICTOIRE ?
  ======================================================= */

  if (
    checkVictory()
  ) {

    finishVictory();

    return;

  }


  /* =======================================================
     PLUS DE COUPS ?
  ======================================================= */

  if (
    level.mode === "moves" &&
    movesRemaining <= 0
  ) {

    finishDefeat();

    return;

  }


  /* =======================================================
     VÉRIFIER QU'UN AUTRE COUP EST POSSIBLE
  ======================================================= */

  ensurePossibleMove();


  renderBoard();


  updateInterface();


  comboDisplay.textContent =
    "RÉSONANCE ×1";


  gameMessage.textContent =
    "À toi de jouer.";


  processing = false;

}


/* =========================================================
   DEUX CASES SONT-ELLES VOISINES ?
========================================================= */

function areAdjacent(
  row1,
  col1,
  row2,
  col2
) {

  const rowDistance =
    Math.abs(
      row1 - row2
    );


  const colDistance =
    Math.abs(
      col1 - col2
    );


  return (
    rowDistance +
    colDistance
  ) === 1;

}


/* =========================================================
   ÉCHANGER DEUX CASES
========================================================= */

function swapCells(
  first,
  second
) {

  const temp =
    board[
      first.row
    ][
      first.col
    ];


  board[
    first.row
  ][
    first.col
  ] =
    board[
      second.row
    ][
      second.col
    ];


  board[
    second.row
  ][
    second.col
  ] =
    temp;

}


/* =========================================================
   AFFICHER LE SYMBOLE SÉLECTIONNÉ
========================================================= */

function showSelectedCell() {

  clearSelectedCells();


  if (
    !selectedCell
  ) {

    return;

  }


  const tile =
    getTile(
      selectedCell.row,
      selectedCell.col
    );


  if (tile) {

    tile.classList.add(
      "selected"
    );

  }

}


/* =========================================================
   ENLEVER LA SÉLECTION
========================================================= */

function clearSelectedCells() {

  const selectedTiles =
    gameBoard.querySelectorAll(
      ".tile.selected"
    );


  selectedTiles.forEach(
    tile => {

      tile.classList.remove(
        "selected"
      );

    }
  );

}


/* =========================================================
   ANIMATION ÉCHANGE
========================================================= */

async function animateSwap(
  first,
  second
) {

  const firstTile =
    getTile(
      first.row,
      first.col
    );


  const secondTile =
    getTile(
      second.row,
      second.col
    );


  if (
    !firstTile ||
    !secondTile
  ) {

    await sleep(220);

    return;

  }


  const firstRect =
    firstTile.getBoundingClientRect();


  const secondRect =
    secondTile.getBoundingClientRect();


  const dx =
    secondRect.left -
    firstRect.left;


  const dy =
    secondRect.top -
    firstRect.top;


  firstTile.animate(

    [

      {
        transform:
          `translate(${-dx}px, ${-dy}px)`
      },

      {
        transform:
          "translate(0, 0)"
      }

    ],

    {

      duration: 220,

      easing:
        "cubic-bezier(.2,.8,.2,1)"

    }

  );


  secondTile.animate(

    [

      {
        transform:
          `translate(${dx}px, ${dy}px)`
      },

      {
        transform:
          "translate(0, 0)"
      }

    ],

    {

      duration: 220,

      easing:
        "cubic-bezier(.2,.8,.2,1)"

    }

  );


  await sleep(220);

}


/* =========================================================
   ANIMATION DÉPLACEMENT IMPOSSIBLE
========================================================= */

async function animateInvalidSwap(
  first,
  second
) {

  const firstTile =
    getTile(
      first.row,
      first.col
    );


  const secondTile =
    getTile(
      second.row,
      second.col
    );


  const animation = [

    {
      transform:
        "translateX(0)"
    },

    {
      transform:
        "translateX(-5px)"
    },

    {
      transform:
        "translateX(5px)"
    },

    {
      transform:
        "translateX(0)"
    }

  ];


  const options = {

    duration: 220,

    easing:
      "ease-in-out"

  };


  if (firstTile) {

    firstTile.animate(
      animation,
      options
    );

  }


  if (secondTile) {

    secondTile.animate(
      animation,
      options
    );

  }


  await sleep(230);

}


/* =========================================================
   TROUVER TOUS LES ALIGNEMENTS
   3 OU PLUS
========================================================= */

function findAllMatches() {

  const matched =
    new Map();


  /* =======================================================
     ALIGNEMENTS HORIZONTAUX
  ======================================================= */

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    let col = 0;


    while (
      col < COLS
    ) {

      const cell =
        board[row][col];


      if (
        !isSymbolCell(cell)
      ) {

        col++;

        continue;

      }


      const symbol =
        cell.symbol;


      let end =
        col + 1;


      while (
        end < COLS &&
        isSymbolCell(
          board[row][end]
        ) &&
        board[row][end].symbol ===
        symbol
      ) {

        end++;

      }


      const length =
        end - col;


      if (
        length >= MATCH_SIZE
      ) {

        for (
          let currentCol = col;
          currentCol < end;
          currentCol++
        ) {

          matched.set(

            `${row}-${currentCol}`,

            {

              row,

              col:
                currentCol,

              symbol

            }

          );

        }

      }


      col = end;

    }

  }


  /* =======================================================
     ALIGNEMENTS VERTICAUX
  ======================================================= */

  for (
    let col = 0;
    col < COLS;
    col++
  ) {

    let row = 0;


    while (
      row < ROWS
    ) {

      const cell =
        board[row][col];


      if (
        !isSymbolCell(cell)
      ) {

        row++;

        continue;

      }


      const symbol =
        cell.symbol;


      let end =
        row + 1;


      while (
        end < ROWS &&
        isSymbolCell(
          board[end][col]
        ) &&
        board[end][col].symbol ===
        symbol
      ) {

        end++;

      }


      const length =
        end - row;


      if (
        length >= MATCH_SIZE
      ) {

        for (
          let currentRow = row;
          currentRow < end;
          currentRow++
        ) {

          matched.set(

            `${currentRow}-${col}`,

            {

              row:
                currentRow,

              col,

              symbol

            }

          );

        }

      }


      row = end;

    }

  }


  return createMatchGroups(

    Array.from(
      matched.values()
    )

  );

}


/* =========================================================
   REGROUPER LES ALIGNEMENTS CONNECTÉS
   POUR LES FORMES EN L OU EN T
========================================================= */

function createMatchGroups(
  positions
) {

  const groups = [];


  const map =
    new Map();


  positions.forEach(
    position => {

      map.set(

        `${position.row}-${position.col}`,

        position

      );

    }
  );


  const visited =
    new Set();


  positions.forEach(
    position => {

      const startKey =
        `${position.row}-${position.col}`;


      if (
        visited.has(startKey)
      ) {

        return;

      }


      const group = [];


      const stack = [
        position
      ];


      while (
        stack.length > 0
      ) {

        const current =
          stack.pop();


        const key =
          `${current.row}-${current.col}`;


        if (
          visited.has(key)
        ) {

          continue;

        }


        visited.add(key);


        group.push(
          current
        );


        const neighbours = [

          {
            row:
              current.row - 1,

            col:
              current.col
          },

          {
            row:
              current.row + 1,

            col:
              current.col
          },

          {
            row:
              current.row,

            col:
              current.col - 1
          },

          {
            row:
              current.row,

            col:
              current.col + 1
          }

        ];


        neighbours.forEach(
          neighbour => {

            const neighbourKey =
              `${neighbour.row}-${neighbour.col}`;


            const next =
              map.get(
                neighbourKey
              );


            if (
              next &&
              next.symbol ===
              current.symbol &&
              !visited.has(
                neighbourKey
              )
            ) {

              stack.push(
                next
              );

            }

          }
        );

      }


      if (
        group.length >=
        MATCH_SIZE
      ) {

        groups.push(
          group
        );

      }

    }
  );


  return groups;

}


/* =========================================================
   RÉSOUDRE LES ALIGNEMENTS
   PUIS LES CASCADES
========================================================= */

async function resolveMatches(
  initialMatches
) {

  let matches =
    initialMatches;


  cascadeLevel = 1;


  while (
    matches.length > 0
  ) {

    await removeMatchedGroups(
      matches,
      cascadeLevel
    );


    if (
      checkVictory()
    ) {

      return;

    }


    await gravityAndRefill();


    matches =
      findAllMatches();


    if (
      matches.length > 0
    ) {

      cascadeLevel++;


      comboDisplay.textContent =
        `RÉSONANCE ×${cascadeLevel}`;


      comboDisplay.classList.remove(
        "active"
      );


      void comboDisplay.offsetWidth;


      comboDisplay.classList.add(
        "active"
      );


      gameMessage.textContent =
        `Résonance ×${cascadeLevel} !`;

    }

  }

}


/* =========================================================
   SUPPRIMER LES ALIGNEMENTS

   3 = normal
   4 = Onde Nexus
   5+ = Bombe Nexus
========================================================= */

async function removeMatchedGroups(
  groups,
  multiplier
) {

  const uniquePositions =
    new Map();


  const specialsToCreate =
    new Map();


  groups.forEach(group => {

    if (
      group.length === 0
    ) {

      return;

    }


    /* =====================================================
       MATCH DE 5 OU PLUS
       BOMBE NEXUS
    ===================================================== */

    if (
      group.length >= 5
    ) {

      const specialPosition =
        chooseBombPosition(
          group
        );


      specialsToCreate.set(

        `${specialPosition.row}-${specialPosition.col}`,

        {

          row:
            specialPosition.row,

          col:
            specialPosition.col,

          symbol:
            group[0].symbol,

          special:
            "nexusBomb"

        }

      );

    }


    /* =====================================================
       MATCH DE 4
       ONDE NEXUS
    ===================================================== */

    else if (
      group.length === 4
    ) {

      const specialPosition =
        chooseBombPosition(
          group
        );


      const direction =
        getLineDirection(
          group
        );


      specialsToCreate.set(

        `${specialPosition.row}-${specialPosition.col}`,

        {

          row:
            specialPosition.row,

          col:
            specialPosition.col,

          symbol:
            group[0].symbol,

          special:
            "nexusLine",

          direction

        }

      );

    }


    /* =====================================================
       CASES À SUPPRIMER
    ===================================================== */

    group.forEach(position => {

      const key =
        `${position.row}-${position.col}`;


      if (
        specialsToCreate.has(key)
      ) {

        return;

      }


      uniquePositions.set(
        key,
        position
      );

    });

  });


  /* =======================================================
     ANIMATION
  ======================================================= */

  uniquePositions.forEach(position => {

    const tile =
      getTile(
        position.row,
        position.col
      );


    if (tile) {

      tile.classList.add(
        "removing"
      );

    }

  });


  await sleep(280);


  /* =======================================================
     OBJECTIFS + SCORE
  ======================================================= */

  groups.forEach(group => {

    if (
      group.length === 0
    ) {

      return;

    }


    const first =
      group[0];


    const cell =
      board[
        first.row
      ][
        first.col
      ];


    if (
      !isSymbolCell(cell)
    ) {

      return;

    }


    const symbol =
      cell.symbol;


    collected[symbol] +=
      group.length;


    score +=
      calculateGroupScore(
        group.length
      ) *
      multiplier;


    damageAdjacentBlocks(
      group
    );

  });


  /* =======================================================
     SUPPRESSION
  ======================================================= */

  uniquePositions.forEach(position => {

    board[
      position.row
    ][
      position.col
    ] = null;

  });


  /* =======================================================
     CRÉATION DES BONUS
  ======================================================= */

  let lineCount = 0;

  let bombCount = 0;


  specialsToCreate.forEach(
    special => {

      board[
        special.row
      ][
        special.col
      ] = {

        type:
          "symbol",

        symbol:
          special.symbol,

        special:
          special.special,

        direction:
          special.direction || null

      };


      if (
        special.special ===
        "nexusBomb"
      ) {

        bombCount++;

      }


      if (
        special.special ===
        "nexusLine"
      ) {

        lineCount++;

      }

    }
  );


  unlockThresholdBlocks();


  /* =======================================================
     BONUS SCORE
  ======================================================= */

  score +=
    (bombCount * 150) +
    (lineCount * 100);


  if (
    bombCount > 0
  ) {

    gameMessage.textContent =
      "Bombe Nexus créée !";

  }

  else if (
    lineCount > 0
  ) {

    gameMessage.textContent =
      "Onde Nexus créée !";

  }


  updateInterface();

}

/* =========================================================
   CHOISIR L'EMPLACEMENT DE LA BOMBE

   On choisit une position proche
   du centre du groupe.
========================================================= */

function chooseBombPosition(
  group
) {

  const averageRow =
    group.reduce(
      (total, position) =>
        total + position.row,
      0
    ) /
    group.length;


  const averageCol =
    group.reduce(
      (total, position) =>
        total + position.col,
      0
    ) /
    group.length;


  let best =
    group[0];


  let bestDistance =
    Infinity;


  group.forEach(position => {

    const distance =
      Math.abs(
        position.row -
        averageRow
      ) +
      Math.abs(
        position.col -
        averageCol
      );


    if (
      distance <
      bestDistance
    ) {

      best =
        position;

      bestDistance =
        distance;

    }

  });


  return best;

}

/* =========================================================
   DIRECTION D'UN ALIGNEMENT DE 4
========================================================= */

function getLineDirection(
  group
) {

  if (
    group.length < 2
  ) {

    return "horizontal";

  }


  /*
     Toutes les cases ont
     la même ligne
  */

  const firstRow =
    group[0].row;


  const horizontal =
    group.every(
      position =>
        position.row ===
        firstRow
    );


  if (
    horizontal
  ) {

    return "horizontal";

  }


  return "vertical";

}

  /* =========================================================
   ACTIVER UNE ONDE NEXUS

   horizontal = toute la ligne
   vertical   = toute la colonne
========================================================= */

async function activateNexusLine(
  centerRow,
  centerCol,
  direction
) {

  const positions = [];


  /* =======================================================
     LIGNE HORIZONTALE
  ======================================================= */

  if (
    direction ===
    "horizontal"
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      positions.push({

        row:
          centerRow,

        col

      });

    }

  }


  /* =======================================================
     COLONNE VERTICALE
  ======================================================= */

  else {

    for (
      let row = 0;
      row < ROWS;
      row++
    ) {

      positions.push({

        row,

        col:
          centerCol

      });

    }

  }


  /* =======================================================
     ANIMATION
  ======================================================= */

  positions.forEach(position => {

    const tile =
      getTile(
        position.row,
        position.col
      );


    if (tile) {

      tile.classList.add(
        direction === "horizontal"
          ? "nexus-line-horizontal-explosion"
          : "nexus-line-vertical-explosion"
      );

    }

  });


  gameMessage.textContent =
    direction === "horizontal"
      ? "ONDE NEXUS — LIGNE !"
      : "ONDE NEXUS — COLONNE !";


  await sleep(420);


  /* =======================================================
     DESTRUCTION
  ======================================================= */

  positions.forEach(position => {

    const cell =
      board[
        position.row
      ][
        position.col
      ];


    if (!cell) {

      return;

    }


    /* =========================
       SYMBOLES
    ========================== */

    if (
      cell.type === "symbol"
    ) {

      if (
        collected[
          cell.symbol
        ] !== undefined
      ) {

        collected[
          cell.symbol
        ]++;

      }


      score += 35;


      board[
        position.row
      ][
        position.col
      ] = null;


      return;

    }


    /* =========================
       GLACE / PIERRE
    ========================== */

    if (
      cell.type === "ice" ||
      cell.type === "stone"
    ) {

      cell.hp--;


      if (
        cell.hp <= 0
      ) {

        board[
          position.row
        ][
          position.col
        ] = null;


        score += 100;

      }

    }

  });


  unlockThresholdBlocks();


  score += 200;


  updateInterface();

} 
/* =========================================================
   ACTIVER UNE BOMBE NEXUS
   EXPLOSION 3 × 3
========================================================= */

async function activateNexusBomb(
  centerRow,
  centerCol
) {

  const positions = [];


  for (
    let row =
      centerRow - 1;

    row <=
      centerRow + 1;

    row++
  ) {

    for (
      let col =
        centerCol - 1;

      col <=
        centerCol + 1;

      col++
    ) {

      if (
        row < 0 ||
        row >= ROWS ||
        col < 0 ||
        col >= COLS
      ) {

        continue;

      }


      positions.push({
        row,
        col
      });

    }

  }


  /* =======================================================
     ANIMATION
  ======================================================= */

  positions.forEach(position => {

    const tile =
      getTile(
        position.row,
        position.col
      );


    if (tile) {

      tile.classList.add(
        "nexus-explosion"
      );

    }

  });


  gameMessage.textContent =
    "RÉSONANCE NEXUS !";


  await sleep(420);


  /* =======================================================
     DESTRUCTION
  ======================================================= */

  positions.forEach(position => {

    const cell =
      board[
        position.row
      ][
        position.col
      ];


    if (!cell) {

      return;

    }


    /* =========================
       SYMBOLE
    ========================== */

    if (
      cell.type === "symbol"
    ) {

      /*
         Le symbole compte
         dans les objectifs.
      */

      if (
        collected[
          cell.symbol
        ] !== undefined
      ) {

        collected[
          cell.symbol
        ]++;

      }


      score += 40;


      board[
        position.row
      ][
        position.col
      ] = null;


      return;

    }


    /* =========================
       GLACE / PIERRE
    ========================== */

    if (
      cell.type === "ice" ||
      cell.type === "stone"
    ) {

      cell.hp--;


      if (
        cell.hp <= 0
      ) {

        board[
          position.row
        ][
          position.col
        ] = null;


        score += 100;

      }

    }

  });


  unlockThresholdBlocks();


  score += 250;


  updateInterface();

}
   

/* =========================================================
   SCORE
========================================================= */

function calculateGroupScore(
  size
) {

  if (
    size === 3
  ) {

    return 30;

  }


  if (
    size === 4
  ) {

    return 70;

  }


  if (
    size === 5
  ) {

    return 130;

  }


  return (
    130 +
    ((size - 5) * 50)
  );

}


/* =========================================================
   VÉRIFIER QU'UN DÉPLACEMENT EST POSSIBLE
========================================================= */

function hasPossibleMove() {

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      if (
        !isSymbolCell(
          board[row][col]
        )
      ) {

        continue;

      }


      const neighbours = [

        {
          row,
          col:
            col + 1
        },

        {
          row:
            row + 1,
          col
        }

      ];


      for (
        const neighbour
        of neighbours
      ) {

        if (
          neighbour.row >= ROWS ||
          neighbour.col >= COLS
        ) {

          continue;

        }


        if (
          !isSymbolCell(
            board[
              neighbour.row
            ][
              neighbour.col
            ]
          )
        ) {

          continue;

        }


        const first = {
          row,
          col
        };


        const second = {

          row:
            neighbour.row,

          col:
            neighbour.col

        };


        swapCells(
          first,
          second
        );


        const createsMatch =
          findAllMatches().length > 0;


        swapCells(
          first,
          second
        );


        if (
          createsMatch
        ) {

          return true;

        }

      }

    }

  }


  return false;

}


/* =========================================================
   GARANTIR QU'IL EXISTE UN COUP
========================================================= */

function ensurePossibleMove() {

  if (
    hasPossibleMove()
  ) {

    return;

  }


  gameMessage.textContent =
    "Aucun déplacement possible. Mélange du Nexus…";


  reshuffleSymbols();

}


/* =========================================================
   MÉLANGER LE PLATEAU
========================================================= */

function reshuffleSymbols() {

  const positions = [];


  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      if (
        isSymbolCell(
          board[row][col]
        )
      ) {

        positions.push({
          row,
          col
        });

      }

    }

  }


  for (
    let attempt = 0;
    attempt < 100;
    attempt++
  ) {

    positions.forEach(
      position => {

        board[
          position.row
        ][
          position.col
        ].symbol =
          randomSymbol();

      }
    );


    if (
      findAllMatches().length === 0 &&
      hasPossibleMove()
    ) {

      renderBoard();

      return;

    }

  }


  createBoard();


  renderBoard();

}

/* =========================================================
   BLOCS ADJACENTS
========================================================= */

function damageAdjacentBlocks(group) {

  const damaged =
    new Set();

  group.forEach(position => {

    const neighbours = [

      {
        row:
          position.row - 1,
        col:
          position.col
      },

      {
        row:
          position.row + 1,
        col:
          position.col
      },

      {
        row:
          position.row,
        col:
          position.col - 1
      },

      {
        row:
          position.row,
        col:
          position.col + 1
      }

    ];

    neighbours.forEach(next => {

      if (
        next.row < 0 ||
        next.row >= ROWS ||
        next.col < 0 ||
        next.col >= COLS
      ) {

        return;

      }

      const key =
        `${next.row}-${next.col}`;

      if (
        damaged.has(key)
      ) {

        return;

      }

      const cell =
        board[next.row][next.col];

      if (
        !cell ||
        (
          cell.type !== "ice" &&
          cell.type !== "stone"
        )
      ) {

        return;

      }

      damaged.add(key);

      cell.hp--;

      if (
        cell.hp <= 0
      ) {

        board[
          next.row
        ][
          next.col
        ] = null;

        score += 100;

      }

    });

  });

}


/* =========================================================
   CADENAS
========================================================= */

function unlockThresholdBlocks() {

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      const cell =
        board[row][col];

      if (
        !cell ||
        cell.type !== "lock"
      ) {

        continue;

      }

      if (
        collected[
          cell.unlockSymbol
        ] >=
        cell.unlockAmount
      ) {

        board[row][col] =
          null;

        score += 150;

      }

    }

  }

}


/* =========================================================
   GRAVITÉ ET REMPLISSAGE
========================================================= */

async function gravityAndRefill() {

  const oldPositions =
    captureSymbolPositions();

  applyGravity();

  renderBoard();

  animateFallingTiles(
    oldPositions
  );

  await sleep(320);

  fillEmptyCells();

  renderBoard();

  animateNewTiles();

  await sleep(260);

}


/* =========================================================
   CAPTURER POSITIONS
========================================================= */

function captureSymbolPositions() {

  const positions = [];

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      const cell =
        board[row][col];

      if (
        isSymbolCell(cell)
      ) {

        positions.push({

          row,
          col,

          symbol:
            cell.symbol

        });

      }

    }

  }

  return positions;

}


/* =========================================================
   GRAVITÉ
========================================================= */

function applyGravity() {

  for (
    let col = 0;
    col < COLS;
    col++
  ) {

    let segmentBottom =
      ROWS - 1;

    while (
      segmentBottom >= 0
    ) {

      while (
        segmentBottom >= 0 &&
        isBlocker(
          board[
            segmentBottom
          ][col]
        )
      ) {

        segmentBottom--;

      }

      if (
        segmentBottom < 0
      ) {

        break;

      }

      let segmentTop =
        segmentBottom;

      while (
        segmentTop >= 0 &&
        !isBlocker(
          board[
            segmentTop
          ][col]
        )
      ) {

        segmentTop--;

      }

      const symbols = [];

      for (
        let row = segmentBottom;
        row > segmentTop;
        row--
      ) {

        if (
          isSymbolCell(
            board[row][col]
          )
        ) {

          symbols.push(
            board[row][col]
          );

        }

      }

      for (
        let row = segmentBottom;
        row > segmentTop;
        row--
      ) {

        board[row][col] =
          null;

      }

      let writeRow =
        segmentBottom;

      symbols.forEach(symbol => {

        board[
          writeRow
        ][col] =
          symbol;

        writeRow--;

      });

      segmentBottom =
        segmentTop - 1;

    }

  }

}


/* =========================================================
   ANIMATION CHUTE
========================================================= */

function animateFallingTiles() {

  const tiles =
    gameBoard.querySelectorAll(
      ".tile"
    );

  tiles.forEach(tile => {

    if (
      tile.classList.contains(
        "blocked-ice"
      ) ||
      tile.classList.contains(
        "blocked-stone"
      ) ||
      tile.classList.contains(
        "locked"
      )
    ) {

      return;

    }

    tile.animate(
      [

        {
          transform:
            "translateY(-28px)",

          opacity:
            0.6
        },

        {
          transform:
            "translateY(4px)",

          opacity:
            1
        },

        {
          transform:
            "translateY(0)",

          opacity:
            1
        }

      ],

      {
        duration: 320,
        easing: "cubic-bezier(.2,.9,.2,1)"
      }
    );

  });

}


/* =========================================================
   REMPLIR LES VIDES
========================================================= */

function fillEmptyCells() {

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      if (
        board[row][col] === null
      ) {

        board[row][col] = {

          type: "symbol",

          symbol:
            randomSymbol()

        };

      }

    }

  }

}


/* =========================================================
   ANIMATION NOUVELLES PIÈCES
========================================================= */

function animateNewTiles() {

  const tiles =
    gameBoard.querySelectorAll(
      ".tile"
    );

  tiles.forEach(tile => {

    if (
      tile.disabled
    ) {

      return;

    }

    tile.animate(
      [

        {
          transform:
            "translateY(-40px) scale(.8)",

          opacity:
            0
        },

        {
          transform:
            "translateY(4px) scale(1.03)",

          opacity:
            1
        },

        {
          transform:
            "translateY(0) scale(1)",

          opacity:
            1
        }

      ],

      {
        duration: 300,
        easing: "cubic-bezier(.2,.9,.2,1)"
      }
    );

  });

}






/* =========================================================
   VICTOIRE
========================================================= */

function checkVictory() {

  const level =
    LEVELS[currentLevel];

  for (
    const [symbol, target]
    of Object.entries(
      level.objectives || {}
    )
  ) {

    if (
      collected[symbol] <
      target
    ) {

      return false;

    }

  }

  if (
    level.clearBlocks
  ) {

    for (
      let row = 0;
      row < ROWS;
      row++
    ) {

      for (
        let col = 0;
        col < COLS;
        col++
      ) {

        const cell =
          board[row][col];

        if (
          cell &&
          (
            cell.type === "ice" ||
            cell.type === "stone"
          )
        ) {

          return false;

        }

      }

    }

  }

  return true;

}


/* =========================================================
   PROGRESSION
========================================================= */

function getObjectiveProgress() {

  const level =
    LEVELS[currentLevel];

  let current = 0;
  let target = 0;

  Object.entries(
    level.objectives || {}
  ).forEach(([symbol, amount]) => {

    target += amount;

    current +=
      Math.min(
        collected[symbol],
        amount
      );

  });

  return {

    current,
    target

  };

}



/* =========================================================
   INTERFACE
========================================================= */

function updateInterface() {

  scoreDisplay.textContent =
    score;


  timerDisplay.textContent =
    timeRemaining;


  movesDisplay.textContent =
    Math.max(
      0,
      movesRemaining
    );


  renderObjectiveDisplay();

}


/* =========================================================
   CHRONO
========================================================= */

function startTimer() {

  stopTimer();

  timerInterval =
    setInterval(() => {

      if (
        paused ||
        processing ||
        levelFinished
      ) {

        return;

      }

      timeRemaining--;

      if (
        timeRemaining <= 0
      ) {

        timeRemaining = 0;

        updateInterface();

        stopTimer();

        if (
          checkVictory()
        ) {

          finishVictory();

        }

        else {

          finishDefeat();

        }

        return;

      }

      updateInterface();

    }, 1000);

}


/* =========================================================
   STOP TIMER
========================================================= */

function stopTimer() {

  if (
    timerInterval
  ) {

    clearInterval(
      timerInterval
    );

    timerInterval = null;

  }

}


/* =========================================================
   VICTOIRE
========================================================= */

function finishVictory() {

  if (
    levelFinished
  ) {

    return;

  }


  levelFinished = true;

  processing = false;

  stopTimer();


  victoryScore.textContent =
    score;


  /*
     Niveau maximum désormais débloqué
  */

  const unlockedLevel =
    Math.min(
      currentLevel + 2,
      LEVELS.length
    );


  const previousUnlocked =
    Number(
      localStorage.getItem(
        STORAGE_UNLOCKED
      )
    ) || 1;


  if (
    unlockedLevel >
    previousUnlocked
  ) {

    localStorage.setItem(
      STORAGE_UNLOCKED,
      unlockedLevel
    );

  }


  victoryScreen.classList.remove(
    "hidden"
  );

}


/* =========================================================
   DÉFAITE
========================================================= */

function finishDefeat() {

  levelFinished = true;

  processing = false;

  stopTimer();

  defeatScreen.classList.remove(
    "hidden"
  );

}


/* =========================================================
   CASE HTML
========================================================= */

function getTile(
  row,
  col
) {

  return gameBoard.querySelector(
    `.tile[data-row="${row}"][data-col="${col}"]`
  );

}


/* =========================================================
   FLASH CASE INVALIDE
========================================================= */

function flashTile(
  row,
  col
) {

  const tile =
    getTile(
      row,
      col
    );

  if (!tile) {

    return;

  }

  tile.animate(
    [

      {
        transform:
          "scale(1)"
      },

      {
        transform:
          "scale(.9)"
      },

      {
        transform:
          "scale(1)"
      }

    ],

    {
      duration: 180
    }
  );

}


/* =========================================================
   DÉCORS DES DIFFÉRENTES ZONES
========================================================= */

const PATH_BACKGROUNDS = {

  1:
    "Images/Parcours/parcours-ocean-fantastique.PNG",

  2:
    "Images/Parcours/parcours-ocean-fantastique2.PNG",

  3:
    "Images/Parcours/parcours-ocean-fantastique3.PNG",

  4:
    "Images/Parcours/parcours-ocean-fantastique4.PNG",

  5:
    "Images/Parcours/parcours-ocean-fantastique5.PNG",

  6:
    "Images/Parcours/parcours-ocean-fantastique6.PNG",

  7:
    "Images/Parcours/parcours-ocean-fantastique7.PNG",

  8:
    "Images/Parcours/parcours-ocean-fantastique8.PNG",

  9:
    "Images/Parcours/parcours-ocean-fantastique9.PNG",

  10:
    "Images/Parcours/parcours-ocean-fantastique10.PNG",

  11:
    "Images/Parcours/parcours-ocean-fantastique11.PNG",

  12:
    "Images/Parcours/parcours-ocean-fantastique12.PNG",

  13:
    "Images/Parcours/parcours-ocean-fantastique13.PNG",

  14:
    "Images/Parcours/parcours-ocean-fantastique14.PNG"

};


/* =========================================================
   CONFIGURER LA ZONE DU PARCOURS

   1 à 10   = zone 1
   11 à 20  = zone 2
   21 à 30  = zone 3
   etc.
========================================================= */

function configurePathZone(
  referenceLevel
) {

  const safeLevel =
    Math.max(
      1,
      referenceLevel
    );


  const zone =
    Math.ceil(
      safeLevel / 10
    );


  const firstLevel =
    ((zone - 1) * 10) + 1;


  /* =======================================================
     CHANGER LE DÉCOR
  ======================================================= */

  const background =
    PATH_BACKGROUNDS[zone];


  if (
    background &&
    pathBackground
  ) {

    pathBackground.src =
      background;

  }


  /* =======================================================
     TRANSFORMER LES 10 BULLES

     Exemple zone 3 :
     21,22,23...30
  ======================================================= */

  pathNodes.forEach(
    (node, index) => {

      const levelNumber =
        firstLevel + index;


      node.dataset.level =
        levelNumber;


      const circle =
        node.querySelector(
          ".node-circle"
        );


      const label =
        node.querySelector(
          ".node-label"
        );


      if (circle) {

        circle.textContent =
          levelNumber;

      }


      /*
         Le nom est récupéré directement
         dans LEVELS.
      */

      const levelData =
        LEVELS[
          levelNumber - 1
        ];


      if (
        label &&
        levelData
      ) {

        label.textContent =
          levelData.name;

      }


      /*
         Si le niveau n'existe pas encore,
         on cache sa bulle.

         Utile actuellement pour 51 à 60
         tant qu'ils ne sont pas créés.
      */

      if (
        levelNumber >
        LEVELS.length
      ) {

        node.style.display =
          "none";

      }

      else {

        node.style.display =
          "flex";

      }

    }
  );

}

   

/* =========================================================
   PARCOURS SOUS-MARIN
========================================================= */

function showPathAfterVictory() {
pathOpenedFromMenu = false;
  stopTimer();

  homeScreen.classList.remove("active");

  gameScreen.classList.remove("active");

  victoryScreen.classList.add("hidden");

  defeatScreen.classList.add("hidden");

  pauseMenu.classList.add("hidden");

  pathScreen.classList.add("active");


  const completedLevel =
    currentLevel + 1;


  const nextLevel =
    currentLevel + 2;
const pathReferenceLevel =
  nextLevel <= LEVELS.length
    ? nextLevel
    : completedLevel;


configurePathZone(
  pathReferenceLevel
);

  /* -------------------------------------------------------
     NETTOYER LES CLASSES
  ------------------------------------------------------- */

  pathNodes.forEach(node => {

    node.classList.remove(
      "completed",
      "current",
      "locked-path",
      "unlocking-path"
    );

  });


  /* -------------------------------------------------------
     ÉTAT DES NIVEAUX
  ------------------------------------------------------- */

  pathNodes.forEach(node => {

    const level =
      Number(
        node.dataset.level
      );


    /*
       Niveaux déjà terminés
    */

    if (
      level <=
      completedLevel
    ) {

      node.classList.add(
        "completed"
      );

    }


    /*
       Prochain niveau
    */

    else if (
      level ===
      nextLevel &&
      nextLevel <=
      LEVELS.length
    ) {

      node.classList.add(
        "current"
      );

    }


    /*
       Futurs niveaux
    */

    else {

      node.classList.add(
        "locked-path"
      );

    }

  });


  /* -------------------------------------------------------
     MESSAGE
  ------------------------------------------------------- */

  const continuePathBtn =
  document.getElementById("continuePathBtn");


  /* -------------------------------------------------------
     ANIMATION DU PROCHAIN NIVEAU
  ------------------------------------------------------- */

  if (
    nextLevel <=
    LEVELS.length
  ) {

    const nextNode =
      document.querySelector(
        `.path-node[data-level="${nextLevel}"]`
      );


    if (nextNode) {

      setTimeout(() => {

        nextNode.classList.add(
          "unlocking-path"
        );

      }, 450);


      setTimeout(() => {

        nextNode.classList.remove(
          "unlocking-path"
        );

        nextNode.classList.add(
          "current"
        );

      }, 1500);

    }

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

/* =========================================================
   OUVRIR LE PARCOURS DEPUIS LE MENU
========================================================= */

function showPathFromMenu() {
pathOpenedFromMenu = true;
  homeScreen.classList.remove("active");

  gameScreen.classList.remove("active");

  victoryScreen.classList.add("hidden");

  defeatScreen.classList.add("hidden");

  pauseMenu.classList.add("hidden");

  pathScreen.classList.add("active");


  /*
     Afficher les niveaux selon
     la progression actuelle
  */

  const unlockedLevel =
    Number(
      localStorage.getItem(
        STORAGE_UNLOCKED
      )
    ) || 1;

configurePathZone(
  unlockedLevel
);
  pathNodes.forEach(node => {

    node.classList.remove(
      "completed",
      "current",
      "locked-path",
      "unlocking-path"
    );


    const level =
      Number(
        node.dataset.level
      );


    if (
      level < unlockedLevel
    ) {

      node.classList.add(
        "completed"
      );

    }

    else if (
      level === unlockedLevel
    ) {

      node.classList.add(
        "current"
      );

    }

    else {

      node.classList.add(
        "locked-path"
      );

    }

  });


  pathMessage.textContent =
    `Progression actuelle : niveau ${unlockedLevel}.`;


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

/* =========================================================
   BOUTONS
========================================================= */

playBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);

/* =========================================================
   RÉINITIALISER LA PROGRESSION
========================================================= */

resetProgressBtn.addEventListener(
  "click",
  () => {

    const confirmation =
      confirm(
        "Recommencer NEXUS RESONANCE depuis le niveau 1 ?"
      );


    if (!confirmation) {

      return;

    }


    /* remettre le niveau à zéro */

    currentLevel = 0;


    /* supprimer les sauvegardes */

    localStorage.removeItem(
      "nexusResonance_level"
    );

    localStorage.removeItem(
      "nexusResonance_unlocked"
    );


    /* actualiser l'accueil */

    showHome();

  }
);

pathMenuBtn.addEventListener("click", () => {

  paused = true;

  pauseMenu.classList.add("hidden");

  showPathFromMenu();

});

   
menuBtn.addEventListener(
  "click",
  () => {

    if (
      levelFinished
    ) {

      return;

    }

    paused = true;

    pauseMenu.classList.remove(
      "hidden"
    );

  }
);


resumeBtn.addEventListener(
  "click",
  () => {

    pauseMenu.classList.add(
      "hidden"
    );

    paused = false;

  }
);


restartBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);


homeBtn.addEventListener(
  "click",
  () => {

    showHome();

  }
);


victoryRestartBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);


nextLevelBtn.addEventListener(
  "click",
  () => {

    showPathAfterVictory();

  }
);


defeatRestartBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);


defeatHomeBtn.addEventListener(
  "click",
  () => {

    showHome();

  }
);
/* =========================================================
   CLIC SUR UN NIVEAU DU PARCOURS
========================================================= */

pathNodes.forEach(node => {

  node.addEventListener(
    "click",
    () => {

      if (
        !pathScreen.classList.contains("active")
      ) {

        return;

      }


      const selectedLevel =
        Number(
          node.dataset.level
        );


      const nextLevel =
        currentLevel + 2;


      /*
         Seul le niveau qui vient
         d'être débloqué est cliquable.
      */

      if (
        selectedLevel !== nextLevel
      ) {

        return;

      }


      if (
        selectedLevel >
        LEVELS.length
      ) {

        return;

      }


      currentLevel =
        selectedLevel - 1;


      localStorage.setItem(
        STORAGE_LEVEL,
        currentLevel
      );


      startLevel(
        currentLevel
      );

    }
  );

});


pathHomeBtn.addEventListener("click", () => {

  if (pathOpenedFromMenu) {

    pathOpenedFromMenu = false;

    pathScreen.classList.remove("active");

    gameScreen.classList.add("active");

    paused = false;

    updateInterface();

    return;

  }

  showHome();

});

/* =========================================================
   DÉMARRAGE
========================================================= */

showHome();


});
