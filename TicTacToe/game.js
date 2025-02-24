// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let money = 0;
let playerShape = 'X';
let currentCountry = '';
let countryStrength = 0;
let playerName = '';
let warMode = false;
let playerAlliances = []; // Countries allied with the player

// Base country strengths – extended by alliance.js
const countryStrengths = {
  'USA': 10, 'Russia': 8, 'China': 9, 'Brazil': 5, 'India': 6,
  'Germany': 7, 'Canada': 6, 'Australia': 4, 'Nigeria': 3, 'Mexico': 5,
  'UK': 8, 'France': 7, 'Japan': 9, 'South Korea': 8
};

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
  
  // Trigger a random event at the start of every turn (5% chance)
  triggerRandomEvent();
};

// Save player name
function saveName() {
  playerName = document.getElementById('playerName').value;
  localStorage.setItem('playerName', playerName);
  document.getElementById('nameConfirmation').textContent = `Name "${playerName}" has been saved!`;
  document.getElementById('playerDisplay').textContent = `Welcome, ${playerName}!`;
}

// Buy shape (costs scaled up)
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

// Trigger a random twist event (5% chance each turn)
function triggerRandomEvent() {
  if (Math.random() < 0.05) {
    const events = [
      () => { money += 500; alert("Lucky break! You found a secret cache of money. +$500!"); },
      () => { gameBoard = ['', '', '', '', '', '', '', '', '']; renderBoard(); alert("Time Warp! The board has been reset."); },
      () => { 
        if (playerAlliances.length > 0) {
          let betrayed = playerAlliances[Math.floor(Math.random() * playerAlliances.length)];
          // Remove betrayal from player alliances
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

// For weaker countries, allow AI to make mistakes
function weakCountryMistakes(board) {
  if (Math.random() < 0.5) {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') availableMoves.push(i);
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  return bestMove(board);
}

// Minimax algorithm for AI (using countryStrength as difficulty modifier)
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
  // Prevent fighting a country that's been eliminated or is allied with you
  if (!(currentCountry in countryStrengths)) {
    alert(`${currentCountry} has been eliminated! Choose another country.`);
    return;
  }
  if (playerAlliances.includes(currentCountry)) {
    alert(`You are allied with ${currentCountry} and cannot fight them.`);
    return;
  }
  // Trigger a random event at each move
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

// Start a fight with a country (only if not allied or eliminated)
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
  
// Heist minigame (simplified)
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
  
  let roll = Math.random()*100;
  let resultText = "";
  if (roll < winChance) {
    let winnings = budget * 2;
    money += winnings;
    resultText = `Heist Successful! You earned $${winnings}.`;
  } else {
    money -= budget;
    if(money<0) money=0;
    resultText = `Heist Failed! You lost $${budget}.`;
  }
  document.getElementById('heistResult').textContent = resultText;
  localStorage.setItem('money', money);
  updateMoney();
}
