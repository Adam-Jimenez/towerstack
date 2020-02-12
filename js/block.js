class Block {
    constructor(x_span=200, y_span=20, z_span=200) {
        const color = this.getRandomColor();
        this.geometry = new THREE.BoxBufferGeometry(x_span, y_span, z_span);
        this.material = new THREE.MeshPhongMaterial({ color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.dimensions = { x: x_span, y: y_span, z: z_span };
    }
    leftX() {
        return this.mesh.position.x - this.dimensions.x / 2
    }
    rightX() {
        return this.mesh.position.x + this.dimensions.x / 2
    }
    clipTo(otherBlock) {
        let leftmost=null
        let rightmost=null
        if (this.mesh.position.x < otherBlock.mesh.position.x) {
            leftmost=this
            rightmost=otherBlock
        } else {
            leftmost=otherBlock
            rightmost=this
        }
        const x2 =Math.min(leftmost.rightX(), otherBlock.rightX()) 
        const x1 = Math.max(rightmost.leftX(),otherBlock.leftX())
        const new_w = x2 - x1;
        const new_x = (x1 + x2) / 2;
        if (new_w <= 0) {
            return -1;
        } else {
            this.mesh.position.y = otherBlock.mesh.position.y + otherBlock.dimensions.y;
            this.mesh.position.x = new_x;
            const scale = new_w / this.dimensions.x;
            this.dimensions.x = new_w;
            this.mesh.scale.x = scale;
            return 0;
        }
    }
    getRandomColor() {
        return Math.random() * 0xffffff
    }
}