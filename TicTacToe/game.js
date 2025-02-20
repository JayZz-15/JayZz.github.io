let board = ["", "", "", "", "", "", "", "", ""];
let playerSymbol = "X";
let aiSymbol = "O";
let gameActive = false;
let aiDifficulty = 5;

function createBoard() {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board.forEach((cell, index) => {
        let cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell;
        cellDiv.addEventListener("click", playerMove);
        boardDiv.appendChild(cellDiv);
    });
}

function startGame(country, difficulty) {
    aiDifficulty = difficulty;
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    createBoard();
    showMenu("gameplay");
}

function playerMove(event) {
    let index = event.target.dataset.index;
    if (board[index] === "" && gameActive) {
        board[index] = playerSymbol;
        updateBoard();
        if (checkWin(playerSymbol)) return endGame("You Win!");
        aiMove();
    }
}

function aiMove() {
    let emptyCells = board.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);
    if (emptyCells.length > 0) {
        let aiChoice = emptyCells[Math.floor(Math.random() * aiDifficulty) % emptyCells.length];
        board[aiChoice] = aiSymbol;
        updateBoard();
        if (checkWin(aiSymbol)) return endGame("AI Wins!");
    }
}

function updateBoard() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
        cell.innerText = board[i];
    });
}

function checkWin(symbol) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winPatterns.some(pattern => pattern.every(index => board[index] === symbol));
}

function endGame(message) {
    gameActive = false;
    document.getElementById("status").innerText = message;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    document.getElementById("status").innerText = "";
    createBoard();
}
