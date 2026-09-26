const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const startButton = document.getElementById("startButton");

const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;

game.appendChild(canvas);

const ctx = canvas.getContext("2d");

const grid = 20;

let snake = [];
let food = {};
let direction = { x: grid, y: 0 };
let nextDirection = { x: grid, y: 0 };

let score = 0;
let gameRunning = false;
let gameLoop;

function startGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
        { x: 140, y: 200 }
    ];

    direction = { x: grid, y: 0 };
    nextDirection = { x: grid, y: 0 };

    score = 0;

    scoreText.textContent = "Skor: 0";

    createFood();

    gameRunning = true;

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
            part =>
                part.x === head.x &&
                part.y === head.y
        )
    ) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Yem yeme
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;

        scoreText.textContent =
            "Skor: " + score;

        createFood();

    } else {

        snake.pop();
    }

    draw();
}

function draw() {

    // Arka plan
    ctx.fillStyle = "#101522";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Izgara
    ctx.strokeStyle = "#182131";
    ctx.lineWidth = 1;

    for (
        let x = 0;
        x < canvas.width;
        x += grid
    ) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (
        let y = 0;
        y < canvas.height;
        y += grid
    ) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    drawFood();
    drawSnake();
}

function drawFood() {

    const x = food.x + grid / 2;
    const y = food.y + grid / 2;

    const gradient =
        ctx.createRadialGradient(
            x - 3,
            y - 3,
            1,
            x,
            y,
            10
        );

    gradient.addColorStop(
        0,
        "#ff9bb2"
    );

    gradient.addColorStop(
        0.5,
        "#ff3d71"
    );

    gradient.addColorStop(
        1,
        "#8a1235"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawSnake() {

    snake.forEach((part, index) => {

        const x = part.x + grid / 2;
        const y = part.y + grid / 2;

        // 🐍 BAŞ
        if (index === 0) {

            ctx.save();

            ctx.translate(x, y);

            let angle = 0;

            if (direction.x > 0) {
                angle = 0;
            }

            if (direction.x < 0) {
                angle = Math.PI;
            }

            if (direction.y < 0) {
                angle = -Math.PI / 2;
            }

            if (direction.y > 0) {
                angle = Math.PI / 2;
            }

            ctx.rotate(angle);

            // Baş gölgesi
            ctx.fillStyle =
                "rgba(0,0,0,0.35)";

            ctx.beginPath();

            ctx.ellipse(
                1,
                2,
                14,
                11,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // Baş
            const headGradient =
                ctx.createRadialGradient(
                    -4,
                    -4,
                    2,
                    0,
                    0,
                    15
                );

            headGradient.addColorStop(
                0,
                "#a4e96d"
            );

            headGradient.addColorStop(
                0.45,
                "#4fae3e"
            );

            headGradient.addColorStop(
                1,
                "#163d1b"
            );

            ctx.fillStyle =
                headGradient;

            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                14,
                10,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // Gözler
            ctx.fillStyle = "#f4df55";

            ctx.beginPath();

            ctx.arc(
                7,
                -6,
                3.5,
                0,
                Math.PI * 2
            );

            ctx.arc(
                7,
                6,
                3.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // Göz bebekleri
            ctx.fillStyle = "#050505";

            ctx.beginPath();

            ctx.arc(
                8,
                -6,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.arc(
                8,
                6,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // Çatallı dil
            ctx.strokeStyle = "#ff3158";
            ctx.lineWidth = 1.5;

            ctx.beginPath();

            ctx.moveTo(12, 0);
            ctx.lineTo(20, 0);

            ctx.moveTo(20, 0);
            ctx.lineTo(24, -3);

            ctx.moveTo(20, 0);
            ctx.lineTo(24, 3);

            ctx.stroke();

            ctx.restore();

        } else {

            // 🐍 GÖVDE

            const radius =
                Math.max(
                    7,
                    10 - index * 0.03
                );

            const gradient =
                ctx.createRadialGradient(
                    x - 3,
                    y - 3,
                    1,
                    x,
                    y,
                    radius
                );

            gradient.addColorStop(
                0,
                "#8bdb5d"
            );

            gradient.addColorStop(
                0.45,
                "#4ca83d"
            );

            gradient.addColorStop(
                1,
                "#193f1d"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // Pul deseni
            ctx.strokeStyle =
                "rgba(190,240,120,0.35)";

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                radius - 2,
                0,
                Math.PI
            );

            ctx.stroke();

            // Gövde parlaklığı
            ctx.fillStyle =
                "rgba(210,255,160,0.18)";

            ctx.beginPath();

            ctx.arc(
                x - 3,
                y - 3,
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    });
}

function createFood() {

    food = {

        x:
            Math.floor(
                Math.random() *
                (canvas.width / grid)
            ) * grid,

        y:
            Math.floor(
                Math.random() *
                (canvas.height / grid)
            ) * grid
    };
}

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    startButton.textContent =
        "TEKRAR OYNA";

    setTimeout(() => {

        alert(
            "Oyun bitti! Skorun: " +
            score
        );

    }, 100);
}


// ⌨️ KLAVYE KONTROLLERİ

document.addEventListener(
    "keydown",
    event => {

        if (!gameRunning) return;

        if (
            event.key === "ArrowUp" &&
            direction.y === 0
        ) {

            nextDirection = {
                x: 0,
                y: -grid
            };
        }

        if (
            event.key === "ArrowDown" &&
            direction.y === 0
        ) {

            nextDirection = {
                x: 0,
                y: grid
            };
        }

        if (
            event.key === "ArrowLeft" &&
            direction.x === 0
        ) {

            nextDirection = {
                x: -grid,
                y: 0
            };
        }

        if (
            event.key === "ArrowRight" &&
            direction.x === 0
        ) {

            nextDirection = {
                x: grid,
                y: 0
            };
        }
    }
);


// 📱 TELEFON KAYDIRMA KONTROLÜ

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.touches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;
    },
    { passive: true }
);

canvas.addEventListener(
    "touchend",
    event => {

        if (!gameRunning) return;

        const touch =
            event.changedTouches[0];

        const dx =
            touch.clientX -
            touchStartX;

        const dy =
            touch.clientY -
            touchStartY;

        if (
            Math.abs(dx) < 20 &&
            Math.abs(dy) < 20
        ) {
            return;
        }

        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (
                dx > 0 &&
                direction.x === 0
            ) {

                nextDirection = {
                    x: grid,
                    y: 0
                };
            }

            if (
                dx < 0 &&
                direction.x === 0
            ) {

                nextDirection = {
                    x: -grid,
                    y: 0
                };
            }

        } else {

            if (
                dy > 0 &&
                direction.y === 0
            ) {

                nextDirection = {
                    x: 0,
                    y: grid
                };
            }

            if (
                dy < 0 &&
                direction.y === 0
            ) {

                nextDirection = {
                    x: 0,
                    y: -grid
                };
            }
        }
    },
    { passive: true }
);


// OYNA BUTONU

startButton.addEventListener(
    "click",
    startGame
);
