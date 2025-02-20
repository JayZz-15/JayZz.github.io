let playerShape = "X";

function buyShape(shape) {
    if (money >= 10) {
        playerShape = shape;
        money -= 10;
        alert(`You now play as ${shape}!`);
    } else {
        alert("Not enough money!");
    }
}
