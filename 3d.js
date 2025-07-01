/**
 * 3d.js - Handles the 3D animated background for the academic personal website.
 * Uses Three.js to create a dynamic scene with particles and academic-themed objects.
 */

class AcademicScene {
    constructor() {
        if (!window.THREE) {
            console.error('Three.js is not loaded. Make sure to include it before this script.');
            return;
        }

        this.container = document.getElementById('background-container');
        if (!this.container) {
            console.error('The container #background-container was not found.');
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 25;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.particles = null;
        this.floatingObjects = [];

        this.init();
    }

    init() {
        this.addLights();
        this.createParticleField();
        this.addAcademicModels();
        this.addEventListeners();
        this.animate();
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    createParticleField() {
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const baseColor = new THREE.Color(0x4a88ff);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;

            const mixedColor = baseColor.clone();
            mixedColor.lerp(new THREE.Color(0xffffff), Math.random() * 0.5);
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    addAcademicModels() {
        // Floating book stack
        const bookStack = new THREE.Group();
        const bookColors = [0x4285F4, 0x0F9D58, 0xF4B400, 0xDB4437];
        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.BoxGeometry(2, 0.3, 3);
            const material = new THREE.MeshStandardMaterial({ color: bookColors[i], roughness: 0.7 });
            const book = new THREE.Mesh(geometry, material);
            book.position.y = i * 0.35;
            book.rotation.y = (Math.random() - 0.5) * 0.2;
            bookStack.add(book);
        }
        bookStack.position.set(-15, 5, -10);
        bookStack.userData = { rotationSpeed: 0.005, floatAmplitude: 0.5, floatSpeed: 0.002 };
        this.floatingObjects.push(bookStack);
        this.scene.add(bookStack);

        // Atom/Molecule structure
        const molecule = new THREE.Group();
        const sphereGeom = new THREE.SphereGeometry(0.5, 16, 16);
        const atomPositions = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(1, 1.73, 0)
        ];
        atomPositions.forEach(pos => {
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
            const atom = new THREE.Mesh(sphereGeom, material);
            atom.position.copy(pos);
            molecule.add(atom);
        });
        molecule.position.set(15, -5, -15);
        molecule.userData = { rotationSpeed: -0.004, floatAmplitude: 0.7, floatSpeed: 0.003 };
        this.floatingObjects.push(molecule);
        this.scene.add(molecule);
    }

    addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.02;
        }

        // Animate floating objects
        this.floatingObjects.forEach(obj => {
            obj.rotation.y += obj.userData.rotationSpeed;
            obj.position.y += Math.sin(elapsedTime * obj.userData.floatSpeed) * obj.userData.floatAmplitude * 0.01;
        });

        // Move camera based on mouse position
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the scene when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AcademicScene();
});
