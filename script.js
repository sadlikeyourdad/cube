let scene, camera, renderer, cube;
let container = document.getElementById('container');
let isDragging = false, previousMousePosition = { x: 0, y: 0 };
let velocity = { x: 0, y: 0 };

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x44aa88,
        roughness: 0.5,
        metalness: 1,
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Universe Background
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://cdn.pixabay.com/photo/2016/11/29/03/14/background-1867601_1280.png', () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
    });

    // Event Listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        velocity.x = deltaMove.x * 0.01;
        velocity.y = deltaMove.y * 0.01;

        cube.rotation.y += velocity.x;
        cube.rotation.x += velocity.y;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function onMouseUp() {
    isDragging = false;
}

function onTouchStart(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}

function onTouchMove(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.touches[0].clientX - previousMousePosition.x,
            y: event.touches[0].clientY - previousMousePosition.y
        };

        velocity.x = deltaMove.x * 0.01;
        velocity.y = deltaMove.y * 0.01;

        cube.rotation.y += velocity.x;
        cube.rotation.x += velocity.y;

        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function onTouchEnd() {
    isDragging = false;
}

function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
        cube.rotation.x += velocity.y * 0.05;
        cube.rotation.y += velocity.x * 0.05;

        velocity.x *= 0.95;
        velocity.y *= 0.95;
    }

    renderer.render(scene, camera);
}

init();