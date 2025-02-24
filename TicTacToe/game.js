// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first
let money = 0; // Player's money
let playerShape = 'X'; // Default player shape
let currentCountry = ''; // Currently selected enemy country
let countryStrength = 0; // The strength of the enemy country
let playerName = '';
let warMode = false; // Whether a war event is active

// Base Country strength levels (the alliance script will extend these)
const countryStrengths = {
  'USA': 10, 'Russia': 8, 'China': 9, 'Brazil': 5, 'India': 6,
  'Germany': 7, 'Canada': 6, 'Australia': 4, 'Nigeria': 3, 'Mexico': 5,
  'UK': 8, 'France': 7, 'Japan': 9, 'South Korea': 8
};

// Load saved data from localStorage when the page loads
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
};

// Save the player's name and update UI
function saveName() {
  playerName = document.getElementById('playerName').value;
  localStorage.setItem('playerName', playerName);
  document.getElementById('nameConfirmation').textContent = `Name "${playerName}" has been saved!`;
  document.getElementById('playerDisplay').textContent = `Welcome, ${playerName}!`;
}

// Shop function for buying shapes
function buyShape(shape) {
  let cost = (shape === 'square') ? 10 : (shape === 'triangle') ? 15 : 0;
  if (money >= cost) {
    money -= cost;
    playerShape = shape;
    localStorage.setItem('money', money);
    localStorage.setItem('playerShape', shape);
    updateMoney();
    alert(`You bought a ${shape} shape! Now you’ll be a cut above the rest!`);
  } else {
    alert("Not enough money!");
  }
}

// Update money display
function updateMoney() {
  document.getElementById('money').textContent = money;
}

// For weaker countries, allow AI to make mistakes
function weakCountryMistakes(board) {
  const mistakeChance = Math.random();
  if (mistakeChance < 0.5) {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        availableMoves.push(i);
      }
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  return bestMove(board);
}

// Minimax algorithm for AI with difficulty scaling
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
        const score = minimax(board, adjustedDepth + 1, false);
        board[i] = '';
        best = Math.max(best, score);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        const score = minimax(board, adjustedDepth + 1, true);
        board[i] = '';
        best = Math.min(best, score);
      }
    }
    return best;
  }
};

// Determine the best move for the AI
const bestMove = (board) => {
  let bestValue = -Infinity;
  let move = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      const moveValue = minimax(board, 0, false);
      board[i] = '';
      if (moveValue > bestValue) {
        bestValue = moveValue;
        move = i;
      }
    }
  }
  return move;
};

// Check if there's a winner on the board
function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Handle player's move on the board
function handlePlayerMove(index) {
  if (gameBoard[index] === '' && currentPlayer === 'X') {
    gameBoard[index] = playerShape;
    renderBoard();
    if (checkWinner(gameBoard)) {
      const reward = 20 * (1 + (countryStrength / 10));
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

// AI's move
function aiMove() {
  let move = (countryStrength < 5) ? weakCountryMistakes(gameBoard) : bestMove(gameBoard);
  if (move === undefined || move === -1) {
    currentPlayer = 'X';
    return;
  }
  gameBoard[move] = 'O';
  renderBoard();
  if (checkWinner(gameBoard)) {
    setTimeout(() => alert("AI wins! Better luck next time."), 100);
  } else {
    currentPlayer = 'X';
  }
}

// Render the game board on screen
function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  gameBoard.forEach((value, index) => {
    cells[index].textContent = value;
  });
  document.getElementById('currentPlayer').textContent = currentPlayer === 'X' ? 'Player' : 'AI';
}

// Restart the game
function restartGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  renderBoard();
  localStorage.setItem('gameBoard', JSON.stringify(gameBoard));
}

// Start a fight with a country (select enemy)
function startFight(country, strength) {
  currentCountry = country;
  countryStrength = countryStrengths[country] || 0;
  localStorage.setItem('currentCountry', country);
  alert(`Gear up! You're now fighting ${country} – let the epic showdown commence!`);
}
  
// ---------- Heist Minigame Functions ----------
function attemptHeist() {
  let budget = parseInt(document.getElementById('heistBudget').value);
  if (isNaN(budget) || budget <= 0) {
    alert("Please enter a valid budget greater than 0.");
    return;
  }
  if (budget > money) {
    alert("Your heist budget cannot exceed your available money!");
    return;
  }
  
  let vehicle = document.getElementById('heistVehicle').value;
  let location = document.getElementById('heistLocation').value;
  let weapon = document.getElementById('heistWeapon').value;
  let disguise = document.getElementById('heistDisguise').value;
  let gadget = document.getElementById('heistGadget').value;
  
  let baseChance = 30;
  let vehicleBonus = heistBonuses.vehicle[vehicle] || 0;
  let locationBonus = heistBonuses.location[location] || 0;
  let weaponBonus = heistBonuses.weapon[weapon] || 0;
  let disguiseBonus = heistBonuses.disguise[disguise] || 0;
  let gadgetBonus = heistBonuses.gadget[gadget] || 0;
  
  let winChance = baseChance + vehicleBonus + locationBonus + weaponBonus + disguiseBonus + gadgetBonus;
  winChance = Math.max(5, Math.min(95, winChance));
  
  let roll = Math.random() * 100;
  let resultText = "";
  if (roll < winChance) {
    let winnings = budget * 2;
    money += winnings;
    const successMessages = [
      `Heist Successful! Your ${gadget} and ${vehicle} made the perfect combo to rob the ${location}. You earned $${winnings}!`,
      `Victory! The ${weapon} and ${disguise} got you past security at the ${location}. You've doubled your money to $${winnings}!`,
      `Smooth heist! With a dash of ${gadget} and a hint of ${disguise}, the ${location} was a cakewalk. You scored $${winnings}!`
    ];
    resultText = successMessages[Math.floor(Math.random() * successMessages.length)];
  } else {
    money -= budget;
    if (money < 0) money = 0;
    const failureMessages = [
      `Heist Failed! Your ${gadget} malfunctioned and the ${vehicle} broke down at the ${location}. You lost $${budget}.`,
      `Disaster! The ${weapon} was more of a prop and your ${disguise} didn't fool anyone at the ${location}. Lost $${budget}.`,
      `Ouch! The plan went sideways – your ${gadget} and ${vehicle} couldn't save you at the ${location}. You lost $${budget}.`
    ];
    resultText = failureMessages[Math.floor(Math.random() * failureMessages.length)];
  }
  
  document.getElementById('heistResult').textContent = resultText;
  localStorage.setItem('money', money);
  updateMoney();
}
