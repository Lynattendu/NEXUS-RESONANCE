/* =========================================================
   NEXUS RESONANCE
   SCRIPT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const homeScreen =
  document.getElementById("homeScreen");

const gameScreen =
  document.getElementById("gameScreen");

const playBtn =
  document.getElementById("playBtn");

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
   PARAMÈTRES GÉNÉRAUX
========================================================= */

const COLS = 7;
const ROWS = 8;

const MIN_GROUP_SIZE = 2;

const MAX_CASCADE = 20;


/* =========================================================
   SYMBOLES

   Plus tard, on pourra remplacer les emojis
   par nos propres images.
========================================================= */

const SYMBOLS = [

  {
    id: "moon",
    icon: "🌙",
    name: "lunes"
  },

  {
    id: "fire",
    icon: "🔥",
    name: "flammes"
  },

  {
    id: "water",
    icon: "💧",
    name: "gouttes"
  },

  {
    id: "leaf",
    icon: "🌿",
    name: "feuilles"
  },

  {
    id: "lightning",
    icon: "⚡",
    name: "éclairs"
  },

  {
    id: "crystal",
    icon: "💎",
    name: "cristaux"
  }

];


/* =========================================================
   NIVEAUX
========================================================= */

const LEVELS = [


/* ---------------------------------------------------------
   NIVEAU 1
   Aucun chrono
--------------------------------------------------------- */

{
  name: "Première résonance",

  mode: "free",

  objectives: {
    moon: 20
  },

  blockers: []
},


/* ---------------------------------------------------------
   NIVEAU 2
   Chronométré
--------------------------------------------------------- */

{
  name: "Feu intérieur",

  mode: "time",

  time: 60,

  objectives: {
    fire: 25
  },

  blockers: []
},


/* ---------------------------------------------------------
   NIVEAU 3
   Nombre de coups limité
--------------------------------------------------------- */

{
  name: "Double fréquence",

  mode: "moves",

  moves: 22,

  objectives: {
    moon: 15,
    lightning: 15
  },

  blockers: []
},


/* ---------------------------------------------------------
   NIVEAU 4
   Glace
   Les blocs se cassent lorsqu'un groupe disparaît à côté.
--------------------------------------------------------- */

{
  name: "Cœur de glace",

  mode: "time",

  time: 75,

  objectives: {
    water: 25
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


/* ---------------------------------------------------------
   NIVEAU 5
   Cadenas
   Les cases s'ouvrent après 12 lunes disparues.
--------------------------------------------------------- */

{
  name: "Le sceau lunaire",

  mode: "moves",

  moves: 28,

  objectives: {
    moon: 25,
    fire: 15
  },

  blockers: [

    {
      row: 3,
      col: 2,
      type: "lock",
      symbol: "moon",
      amount: 12
    },

    {
      row: 3,
      col: 3,
      type: "lock",
      symbol: "moon",
      amount: 12
    },

    {
      row: 3,
      col: 4,
      type: "lock",
      symbol: "moon",
      amount: 12
    }

  ]
},


/* ---------------------------------------------------------
   NIVEAU 6
   Pierre renforcée
   Il faut créer deux groupes à côté pour la casser.
--------------------------------------------------------- */

{
  name: "Nexus fracturé",

  mode: "time",

  time: 90,

  objectives: {
    crystal: 20,
    leaf: 20
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
   VARIABLES DU JEU
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

let processing = false;

let levelFinished = false;

let cascadeLevel = 1;


/* =========================================================
   COMPTEURS DES SYMBOLES DISPARUS
========================================================= */

let collected = {

  moon: 0,
  fire: 0,
  water: 0,
  leaf: 0,
  lightning: 0,
  crystal: 0

};


/* =========================================================
   OUTIL ATTENTE
========================================================= */

function sleep(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

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

  pauseMenu.classList.add("hidden");

  victoryScreen.classList.add("hidden");

  defeatScreen.classList.add("hidden");

}


function showGame() {

  homeScreen.classList.remove("active");

  gameScreen.classList.add("active");

}


/* =========================================================
   LANCER UN NIVEAU
========================================================= */

function startLevel(levelIndex = currentLevel) {

  stopTimer();

  currentLevel = levelIndex;

  if (currentLevel >= LEVELS.length) {

    currentLevel = 0;

  }

  localStorage.setItem(
    STORAGE_LEVEL,
    currentLevel
  );


  score = 0;

  movesRemaining = 0;

  timeRemaining = 0;

  cascadeLevel = 1;

  processing = false;

  paused = false;

  levelFinished = false;


  collected = {

    moon: 0,
    fire: 0,
    water: 0,
    leaf: 0,
    lightning: 0,
    crystal: 0

  };


  victoryScreen.classList.add("hidden");

  defeatScreen.classList.add("hidden");

  pauseMenu.classList.add("hidden");


  showGame();


  createBoard();

  configureLevel();

  renderBoard();

  updateInterface();


  gameMessage.textContent =
    "Sélectionne un groupe d'au moins 2 symboles identiques.";


  const level =
    LEVELS[currentLevel];


  if (level.mode === "time") {

    startTimer();

  }

}


/* =========================================================
   CONFIGURATION DU NIVEAU
========================================================= */

function configureLevel() {

  const level =
    LEVELS[currentLevel];


  levelNumber.textContent =
    currentLevel + 1;


  if (level.mode === "time") {

    timeRemaining =
      level.time;

    timerBox.classList.remove("hidden");

    movesBox.classList.add("hidden");

  }


  else if (level.mode === "moves") {

    movesRemaining =
      level.moves;

    movesBox.classList.remove("hidden");

    timerBox.classList.add("hidden");

  }


  else {

    timerBox.classList.add("hidden");

    movesBox.classList.add("hidden");

  }


  objectiveText.textContent =
    buildObjectiveText();

}


/* =========================================================
   TEXTE OBJECTIF
========================================================= */

function buildObjectiveText() {

  const level =
    LEVELS[currentLevel];

  const parts = [];


  Object.entries(
    level.objectives || {}
  ).forEach(([symbolId, amount]) => {

    const symbol =
      getSymbolData(symbolId);

    if (!symbol) return;

    parts.push(
      `${amount} ${symbol.name}`
    );

  });


  if (level.clearBlocks) {

    const breakableBlocks =
      level.blockers.filter(blocker =>

        blocker.type === "ice" ||
        blocker.type === "stone"

      ).length;


    if (breakableBlocks > 0) {

      parts.push(
        `${breakableBlocks} bloc${
          breakableBlocks > 1 ? "s" : ""
        }`
      );

    }

  }


  return parts.join(" + ");

}


/* =========================================================
   CRÉATION DU PLATEAU
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


  /* -------------------------------------------------------
     Ajouter les blocs du niveau
  ------------------------------------------------------- */

  const level =
    LEVELS[currentLevel];


  level.blockers.forEach(blocker => {

    if (
      blocker.row < 0 ||
      blocker.row >= ROWS ||
      blocker.col < 0 ||
      blocker.col >= COLS
    ) {

      return;

    }


    if (blocker.type === "ice") {

      board[blocker.row][blocker.col] = {

        type: "ice",

        hp:
          blocker.hp || 1

      };

    }


    else if (
      blocker.type === "stone"
    ) {

      board[blocker.row][blocker.col] = {

        type: "stone",

        hp:
          blocker.hp || 2

      };

    }


    else if (
      blocker.type === "lock"
    ) {

      board[blocker.row][blocker.col] = {

        type: "lock",

        unlockSymbol:
          blocker.symbol,

        unlockAmount:
          blocker.amount

      };

    }

  });


  /* -------------------------------------------------------
     Remplir les cases libres
     On évite de créer des groupes dès le départ.
  ------------------------------------------------------- */

  for (
    let row = ROWS - 1;
    row >= 0;
    row--
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      if (board[row][col] !== null) {

        continue;

      }


      board[row][col] = {

        type: "symbol",

        symbol:
          chooseSafeSymbol(
            row,
            col
          )

      };

    }

  }


  ensurePlayableBoard();

}


/* =========================================================
   CHOISIR UN SYMBOLE
   On évite autant que possible de créer une paire
   lors du remplissage.
========================================================= */

function chooseSafeSymbol(row, col) {

  let possibilities =
    SYMBOLS.map(symbol => symbol.id);


  const forbidden = [];


  /* symbole en dessous */

  if (
    row + 1 < ROWS &&
    isSymbolCell(
      board[row + 1][col]
    )
  ) {

    forbidden.push(
      board[row + 1][col].symbol
    );

  }


  /* symbole à gauche */

  if (
    col - 1 >= 0 &&
    isSymbolCell(
      board[row][col - 1]
    )
  ) {

    forbidden.push(
      board[row][col - 1].symbol
    );

  }


  possibilities =
    possibilities.filter(symbol =>

      !forbidden.includes(symbol)

    );


  if (
    possibilities.length === 0
  ) {

    possibilities =
      SYMBOLS.map(symbol => symbol.id);

  }


  return possibilities[
    Math.floor(
      Math.random() *
      possibilities.length
    )
  ];

}


/* =========================================================
   VÉRIFIER UNE CASE SYMBOLE
========================================================= */

function isSymbolCell(cell) {

  return (
    cell &&
    cell.type === "symbol" &&
    cell.symbol
  );

}


/* =========================================================
   AFFICHAGE DU PLATEAU
========================================================= */

function renderBoard(options = {}) {

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
        document.createElement("button");


      tile.type = "button";

      tile.classList.add("tile");


      tile.dataset.row = row;

      tile.dataset.col = col;


      /* ---------------------------------------------------
         CASE VIDE
      --------------------------------------------------- */

      if (!cell) {

        tile.disabled = true;

        tile.style.opacity = "0";

      }


      /* ---------------------------------------------------
         SYMBOLE
      --------------------------------------------------- */

      else if (
        cell.type === "symbol"
      ) {

        const symbol =
          getSymbolData(
            cell.symbol
          );


        tile.classList.add(
          cell.symbol
        );


        if (
          options.falling
        ) {

          tile.classList.add(
            "falling"
          );

        }


        if (
          options.newTiles
        ) {

          tile.classList.add(
            "new-tile"
          );

        }


        const span =
          document.createElement("span");

        span.className =
          "symbol";

        span.textContent =
          symbol.icon;


        tile.appendChild(span);


        tile.setAttribute(
          "aria-label",
          symbol.name
        );


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


      /* ---------------------------------------------------
         GLACE
      --------------------------------------------------- */

      else if (
        cell.type === "ice"
      ) {

        tile.classList.add(
          "blocked-ice"
        );

        tile.disabled = true;

        tile.innerHTML =
          `<span class="symbol">❄️</span>`;

      }


      /* ---------------------------------------------------
         PIERRE
      --------------------------------------------------- */

      else if (
        cell.type === "stone"
      ) {

        tile.classList.add(
          "blocked-stone"
        );

        tile.disabled = true;


        tile.innerHTML =
          `<span class="symbol">${
            cell.hp >= 2
              ? "🪨"
              : "◈"
          }</span>`;

      }


      /* ---------------------------------------------------
         CADENAS
      --------------------------------------------------- */

      else if (
        cell.type === "lock"
      ) {

        tile.classList.add(
          "locked"
        );

        tile.disabled = true;

      }


      gameBoard.appendChild(
        tile
      );

    }

  }

}


/* =========================================================
   CLIC SUR UNE CASE
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


  if (!isSymbolCell(cell)) {

    return;

  }


  const group =
    findGroup(
      row,
      col
    );


  if (
    group.length <
    MIN_GROUP_SIZE
  ) {

    gameMessage.textContent =
      "Il faut au moins 2 symboles identiques.";

    flashTile(
      row,
      col
    );

    return;

  }


  /* -------------------------------------------------------
     Un vrai coup est joué
  ------------------------------------------------------- */

  processing = true;


  const level =
    LEVELS[currentLevel];


  if (
    level.mode === "moves"
  ) {

    movesRemaining--;

  }


  cascadeLevel = 1;


  await removeGroup(
    group,
    false
  );


  if (checkVictory()) {

    finishVictory();

    return;

  }


  await resolveBoard();


  if (checkVictory()) {

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


  ensurePlayableBoard();

  renderBoard();

  updateInterface();


  processing = false;

}


/* =========================================================
   TROUVER UN GROUPE CONNECTÉ

   Connexion :
   haut / bas / gauche / droite
========================================================= */

function findGroup(
  startRow,
  startCol
) {

  const startCell =
    board[startRow][startCol];


  if (
    !isSymbolCell(startCell)
  ) {

    return [];

  }


  const targetSymbol =
    startCell.symbol;


  const visited =
    new Set();


  const group = [];


  const stack = [
    {
      row: startRow,
      col: startCol
    }
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


    if (
      current.row < 0 ||
      current.row >= ROWS ||
      current.col < 0 ||
      current.col >= COLS
    ) {

      continue;

    }


    const cell =
      board[current.row][current.col];


    if (
      !isSymbolCell(cell) ||
      cell.symbol !== targetSymbol
    ) {

      continue;

    }


    group.push({
      row:
        current.row,

      col:
        current.col
    });


    stack.push(
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
    );

  }


  return group;

}


/* =========================================================
   SUPPRIMER UN GROUPE
========================================================= */

async function removeGroup(
  group,
  automaticCascade
) {

  if (
    group.length === 0
  ) {

    return;

  }


  const symbolId =
    board[
      group[0].row
    ][
      group[0].col
    ].symbol;


  /* -------------------------------------------------------
     Animation de sélection
  ------------------------------------------------------- */

  group.forEach(position => {

    const tile =
      getTile(
        position.row,
        position.col
      );


    if (tile) {

      tile.classList.add(
        "selected"
      );

    }

  });


  await sleep(100);


  /* -------------------------------------------------------
     Animation disparition
  ------------------------------------------------------- */

  group.forEach(position => {

    const tile =
      getTile(
        position.row,
        position.col
      );


    if (tile) {

      tile.classList.remove(
        "selected"
      );

      tile.classList.add(
        "removing"
      );

    }

  });


  await sleep(300);


  /* -------------------------------------------------------
     Comptabiliser les symboles
  ------------------------------------------------------- */

  collected[symbolId] +=
    group.length;


  /* -------------------------------------------------------
     Score
  ------------------------------------------------------- */

  const baseScore =
    calculateGroupScore(
      group.length
    );


  const multiplier =
    automaticCascade
      ? cascadeLevel
      : 1;


  score +=
    baseScore *
    multiplier;


  /* -------------------------------------------------------
     Casser les blocs à côté
  ------------------------------------------------------- */

  damageAdjacentBlocks(
    group
  );


  /* -------------------------------------------------------
     Supprimer réellement les symboles
  ------------------------------------------------------- */

  group.forEach(position => {

    board[
      position.row
    ][
      position.col
    ] = null;

  });


  /* -------------------------------------------------------
     Vérifier les cadenas
  ------------------------------------------------------- */

  unlockThresholdBlocks();


  updateInterface();


  /* -------------------------------------------------------
     Message combo
  ------------------------------------------------------- */

  if (
    automaticCascade
  ) {

    comboDisplay.textContent =
      `COMBO ×${cascadeLevel}`;

    comboDisplay.classList.remove(
      "active"
    );


    void comboDisplay.offsetWidth;


    comboDisplay.classList.add(
      "active"
    );


    gameMessage.textContent =
      `Réaction en chaîne ×${cascadeLevel} !`;

  }

  else {

    comboDisplay.textContent =
      "COMBO ×1";


    gameMessage.textContent =
      `${group.length} symboles en résonance`;

  }


  gameBoard.classList.add(
    "board-success"
  );


  setTimeout(() => {

    gameBoard.classList.remove(
      "board-success"
    );

  }, 400);

}


/* =========================================================
   SCORE DES GROUPES
========================================================= */

function calculateGroupScore(size) {

  if (size === 2) {

    return 20;

  }


  if (size === 3) {

    return 45;

  }


  if (size === 4) {

    return 80;

  }


  if (size === 5) {

    return 125;

  }


  return (
    125 +
    ((size - 5) * 40)
  );

}


/* =========================================================
   ENDOMMAGER LES BLOCS ADJACENTS
========================================================= */

function damageAdjacentBlocks(
  group
) {

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
   DÉBLOQUER LES CADENAS
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


      const amount =
        collected[
          cell.unlockSymbol
        ] || 0;


      if (
        amount >=
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
   RÉSOUDRE LE PLATEAU
   Gravité + cascades
========================================================= */

async function resolveBoard() {

  let cascadeCount = 0;


  while (
    cascadeCount <
    MAX_CASCADE
  ) {

    await applyGravity();

    fillEmptyCells();

    renderBoard({
      falling: true,
      newTiles: true
    });


    await sleep(320);


    const groups =
      findAllGroups();


    if (
      groups.length === 0
    ) {

      break;

    }


    cascadeCount++;

    cascadeLevel++;


    /* -----------------------------------------------------
       Tous les groupes créés sont supprimés ensemble.
    ----------------------------------------------------- */

    const positions =
      mergeGroups(groups);


    await removeMultipleGroups(
      positions,
      groups
    );


    if (
      checkVictory()
    ) {

      break;

    }

  }


  comboDisplay.textContent =
    "COMBO ×1";

}


/* =========================================================
   GRAVITÉ

   Les blocs séparent les colonnes en plusieurs zones.
========================================================= */

async function applyGravity() {

  for (
    let col = 0;
    col < COLS;
    col++
  ) {

    let bottom =
      ROWS - 1;


    while (
      bottom >= 0
    ) {

      /* ---------------------------------------------------
         Chercher le prochain bloc.
      --------------------------------------------------- */

      let segmentBottom =
        bottom;


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
        let row =
          segmentBottom;

        row >
          segmentTop;

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
        let row =
          segmentBottom;

        row >
          segmentTop;

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


      bottom =
        segmentTop - 1;

    }

  }


  renderBoard({
    falling: true
  });


  await sleep(220);

}


/* =========================================================
   UN BLOC ARRÊTE LA GRAVITÉ
========================================================= */

function isBlocker(cell) {

  if (!cell) {

    return false;

  }


  return (
    cell.type === "ice" ||
    cell.type === "stone" ||
    cell.type === "lock"
  );

}


/* =========================================================
   REMPLIR LES CASES VIDES
========================================================= */

function fillEmptyCells() {

  for (
    let row = ROWS - 1;
    row >= 0;
    row--
  ) {

    for (
      let col = 0;
      col < COLS;
      col++
    ) {

      if (
        board[row][col] !== null
      ) {

        continue;

      }


      board[row][col] = {

        type: "symbol",

        symbol:
          chooseSafeSymbol(
            row,
            col
          )

      };

    }

  }

}


/* =========================================================
   TROUVER TOUS LES GROUPES
========================================================= */

function findAllGroups() {

  const visited =
    new Set();

  const groups = [];


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

      const key =
        `${row}-${col}`;


      if (
        visited.has(key)
      ) {

        continue;

      }


      if (
        !isSymbolCell(
          board[row][col]
        )
      ) {

        continue;

      }


      const group =
        findGroup(
          row,
          col
        );


      group.forEach(position => {

        visited.add(
          `${position.row}-${position.col}`
        );

      });


      if (
        group.length >=
        MIN_GROUP_SIZE
      ) {

        groups.push(group);

      }

    }

  }


  return groups;

}


/* =========================================================
   FUSIONNER LES POSITIONS DES GROUPES
========================================================= */

function mergeGroups(groups) {

  const map =
    new Map();


  groups.forEach(group => {

    group.forEach(position => {

      const key =
        `${position.row}-${position.col}`;


      map.set(
        key,
        position
      );

    });

  });


  return Array.from(
    map.values()
  );

}


/* =========================================================
   SUPPRESSION DE PLUSIEURS GROUPES
   PENDANT UNE CASCADE
========================================================= */

async function removeMultipleGroups(
  positions,
  groups
) {

  /* -------------------------------------------------------
     Animation
  ------------------------------------------------------- */

  positions.forEach(position => {

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


  await sleep(300);


  /* -------------------------------------------------------
     Chaque groupe compte séparément pour les points
  ------------------------------------------------------- */

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


    const symbolId =
      cell.symbol;


    collected[symbolId] +=
      group.length;


    score +=
      calculateGroupScore(
        group.length
      ) *
      cascadeLevel;


    damageAdjacentBlocks(
      group
    );

  });


  positions.forEach(position => {

    board[
      position.row
    ][
      position.col
    ] = null;

  });


  unlockThresholdBlocks();


  comboDisplay.textContent =
    `COMBO ×${cascadeLevel}`;


  comboDisplay.classList.remove(
    "active"
  );


  void comboDisplay.offsetWidth;


  comboDisplay.classList.add(
    "active"
  );


  gameMessage.textContent =
    `Cascade automatique ×${cascadeLevel} !`;


  updateInterface();

}


/* =========================================================
   OBJECTIFS
========================================================= */

function checkVictory() {

  const level =
    LEVELS[currentLevel];


  /* -------------------------------------------------------
     Objectifs symboles
  ------------------------------------------------------- */

  for (
    const [symbol, amount]
    of Object.entries(
      level.objectives || {}
    )
  ) {

    if (
      (collected[symbol] || 0)
      <
      amount
    ) {

      return false;

    }

  }


  /* -------------------------------------------------------
     Blocs à détruire
  ------------------------------------------------------- */

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
   PROGRESSION OBJECTIF
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


    current += Math.min(
      collected[symbol] || 0,
      amount
    );

  });


  if (
    level.clearBlocks
  ) {

    const originalBlocks =
      level.blockers.filter(blocker =>

        blocker.type === "ice" ||
        blocker.type === "stone"

      ).length;


    let remaining = 0;


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

          remaining++;

        }

      }

    }


    current +=
      originalBlocks -
      remaining;


    target +=
      originalBlocks;

  }


  return {
    current,
    target
  };

}


