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
let food = null;
let coin = null;

let direction = { x: grid, y: 0 };
let nextDirection = { x: grid, y: 0 };

let score = 0;
let gameRunning = false;
let gameLoop = null;

let coins = Number(
    localStorage.getItem("modernSnakeCoins") || 0
);

let tongueTimer = 0;
let tonguePower = 0;

let eatingAnimation = 0;
let eatenFood = null;


// =====================================
// COIN SAYACI
// =====================================

function drawCoinCounter() {

    let counter = document.getElementById("coinCounter");

    if (!counter) {

        counter = document.createElement("div");
        counter.id = "coinCounter";

        counter.style.fontSize = "20px";
        counter.style.fontWeight = "bold";
        counter.style.color = "#ffd54a";
        counter.style.marginBottom = "8px";
        counter.style.textAlign = "center";

        game.parentElement.insertBefore(
            counter,
            game
        );
    }

    counter.textContent = "🪙 " + coins;
}


function saveCoins() {

    localStorage.setItem(
        "modernSnakeCoins",
        coins
    );

    drawCoinCounter();
}


// =====================================
// OYUNU BAŞLAT
// =====================================

function startGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];

    direction = {
        x: grid,
        y: 0
    };

    nextDirection = {
        x: grid,
        y: 0
    };

    score = 0;

    tongueTimer = 0;
    tonguePower = 0;

    eatingAnimation = 0;
    eatenFood = null;

    scoreText.textContent = "Skor: 0";

    createFood();
    createCoin();

    gameRunning = true;

    startButton.textContent =
        "YENİDEN BAŞLAT";

    clearInterval(gameLoop);

    gameLoop = setInterval(
        update,
        120
    );

    draw();
    drawCoinCounter();
}


// =====================================
// OYUN GÜNCELLE
// =====================================

function update() {

    if (!gameRunning) {
        return;
    }

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };


    // DUVAR

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {

        endGame();
        return;
    }


    // KENDİNE ÇARPMA

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


    // =================================
    // YEM
    // =================================

    if (
        food &&
        head.x === food.x &&
        head.y === food.y &&
        eatingAnimation === 0
    ) {

        score += 10;

        scoreText.textContent =
            "Skor: " + score;

        eatenFood = {
            x: food.x,
            y: food.y
        };

        food = null;

        tonguePower = 1;
        tongueTimer = 8;

        eatingAnimation = 8;

    } else {

        if (eatingAnimation === 0) {
            snake.pop();
        }
    }


    // =================================
    // COIN
    // =================================

    if (
        coin &&
        head.x === coin.x &&
        head.y === coin.y
    ) {

        coins++;

        saveCoins();

        createCoin();
    }


    // =================================
    // DİL
    // =================================

    if (tongueTimer > 0) {

        tongueTimer--;

        if (tongueTimer <= 0) {
            tonguePower = 0;
        }
    }


    // =================================
    // YEM ANİMASYONU
    // =================================

    if (eatingAnimation > 0) {

        eatingAnimation--;

        if (eatingAnimation <= 0) {

            eatenFood = null;

            createFood();
        }
    }


    draw();
}


// =====================================
// ANA ÇİZİM
// =====================================

function draw() {

    ctx.fillStyle = "#101522";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // IZGARA

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
    drawCoin();
    drawSnake();
}


// =====================================
// YEM
// =====================================

