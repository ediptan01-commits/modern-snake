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

let direction = {
    x: grid,
    y: 0
};

let nextDirection = {
    x: grid,
    y: 0
};

let score = 0;
let gameRunning = false;
let gameLoop;


// ==============================
// OYUNU BAŞLAT
// ==============================

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

    scoreText.textContent = "Skor: 0";

    createFood();

    gameRunning = true;

    startButton.textContent = "YENİDEN BAŞLAT";

    clearInterval(gameLoop);

    gameLoop = setInterval(update, 120);

    draw();
}


// ==============================
// OYUN GÜNCELLEME
// ==============================

function update() {

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };


    // DUVARA ÇARPMA

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


    // YEM YENDİ

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


// ==============================
// ÇİZİM
// ==============================

function draw() {

    // Arka plan

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

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    drawFood();

    drawSnake();
}


// ==============================
// YEM
// ==============================

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
            11
        );


    gradient.addColorStop(
        0,
        "#ffb1c2"
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


// ==============================
// GERÇEKÇİ YILAN
// ==============================

function drawSnake() {

    if (snake.length === 0) {
        return;
    }


    // ==========================
    // TEK PARÇA GÖVDE
    // ==========================

    const bodyGradient =
        ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );


    bodyGradient.addColorStop(
        0,
        "#91e76b"
    );


    bodyGradient.addColorStop(
        0.45,
        "#4ca83d"
    );


    bodyGradient.addColorStop(
        1,
        "#163c1a"
    );


    ctx.save();


    ctx.strokeStyle =
        bodyGradient;

    ctx.lineWidth = 17;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";


    ctx.beginPath();


    // Kuyruktan başa doğru çiz

    for (
        let i = snake.length - 1;
        i >= 0;
        i--
    ) {

        const x =
            snake[i].x +
            grid / 2;

        const y =
            snake[i].y +
            grid / 2;


        if (
            i === snake.length - 1
        ) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );
        }
    }


    ctx.stroke();


    // ==========================
    // GÖVDE PARLAKLIĞI
    // ==========================

    ctx.strokeStyle =
        "rgba(210,255,160,0.18)";

    ctx.lineWidth = 5;

    ctx.beginPath();


    for (
        let i = snake.length - 1;
        i >= 0;
        i--
    ) {

        const x =
            snake[i].x +
            grid / 2;

        const y =
            snake[i].y +
            grid / 2;


        if (
            i === snake.length - 1
        ) {

            ctx.moveTo(
                x - 2,
                y - 3
            );

        } else {

            ctx.lineTo(
                x - 2,
                y - 3
            );
        }
    }


    ctx.stroke();


    // ==========================
    // PULLAR
    // ==========================

    ctx.strokeStyle =
        "rgba(220,255,170,0.35)";

    ctx.lineWidth = 1;


    for (
        let i = 2;
        i < snake.length;
        i += 2
    ) {

        const x =
            snake[i].x +
            grid / 2;

        const y =
            snake[i].y +
            grid / 2;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            6,
            0,
            Math.PI
        );

        ctx.stroke();
    }


    ctx.restore();


    // ==========================
    // YILAN BAŞI
    // ==========================

    const head = snake[0];


    const headX =
        head.x +
        grid / 2;

    const headY =
        head.y +
        grid / 2;


    ctx.save();


    ctx.translate(
        headX,
        headY
    );


    // Baş yönü

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


    // ==========================
    // BAŞ GÖLGESİ
    // ==========================

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.beginPath();


    ctx.ellipse(
        2,
        3,
        16,
        12,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // ==========================
    // BAŞ
    // ==========================

    const headGradient =
        ctx.createRadialGradient(
            -5,
            -5,
            2,
            0,
            0,
            17
        );


    headGradient.addColorStop(
        0,
        "#b7f27b"
    );


    headGradient.addColorStop(
        0.45,
        "#55b642"
    );


    headGradient.addColorStop(
        1,
        "#143819"
    );


    ctx.fillStyle =
        headGradient;


    ctx.beginPath();


    ctx.ellipse(
        0,
        0,
        16,
        11,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // ==========================
    // GÖZLER
    // ==========================

    ctx.fillStyle =
        "#f5df55";


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


    // ==========================
    // GÖZ BEBEKLERİ
    // ==========================

    ctx.fillStyle =
        "#050505";


    ctx.beginPath();


    ctx.arc(
        8,
        -6,
        1.6,
        0,
        Math.PI * 2
    );


    ctx.arc(
        8,
        6,
        1.6,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // ==========================
    // BURUN DELİKLERİ
    // ==========================

    ctx.fillStyle =
        "#102510";


    ctx.beginPath();


    ctx.arc(
        12,
        -3,
        1,
        0,
        Math.PI * 2
    );


    ctx.arc(
        12,
        3,
        1,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // ==========================
    // ÇATALLI DİL
    // ==========================

    ctx.strokeStyle =
        "#ff3158";

    ctx.lineWidth = 1.6;

    ctx.lineCap = "round";


    ctx.beginPath();


    ctx.moveTo(
        13,
        0
    );


    ctx.lineTo(
        21,
        0
    );


    ctx.moveTo(
        21,
        0
    );


    ctx.lineTo(
        25,
        -3
    );


    ctx.moveTo(
        21,
        0
    );


    ctx.lineTo(
        25,
        3
    );


    ctx.stroke();


    ctx.restore();
}


// ==============================
// YEM OLUŞTUR
// ==============================

function createFood() {

    let validPosition = false;


    while (!validPosition) {

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


        validPosition =
            !snake.some(
                part =>
                    part.x === food.x &&
                    part.y === food.y
            );
    }
}


// ==============================
// OYUN BİTTİ
// ==============================

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


// ==============================
// KLAVYE
// ==============================

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


// ==============================
// TELEFON KAYDIRMA
// ==============================

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


        // YATAY

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


        }

        // DİKEY

        else {

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


// ==============================
// OYNA BUTONU
// ==============================

startButton.addEventListener(
    "click",
    startGame
);
