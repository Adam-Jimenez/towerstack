class Viewer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = this.makeCamera();
        this.renderer = this.makeRenderer();
        this.handleWindowResize();
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }
        
    makeCamera() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const nearClip = 0.1;
        const farClip = 100000;
        return new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, nearClip, farClip);
    }

    makeRenderer() {
        const canvas = document.getElementById("viewer");
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = this.camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;
        renderer.setClearColor( 0x00CCCC, 1 );
        return renderer;
    }

    handleWindowResize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    getDomNode() {
        return this.renderer.domElement;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}