function drawFood() {

    let currentFood = food;

    if (
        !currentFood &&
        eatenFood
    ) {

        currentFood = eatenFood;
    }

    if (!currentFood) {
        return;
    }

    const x =
        currentFood.x + grid / 2;

    const y =
        currentFood.y + grid / 2;

    let size = 9;

    if (eatingAnimation > 0) {

        size =
            9 *
            (eatingAnimation / 8);
    }

    const gradient =
        ctx.createRadialGradient(
            x - 3,
            y - 3,
            1,
            x,
            y,
            11
        );

    gradient.addColorStop(
        0,
        "#ffb5c5"
    );

    gradient.addColorStop(
        0.5,
        "#ff3d71"
    );

    gradient.addColorStop(
        1,
        "#861333"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// =====================================
// COIN
// =====================================

function drawCoin() {

    if (!coin) {
        return;
    }

    const x =
        coin.x + grid / 2;

    const y =
        coin.y + grid / 2;

    ctx.shadowColor = "#ffd54a";
    ctx.shadowBlur = 12;

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
        "#fff6a0"
    );

    gradient.addColorStop(
        0.45,
        "#ffd54a"
    );

    gradient.addColorStop(
        1,
        "#c88700"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#8a5c00";

    ctx.font =
        "bold 11px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "$",
        x,
        y + 1
    );
}


// =====================================
// 🐍 PITON GÖVDESİ
// =====================================

function drawSnake() {

    if (snake.length === 0) {
        return;
    }


    // Ana piton rengi

    const bodyGradient =
        ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );

    bodyGradient.addColorStop(
        0,
        "#d6a75b"
    );

    bodyGradient.addColorStop(
        0.35,
        "#a8753f"
    );

    bodyGradient.addColorStop(
        0.7,
        "#70472c"
    );

    bodyGradient.addColorStop(
        1,
        "#3d281d"
    );


    ctx.save();

    ctx.strokeStyle =
        bodyGradient;

    ctx.lineWidth = 19;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawSmoothSnakePath();

    ctx.stroke();


    // Açık renkli sırt şeridi

    ctx.strokeStyle =
        "rgba(232,190,112,0.55)";

    ctx.lineWidth = 4;

    drawSmoothSnakePath();

    ctx.stroke();


    // =================================
    // PITON DESENLERİ
    // =================================

    for (
        let i = 1;
        i < snake.length;
        i++
    ) {

        const x =
            snake[i].x +
            grid / 2;

        const y =
            snake[i].y +
            grid / 2;


        // Büyük koyu benek

        ctx.fillStyle =
            "rgba(45,25,15,0.72)";

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            6,
            4,
            Math.PI / 4,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Benek içi

        ctx.strokeStyle =
            "rgba(235,190,105,0.55)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            4,
            2.5,
            Math.PI / 4,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }


    // Alt gövde gölgeleri

    ctx.strokeStyle =
        "rgba(30,18,12,0.35)";

    ctx.lineWidth = 3;

    drawSmoothSnakePath();

    ctx.stroke();


    ctx.restore();


    drawSnakeHead();
}


// =====================================
// YUMUŞAK GÖVDE
// =====================================

function drawSmoothSnakePath() {

    if (snake.length < 2) {
        return;
    }

    const points =
        snake.map(part => ({
            x: part.x + grid / 2,
            y: part.y + grid / 2
        }));


    ctx.beginPath();

    ctx.moveTo(
        points[points.length - 1].x,
        points[points.length - 1].y
    );


    for (
        let i = points.length - 1;
        i > 0;
        i--
    ) {

        const current =
            points[i];

        const next =
            points[i - 1];


        const midX =
            (current.x + next.x) / 2;

        const midY =
            (current.y + next.y) / 2;


        ctx.quadraticCurveTo(
            current.x,
            current.y,
            midX,
            midY
        );
    }


    const first =
        points[0];

    const second =
        points[1];


    ctx.quadraticCurveTo(
        second.x,
        second.y,
        first.x,
        first.y
    );
}


// =====================================
// 🐍 PITON BAŞI
// =====================================

