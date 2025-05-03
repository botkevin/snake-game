// Get canvas and context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameInterval;
let gameRunning = false;

// Initialize game
function initGame() {
    // Reset snake
    snake = [
        { x: 10, y: 10 }
    ];
    
    // Reset direction
    dx = 0;
    dy = 0;
    
    // Reset score
    score = 0;
    document.getElementById('score').textContent = score;
    
    // Place food
    placeFood();
}

// Place food at random position
function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't spawn on snake
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            placeFood();
            break;
        }
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score++;
        document.getElementById('score').textContent = score;
        
        // Speed up game slightly
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
        
        // Place new food
        placeFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw everything
    draw();
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
    }
    
    // Draw food
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    document.getElementById('start-btn').textContent = 'Restart Game';
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    initGame();
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.getElementById('start-btn').textContent = 'Game Running';
}

// Handle keyboard controls
document.addEventListener('keydown', function(e) {
    // Prevent arrow keys from scrolling the page
    if ([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
    }
    
    // Left arrow
    if (e.keyCode === 37 && dx === 0) {
        dx = -1;
        dy = 0;
    }
    // Up arrow
    else if (e.keyCode === 38 && dy === 0) {
        dx = 0;
        dy = -1;
    }
    // Right arrow
    else if (e.keyCode === 39 && dx === 0) {
        dx = 1;
        dy = 0;
    }
    // Down arrow
    else if (e.keyCode === 40 && dy === 0) {
        dx = 0;
        dy = 1;
    }
});

// Start button event listener
document.getElementById('start-btn').addEventListener('click', startGame);

// Initial draw
draw();