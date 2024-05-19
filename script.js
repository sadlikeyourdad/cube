// script.js
document.addEventListener('DOMContentLoaded', () => {
    const cube = document.querySelector('.cube');
    let rotationSpeed = 5; // Initial rotation speed (in seconds)

    // Function to change the color of cube faces
    const changeColors = () => {
        const faces = document.querySelectorAll('.face');
        faces.forEach(face => {
            face.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        });
    };

    // Add touch event to speed up the rotation
    let touchTimeout;
    cube.addEventListener('touchstart', () => {
        rotationSpeed = 1; // Increase rotation speed on touch
        updateAnimationSpeed();
        clearTimeout(touchTimeout); // Clear any existing timeout
    });

    // Reset rotation speed when touch ends after a delay
    cube.addEventListener('touchend', () => {
        touchTimeout = setTimeout(() => {
            rotationSpeed = 5; // Reset to original speed
            updateAnimationSpeed();
        }, 500); // Delay to reset the speed
    });

    // Update the animation duration based on rotation speed
    const updateAnimationSpeed = () => {
        cube.style.animationDuration = `${rotationSpeed}s`;
    };

    // Change colors every few seconds
    setInterval(changeColors, 2000);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(error => console.error('Service Worker Registration failed:', error));
    }
});