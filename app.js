// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cube-container').appendChild(renderer.domElement);

// Create the cube with dynamic color changing
const geometry = new THREE.BoxGeometry();
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add touch controls
const hammer = new Hammer(document.getElementById('cube-container'));
hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

let isPanning = false;
let rotationSpeed = { x: 0, y: 0 };

hammer.on('panstart', () => {
    isPanning = true;
});
hammer.on('panmove', (ev) => {
    if (isPanning) {
        cube.rotation.y += ev.deltaX * 0.01;
        cube.rotation.x += ev.deltaY * 0.01;
        rotationSpeed.x = ev.deltaY * 0.001;
        rotationSpeed.y = ev.deltaX * 0.001;
    }
});
hammer.on('panend', () => {
    isPanning = false;
});

function updatePhysics() {
    if (!isPanning) {
        cube.rotation.x += rotationSpeed.x;
        cube.rotation.y += rotationSpeed.y;
        // Apply friction
        rotationSpeed.x *= 0.95;
        rotationSpeed.y *= 0.95;
    }
    requestAnimationFrame(updatePhysics);
}
updatePhysics();