function drawSnakeHead() {

    const head = snake[0];

    const headX =
        head.x + grid / 2;

    const headY =
        head.y + grid / 2;


    ctx.save();

    ctx.translate(
        headX,
        headY
    );


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
        "rgba(0,0,0,0.45)";

    ctx.beginPath();

    ctx.ellipse(
        2,
        3,
        18,
        13,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Piton kafa rengi

    const headGradient =
        ctx.createRadialGradient(
            -6,
            -6,
            2,
            0,
            0,
            20
        );

    headGradient.addColorStop(
        0,
        "#e0b86e"
    );

    headGradient.addColorStop(
        0.45,
        "#a97842"
    );

    headGradient.addColorStop(
        1,
        "#4b3021"
    );


    ctx.fillStyle =
        headGradient;


    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        18,
        13,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =================================
    // BAŞ DESENİ
    // =================================

    ctx.strokeStyle =
        "rgba(45,24,14,0.75)";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        -8,
        -9
    );

    ctx.quadraticCurveTo(
        0,
        -3,
        8,
        -8
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        -8,
        9
    );

    ctx.quadraticCurveTo(
        0,
        3,
        8,
        8
    );

    ctx.stroke();


    // =================================
    // GÖZLER
    // =================================

    ctx.fillStyle =
        "#d9b62e";


    ctx.beginPath();

    ctx.arc(
        8,
        -7,
        4,
        0,
        Math.PI * 2
    );

    ctx.arc(
        8,
        7,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Siyah dikey göz bebekleri

    ctx.fillStyle =
        "#080604";


    ctx.beginPath();

    ctx.ellipse(
        9,
        -7,
        1.2,
        3,
        0,
        0,
        Math.PI * 2
    );

    ctx.ellipse(
        9,
        7,
        1.2,
        3,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Burun delikleri

    ctx.fillStyle =
        "#24150e";


    ctx.beginPath();

    ctx.arc(
        14,
        -3,
        1.2,
        0,
        Math.PI * 2
    );

    ctx.arc(
        14,
        3,
        1.2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =================================
    // DİL
    // =================================

    if (tonguePower > 0) {
        drawTongue();
    }


    ctx.restore();
}


// =====================================
// 👅 DİL
// =====================================

function drawTongue() {

    const length = 32;

    ctx.strokeStyle =
        "#e51f45";

    ctx.lineWidth = 2;

    ctx.lineCap = "round";


    ctx.beginPath();

    ctx.moveTo(
        15,
        0
    );

    ctx.lineTo(
        length,
        0
    );


    // Üst çatal

    ctx.moveTo(
        length,
        0
    );

    ctx.lineTo(
        length + 8,
        -4
    );


    // Alt çatal

    ctx.moveTo(
        length,
        0
    );

    ctx.lineTo(
        length + 8,
        4
    );

    ctx.stroke();
}


// =====================================
// YEM OLUŞTUR
// =====================================

function createFood() {

    let valid = false;

    while (!valid) {

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


        valid =
            !snake.some(
                part =>
                    part.x === food.x &&
                    part.y === food.y
            );
    }
}


// =====================================
// COIN OLUŞTUR
// =====================================

function createCoin() {

    let valid = false;

    while (!valid) {

        coin = {

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


        valid =
            !snake.some(
                part =>
                    part.x === coin.x &&
                    part.y === coin.y
            );


        if (
            food &&
            coin.x === food.x &&
            coin.y === food.y
        ) {

            valid = false;
        }
    }
}


// =====================================
// OYUN BİTTİ
// =====================================

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    startButton.textContent =
        "TEKRAR OYNA";


    setTimeout(() => {

        alert(
            "Oyun bitti! Skorun: " +
            score +
            "\n\n🪙 Coin: " +
            coins
        );

    }, 100);
}


// =====================================
// KLAVYE
// =====================================

document.addEventListener(
    "keydown",
    event => {

        if (!gameRunning) {
            return;
        }


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


// =====================================
// TELEFON KONTROLÜ
// =====================================

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
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        if (!gameRunning) {
            return;
        }


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
    {
        passive: true
    }
);


// =====================================
// OYNA
// =====================================

startButton.addEventListener(
    "click",
    startGame
);


// =====================================
// COIN SAYACINI GÖSTER
// =====================================

drawCoinCounter();
