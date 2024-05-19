let scene, camera, renderer, cube;
let isUserInteracting = false,
    onPointerDownPointerX = 0, onPointerDownPointerY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0;

init();
animate();

function init() {
    const container = document.getElementById('container');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    container.addEventListener('pointerdown', onPointerDown, false);
    container.addEventListener('pointermove', onPointerMove, false);
    container.addEventListener('pointerup', onPointerUp, false);

    const gui = new dat.GUI();
    const cubeColor = { color: cube.material.color.getHex() };
    gui.addColor(cubeColor, 'color').onChange((value) => {
        cube.material.color.setHex(value);
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onPointerMove(event) {
    if (isUserInteracting) {
        lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }
}

function onPointerUp() {
    isUserInteracting = false;
}

function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    if (!isUserInteracting) {
        lon += 0.1;
    }
    lat = Math.max(-85, Math.min(85, lat));
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    camera.position.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 500 * Math.cos(phi);
    camera.position.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
