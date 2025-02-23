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
        let totalPlayers = this.countries.filter(c => c.alliance).length;
        let numBoards = Math.ceil(totalPlayers / 2);
        // Trigger the war mechanic with the calculated number of boards
        startMultiBoardGame(numBoards, country);
    }
}

function startMultiBoardGame(numBoards, country) {
    // Logic to start a multi-board game, where each board represents a battlefront
    console.log(`Starting a multi-board Tic-Tac-Toe game with ${numBoards} boards against ${country.countryName}.`);
    // This is where you would integrate the multi-board gameplay logic.
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

