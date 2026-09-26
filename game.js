const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const startButton = document.getElementById("startButton");

const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;

game.appendChild(canvas);

const ctx = canvas.getContext("2d");

const grid = 20;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameRunning = false;
let gameLoop;

function startGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = { x: grid, y: 0 };
    nextDirection = direction;

    score = 0;

    createFood();
    gameRunning = true;

    scoreText.textContent = "Skor: 0";
    startButton.textContent = "YENİDEN BAŞLAT";

    clearInterval(gameLoop);
    gameLoop = setInterval(update, 120);

    draw();
}

function update() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Duvara çarpma
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        endGame();
        return;
    }

    // Kendine çarpma
    if (
        snake.some(
            part => part.x === head.x && part.y === head.y
        )
    ) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Yem
    if (
        head.x === food.x &&
        head.y === food.y
    ) {
        score += 10;
        scoreText.textContent = "Skor: " + score;

        createFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = "#101522";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Izgara
    ctx.strokeStyle = "#182131";

    for (let x = 0; x < canvas.width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Yem
    ctx.fillStyle = "#ff3d71";

    ctx.beginPath();

    ctx.arc(
        food.x + grid / 2,
        food.y + grid / 2,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Yılan
    snake.forEach((part, index) => {

        ctx.fillStyle =
            index === 0
                ? "#00e5ff"
                : "#00a9c0";

        ctx.beginPath();

        ctx.roundRect(
            part.x + 2,
            part.y + 2,
            grid - 4,
            grid - 4,
            6
        );

        ctx.fill();
    });
}

function createFood() {
    food = {
        x: Math.floor(
            Math.random() * (canvas.width / grid)
        ) * grid,

        y: Math.floor(
            Math.random() * (canvas.height / grid)
        ) * grid
    };
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);

    startButton.textContent = "TEKRAR OYNA";

    setTimeout(() => {
        alert("Oyun bitti! Skorun: " + score);
    }, 100);
}

document.addEventListener("keydown", event => {

    if (!gameRunning) return;

    if (
        event.key === "ArrowUp" &&
        direction.y === 0
    ) {
        nextDirection = { x: 0, y: -grid };
    }

    if (
        event.key === "ArrowDown" &&
        direction.y === 0
    ) {
        nextDirection = { x: 0, y: grid };
    }

    if (
        event.key === "ArrowLeft" &&
        direction.x === 0
    ) {
        nextDirection = { x: -grid, y: 0 };
    }

    if (
        event.key === "ArrowRight" &&
        direction.x === 0
    ) {
        nextDirection = { x: grid, y: 0 };
    }
});

startButton.addEventListener("click", startGame);

// 📱 Dokunmatik kontrol
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", (event) => {
    if (!gameRunning) return;

    const touch = event.changedTouches[0];

    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Çok küçük hareketleri yok say
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        return;
    }

    // Yatay hareket
    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0 && direction.x === 0) {
            nextDirection = { x: grid, y: 0 };
        }

        if (dx < 0 && direction.x === 0) {
            nextDirection = { x: -grid, y: 0 };
        }

    }

    // Dikey hareket
    else {

        if (dy > 0 && direction.y === 0) {
            nextDirection = { x: 0, y: grid };
        }

        if (dy < 0 && direction.y === 0) {
            nextDirection = { x: 0, y: -grid };
        }

    }
});
