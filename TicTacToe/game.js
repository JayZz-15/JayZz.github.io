// Global variables
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first
let money = 100; // Player starts with some money
let playerShape = 'X'; // Default player shape
let currentCountry = ''; // To store selected country
let countryStrength = 0; // The strength of the country
let currentBet = 0; // Stores the player's bet

// Country strength levels
const countryStrengths = {
    'USA': 10, 'Russia': 8, 'China': 9, 'Brazil': 5,
    'India': 6, 'Germany': 7, 'Canada': 6, 'Australia': 4,
    'Nigeria': 3, 'Mexico': 5
};

// Function to place a bet
function placeBet() {
    let betInput = document.getElementById('betAmount').value;
    let bet = parseInt(betInput);

    if (bet > 0 && bet <= money) {
        currentBet = bet;
        money -= bet; // Deduct bet from money
        updateMoney();
        document.getElementById('betInfo').textContent = `Current Bet: $${currentBet}`;
        alert(`You placed a bet of $${currentBet}!`);
    } else {
        alert("Invalid bet amount!");
    }
}

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
    if (!board.includes('')) return 'Tie'; // If board is full and no winner
    return null;
}

// Handle the player's move
function handlePlayerMove(index) {
    if (gameBoard[index] === '' && currentPlayer === 'X') {
        gameBoard[index] = playerShape;
        renderBoard();
        const winner = checkWinner(gameBoard);
        if (winner) endGame(winner);
        else {
            currentPlayer = 'O';
            aiMove();
        }
    }
}

// AI's move
function aiMove() {
    const move = (countryStrength < 5) ? weakCountryMistakes(gameBoard) : bestMove(gameBoard);
    gameBoard[move] = 'O';
    renderBoard();
    const winner = checkWinner(gameBoard);
    if (winner) endGame(winner);
    else {
        currentPlayer = 'X';
    }
}

// End game function
function endGame(winner) {
    if (winner === 'X') {
        let winnings = currentBet * 2;
        money += winnings;
        alert(`You won! You earned $${winnings}`);
    } else if (winner === 'O') {
        alert("AI won! You lost your bet.");
    } else {
        alert("It's a tie! You got your bet back.");
        money += currentBet; // Refund bet
    }
    updateMoney();
    currentBet = 0;
    restartGame();
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