/* =========================================================
   METTRE À JOUR L'INTERFACE
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


  const progress =
    getObjectiveProgress();


  objectiveCurrent.textContent =
    progress.current;


  objectiveTarget.textContent =
    progress.target;

}


/* =========================================================
   CHRONOMÈTRE
========================================================= */

function startTimer() {

  stopTimer();


  timerDisplay.textContent =
    timeRemaining;


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
        timeRemaining < 0
      ) {

        timeRemaining = 0;

      }


      updateInterface();


      if (
        timeRemaining <= 0
      ) {

        stopTimer();


        if (
          checkVictory()
        ) {

          finishVictory();

        }

        else {

          finishDefeat();

        }

      }

    }, 1000);

}


/* =========================================================
   ARRÊTER LE CHRONO
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


  victoryScreen.classList.remove(
    "hidden"
  );


  /* -------------------------------------------------------
     Sauvegarder le niveau débloqué
  ------------------------------------------------------- */

  const unlocked =
    Number(
      localStorage.getItem(
        STORAGE_UNLOCKED
      )
    ) || 1;


  const nextUnlocked =
    Math.min(
      currentLevel + 2,
      LEVELS.length
    );


  if (
    nextUnlocked >
    unlocked
  ) {

    localStorage.setItem(
      STORAGE_UNLOCKED,
      nextUnlocked
    );

  }


  if (
    currentLevel <
    LEVELS.length - 1
  ) {

    localStorage.setItem(
      STORAGE_LEVEL,
      currentLevel + 1
    );

  }

}


