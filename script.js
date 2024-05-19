import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.18.1/dist/cannon-es.js';

let scene, camera, renderer, cube, world, cubeBody;
let isUserInteracting = false, onPointerDownPointerX = 0, onPointerDownPointerY = 0, lon = 0, onPointerDownLon = 0, lat = 0, onPointerDownLat = 0;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Cannon.js setup
    world = new CANNON.World();
    world.gravity.set(0, 0, 0);

    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    cubeBody = new CANNON.Body({ mass: 1 });
    cubeBody.addShape(cubeShape);
    world.addBody(cubeBody);

    // Event listeners for touch interaction
    document.addEventListener('pointerdown', onPointerDown, false);
    document.addEventListener('pointermove', onPointerMove, false);
    document.addEventListener('pointerup', onPointerUp, false);
    document.addEventListener('pointerout', onPointerUp, false);
    
    window.addEventListener('resize', onWindowResize, false);
}

function onPointerDown(event) {
    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onPointerMove(event) {
    if (isUserInteracting === true) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

        cube.rotation.x = THREE.Math.degToRad(lat);
        cube.rotation.y = THREE.Math.degToRad(lon);
    }
}

function onPointerUp() {
    isUserInteracting = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update the physics world
    world.step(1 / 60);

    // Sync the Three.js cube with Cannon.js body
    cube.position.copy(cubeBody.position);
    cube.quaternion.copy(cubeBody.quaternion);

    renderer.render(scene, camera);
}