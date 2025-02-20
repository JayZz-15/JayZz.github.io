// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first
let money = 0; // Player's money
let playerItem = ''; // Item bought from shop (Square or Triangle)
let currentCountry = ''; // To store selected country
let countryStrength = 0; // The strength of the country

// Retrieve data from localStorage or set to defaults if nothing is saved
function loadGameData() {
    if (localStorage.getItem('money')) {
        money = parseInt(localStorage.getItem('money'));
    }
    if (localStorage.getItem('playerItem')) {
        playerItem = localStorage.getItem('playerItem');
        updateShopUI(); // Update shop UI based on the item
    }
    document.getElementById('money').textContent = "Money: $" + money;
}

// Update Shop UI to show Equip button instead of Buy
function updateShopUI() {
    if (playerItem === 'Square') {
        document.getElementById('buySquareButton').style.display = 'none';
        document.getElementById('equipSquareButton').style.display = 'inline-block';
    }
    if (playerItem === 'Triangle') {
        document.getElementById('buyTriangleButton').style.display = 'none';
        document.getElementById('equipTriangleButton').style.display = 'inline-block';
    }
}

// Function to buy an item (Square or Triangle)
function buyItem(item) {
    if (money >= 10 && item === 'Square' || money >= 15 && item === 'Triangle') {
        playerItem = item;
        money -= (item === 'Square' ? 10 : 15);
        localStorage.setItem('playerItem', playerItem); // Save the item in localStorage
        updateMoney();
        updateShopUI(); // Update UI with Equip button
        alert(`You have purchased the ${item}!`);
    } else {
        alert("Not enough money!");
    }
}

// Function to equip an item (Square or Triangle)
function equipItem(item) {
    alert(`${item} is now equipped!`);
    // You can add more logic to apply the skin to the game.
}

// Update money display
function updateMoney() {
    document.getElementById('money').textContent = "Money: $" + money;
    localStorage.setItem('money', money); // Save the money in localStorage
}

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
            return board[a]; // Return the winner ('X' or 'O')
        }
    }
    return null;
}

// Handle the player's move
function handlePlayerMove(index) {
    if (gameBoard[index] === '' && currentPlayer === 'X') {
        gameBoard[index] = 'X'; // Always 'X' for player
        renderBoard();
        if (checkWinner(gameBoard)) {
            money += 20; // Reward money for winning
            setTimeout(() => alert("Player wins! You earned $20"), 100);
            updateMoney();
            return;
        }
        currentPlayer = 'O';
        aiMove();
    }
}

// AI's move
function aiMove() {
    const move = bestMove(gameBoard);
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
    gameBoard.forEach((cell, index) => {
        cells[index].textContent = cell;
    });
}

// Restart the game
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    renderBoard();
}

// Initialize game data
loadGameData();
