let currentPlayer = "X"; // X always starts
let board = ["", "", "", "", "", "", "", "", ""];
let totalMoney = 0;
let countryName = "";

// Set player's country and hide country input section
function setCountry() {
    countryName = document.getElementById("countryName").value;
    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }
    localStorage.setItem("countryName", countryName);
    localStorage.setItem("totalMoney", 0);
    document.getElementById("countrySection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    loadPlayerData();
}

// Load player data (money, country name) from localStorage
function loadPlayerData() {
    countryName = localStorage.getItem("countryName");
    totalMoney = parseInt(localStorage.getItem("totalMoney")) || 0;
    document.getElementById("playerCountry").textContent = countryName;
    document.getElementById("playerMoney").textContent = totalMoney;
}

// Start the game by resetting the board
function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    renderBoard();
}

// Render the game board with clickable cells
function renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (board[i] !== "") {
            cell.classList.add("disabled");
            cell.textContent = board[i];
        } else {
            cell.onclick = () => handleCellClick(i);
        }
        boardElement.appendChild(cell);
    }
}

// Handle player click on a cell
function handleCellClick(index) {
    if (board[index] !== "") return;
    board[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    renderBoard();
    if (checkWin()) {
        winRound();
    }
}

// Check if the current player wins
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Handle win round: increase money, update leaderboard, and render results
function winRound() {
    totalMoney += 100; // Add 100 money as a reward for winning
    localStorage.setItem("totalMoney", totalMoney);
    alert("You won! Your money has increased by $100.");

    // Update the leaderboard and render it
    updateLeaderboard();
    loadPlayerData();
}

// Update leaderboard
function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({
        country: countryName,
        money: totalMoney
    });
    leaderboard.sort((a, b) => b.money - a.money); // Sort by highest money
    leaderboard = leaderboard.slice(0, 10); // Keep top 10

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    renderLeaderboard(leaderboard);
}

// Render the leaderboard
function renderLeaderboard(leaderboard) {
    const tableBody = document.getElementById("leaderboardTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Clear existing leaderboard

    leaderboard.forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = entry.country;
        row.insertCell(2).innerText = entry.money;
    });
}

// On page load, check for saved data
window.onload = () => {
    if (localStorage.getItem("countryName")) {
        loadPlayerData();
        document.getElementById("countrySection").style.display = "none";
        document.getElementById("gameSection").style.display = "block";
    }
};
