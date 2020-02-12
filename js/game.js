const STATE = {
    IDLE: "IDLE",
    PLACE_NEW_BLOCK: "PLACE_NEW_BLOCK",
    OSCILLATE_NEW_BLOCK: "OSCILLATE_NEW_BLOCK",
    LOST: "LOST"
}
class Game {
    constructor() {
        this.viewer = new Viewer();
    }
    initGame() {
        this.viewer.scene = new THREE.Scene();

        // lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        const light = new THREE.AmbientLight(0x404040); // soft white light
        this.viewer.scene.add(directionalLight);
        this.viewer.scene.add(light);

        // camera position
        this.viewer.camera.position.set(1000,800,1000);
        this.viewer.camera.lookAt(0,200,0);

        // box at the top of the stack
        this.top = new Block();
        this.viewer.scene.add(this.top.mesh);

        this.newBlock = null

        this.state = STATE.IDLE
        this.direction = 1;
        this.speed = 1;
        this.score = 0;
        this.updateScore();
        this.registerSpacePress();
    }
    registerSpacePress() {
        document.onkeydown = (evt) => {
            evt = evt || window.event;
            if (this.state === STATE.OSCILLATE_NEW_BLOCK && evt.keyCode == 32) {
                if (this.newBlock.clipTo(this.top) < 0) {
                    this.state = STATE.LOST
                    return
                } 
                this.top = this.newBlock;
                this.newBlock = null;
                this.score += 1;
                this.speed += 0.5;
                this.updateScore();
                this.cameraFollowTop();
                this.state = STATE.PLACE_NEW_BLOCK;
            }
        };
    }
    cameraFollowTop() {
        this.viewer.camera.position.set(1000,this.top.mesh.position.y+800,1000);
        this.viewer.camera.lookAt(0,this.top.mesh.position.y+200,0);
    }
    updateScore() {
        const div = document.getElementById("score");
        div.innerText = this.score;
    }
    placeNewBlock() {
        this.newBlock = new Block()
        this.newBlock.mesh.position.x = -250;
        this.newBlock.mesh.position.y = this.top.mesh.position.y + this.top.dimensions.y + 5;
        this.viewer.scene.add(this.newBlock.mesh);
        this.state = STATE.OSCILLATE_NEW_BLOCK;
    }
    oscillateNewBlock() {
        if (this.newBlock.mesh.position.x > 250 && this.direction > 0) {
            this.direction *= -1;
        }
        if (this.newBlock.mesh.position.x < -250 && this.direction < 0) {
            this.direction *= -1;
        }
        this.newBlock.mesh.position.x += this.speed * this.direction;
    }
    update() {
        switch(this.state) {
            case STATE.IDLE:
                break;
            case STATE.PLACE_NEW_BLOCK:
                this.placeNewBlock();
                break;
            case STATE.OSCILLATE_NEW_BLOCK:
                this.oscillateNewBlock();
                break;
            case STATE.LOST:
                const button = document.getElementById("cta")
                button.style.display = "flex";
                this.state = STATE.IDLE
                break;
        }
    }
    loop(){
        this.update();
        this.viewer.render();
        requestAnimationFrame(this.loop.bind(this));
    }
}