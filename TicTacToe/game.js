<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ticked Tacked Toed - World Domination Edition</title>
  <style>
    /* Basic styling – tweak as desired */
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
    body { background: black; color: white; display: flex; flex-direction: column; }
    .game-container { 
      overflow: auto; 
      height: 90vh; 
      padding: 20px;
    }
    .section { margin-top: 20px; padding: 10px; border: 2px solid #444; }
    .board { 
      display: grid; 
      grid-template-columns: repeat(3, 100px); 
      grid-gap: 10px; 
      justify-content: center; 
      margin-top: 20px; 
    }
    .cell { 
      width: 100px; 
      height: 100px; 
      background: #333; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 2em; 
      cursor: pointer; 
    }
    .cell:hover { background: #555; }
    button { margin: 10px; padding: 10px; background: #444; color: white; border: none; cursor: pointer; }
    button:hover { background: #666; }
    select, input[type="number"], input[type="text"] { margin-top: 5px; padding: 5px; width: 200px; display: block; }
    ul { list-style: none; }
  </style>
</head>
<body>
  <div>
    <h1>Tic Tac Toe - World Domination Edition</h1>
  </div>
  <div class="game-container">
    <!-- Player Info -->
    <div class="section" id="playerInfo">
      <label for="playerName">Enter your name:</label>
      <input type="text" id="playerName" placeholder="Player Name" />
      <button id="saveNameButton">Save Name</button>
      <p id="nameConfirmation"></p>
      <p id="playerDisplay"></p>
    </div>

    <!-- Core Game Board -->
    <div class="section" id="gameBoardSection">
      <div class="board">
        <div class="cell" onclick="handlePlayerMove(0)"></div>
        <div class="cell" onclick="handlePlayerMove(1)"></div>
        <div class="cell" onclick="handlePlayerMove(2)"></div>
        <div class="cell" onclick="handlePlayerMove(3)"></div>
        <div class="cell" onclick="handlePlayerMove(4)"></div>
        <div class="cell" onclick="handlePlayerMove(5)"></div>
        <div class="cell" onclick="handlePlayerMove(6)"></div>
        <div class="cell" onclick="handlePlayerMove(7)"></div>
        <div class="cell" onclick="handlePlayerMove(8)"></div>
      </div>
      <div class="info">
        <p>Current Player: <span id="currentPlayer">Player</span></p>
        <p>Money: $<span id="money">0</span></p>
        <button id="restartButton">Restart Game</button>
      </div>
    </div>

    <!-- Expanded Country Selection -->
    <div class="section" id="countrySelection">
      <h3>Choose Country to Fight</h3>
      <!-- Real-life countries -->
      <button class="country-btn" onclick="startFight('USA', 10)">USA</button>
      <button class="country-btn" onclick="startFight('Russia', 8)">Russia</button>
      <button class="country-btn" onclick="startFight('China', 9)">China</button>
      <button class="country-btn" onclick="startFight('Brazil', 5)">Brazil</button>
      <button class="country-btn" onclick="startFight('India', 6)">India</button>
      <button class="country-btn" onclick="startFight('Germany', 7)">Germany</button>
      <button class="country-btn" onclick="startFight('Canada', 6)">Canada</button>
      <button class="country-btn" onclick="startFight('Australia', 4)">Australia</button>
      <button class="country-btn" onclick="startFight('Nigeria', 3)">Nigeria</button>
      <button class="country-btn" onclick="startFight('Mexico', 5)">Mexico</button>
      <button class="country-btn" onclick="startFight('UK', 8)">UK</button>
      <button class="country-btn" onclick="startFight('France', 7)">France</button>
      <button class="country-btn" onclick="startFight('Japan', 9)">Japan</button>
      <button class="country-btn" onclick="startFight('South Korea', 8)">South Korea</button>
      <button class="country-btn" onclick="startFight('Italy', 7)">Italy</button>
      <button class="country-btn" onclick="startFight('Spain', 6)">Spain</button>
      <button class="country-btn" onclick="startFight('Turkey', 7)">Turkey</button>
      <button class="country-btn" onclick="startFight('South Africa', 4)">South Africa</button>
      <!-- Fictional countries -->
      <button class="country-btn" onclick="startFight('Zorg', 9)">Zorg</button>
      <button class="country-btn" onclick="startFight('Xandar', 8)">Xandar</button>
      <button class="country-btn" onclick="startFight('Nova', 7)">Nova</button>
      <button class="country-btn" onclick="startFight('Aurora', 6)">Aurora</button>
    </div>

    <!-- Diplomacy Section -->
    <div class="section" id="diplomacy">
      <h3>Diplomacy</h3>
      <label for="diplomacyCountry">Select Country:</label>
      <select id="diplomacyCountry">
        <!-- Options match extended countries -->
        <option value="USA">USA</option>
        <option value="Russia">Russia</option>
        <option value="China">China</option>
        <option value="Brazil">Brazil</option>
        <option value="India">India</option>
        <option value="Germany">Germany</option>
        <option value="Canada">Canada</option>
        <option value="Australia">Australia</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Mexico">Mexico</option>
        <option value="UK">UK</option>
        <option value="France">France</option>
        <option value="Japan">Japan</option>
        <option value="South Korea">South Korea</option>
        <option value="Italy">Italy</option>
        <option value="Spain">Spain</option>
        <option value="Turkey">Turkey</option>
        <option value="South Africa">South Africa</option>
        <option value="Zorg">Zorg</option>
        <option value="Xandar">Xandar</option>
        <option value="Nova">Nova</option>
        <option value="Aurora">Aurora</option>
      </select>
      <label for="diplomacyAmount">Amount to Send:</label>
      <input type="number" id="diplomacyAmount" placeholder="Enter amount" />
      <button id="sendDiplomacyButton">Send Money</button>
      <p id="diplomacyResult"></p>
    </div>

    <!-- Form Alliance Section -->
    <div class="section" id="formAlliance">
      <h3>Form Alliance</h3>
      <label for="formAllianceCountry">Select Country to Ally With:</label>
      <select id="formAllianceCountry">
        <!-- Options as above -->
        <option value="USA">USA</option>
        <option value="Russia">Russia</option>
        <option value="China">China</option>
        <option value="Brazil">Brazil</option>
        <option value="India">India</option>
        <option value="Germany">Germany</option>
        <option value="Canada">Canada</option>
        <option value="Australia">Australia</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Mexico">Mexico</option>
        <option value="UK">UK</option>
        <option value="France">France</option>
        <option value="Japan">Japan</option>
        <option value="South Korea">South Korea</option>
        <option value="Italy">Italy</option>
        <option value="Spain">Spain</option>
        <option value="Turkey">Turkey</option>
        <option value="South Africa">South Africa</option>
        <option value="Zorg">Zorg</option>
        <option value="Xandar">Xandar</option>
        <option value="Nova">Nova</option>
        <option value="Aurora">Aurora</option>
      </select>
      <button onclick="formAlliance(document.getElementById('formAllianceCountry').value)">Form Alliance</button>
      <p id="allianceFormResult"></p>
      <h4>Your Alliances:</h4>
      <div id="playerAlliancesDisplay"></div>
    </div>

    <!-- Alliance Overview Section -->
    <div class="section" id="allianceOverview">
      <h3>Alliance Overview</h3>
      <div id="alliancesDisplay"></div>
    </div>

    <!-- Alliance War Section -->
    <div class="section" id="allianceWar">
      <h3>Start Alliance War</h3>
      <label for="warAlliance">Select Alliance:</label>
      <select id="warAlliance">
        <option value="Western Alliance">Western Alliance (USA, UK, France, Germany, Canada, Australia)</option>
        <option value="Eastern Bloc">Eastern Bloc (Russia, China, India, Brazil, Mexico)</option>
        <option value="Mediterranean Union">Mediterranean Union (Italy, Spain, Turkey)</option>
        <option value="Asia-Pacific">Asia-Pacific (Japan, South Korea, Australia)</option>
        <option value="African Coalition">African Coalition (Nigeria, South Africa)</option>
        <option value="Rebel Alliance">Rebel Alliance (Zorg, Xandar)</option>
        <option value="Intergalactic Coalition">Intergalactic Coalition (Nova, Aurora)</option>
      </select>
      <button onclick="startAllianceWar(document.getElementById('warAlliance').value)">Start War</button>
      <p id="warResult"></p>
    </div>

    <!-- Alliance Upgrade Shop -->
    <div class="section" id="allianceShop">
      <h3>Alliance Upgrades</h3>
      <button onclick="buyUpgrade('Spy Drone')">Buy Spy Drone ($5000)</button>
      <button onclick="buyUpgrade('Cyber Warfare')">Buy Cyber Warfare Upgrade ($10000)</button>
      <button onclick="buyUpgrade('Diplomatic Immunity')">Buy Diplomatic Immunity ($15000)</button>
      <button onclick="buyUpgrade('Nuke')">Buy Nuke ($1000000)</button>
      <button onclick="buyUpgrade('Economic Sanctions')">Buy Economic Sanctions ($8000)</button>
      <button onclick="buyUpgrade('Propaganda Campaign')">Buy Propaganda Campaign ($5000)</button>
      <div id="upgradeResult"></div>
    </div>

    <!-- Country Relations Display -->
    <div class="section" id="relationsSection">
      <h3>Country Relations</h3>
      <div id="relationsDisplay"></div>
    </div>

    <!-- Heist Minigame Section -->
    <div class="section" id="heistSection">
      <h3>Heist Minigame</h3>
      <p>Set your heist parameters and try your luck!</p>
      <label for="heistBudget">Budget ($):</label>
      <input type="number" id="heistBudget" placeholder="Enter budget" />
      <label for="heistVehicle">Vehicle:</label>
      <select id="heistVehicle">
        <option value="Car">Car</option>
        <option value="Motorcycle">Motorcycle</option>
        <option value="Van">Van</option>
        <option value="Helicopter">Helicopter</option>
        <option value="Banana Car">Banana Car</option>
        <option value="Rickshaw">Rickshaw</option>
        <option value="Hoverboard">Hoverboard</option>
        <option value="Spaceship">Spaceship</option>
      </select>
      <label for="heistLocation">Location:</label>
      <select id="heistLocation">
        <option value="Bank">Bank</option>
        <option value="Casino">Casino</option>
        <option value="Museum">Museum</option>
        <option value="Jewelry Store">Jewelry Store</option>
        <option value="Ice Cream Parlor">Ice Cream Parlor</option>
        <option value="Candy Factory">Candy Factory</option>
        <option value="Roller Disco">Roller Disco</option>
        <option value="Secret Lair">Secret Lair</option>
      </select>
      <label for="heistWeapon">Weapon:</label>
      <select id="heistWeapon">
        <option value="Pistol">Pistol</option>
        <option value="Shotgun">Shotgun</option>
        <option value="Rifle">Rifle</option>
        <option value="None">None</option>
        <option value="Rubber Chicken">Rubber Chicken</option>
        <option value="Water Gun">Water Gun</option>
        <option value="Banana Peel">Banana Peel</option>
        <option value="Feather Duster">Feather Duster</option>
      </select>
      <label for="heistDisguise">Disguise:</label>
      <select id="heistDisguise">
        <option value="Mask">Mask</option>
        <option value="Suit">Suit</option>
        <option value="Casual">Casual</option>
        <option value="None">None</option>
        <option value="Giant Chicken Costume">Giant Chicken Costume</option>
        <option value="Clown Outfit">Clown Outfit</option>
        <option value="Zombie Costume">Zombie Costume</option>
        <option value="SpongeBob Costume">SpongeBob Costume</option>
      </select>
      <label for="heistGadget">Choose a Gadget:</label>
      <select id="heistGadget">
        <option value="Hacking Device">Hacking Device</option>
        <option value="EMP">EMP</option>
        <option value="Grappling Hook">Grappling Hook</option>
        <option value="Smoke Bomb">Smoke Bomb</option>
        <option value="Silly String">Silly String</option>
        <option value="Whoopee Cushion">Whoopee Cushion</option>
        <option value="Exploding Cake">Exploding Cake</option>
        <option value="Magic Wand">Magic Wand</option>
      </select>
      <button id="attemptHeistButton">Attempt Heist</button>
      <p id="heistResult"></p>
    </div>
  </div>

  <!-- Load core game logic first, then alliance system -->
  <script src="game.js"></script>
  <script src="alliance.js"></script>
</body>
</html>
