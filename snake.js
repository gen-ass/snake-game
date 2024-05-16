// Get the canvas element from the HTML document
let canvas = document.getElementById("game");
// Get the 2D rendering context for the drawing surface of the canvas
let context = canvas.getContext("2d");

// Define the size of each box that makes up the snake and the game area
let box = 32;

// Initialize the snake as an array of objects with x and y coordinates and score
let snake = [{ x: 8 * box, y: 8 * box }];
let score = 0;

// Set the initial direction of the snake
let direction = "right";
// Create the food object with random x and y coordinates
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box,
};

// Function to draw the game area
function createBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
    drawObstacles(); // Draw the obstacles
}

// Function to draw the snake
function createSnake() {
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i == 0)? "green" : "white";
        context.fillRect(snake[i].x, snake[i].y, box, box);

        // Draw eyes on the snake's head
        if (i == 0) {
            context.fillStyle = 'white';
            context.fillRect(snake[i].x + box/3, snake[i].y + box/4, box/5, box/5);
            context.fillRect(snake[i].x + 2*box/3, snake[i].y + box/4, box/5, box/5);
        }
    }
}

// Array of obstacles
let obstacles = [
    { x: 3 * box, y: 3 * box },
    { x: 5 * box, y: 7 * box },
    { x: 9 * box, y: 4 * box },
    // Add more obstacles as needed
];

// Function to draw the obstacles
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        context.fillStyle = "red";
        context.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }
}

// Function to draw the food
function drawFood() {
    context.fillStyle = "blue";
    context.fillRect(food.x, food.y, box, box);
}

// Add an event listener for keydown events
document.addEventListener("keydown", update);

// Function to update the direction of the snake based on the key pressed
function update(event) {
    if (event.keyCode == 37 && direction != "right") direction = "left";
    if (event.keyCode == 38 && direction != "down") direction = "up";
    if (event.keyCode == 39 && direction != "left") direction = "right";
    if (event.keyCode == 40 && direction != "up") direction = "down";
}

// Function to generate a new position for the food
function generateFood() {
    while (true) {
        // Generate a random position for the food
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;

        // Check if the food is in the same place as any of the obstacles
        let collision = obstacles.some(obstacle => obstacle.x == food.x && obstacle.y == food.y);

        // If the food is not in the same place as any of the obstacles, break the loop
        if (!collision) break;
    }
}

// Function to start the game and update the game state
function startGame() {
    createBG();
    createSnake();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Check if the snake has hit an obstacle
    for (let i = 0; i < obstacles.length; i++) {
        if (snakeX == obstacles[i].x && snakeY == obstacles[i].y) {
            clearInterval(game);
            alert("Game Over!");
        }
    }

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    // If the snake hits the boundaries, make it appear on the opposite side
    if (snakeX < 0) snakeX = 15 * box;
    if (snakeX > 15 * box) snakeX = 0;
    if (snakeY < 0) snakeY = 15 * box;
    if (snakeY > 15 * box) snakeY = 0;

    if (snakeX != food.x || snakeY != food.y) {
        snake.pop(); // remove the tail
    } else {
        // Increase the score and update the score element
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;

        generateFood(); // Generate a new position for the food
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    // Check for self-collision
    for(let i = 0; i < snake.length; i++) {
        if(snake[i].x == newHead.x && snake[i].y == newHead.y) {
            clearInterval(game);
            alert('Game Over!');
        }
    }

    snake.unshift(newHead); // add new head to the snake
}

// Function to reset the game
function resetGame() {
    // Clear the game interval
    clearInterval(game);

    // Reset the snake, score, and food
    snake = [{ x: 8 * box, y: 8 * box }];
    score = 0;
    document.getElementById('score').innerText = 'Score: ' + score;
    generateFood();

    // Restart the game loop
    game = setInterval(startGame, 100);
}

// Event listener for keydown events
window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        resetGame();
    }
});

let game = setInterval(startGame, 100); // call startGame every 100ms
