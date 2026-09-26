const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const grid = 20;

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let direction = { x: grid, y: 0 };

let food = {
    x: 300,
    y: 200
};

function draw() {
    ctx.fillStyle = "#101522";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        ctx.fillStyle = index === 0 ? "#00e5ff" : "#00a9c0";

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

function update() {
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
        gameOver();
        return;
    }

    snake.unshift(head);

    // Yem yendi
    if (
        head.x === food.x &&
        head.y === food.y
    ) {
        createFood();
    } else {
        snake.pop();
    }

    draw();
}

function createFood() {
    food.x =
        Math.floor(Math.random() * (canvas.width / grid)) * grid;

    food.y =
        Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

function gameOver() {
    alert("OYUN BİTTİ!");
    location.reload();
}

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -grid };
    }

    if (event.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: grid };
    }

    if (event.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -grid, y: 0 };
    }

    if (event.key === "ArrowRight" && direction.x === 0) {
        direction = { x: grid, y: 0 };
    }
});

draw();

setInterval(update, 120);
