// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first
let money = 0; // Player's money
let playerShape = 'X'; // Default player shape
let currentCountry = ''; // To store selected country
let countryStrength = 0; // The strength of the country

// Country strength levels
const countryStrengths = {
    'USA': 10,
    'Russia': 8,
    'China': 9,
    'Brazil': 5,
    'India': 6,
    'Germany': 7,
    'Canada': 6,
    'Australia': 4,
    'Nigeria': 3,
    'Mexico': 5
};

// Minimax algorithm for AI with dynamic strength
const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === 'X') return -10 + depth;
    if (winner === 'O') return 10 - depth;
    if (!board.includes('')) return 0;

    const adjustedDepth = depth * (1 + countryStrength * 0.1); // AI difficulty scaling

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

// Function to get the best move for the AI
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

// Handle weaker AI's mistakes for low-strength countries
const weakCountryMistakes = (board) => {
    const mistakeChance = Math.random();
    if (mistakeChance < 0.5) {
        // 50% chance of making a mistake
        const availableMoves = board.map((cell, index) => (cell === '') ? index : null).filter(val => val !== null);
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        return randomMove;
    }
    return bestMove(board); // Otherwise, use the best move
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
            return board[a]; // Return the winner ('X' or 'O')
        }
    }
    return null;
}

// Handle the player's move
function handlePlayerMove(index) {
    if (gameBoard[index] === '' && currentPlayer === 'X') {
        gameBoard[index] = playerShape; // Use the current shape
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

// AI's move (use weaker AI for weaker countries)
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
}

// Update money on the UI
function updateMoney() {
    document.getElementById('money').textContent = money;
}

// Buy a new shape
function buyShape(shape) {
    if (money >= 10) {
        playerShape = shape;
        money -= 10;
        updateMoney();
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
