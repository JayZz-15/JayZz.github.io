let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let money = 0;
let playerShape = 'X';
let currentCountry = '';
let countryStrength = 0;

// Function to show the main menu
function showMenu() {
    document.getElementById('mainMenu').style.display = 'flex';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('chooseCountry').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
}

// Function to start the game
function startGame() {
    showGameScreen();
    restartGame();
}

// Function to show the game screen
function showGameScreen() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
}

// Function to show the country selection menu
function showCountries() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('chooseCountry').style.display = 'flex';
}

// Function to show the shop
function showShop() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('shop').style.display = 'flex';
}

// Function to go back to the main menu
function goToMenu() {
    showMenu();
}

// Restart the game
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    renderBoard();
}

// Render the board
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    gameBoard.forEach((value, index) => {
        cells[index].textContent = value;
    });
    document.getElementById('currentPlayer').textContent = currentPlayer === 'X' ? 'Player' : 'AI';
}

// Handle the player's move
function handlePlayerMove(index) {
    if (gameBoard[index] === '' && currentPlayer === 'X') {
        gameBoard[index] = 'X';
        currentPlayer = 'O'; // Switch to AI
        renderBoard();
        checkWinner();
        aiMove();
    }
}

// Check for the winner
function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            endGame(gameBoard[a]);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        endGame('Draw');
    }
}

// End the game
function endGame(result) {
    document.getElementById('gameResult').textContent = result === 'Draw' ? 'It\'s a Draw!' : `${result} Wins!`;
    money += result === 'Draw' ? 5 : 10;
    document.getElementById('money').textContent = money;
    document.getElementById('gameOver').style.display = 'flex';
}

// AI Move
function aiMove() {
    if (currentPlayer === 'O') {
        setTimeout(() => {
            let move = bestMove();
            gameBoard[move] = 'O';
            currentPlayer = 'X'; // Switch back to player
            renderBoard();
            checkWinner();
        }, 1000);
    }
}

// Best AI Move (Dummy for now)
function bestMove() {
    return gameBoard.indexOf('');
}

// Buy new shape
function buyShape(shape) {
    if (money >= 10) {
        playerShape = shape;
        money -= 10;
        document.getElementById('money').textContent = money;
        alert(`You now play as ${shape}!`);
    } else {
        alert("Not enough money!");
    }
}

// Start a fight with a selected country
function startFight(country, strength) {
    currentCountry = country;
    countryStrength = strength;
    alert(`You are now fighting against ${country} with strength: ${strength}`);
    restartGame(); // Restart the game with the new country
}
