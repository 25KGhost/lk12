// three-scene.js
class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        this.init();
        this.animate();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;

        // Create renderer with transparent background
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Position the renderer behind all content
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-2'; // Behind SVG background
        this.renderer.domElement.style.pointerEvents = 'none';
        
        document.body.appendChild(this.renderer.domElement);

        // Create a simple cube with premium materials
        this.createCube();
        
        // Add lighting
        this.setupLighting();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

   // In the init() method, replace this.createCube(); with:
this.loadGLBModel('cube.glb');

    setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Directional light for main illumination and shadows
        const directionalLight = new THREE.DirectionalLight(0xC8B78A, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);

        // Fill light to reduce harsh shadows
        const fillLight = new THREE.DirectionalLight(0x8A7A5C, 0.5);
        fillLight.position.set(-5, -5, -5);
        this.scene.add(fillLight);

        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0xD9C89E, 0.3);
        rimLight.position.set(0, 0, 5);
        this.scene.add(rimLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Subtle rotation animation
        if (this.cube) {
            this.cube.rotation.x += 0.002;
            this.cube.rotation.y += 0.003;
        }

        // Update animations if any
        const delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }

    // Method to load external GLB file (if you want to use a custom model later)
    loadGLBModel(url) {
        const loader = new THREE.GLTFLoader();
        loader.load(url, (gltf) => {
            // Remove existing cube
            if (this.cube) {
                this.scene.remove(this.cube);
            }
            
            this.cube = gltf.scene;
            this.cube.scale.set(1, 1, 1);
            this.cube.position.set(0, 0, 0);
            this.cube.castShadow = true;
            this.cube.receiveShadow = true;
            
            this.scene.add(this.cube);
            
            // Setup animations if available
            if (gltf.animations && gltf.animations.length) {
                this.mixer = new THREE.AnimationMixer(this.cube);
                gltf.animations.forEach((clip) => {
                    this.mixer.clipAction(clip).play();
                });
            }
        }, undefined, (error) => {
            console.error('Error loading GLB model:', error);
        });
    }
}

// Initialize the scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure other scripts are loaded
    setTimeout(() => {
        window.threeScene = new ThreeScene();
    }, 100);
});