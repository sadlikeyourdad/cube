let scene, camera, renderer, cube, controls;
let container = document.getElementById('container');

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

    // Touch Controls
    let startX, startY, startRotation;
    let isDragging = false;

    function onTouchStart(event) {
        isDragging = true;
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
        startRotation = cube.rotation.clone();
    }

    function onTouchMove(event) {
        if (isDragging) {
            let deltaX = event.touches[0].pageX - startX;
            let deltaY = event.touches[0].pageY - startY;

            cube.rotation.y = startRotation.y + deltaX * 0.01;
            cube.rotation.x = startRotation.x + deltaY * 0.01;
        }
    }

    function onTouchEnd() {
        isDragging = false;
    }

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    // Physics
    let velocity = new THREE.Vector3(0, 0.01, 0);

    function animate() {
        requestAnimationFrame(animate);

        if (!isDragging) {
            cube.rotation.x += velocity.x;
            cube.rotation.y += velocity.y;
            cube.rotation.z += velocity.z;
        }

        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();