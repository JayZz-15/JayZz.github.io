// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let money = 0;
let playerShape = 'X';
let currentCountry = '';
let countryStrength = 0;
let playerName = '';
let warMode = false;

// Base country strengths – extended later in alliance.js
const countryStrengths = {
  'USA': 10, 'Russia': 8, 'China': 9, 'Brazil': 5, 'India': 6,
  'Germany': 7, 'Canada': 6, 'Australia': 4, 'Nigeria': 3, 'Mexico': 5,
  'UK': 8, 'France': 7, 'Japan': 9, 'South Korea': 8
};

// Heist bonus values
const heistBonuses = {
  vehicle: {
    'Car': 5, 'Motorcycle': 3, 'Van': 7, 'Helicopter': 10,
    'Banana Car': 2, 'Rickshaw': -2, 'Hoverboard': 4, 'Spaceship': 15
  },
  location: {
    'Bank': 10, 'Casino': 5, 'Museum': 3, 'Jewelry Store': 8,
    'Ice Cream Parlor': 12, 'Candy Factory': 10, 'Roller Disco': 4, 'Secret Lair': 15
  },
  weapon: {
    'Pistol': 5, 'Shotgun': 7, 'Rifle': 10, 'None': 0,
    'Rubber Chicken': 2, 'Water Gun': 4, 'Banana Peel': 6, 'Feather Duster': 3
  },
  disguise: {
    'Mask': 3, 'Suit': 5, 'Casual': 2, 'None': 0,
    'Giant Chicken Costume': 8, 'Clown Outfit': 6, 'Zombie Costume': 7, 'SpongeBob Costume': 5
  },
  gadget: {
    'Hacking Device': 10, 'EMP': 8, 'Grappling Hook': 5, 'Smoke Bomb': 7,
    'Silly String': 3, 'Whoopee Cushion': 4, 'Exploding Cake': 9, 'Magic Wand': 12
  }
};

// Random events: 5% chance each move
function triggerRandomEvent() {
  if (Math.random() < 0.05) {
    const events = [
      () => { money += 500; alert("Lucky break! You found a secret cache. +$500!"); },
      () => { gameBoard = ['', '', '', '', '', '', '', '', '']; renderBoard(); alert("Time Warp! The board has been reset."); },
      () => {
        if (playerAlliances.length > 0) {
          let betrayed = playerAlliances[Math.floor(Math.random() * playerAlliances.length)];
          playerAlliances = playerAlliances.filter(c => c !== betrayed);
          alert(`Betrayal! ${betrayed} has defected from your alliance.`);
          updatePlayerAlliancesDisplay();
        }
      },
      () => { alert("Glitch in the Matrix! The AI stumbles this turn."); }
    ];
    events[Math.floor(Math.random() * events.length)]();
    updateMoney();
  }
}

// On page load
window.onload = () => {
  if (localStorage.getItem('playerName')) {
    playerName = localStorage.getItem('playerName');
    document.getElementById('playerDisplay').textContent = `Welcome, ${playerName}!`;
  }
  if (localStorage.getItem('money')) {
    money = parseInt(localStorage.getItem('money'));
    document.getElementById('money').textContent = money;
  }
  if (localStorage.getItem('playerShape')) {
    playerShape = localStorage.getItem('playerShape');
  }
  if (localStorage.getItem('currentCountry')) {
    currentCountry = localStorage.getItem('currentCountry');
    countryStrength = countryStrengths[currentCountry] || 0;
  } else {
    currentCountry = "USA";
    countryStrength = countryStrengths["USA"];
    localStorage.setItem('currentCountry', currentCountry);
  }
  document.getElementById('saveNameButton').addEventListener('click', saveName);
  document.getElementById('restartButton').addEventListener('click', restartGame);
  document.getElementById('attemptHeistButton').addEventListener('click', attemptHeist);
  triggerRandomEvent();
};

// Save player name
function saveName() {
  playerName = document.getElementById('playerName').value;
  localStorage.setItem('playerName', playerName);
  document.getElementById('nameConfirmation').textContent = `Name "${playerName}" has been saved!`;
  document.getElementById('playerDisplay').textContent = `Welcome, ${playerName}!`;
}

// Buy shape (costs increased)
function buyShape(shape) {
  let cost = (shape === 'square') ? 100 : (shape === 'triangle') ? 150 : 0;
  if (money >= cost) {
    money -= cost;
    playerShape = shape;
    localStorage.setItem('money', money);
    localStorage.setItem('playerShape', shape);
    updateMoney();
    alert(`You bought a ${shape} shape for $${cost}.`);
  } else {
    alert("Not enough money!");
  }
}

// Update money display
function updateMoney() {
  document.getElementById('money').textContent = money;
}

