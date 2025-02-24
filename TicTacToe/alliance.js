/* alliance.js */

// Extend the list of countries with additional ones
const extendedCountries = {
  'USA': { strength: 10, relation: 100 },
  'Russia': { strength: 8, relation: 100 },
  'China': { strength: 9, relation: 100 },
  'Brazil': { strength: 5, relation: 100 },
  'India': { strength: 6, relation: 100 },
  'Germany': { strength: 7, relation: 100 },
  'Canada': { strength: 6, relation: 100 },
  'Australia': { strength: 4, relation: 100 },
  'Nigeria': { strength: 3, relation: 100 },
  'Mexico': { strength: 5, relation: 100 },
  'UK': { strength: 8, relation: 100 },
  'France': { strength: 7, relation: 100 },
  'Japan': { strength: 9, relation: 100 },
  'South Korea': { strength: 8, relation: 100 },
  'Italy': { strength: 7, relation: 100 },
  'Spain': { strength: 6, relation: 100 },
  'Turkey': { strength: 7, relation: 100 },
  'South Africa': { strength: 4, relation: 100 }
};

// Merge extended countries into the global countryStrengths
for (let country in extendedCountries) {
  countryStrengths[country] = extendedCountries[country].strength;
}
// Replace the original countryRelations with extended ones
let extendedRelations = {};
for (let country in extendedCountries) {
  extendedRelations[country] = extendedCountries[country].relation;
}
countryRelations = extendedRelations;

// Define alliances – grouping countries by region or common interest
let alliances = {
  "Western Alliance": ["USA", "UK", "France", "Germany", "Canada", "Australia"],
  "Eastern Bloc": ["Russia", "China", "India", "Brazil", "Mexico"],
  "Mediterranean Union": ["Italy", "Spain", "Turkey"],
  "Asia-Pacific": ["Japan", "South Korea", "Australia"],
  "African Coalition": ["Nigeria", "South Africa"]
};

// Alliance upgrades available in the shop
let allianceUpgrades = {
  "Spy Drone": { cost: 50, effect: (alliance) => { improveAllianceRelations(alliance, 5); } },
  "Cyber Warfare": { cost: 100, effect: (alliance) => { improveAllianceRelations(alliance, 10); } },
  "Diplomatic Immunity": { cost: 150, effect: (alliance) => { improveAllianceRelations(alliance, 15); } },
  "Nuclear Option": { cost: 200, effect: (alliance) => { damageAlliance(alliance, 20); } }
};

// Update the relations display in the "Country Relations" section
function updateRelationsDisplay() {
  let html = "<ul>";
  for (let country in countryRelations) {
    html += `<li>${country}: ${countryRelations[country]}</li>`;
  }
  html += "</ul>";
  document.getElementById("relationsDisplay").innerHTML = html;
}

// Update a country's relation score
function updateCountryRelation(country, delta) {
  if (countryRelations[country] !== undefined) {
    countryRelations[country] += delta;
    if (countryRelations[country] > 100) countryRelations[country] = 100;
    if (countryRelations[country] < 0) countryRelations[country] = 0;
    updateRelationsDisplay();
    checkAllianceWar();
  }
}

// Diplomacy: send money to improve relations
function sendDiplomacy() {
  const selectedCountry = document.getElementById('diplomacyCountry').value;
  const amount = parseInt(document.getElementById('diplomacyAmount').value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }
  if (amount > money) {
    alert("You don't have enough money!");
    return;
  }
  money -= amount;
  updateMoney();
  const relationIncrease = Math.floor(amount / 10);
  updateCountryRelation(selectedCountry, relationIncrease);
  document.getElementById('diplomacyResult').textContent = `You sent $${amount} to ${selectedCountry}. Their relation improved by ${relationIncrease} points.`;
}

// Check if any alliance is hostile enough to trigger a war event
function checkAllianceWar() {
  for (let allianceName in alliances) {
    let allianceCountries = alliances[allianceName];
    let totalRelation = 0, count = 0;
    for (let country of allianceCountries) {
      if (countryRelations[country] !== undefined) {
        totalRelation += countryRelations[country];
        count++;
      }
    }
    let avgRelation = totalRelation / count;
    if (avgRelation < 40 && !warMode) {
      triggerAllianceWar(allianceName);
      break;
    }
  }
}

// Trigger an alliance war event
function triggerAllianceWar(allianceName) {
  warMode = true;
  alert(`Alliance War! The ${allianceName} has united against you! Prepare for a massive multi-board battle!`);
  // For demonstration, penalize the player’s money.
  money = Math.floor(money * 0.5);
  updateMoney();
  // (Later you could launch a new game mode with an expanded board.)
}

// Apply an upgrade effect to improve relations for all members of an alliance
function improveAllianceRelations(allianceName, amount) {
  let allianceCountries = alliances[allianceName];
  for (let country of allianceCountries) {
    updateCountryRelation(country, amount);
  }
  document.getElementById('upgradeResult').textContent = `${allianceName} relations improved by ${amount} points.`;
}

// Apply an upgrade effect that damages (lowers) relations for all members of an alliance
function damageAlliance(allianceName, amount) {
  let allianceCountries = alliances[allianceName];
  for (let country of allianceCountries) {
    updateCountryRelation(country, -amount);
  }
  document.getElementById('upgradeResult').textContent = `${allianceName} relations damaged by ${amount} points.`;
}

// Buy an alliance upgrade from the shop
function buyUpgrade(itemName) {
  const upgrade = allianceUpgrades[itemName];
  if (!upgrade) {
    alert("Invalid upgrade!");
    return;
  }
  if (money < upgrade.cost) {
    alert("Not enough money for this upgrade!");
    return;
  }
  // Let the player choose which alliance to target with the upgrade
  let allianceName = prompt("Enter the alliance name to apply this upgrade (e.g., 'Western Alliance'):");
  if (!alliances[allianceName]) {
    alert("Invalid alliance name!");
    return;
  }
  money -= upgrade.cost;
  updateMoney();
  upgrade.effect(allianceName);
  document.getElementById('upgradeResult').textContent = `${itemName} purchased for ${allianceName}!`;
}

// Initialize the relations display on page load
window.addEventListener('load', () => {
  updateRelationsDisplay();
});

