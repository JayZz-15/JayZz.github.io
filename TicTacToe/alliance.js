/* alliance.js */

// Extended countries (with many new entries)
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

// Merge extended countries into global countryStrengths
for (let country in extendedCountries) {
  countryStrengths[country] = extendedCountries[country].strength;
}
// Replace global countryRelations with extended ones
let extendedRelations = {};
for (let country in extendedCountries) {
  extendedRelations[country] = extendedCountries[country].relation;
}
countryRelations = extendedRelations;

// Define alliances (grouped by region or interest)
let alliances = {
  "Western Alliance": ["USA", "UK", "France", "Germany", "Canada", "Australia"],
  "Eastern Bloc": ["Russia", "China", "India", "Brazil", "Mexico"],
  "Mediterranean Union": ["Italy", "Spain", "Turkey"],
  "Asia-Pacific": ["Japan", "South Korea", "Australia"],
  "African Coalition": ["Nigeria", "South Africa"]
};

// Alliance upgrades (all prices are much higher)
let allianceUpgrades = {
  "Spy Drone": { cost: 500, effect: (allianceName) => { improveAllianceRelations(allianceName, 50); } },
  "Cyber Warfare": { cost: 1000, effect: (allianceName) => { improveAllianceRelations(allianceName, 100); } },
  "Diplomatic Immunity": { cost: 1500, effect: (allianceName) => { improveAllianceRelations(allianceName, 150); } },
  "Nuke": { cost: 2000, effect: (allianceName) => { deployNuke(allianceName); } }
};

// Update the relations display (shows all countries)
function updateRelationsDisplay() {
  let html = "<ul>";
  for (let country in countryRelations) {
    html += `<li>${country}: ${countryRelations[country]}</li>`;
  }
  html += "</ul>";
  document.getElementById("relationsDisplay").innerHTML = html;
  updateAlliancesDisplay();
}

// Update the Alliance Overview display
function updateAlliancesDisplay() {
  let html = "";
  for (let allianceName in alliances) {
    html += `<h4>${allianceName}</h4><ul>`;
    alliances[allianceName].forEach(country => {
      // Only show if the country still exists (has not been nuked)
      if (country in countryRelations) {
        html += `<li>${country}: ${countryRelations[country]}</li>`;
      }
    });
    html += "</ul>";
  }
  document.getElementById("alliancesDisplay").innerHTML = html;
}

// Update a country's relation score and check for war events
function updateCountryRelation(country, delta) {
  if (countryRelations[country] !== undefined) {
    countryRelations[country] += delta;
    if (countryRelations[country] > 100) countryRelations[country] = 100;
    if (countryRelations[country] < 0) countryRelations[country] = 0;
    updateRelationsDisplay();
    checkAllianceWar();
  }
}

// Diplomacy: send money to improve relations (costs are higher – see core game for money deduction)
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
  document.getElementById('diplomacyResult').textContent = `You sent $${amount} to ${selectedCountry}. Relation improved by ${relationIncrease} points.`;
}

// Check if any alliance has an average relation below threshold to trigger war
function checkAllianceWar() {
  for (let allianceName in alliances) {
    let allianceCountries = alliances[allianceName];
    let total = 0, count = 0;
    allianceCountries.forEach(country => {
      if (country in countryRelations) {
        total += countryRelations[country];
        count++;
      }
    });
    let avg = count ? total / count : 100;
    if (avg < 40 && !warMode) {
      triggerAllianceWar(allianceName);
      break;
    }
  }
}

// Trigger an alliance war event
function triggerAllianceWar(allianceName) {
  warMode = true;
  alert(`Alliance War! The ${allianceName} has united against you! Prepare for a massive multi-board battle!`);
  money = Math.floor(money * 0.5);
  updateMoney();
  // (A full war mode with extra boards could be implemented here.)
}

// Improve relations for all members of an alliance
function improveAllianceRelations(allianceName, amount) {
  let allianceCountries = alliances[allianceName];
  allianceCountries.forEach(country => {
    updateCountryRelation(country, amount);
  });
  document.getElementById('upgradeResult').textContent = `${allianceName} relations improved by ${amount} points.`;
}

// Deploy a nuke: eliminate the worst country from the alliance (randomly among equals)
function deployNuke(allianceName) {
  let allianceCountries = alliances[allianceName];
  let validCountries = allianceCountries.filter(c => c in countryRelations);
  if (validCountries.length === 0) {
    document.getElementById('upgradeResult').textContent = `No valid targets in ${allianceName}.`;
    return;
  }
  // Find the minimum relation value
  let worstValue = Math.min(...validCountries.map(c => countryRelations[c]));
  let worstCandidates = validCountries.filter(c => countryRelations[c] === worstValue);
  let eliminated = worstCandidates[Math.floor(Math.random() * worstCandidates.length)];
  
  // Remove eliminated country from all structures
  delete countryRelations[eliminated];
  delete countryStrengths[eliminated];
  for (let a in alliances) {
    alliances[a] = alliances[a].filter(c => c !== eliminated);
  }
  document.getElementById('upgradeResult').textContent = `Nuke deployed on ${eliminated}! They have been eliminated from the game.`;
  updateRelationsDisplay();
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
  let allianceName = prompt("Enter the alliance name to apply this upgrade (e.g., 'Western Alliance'):");
  if (!alliances[allianceName] || alliances[allianceName].length === 0) {
    alert("Invalid or empty alliance name!");
    return;
  }
  money -= upgrade.cost;
  updateMoney();
  upgrade.effect(allianceName);
}
  
// Initialize displays on page load
window.addEventListener('load', () => {
  updateRelationsDisplay();
});