/* =========================================================
   DÉFAITE
========================================================= */

function finishDefeat() {

  if (
    levelFinished
  ) {

    return;

  }


  levelFinished = true;

  processing = false;

  stopTimer();


  defeatScreen.classList.remove(
    "hidden"
  );

}


/* =========================================================
   PLATEAU JOUABLE
========================================================= */

function ensurePlayableBoard() {

  if (
    findAllGroups().length > 0
  ) {

    return;

  }


  shuffleSymbols();


  if (
    findAllGroups().length === 0
  ) {

    forcePlayablePair();

  }

}


/* =========================================================
   MÉLANGER LES SYMBOLES
========================================================= */

function shuffleSymbols() {

  const positions = [];

  const symbols = [];


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


        symbols.push(
          board[row][col].symbol
        );

      }

    }

  }


  for (
    let i =
      symbols.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      symbols[i],
      symbols[j]
    ] = [
      symbols[j],
      symbols[i]
    ];

  }


  positions.forEach(
    (position, index) => {

      board[
        position.row
      ][
        position.col
      ].symbol =
        symbols[index];

    }
  );

}


/* =========================================================
   FORCER AU MOINS UNE PAIRE
========================================================= */

function forcePlayablePair() {

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    for (
      let col = 0;
      col < COLS - 1;
      col++
    ) {

      const first =
        board[row][col];

      const second =
        board[row][col + 1];


      if (
        isSymbolCell(first) &&
        isSymbolCell(second)
      ) {

        second.symbol =
          first.symbol;

        return;

      }

    }

  }

}


