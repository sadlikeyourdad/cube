// script.js
document.addEventListener('DOMContentLoaded', () => {
    let scene, camera, renderer, cube;
    let startX, startY, startRotation;
    let isDragging = false;

    const init = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        cube = new THREE.Mesh(geometry, material);
        
        // Add different colors to each face
        for (let i = 0; i < geometry.faces.length; i += 2) {
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            geometry.faces[i].color = color;
            geometry.faces[i + 1].color = color;
        }

        scene.add(cube);
        camera.position.z = 5;

        animate();
        addEventListeners();
    };

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    const addEventListeners = () => {
        const container = document.getElementById('container');

        container.addEventListener('touchstart', onTouchStart, false);
        container.addEventListener('touchmove', onTouchMove, false);
        container.addEventListener('touchend', onTouchEnd, false);
    };

    const onTouchStart = (event) => {
        isDragging = true;
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
        startRotation = { x: cube.rotation.x, y: cube.rotation.y };
    };

    const onTouchMove = (event) => {
        if (!isDragging) return;
        const deltaX = event.touches[0].pageX - startX;
        const deltaY = event.touches[0].pageY - startY;
        cube.rotation.x = startRotation.x + deltaY * 0.01;
        cube.rotation.y = startRotation.y + deltaX * 0.01;
    };

    const onTouchEnd = () => {
        isDragging = false;
    };

    init();

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(error => console.error('Service Worker Registration failed:', error));
    }
});