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

const MIN_PLAYER_GROUP = 2;
const AUTO_RESONANCE_SIZE = 4;


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
  }

];

/* =========================================================
   NIVEAUX
========================================================= */

const LEVELS = [

  {
    name: "Première résonance",

    mode: "free",

    objectives: {
      moon: 20
    },

    blockers: []
  },


  {
    name: "Feu intérieur",

    mode: "time",

    time: 60,

    objectives: {
      fire: 25
    },

    blockers: []
  },


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
      }

    ]
  },


  {
    name: "Sceau lunaire",

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
let processing = false;
let levelFinished = false;

let cascadeLevel = 1;


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

  updateInterface();

  gameMessage.textContent =
    "Choisis un groupe d'au moins 2 symboles identiques.";

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

      board[blocker.row][blocker.col] = {

        type: "ice",
        hp: blocker.hp || 1

      };

    }

    else if (
      blocker.type === "stone"
    ) {

      board[blocker.row][blocker.col] = {

        type: "stone",
        hp: blocker.hp || 2

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

  ensurePlayerMove();

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
        document.createElement("button");

      tile.type = "button";

      tile.className =
        "tile";

      tile.dataset.row =
        row;

      tile.dataset.col =
        col;


      if (!cell) {

        tile.disabled = true;

        tile.classList.add(
          "tile-empty"
        );

      }


      else if (
        cell.type === "symbol"
      ) {

        const data =
          getSymbolData(
            cell.symbol
          );

        tile.classList.add(
          cell.symbol
        );

       const img =
  document.createElement("img");

img.className =
  "symbol-img";

img.src =
  data.image;

img.alt =
  data.name;

tile.appendChild(img);

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


      else if (
        cell.type === "stone"
      ) {

        tile.classList.add(
          "blocked-stone"
        );

        tile.disabled = true;

        tile.innerHTML =
          `<span class="symbol">🪨</span>`;

      }


      else if (
        cell.type === "lock"
      ) {

        tile.classList.add(
          "locked"
        );

        tile.disabled = true;

      }

      gameBoard.appendChild(tile);

    }

  }

}


/* =========================================================
   CLIC JOUEUR
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

  const group =
    findGroup(
      row,
      col
    );

  if (
    group.length <
    MIN_PLAYER_GROUP
  ) {

    flashTile(
      row,
      col
    );

    gameMessage.textContent =
      "Il faut au moins 2 symboles identiques.";

    return;

  }

  processing = true;

  cascadeLevel = 1;

  if (
    LEVELS[currentLevel].mode === "moves"
  ) {

    movesRemaining--;

  }

  await removeGroup(
    group,
    false
  );

  if (
    checkVictory()
  ) {

    finishVictory();
    return;

  }

  await gravityAndRefill();

  if (
    checkVictory()
  ) {

    finishVictory();
    return;

  }

  await resolveSpecialResonances();

  if (
    checkVictory()
  ) {

    finishVictory();
    return;

  }

  if (
    LEVELS[currentLevel].mode === "moves" &&
    movesRemaining <= 0
  ) {

    finishDefeat();
    return;

  }

  ensurePlayerMove();

  renderBoard();

  updateInterface();

  comboDisplay.textContent =
    "COMBO ×1";

  processing = false;

}


/* =========================================================
   TROUVER GROUPE CONNECTÉ
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

  const target =
    startCell.symbol;

  const stack = [

    {
      row: startRow,
      col: startCol
    }

  ];

  const visited =
    new Set();

  const group = [];

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
      board[
        current.row
      ][
        current.col
      ];

    if (
      !isSymbolCell(cell) ||
      cell.symbol !== target
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
   SUPPRESSION JOUEUR OU CASCADE
========================================================= */

async function removeGroup(
  group,
  automatic
) {

  if (
    group.length === 0
  ) {

    return;

  }

  const first =
    group[0];

  const symbolId =
    board[
      first.row
    ][
      first.col
    ].symbol;


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


  await sleep(90);


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


  await sleep(260);


  collected[symbolId] +=
    group.length;


  score +=
    calculateGroupScore(
      group.length
    ) *
    (
      automatic
        ? cascadeLevel
        : 1
    );


  damageAdjacentBlocks(
    group
  );


  group.forEach(position => {

    board[
      position.row
    ][
      position.col
    ] = null;

  });


  unlockThresholdBlocks();


  if (automatic) {

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
      `Résonance automatique ×${cascadeLevel} !`;

  }

  else {

    gameMessage.textContent =
      `${group.length} symboles supprimés`;

  }

  updateInterface();

}


/* =========================================================
   SCORE
========================================================= */

function calculateGroupScore(size) {

  if (size === 2) return 20;
  if (size === 3) return 45;
  if (size === 4) return 80;
  if (size === 5) return 125;

  return 125 + ((size - 5) * 40);

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
   RÉSONANCES AUTOMATIQUES
   Seulement groupes de 4 ou plus
========================================================= */

async function resolveSpecialResonances() {

  let safety = 0;

  while (
    safety < 8
  ) {

    const groups =
      findAllGroups().filter(
        group =>
          group.length >=
          AUTO_RESONANCE_SIZE
      );

    if (
      groups.length === 0
    ) {

      return;

    }

    cascadeLevel++;

    for (
      const group of groups
    ) {

      if (
        group.length <
        AUTO_RESONANCE_SIZE
      ) {

        continue;

      }

      await removeGroup(
        group,
        true
      );

    }

    await gravityAndRefill();

    if (
      checkVictory()
    ) {

      return;

    }

    safety++;

  }

}


/* =========================================================
   TROUVER TOUS LES GROUPES
========================================================= */

function findAllGroups() {

  const groups = [];

  const visited =
    new Set();

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
        MIN_PLAYER_GROUP
      ) {

        groups.push(group);

      }

    }

  }

  return groups;

}


/* =========================================================
   GARANTIR UN COUP POSSIBLE
========================================================= */

function ensurePlayerMove() {

  const groups =
    findAllGroups();

  if (
    groups.length > 0
  ) {

    return;

  }

  forcePlayablePair();

}


/* =========================================================
   FORCER UNE PAIRE
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

      const a =
        board[row][col];

      const b =
        board[row][col + 1];

      if (
        isSymbolCell(a) &&
        isSymbolCell(b)
      ) {

        b.symbol =
          a.symbol;

        return;

      }

    }

  }

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

  const progress =
    getObjectiveProgress();

  objectiveCurrent.textContent =
    progress.current;

  objectiveTarget.textContent =
    progress.target;

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

  levelFinished = true;

  processing = false;

  stopTimer();

  victoryScore.textContent =
    score;

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

    let next =
      currentLevel + 1;

    if (
      next >= LEVELS.length
    ) {

      next = 0;

    }

    startLevel(next);

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
   DÉMARRAGE
========================================================= */

showHome();


});
