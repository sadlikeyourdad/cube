// script.js
let cube = document.querySelector('.cube');
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;

cube.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  cube.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch events for mobile
cube.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX - currentX;
  startY = e.touches[0].clientY - currentY;
});

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX - startX;
  currentY = e.touches[0].clientY - startY;
  cube.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
});

document.addEventListener('touchend', () => {
  isDragging = false;
});
// script.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