// Minimax algorithm for AI, modified by countryStrength
const minimax = (board, depth, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === 'X') return -10 + depth;
  if (winner === 'O') return 10 - depth;
  if (!board.includes('')) return 0;
  const adjustedDepth = depth * (1 + countryStrength * 0.1);
  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        best = Math.max(best, minimax(board, adjustedDepth + 1, false));
        board[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        best = Math.min(best, minimax(board, adjustedDepth + 1, true));
        board[i] = '';
      }
    }
    return best;
  }
};

// Determine best move for AI
const bestMove = (board) => {
  let bestValue = -Infinity, move = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let moveValue = minimax(board, 0, false);
      board[i] = '';
      if (moveValue > bestValue) { bestValue = moveValue; move = i; }
    }
  }
  return move;
};

// Check winner on board
function checkWinner(board) {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pat of patterns) {
    const [a,b,c] = pat;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

// Handle player's move on the board
function handlePlayerMove(index) {
  // Prevent fighting eliminated countries or allies
  if (!(currentCountry in countryStrengths)) {
    alert(`${currentCountry} has been eliminated! Choose another country.`);
    return;
  }
  if (playerAlliances.includes(currentCountry)) {
    alert(`You are allied with ${currentCountry} and cannot fight them.`);
    return;
  }
  triggerRandomEvent();
  if (gameBoard[index] === '' && currentPlayer === 'X') {
    gameBoard[index] = playerShape;
    renderBoard();
    if (checkWinner(gameBoard)) {
      const reward = 200 * (1 + (countryStrength / 10));
      money += reward;
      setTimeout(() => alert(`Player wins! You earned $${reward.toFixed(0)} – Cha-ching!`), 100);
      localStorage.setItem('money', money);
      updateMoney();
      return;
    }
    currentPlayer = 'O';
    aiMove();
  }
}

// AI move
function aiMove() {
  let move = (countryStrength < 5) ? weakCountryMistakes(gameBoard) : bestMove(gameBoard);
  if (move === undefined || move === -1) { currentPlayer = 'X'; return; }
  gameBoard[move] = 'O';
  renderBoard();
  if (checkWinner(gameBoard)) {
    setTimeout(() => alert("AI wins! Better luck next time."), 100);
  } else {
    currentPlayer = 'X';
  }
}

// For weaker countries, allow random mistake moves
function weakCountryMistakes(board) {
  if (Math.random() < 0.5) {
    let available = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') available.push(i);
    }
    return available[Math.floor(Math.random() * available.length)];
  }
  return bestMove(board);
}

// Render board
function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  gameBoard.forEach((val, idx) => { cells[idx].textContent = val; });
  document.getElementById('currentPlayer').textContent = currentPlayer === 'X' ? 'Player' : 'AI';
}

// Restart game
function restartGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  renderBoard();
  localStorage.setItem('gameBoard', JSON.stringify(gameBoard));
}

// Start fight with a country (if not allied or eliminated)
function startFight(country, strength) {
  if (!(country in countryStrengths)) {
    alert(`${country} has been eliminated and cannot be challenged.`);
    return;
  }
  if (playerAlliances.includes(country)) {
    alert(`You are allied with ${country} and cannot fight them.`);
    return;
  }
  currentCountry = country;
  countryStrength = countryStrengths[country] || 0;
  localStorage.setItem('currentCountry', country);
  alert(`Gear up! You're now fighting ${country} – prepare for a tough match!`);
}

// Heist minigame
function attemptHeist() {
  let budget = parseInt(document.getElementById('heistBudget').value);
  if (isNaN(budget) || budget <= 0) { alert("Enter a valid budget (>0)."); return; }
  if (budget > money) { alert("Budget exceeds available money!"); return; }
  let vehicle = document.getElementById('heistVehicle').value;
  let location = document.getElementById('heistLocation').value;
  let weapon = document.getElementById('heistWeapon').value;
  let disguise = document.getElementById('heistDisguise').value;
  let gadget = document.getElementById('heistGadget').value;
  
  let baseChance = 30;
  let winChance = baseChance +
    (heistBonuses.vehicle[vehicle]||0) +
    (heistBonuses.location[location]||0) +
    (heistBonuses.weapon[weapon]||0) +
    (heistBonuses.disguise[disguise]||0) +
    (heistBonuses.gadget[gadget]||0);
  winChance = Math.max(5, Math.min(95, winChance));
  
  let roll = Math.random() * 100;
  let resultText = "";
  if (roll < winChance) {
    let winnings = budget * 2;
    money += winnings;
    resultText = `Heist Successful! You earned $${winnings}.`;
  } else {
    money -= budget;
    if (money < 0) money = 0;
    resultText = `Heist Failed! You lost $${budget}.`;
  }
  document.getElementById('heistResult').textContent = resultText;
  localStorage.setItem('money', money);
  updateMoney();
}