/* =========================================================
   DONNÉES D'UN SYMBOLE
========================================================= */

function getSymbolData(id) {

  return SYMBOLS.find(
    symbol =>
      symbol.id === id
  );

}


/* =========================================================
   RETROUVER UNE CASE HTML
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
   PETIT EFFET SI LE GROUPE EST TROP PETIT
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


  tile.classList.add(
    "selected"
  );


  setTimeout(() => {

    tile.classList.remove(
      "selected"
    );

  }, 180);

}


/* =========================================================
   BOUTON JOUER
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
   MENU
========================================================= */

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


/* =========================================================
   CONTINUER
========================================================= */

resumeBtn.addEventListener(
  "click",
  () => {

    pauseMenu.classList.add(
      "hidden"
    );


    paused = false;

  }
);


/* =========================================================
   RECOMMENCER
========================================================= */

restartBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);


/* =========================================================
   RETOUR ACCUEIL
========================================================= */

homeBtn.addEventListener(
  "click",
  () => {

    showHome();

  }
);


/* =========================================================
   REJOUER APRÈS VICTOIRE
========================================================= */

victoryRestartBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);


/* =========================================================
   NIVEAU SUIVANT
========================================================= */

nextLevelBtn.addEventListener(
  "click",
  () => {

    let next =
      currentLevel + 1;


    if (
      next >=
      LEVELS.length
    ) {

      next = 0;

    }


    startLevel(next);

  }
);


/* =========================================================
   REJOUER APRÈS DÉFAITE
========================================================= */

defeatRestartBtn.addEventListener(
  "click",
  () => {

    startLevel(
      currentLevel
    );

  }
);


/* =========================================================
   ACCUEIL APRÈS DÉFAITE
========================================================= */

defeatHomeBtn.addEventListener(
  "click",
  () => {

    showHome();

  }
);


/* =========================================================
   DÉMARRAGE
========================================================= */

showHome();


});
