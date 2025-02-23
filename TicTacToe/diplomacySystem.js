class CountryRelations {
    constructor(countryName) {
        this.countryName = countryName;
        this.relation = 50;  // Start with neutral relations (0 = hate, 100 = ally)
        this.alliance = false;
    }

    // Increase relations with the country
    increaseRelation(amount) {
        this.relation = Math.min(this.relation + amount, 100);  // Cap at 100
    }

    // Decrease relations with the country
    decreaseRelation(amount) {
        this.relation = Math.max(this.relation - amount, 0);  // Cap at 0
    }

    // Check if the country has declared war on the player
    isAtWar() {
        return this.relation < 20;  // If relation is low, war is declared
    }

    // Form an alliance if relations are high enough
    formAlliance() {
        if (this.relation >= 75) {
            this.alliance = true;
            return true;
        }
        return false;
    }

    // Remove alliance if relations drop
    removeAlliance() {
        this.alliance = false;
    }
}

class Diplomacy {
    constructor(player) {
        this.player = player;
        this.countries = [];
    }

    // Add a new country to the game
    addCountry(countryName) {
        const newCountry = new CountryRelations(countryName);
        this.countries.push(newCountry);
    }

    // Handle giving money to a country
    giveMoneyToCountry(countryName, amount) {
        let country = this.countries.find(c => c.countryName === countryName);
        if (country) {
            country.increaseRelation(amount);
            console.log(`Gave ${amount} to ${countryName}. Relations increased.`);
        }
    }

    // Handle buying an item and giving it to a country
    buyItemForCountry(countryName, item) {
        let country = this.countries.find(c => c.countryName === countryName);
        if (country) {
            let itemRelationBoost = 10;  // Example of item impact
            country.increaseRelation(itemRelationBoost);
            console.log(`Bought ${item} for ${countryName}. Relations increased by ${itemRelationBoost}.`);
        }
    }

    // Trigger war if a country hates the player
    checkForWar() {
        for (let country of this.countries) {
            if (country.isAtWar()) {
                this.initiateWar(country);
            }
        }
    }

    // Handle war initiation (multi-board Tic-Tac-Toe)
    initiateWar(country) {
        console.log(`${country.countryName} has declared war! Starting multi-board Tic-Tac-Toe.`);
        let totalPlayers = this.countries.filter(c => c.alliance).length + 1; // Include player in the count
        let numBoards = Math.ceil(totalPlayers / 2);
        // Trigger the war mechanic with the calculated number of boards
        startMultiBoardGame(numBoards, country);
    }

    // Form alliances with countries (for multi-board mechanics)
    formAlliance(countryName) {
        let country = this.countries.find(c => c.countryName === countryName);
        if (country) {
            if (country.formAlliance()) {
                console.log(`${countryName} has formed an alliance with you!`);
            }
        }
    }

    // Remove alliances if relations fall too low
    removeAlliance(countryName) {
        let country = this.countries.find(c => c.countryName === countryName);
        if (country) {
            country.removeAlliance();
            console.log(`${countryName} has broken the alliance.`);
        }
    }
}

class Player {
    constructor() {
        this.diplomacy = new Diplomacy(this);
    }

    // Example of player giving money to a country
    giveMoney(countryName, amount) {
        this.diplomacy.giveMoneyToCountry(countryName, amount);
    }

    // Example of player buying an item for a country
    buyItemForCountry(countryName, item) {
        this.diplomacy.buyItemForCountry(countryName, item);
    }

    // Update diplomacy status (like checking for alliances, etc.)
    updateDiplomacy() {
        this.diplomacy.checkForWar();
    }

    // Form an alliance with a country
    formAlliance(countryName) {
        this.diplomacy.formAlliance(countryName);
    }

    // Remove alliance with a country
    removeAlliance(countryName) {
        this.diplomacy.removeAlliance(countryName);
    }
}

// Multi-board Tic-Tac-Toe Setup
function startMultiBoardGame(numBoards, country) {
    console.log(`Starting a multi-board Tic-Tac-Toe game with ${numBoards} boards against ${country.countryName}.`);
    // Initialize the multi-board game (simulate the boards)
    for (let i = 0; i < numBoards; i++) {
        startTicTacToeBoard(i + 1, country);
    }
}

// Single board Tic-Tac-Toe game logic
function startTicTacToeBoard(boardNum, country) {
    console.log(`Starting Tic-Tac-Toe board ${boardNum} against ${country.countryName}.`);
    // Add logic for the Tic-Tac-Toe game here (initialize the board, handle moves, etc.)
    // You can connect this with existing Tic-Tac-Toe gameplay logic
    const board = ['', '', '', '', '', '', '', '', '']; // Empty board for the new game
    let currentPlayer = 'Player'; // Change depending on the player turn
    let winner = null;

    // Game loop (simplified for demonstration)
    while (!winner && board.includes('')) {
        // Randomly decide a move for now (replace with your game logic)
        const move = Math.floor(Math.random() * 9);
        if (board[move] === '') {
            board[move] = currentPlayer === 'Player' ? 'X' : 'O';
            currentPlayer = currentPlayer === 'Player' ? 'AI' : 'Player'; // Switch turns
        }

        // Check for a winner after each move (simplified check)
        winner = checkWinner(board);
    }

    if (winner) {
        console.log(`Board ${boardNum}: Winner is ${winner}!`);
    } else {
        console.log(`Board ${boardNum}: It's a tie!`);
    }
}

// Check if there's a winner on a Tic-Tac-Toe board
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

// Example Usage:

// Player setup
const player = new Player();
player.diplomacy.addCountry("USA");
player.diplomacy.addCountry("Russia");

// Player giving money and buying items to influence relations
player.giveMoney("USA", 10);  // Increases relation with USA
player.buyItemForCountry("Russia", "Food Supplies");  // Increases relation with Russia

// Checking for alliances and wars
player.updateDiplomacy();

// Example of a country declaring war
player.diplomacy.countries[1].decreaseRelation(60);  // Decrease Russia's relation below threshold to trigger war
player.updateDiplomacy();

// Forming an alliance with a country
player.formAlliance("USA");

// Removing an alliance with a country
player.removeAlliance("Russia");
