// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first
let money = 0; // Player's money
let playerShape = 'X'; // Default player shape
let currentCountry = ''; // To store selected country
let countryStrength = 0; // The strength of the country
let playerName = ''; // Player's name

// Leaderboard server URL (replace with your actual server URL if using a backend)
const leaderboardURL = 'http://localhost:3000/leaderboard';

// Load saved data from localStorage
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
  }

  // Attach event listeners for buttons
  document.getElementById('saveNameButton').addEventListener('click', saveName);
  document.getElementById('restartButton').addEventListener('click', restartGame);

  // Load global leaderboard (if using a backend)
  fetchLeaderboard();
  
  // Also load the local leaderboard
  loadLocalLeaderboard();
};

// Save the player's name to localStorage
function saveName() {
  playerName = document.getElementById('playerName').value;
  localStorage.setItem('playerName', playerName);
  document.getElementById('nameConfirmation').textContent = `Name "${playerName}" has been saved!`;
  document.getElementById('playerDisplay').textContent = `Welcome, ${playerName}!`;
}

// Country strength levels
const countryStrengths = {
  'USA': 10, 'Russia': 8, 'China': 9, 'Brazil': 5, 'India': 6,
  'Germany': 7, 'Canada': 6, 'Australia': 4, 'Nigeria': 3, 'Mexico': 5
};

// For weaker countries, allow mistakes
function weakCountryMistakes(board) {
  const mistakeChance = Math.random();
  if (mistakeChance < 0.5) {
    // 50% chance to pick a random move
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

  const adjustedDepth = depth * (1 + countryStrength * 0.1); // Scale difficulty

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

// Get the best move for the AI
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

// Check for a winner
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

// Handle player's move
function handlePlayerMove(index) {
  if (gameBoard[index] === '' && currentPlayer === 'X') {
    gameBoard[index] = playerShape;
    renderBoard();
    if (checkWinner(gameBoard)) {
      money += 20;
      setTimeout(() => alert("Player wins! You earned $20"), 100);
      localStorage.setItem('money', money);
      updateMoney();
      updateLocalLeaderboard();
      updateLeaderboard(); // Also update the global leaderboard if backend is used
      return;
    }
    currentPlayer = 'O';
    aiMove();
  }
}

// AI's move
function aiMove() {
  const move = (countryStrength < 5) ? weakCountryMistakes(gameBoard) : bestMove(gameBoard);
  gameBoard[move] = 'O';
  renderBoard();
  if (checkWinner(gameBoard)) {
    setTimeout(() => alert("AI wins!"), 100);
  } else {
    currentPlayer = 'X';
  }
}

// Render the board
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

// Start a fight with a country
function startFight(country, strength) {
  currentCountry = country;
  countryStrength = strength;
  localStorage.setItem('currentCountry', country);
  alert(`You are fighting ${country}!`);
}

// Update money display
function updateMoney() {
  document.getElementById('money').textContent = money;
}

// ---------- LOCAL LEADERBOARD FUNCTIONS ----------

// Load local leaderboard from localStorage
function loadLocalLeaderboard() {
  return JSON.parse(localStorage.getItem('leaderboard')) || [];
}

// Save local leaderboard to localStorage
function saveLocalLeaderboard(leaderboard) {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Update local leaderboard after a game win
function updateLocalLeaderboard() {
  let leaderboard = loadLocalLeaderboard();
  let playerFound = leaderboard.find(p => p.name === playerName);
  if (playerFound) {
    playerFound.money = money;
  } else {
    leaderboard.push({ name: playerName, money: money });
  }
  leaderboard.sort((a, b) => b.money - a.money);
  saveLocalLeaderboard(leaderboard);
  renderLocalLeaderboard(leaderboard);
}

// Render local leaderboard UI
function renderLocalLeaderboard(leaderboard) {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';
  leaderboard.slice(0, 5).forEach((player, index) => {
    let li = document.createElement('li');
    li.textContent = `${index + 1}. ${player.name} - $${player.money}`;
    leaderboardList.appendChild(li);
  });
}

// ---------- GLOBAL LEADERBOARD FUNCTIONS ----------
// Submit score to global leaderboard
function submitScore() {
  fetch(leaderboardURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: playerName, score: money })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Score submitted:', data);
    fetchLeaderboard();
  })
  .catch(error => console.error('Error submitting score:', error));
}

// Fetch global leaderboard from backend
function fetchLeaderboard() {
  fetch(leaderboardURL)
    .then(response => response.json())
    .then(data => {
      updateLeaderboardUI(data);
    })
    .catch(error => console.error('Error fetching leaderboard:', error));
}

// Update global leaderboard UI
function updateLeaderboardUI(leaderboard) {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';
  leaderboard.forEach((player, index) => {
    let li = document.createElement('li');
    li.textContent = `${index + 1}. ${player.name} - $${player.score}`;
    leaderboardList.appendChild(li);
  });
}

// Optionally, you can call submitScore() at game end to update the global leaderboard.
// For example, inside handlePlayerMove() after a win:
//   submitScore();
