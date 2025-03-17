const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let dx = 0, dy = 0; // Initially, the snake doesn't move
let score = 0;
let gameRunning = false;

// Resize Canvas for iPhone Compatibility
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth, 400);
    canvas.height = Math.min(window.innerHeight, 400);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Place Food Randomly
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

// Check Collision
function isColliding(a, b) {
    return a.x === b.x && a.y === b.y;
}

// Start Game when first move is made
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop();
    }
}

// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    // Move Snake
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall Collision
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        alert(`Game Over! Score: ${score}`);
        document.location.reload();
        return;
    }

    // Self Collision
    if (snake.some(segment => isColliding(segment, newHead))) {
        alert(`Game Over! Score: ${score}`);
        document.location.reload();
        return;
    }

    snake.unshift(newHead);

    // Eat Food
    if (isColliding(newHead, food)) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
    setTimeout(gameLoop, 100);
}

// Draw Game
function drawGame() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Touch Controls for iPhone (Start Game on First Swipe)
let touchStartX = 0, touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) startGame(); // Start game on first interaction

    let deltaX = e.changedTouches[0].clientX - touchStartX;
    let deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && dx === 0) { dx = gridSize; dy = 0; }
        else if (deltaX < 0 && dx === 0) { dx = -gridSize; dy = 0; }
    } else {
        if (deltaY > 0 && dy === 0) { dx = 0; dy = gridSize; }
        else if (deltaY < 0 && dy === 0) { dx = 0; dy = -gridSize; }
    }
});

// Keyboard Controls (for Desktop)
window.addEventListener('keydown', (e) => {
    if (!gameRunning) startGame(); // Start game on first keypress

    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
    else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
    else if (e.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
    else if (e.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
});

// Initialize Game
placeFood();
drawGame(); // Show initial game state before movement