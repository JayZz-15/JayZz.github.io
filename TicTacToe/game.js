const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
let currentPlayer = 'X'; // 'X' is the player, 'O' is AI
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

function renderBoard() {
    gameBoard.forEach((value, index) => {
        cells[index].textContent = value;
        cells[index].style.pointerEvents = gameOver ? 'none' : 'auto';
    });
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameOver = true;
            statusDiv.textContent = `${currentPlayer} Wins!`;
            return true;
        }
    }

    if (!gameBoard.includes('')) {
        gameOver = true;
        statusDiv.textContent = "It's a Tie!";
        return true;
    }

    return false;
}

function handleClick(event) {
    if (gameOver) return;
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (gameBoard[index] === '') {
        gameBoard[index] = currentPlayer;
        renderBoard();
        if (!checkWinner()) {
            currentPlayer = 'O'; // AI's turn
            statusDiv.textContent = `AI's turn`;
            aiMove();
        }
    }
}

function aiMove() {
    // Simple AI that picks a random empty spot
    let availableMoves = [];
    gameBoard.forEach((value, index) => {
        if (value === '') {
            availableMoves.push(index);
        }
    });

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    gameBoard[randomMove] = 'O';
    renderBoard();
    if (!checkWinner()) {
        currentPlayer = 'X'; // Player's turn
        statusDiv.textContent = `Player's turn`;
    }
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X'; // Player starts
    gameOver = false;
    statusDiv.textContent = `Player's turn`;
    renderBoard();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

renderBoard();
