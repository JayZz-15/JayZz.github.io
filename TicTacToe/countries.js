function startFight(country, strength) {
    currentCountry = country;
    countryStrength = strength;
    alert(`You are now fighting against ${country}!`);
    showMenu("gameplay");
    startGame();
}
