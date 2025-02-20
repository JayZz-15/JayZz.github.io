let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let money = 0;
let currentCountry = "None";
let countryStrength = 5;

function showMenu(menu) {
    document.querySelectorAll(".menu").forEach(m => m.style.display = "none");
    document.getElementById(menu).style.display = "block";
}

function startGame() {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.addEventListener("click", () => playerMove(i));
        boardDiv.appendChild(cell);
    }
}

function playerMove(index) {
    if (board[index] === "") {
        board[index] = currentPlayer;
        updateBoard();
        setTimeout(() => aiMove(), 500);
    }
}

function aiMove() {
    let emptyCells = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (Math.random() > countryStrength / 10) { 
        move = emptyCells[0]; 
    }

    board[move] = "O";
    updateBoard();
}

function updateBoard() {
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < 9; i++) {
        cells[i].innerText = board[i];
    }
}

showMenu("main-menu");
