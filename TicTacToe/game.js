// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first
let money = 0; // Player's money
let playerShape = 'X'; // Default player shape
let currentCountry = ''; // Currently selected enemy country
let countryStrength = 0; // The strength of the enemy country
let playerName = '';
let warMode = false; // Whether a war event is active

// Country strength levels
const countryStrengths = {
  'USA': 10, 'Russia': 8, 'China': 9, 'Brazil': 5, 'India': 6,
  'Germany': 7, 'Canada': 6, 'Australia': 4, 'Nigeria': 3, 'Mexico': 5
};

// Country relations (0-100; 100 = best, 0 = worst)
let countryRelations = {
  'USA': 100, 'Russia': 100, 'China': 100, 'Brazil': 100, 'India': 100,
  'Germany': 100, 'Canada': 100, 'Australia': 100, 'Nigeria': 100, 'Mexico': 100
};

// Heist bonus values for funny options
const heistBonuses = {
  vehicle: {
    'Car': 5,
    'Motorcycle': 3,
    'Van': 7,
    'Helicopter': 10,
    'Banana Car': 2,
    'Rickshaw': -2,
    'Hoverboard': 4,
    'Spaceship': 15
  },
  location: {
    'Bank': 10,
    'Casino': 5,
    'Museum': 3,
    'Jewelry Store': 8,
    'Ice Cream Parlor': 12,
    'Candy Factory': 10,
    'Roller Disco': 4,
    'Secret Lair': 15
  },
  weapon: {
    'Pistol': 5,
    'Shotgun': 7,
    'Rifle': 10,
    'None': 0,
    'Rubber Chicken': 2,
    'Water Gun': 4,
    'Banana Peel': 6,
    'Feather Duster': 3
  },
  disguise: {
    'Mask': 3,
    'Suit': 5,
    'Casual': 2,
    'None': 0,
    'Giant Chicken Costume': 8,
    'Clown Outfit': 6,
    'Zombie Costume': 7,
    'SpongeBob Costume': 5
  },
  gadget: {
    'Hacking Device': 10,
    'EMP': 8,
    'Grappling Hook': 5,
    'Smoke Bomb': 7,
    'Silly String': 3,
    'Whoopee Cushion': 4,
    'Exploding Cake': 9,
    'Magic Wand': 12
  }
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
    // Set default enemy if none selected
    currentCountry = "USA";
    countryStrength = countryStrengths["USA"];
    localStorage.setItem('currentCountry', currentCountry);
  }
  
  // Attach event listeners for buttons
  document.getElementById('saveNameButton').addEventListener('click', saveName);
  document.getElementById('restartButton').addEventListener('click', restartGame);
  document.getElementById('attemptHeistButton').addEventListener('click', attemptHeist);
  document.getElementById('sendDiplomacyButton').addEventListener('click', sendDiplomacy);
  
  updateRelationsDisplay();
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

// Update the display of all country relations
function updateRelationsDisplay() {
  let html = "<ul>";
  for (let country in countryRelations) {
    html += `<li>${country}: ${countryRelations[country]}</li>`;
  }
  html += "</ul>";
  document.getElementById("relationsDisplay").innerHTML = html;
}

// Update a country's relation score and check for war events
function updateCountryRelation(country, delta) {
  if (countryRelations[country] !== undefined) {
    countryRelations[country] += delta;
    // Clamp between 0 and 100
    if (countryRelations[country] > 100) countryRelations[country] = 100;
    if (countryRelations[country] < 0) countryRelations[country] = 0;
    updateRelationsDisplay();
    checkAllianceWar();
  }
}

// Send money to improve relations via diplomacy
function sendDiplomacy() {
  const selectedCountry = document.getElementById('diplomacyCountry').value;
  const amount = parseInt(document.getElementById('diplomacyAmount').value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }
  if (amount > money) {
    alert("You don't have enough money!");
    return;
  }
  // Deduct money and improve relation (e.g., each $10 increases relation by 1 point)
  money -= amount;
  updateMoney();
  const relationIncrease = Math.floor(amount / 10);
  updateCountryRelation(selectedCountry, relationIncrease);
  document.getElementById('diplomacyResult').textContent = `You sent $${amount} to ${selectedCountry}. Their relation improved by ${relationIncrease} points.`;
}

// Check if enough countries are hostile to trigger an alliance war event
function checkAllianceWar() {
  let hostileCount = 0;
  for (let country in countryRelations) {
    if (countryRelations[country] < 30) {
      hostileCount++;
    }
  }
  if (hostileCount >= 3 && !warMode) {
    warMode = true;
    alert("The hostile nations have allied against you! Prepare for a massive war!");
    // Here you could trigger a larger board or multi-board war mode.
  }
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
      // Reward increases based on enemy strength
      const reward = 20 * (1 + (countryStrength / 10));
      money += reward;
      setTimeout(() => alert(`Player wins! You earned $${reward.toFixed(0)} – Cha-ching!`), 100);
      localStorage.setItem('money', money);
      updateMoney();
      // Lower relation more if you keep attacking this country
      updateCountryRelation(currentCountry, -10);
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
    // Even if you lose, your repeated attacks lower relations (but less so)
    updateCountryRelation(currentCountry, -5);
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
  countryStrength = strength;
  localStorage.setItem('currentCountry', country);
  alert(`Gear up! You're now fighting ${country} – let the epic showdown commence!`);
  // Initiating a fight lowers relations slightly by default
  updateCountryRelation(country, -5);
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
  
  // Calculate win chance based on chosen parameters
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
