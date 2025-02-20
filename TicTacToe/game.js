// Minimax algorithm for AI
const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === 'X') return -10 + depth; // Player 'X' wins
    if (winner === 'O') return 10 - depth; // AI 'O' wins
    if (!board.includes('')) return 0; // Tie

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // AI's turn
                const score = minimax(board, depth + 1, false);
                board[i] = ''; // Undo move
                best = Math.max(best, score);
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Player's turn
                const score = minimax(board, depth + 1, true);
                board[i] = ''; // Undo move
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
            board[i] = 'O'; // AI's move
            const moveValue = minimax(board, 0, false);
            board[i] = ''; // Undo move

            if (moveValue > bestValue) {
                bestValue = moveValue;
                move = i;
            }
        }
    }
    return move;
};

// Board initialization
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player's turn starts first

// Check for a winner
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }

    return null; // No winner yet
}

// Function to handle the player's move
function handlePlayerMove(index) {
    if (gameBoard[index] === '' && currentPlayer === 'X') {
        gameBoard[index] = 'X'; // Player's move
        renderBoard();
        if (checkWinner(gameBoard)) {
            setTimeout(() => alert("Player wins!"), 100);
            return;
        }
        currentPlayer = 'O'; // Switch to AI's turn
        aiMove(); // Let the AI make a move
    }
}

// Function to handle the AI's move
function aiMove() {
    const move = bestMove(gameBoard); // Get the best move for the AI
    gameBoard[move] = 'O'; // AI makes the move
    renderBoard();
    if (checkWinner(gameBoard)) {
        setTimeout(() => alert("AI wins!"), 100);
    } else {
        currentPlayer = 'X'; // Switch back to player's turn
    }
}

// Render the board to the UI
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    gameBoard.forEach((value, index) => {
        cells[index].textContent = value;
    });

    document.getElementById('currentPlayer').textContent = currentPlayer === 'X' ? 'Player' : 'AI';
}

// Restart the game
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', '']; // Reset the board
    currentPlayer = 'X'; // Start with Player
    renderBoard();
}
