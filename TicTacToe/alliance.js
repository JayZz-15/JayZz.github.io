/* alliance.js */

// Extended countries including fictional ones
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
  'South Africa': { strength: 4, relation: 100 },
  // Fictional countries
  'Zorg': { strength: 9, relation: 100 },
  'Xandar': { strength: 8, relation: 100 },
  'Nova': { strength: 7, relation: 100 },
  'Aurora': { strength: 6, relation: 100 }
};

// Merge extended countries into global objects
for (let country in extendedCountries) {
  countryStrengths[country] = extendedCountries[country].strength;
}
let extendedRelations = {};
for (let country in extendedCountries) {
  extendedRelations[country] = extendedCountries[country].relation;
}
countryRelations = extendedRelations;

// Define alliances (some based on regions, others entirely fictional)
let alliances = {
  "Western Alliance": ["USA", "UK", "France", "Germany", "Canada", "Australia"],
  "Eastern Bloc": ["Russia", "China", "India", "Brazil", "Mexico"],
  "Mediterranean Union": ["Italy", "Spain", "Turkey"],
  "Asia-Pacific": ["Japan", "South Korea", "Australia"],
  "African Coalition": ["Nigeria", "South Africa"],
  "Rebel Alliance": ["Zorg", "Xandar"],
  "Intergalactic Coalition": ["Nova", "Aurora"]
};

// Additional alliance upgrades – costs are high now
let allianceUpgrades = {
  "Spy Drone": { cost: 5000, effect: (allianceName) => { improveAllianceRelations(allianceName, 50); } },
  "Cyber Warfare": { cost: 10000, effect: (allianceName) => { improveAllianceRelations(allianceName, 100); } },
  "Diplomatic Immunity": { cost: 15000, effect: (allianceName) => { improveAllianceRelations(allianceName, 150); } },
  "Nuke": { cost: 1000000, effect: (allianceName) => { deployNuke(allianceName); } },
  "Economic Sanctions": { cost: 8000, effect: (allianceName) => { damageAlliance(allianceName, 50); } },
  "Propaganda Campaign": { cost: 5000, effect: (allianceName) => { money += 2000; alert("Propaganda Campaign boosted your economy by $2000!"); } }
};

// Update relations display (shows all countries)
function updateRelationsDisplay() {
  let html = "<ul>";
  for (let country in countryRelations) {
    html += `<li>${country}: ${countryRelations[country]}</li>`;
  }
  html += "</ul>";
  document.getElementById("relationsDisplay").innerHTML = html;
  updateAlliancesDisplay();
}

