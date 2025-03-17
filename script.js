// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting Setup
const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Particle System Variables
let particles, particleSystem;
let expansionSpeed = 1;
let particleCount = 20000;

// Create Particle System
function createParticles() {
    if (particleSystem) scene.remove(particleSystem);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        velocities[i * 3] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

createParticles();

// Camera Position
camera.position.z = 50;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * expansionSpeed;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * expansionSpeed;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * expansionSpeed;

        velocities[i * 3] *= 1.01;
        velocities[i * 3 + 1] *= 1.01;
        velocities[i * 3 + 2] *= 1.01;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

// UI Controls
document.getElementById('speed').addEventListener('input', (event) => {
    expansionSpeed = parseFloat(event.target.value);
});

document.getElementById('density').addEventListener('input', (event) => {
    particleCount = parseInt(event.target.value);
    createParticles();
});

// Resize Event
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});