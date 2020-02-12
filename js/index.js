game = new Game();
game.loop();
const button = document.getElementById("cta")
button.addEventListener("click", () => {
    button.style.display = "none";
    game.initGame();
    game.state = STATE.PLACE_NEW_BLOCK;
})