// Update Alliance Overview display (lists alliances and their members)
function updateAlliancesDisplay() {
  let html = "";
  for (let allianceName in alliances) {
    html += `<h4>${allianceName}</h4><ul>`;
    alliances[allianceName].forEach(country => {
      if (country in countryRelations)
        html += `<li>${country}: ${countryRelations[country]}</li>`;
    });
    html += "</ul>";
  }
  document.getElementById("alliancesDisplay").innerHTML = html;
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

// Damage an alliance: lower relations for all members
function damageAlliance(allianceName, amount) {
  alliances[allianceName].forEach(country => {
    updateCountryRelation(country, -amount);
  });
  document.getElementById('upgradeResult').textContent = `${allianceName} relations decreased by ${amount} points.`;
}

// Diplomacy: send money to improve relations (money deducted in game.js)
function sendDiplomacy() {
  const selectedCountry = document.getElementById('diplomacyCountry').value;
  const amount = parseInt(document.getElementById('diplomacyAmount').value);
  if (isNaN(amount) || amount <= 0) { alert("Enter a valid amount (>0)."); return; }
  if (amount > money) { alert("Not enough money!"); return; }
  money -= amount;
  updateMoney();
  const relationIncrease = Math.floor(amount / 10);
  updateCountryRelation(selectedCountry, relationIncrease);
  document.getElementById('diplomacyResult').textContent = `You sent $${amount} to ${selectedCountry}. Relation improved by ${relationIncrease} points.`;
}

// Check if any alliance has an average relation below threshold to trigger war
function checkAllianceWar() {
  for (let allianceName in alliances) {
    let arr = alliances[allianceName].filter(c => c in countryRelations);
    let total = arr.reduce((sum, c) => sum + countryRelations[c], 0);
    let avg = arr.length ? total / arr.length : 100;
    if (avg < 40 && !warMode) {
      triggerAllianceWar(allianceName);
      break;
    }
  }
}

// Trigger an alliance war event (multi–board war mode)
function triggerAllianceWar(allianceName) {
  warMode = true;
  alert(`Alliance War! The ${allianceName} has united against you!`);
  startAllianceWar(allianceName);
}

// Improve relations for all members of an alliance
function improveAllianceRelations(allianceName, amount) {
  alliances[allianceName].forEach(country => {
    updateCountryRelation(country, amount);
  });
  document.getElementById('upgradeResult').textContent = `${allianceName} relations improved by ${amount} points.`;
}

// Deploy a Nuke: eliminate the worst–related country in the alliance
function deployNuke(allianceName) {
  let arr = alliances[allianceName].filter(c => c in countryRelations);
  if (!arr.length) { document.getElementById('upgradeResult').textContent = `No targets in ${allianceName}.`; return; }
  let worst = Math.min(...arr.map(c => countryRelations[c]));
  let candidates = arr.filter(c => countryRelations[c] === worst);
  let eliminated = candidates[Math.floor(Math.random() * candidates.length)];
  delete countryRelations[eliminated];
  delete countryStrengths[eliminated];
  // Remove eliminated country from all alliances
  for (let key in alliances) {
    alliances[key] = alliances[key].filter(c => c !== eliminated);
  }
  document.getElementById('upgradeResult').textContent = `Nuke deployed on ${eliminated}! They have been eliminated.`;
  updateRelationsDisplay();
}

// Buy an alliance upgrade from the shop
function buyUpgrade(itemName) {
  const upgrade = allianceUpgrades[itemName];
  if (!upgrade) { alert("Invalid upgrade!"); return; }
  if (money < upgrade.cost) { alert("Not enough money for this upgrade!"); return; }
  let allianceName = prompt("Enter alliance name to apply upgrade (e.g., 'Western Alliance'):");
  if (!alliances[allianceName] || alliances[allianceName].length === 0) { alert("Invalid or empty alliance!"); return; }
  money -= upgrade.cost;
  updateMoney();
  upgrade.effect(allianceName);
}

// --- Form Alliance ---
// Global array for player's allied countries
let playerAlliances = [];
function formAlliance(country) {
  if (!(country in countryRelations)) { 
    document.getElementById('allianceFormResult').textContent = `${country} is not available.`; 
    return; 
  }
  if (playerAlliances.includes(country)) {
    document.getElementById('allianceFormResult').textContent = `Already allied with ${country}.`;
    return;
  }
  playerAlliances.push(country);
  document.getElementById('allianceFormResult').textContent = `Alliance formed with ${country}!`;
  updatePlayerAlliancesDisplay();
}
function updatePlayerAlliancesDisplay() {
  let html = "<ul>";
  playerAlliances.forEach(c => { html += `<li>${c}</li>`; });
  html += "</ul>";
  document.getElementById("playerAlliancesDisplay").innerHTML = html;
}

// --- Multi–Board War Mode ---
// Simulate war as 9 mini–games; win majority to get reward.
function startAllianceWar(allianceName) {
  // Hide normal board
  document.getElementById('gameBoardSection').style.display = "none";
  let wins = 0;
  let losses = 0;
  let arr = alliances[allianceName].filter(c => c in countryRelations);
  let total = arr.reduce((sum, c) => sum + countryRelations[c], 0);
  let avgRelation = arr.length ? total / arr.length : 100;
  let baseWinChance = avgRelation < 50 ? 0.4 : 0.2;
  for (let i = 0; i < 9; i++) {
    if (Math.random() < baseWinChance) wins++; else losses++;
  }
  if (wins >= 5) {
    let reward = 10000;
    money += reward;
    document.getElementById('warResult').textContent = `War won! You earned $${reward}. (Boards won: ${wins}/9)`;
  } else {
    let penalty = 5000;
    money = Math.max(0, money - penalty);
    document.getElementById('warResult').textContent = `War lost! You lost $${penalty}. (Boards won: ${wins}/9)`;
  }
  updateMoney();
  warMode = false;
  document.getElementById('gameBoardSection').style.display = "grid";
}

// Initialize displays and attach event listeners on load
window.addEventListener('load', () => {
  updateRelationsDisplay();
  updatePlayerAlliancesDisplay();
  document.getElementById('sendDiplomacyButton').addEventListener('click', sendDiplomacy);
});
