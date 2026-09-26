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

let selectedSnake =
    localStorage.getItem("selectedSnake") || "python";

let ownedSnakes = JSON.parse(
    localStorage.getItem("ownedSnakes") ||
    '["python"]'
);

let tongueTimer = 0;
let tonguePower = 0;

let eatingAnimation = 0;
let eatenFood = null;


// =====================================
// YILANLAR
// =====================================

const snakes = {

    python: {
        name: "Piton",
        price: 0,
        color: "brown"
    },

    cobra: {
        name: "Kobra",
        price: 50,
        color: "cobra"
    },

    anaconda: {
        name: "Anakonda",
        price: 100,
        color: "anaconda"
    },

    kingcobra: {
        name: "Kral Kobra",
        price: 150,
        color: "kingcobra"
    },

    albino: {
        name: "Albino Piton",
        price: 200,
        color: "albino"
    }
};


// =====================================
// KAYDET
// =====================================

function saveSnakeData() {

    localStorage.setItem(
        "selectedSnake",
        selectedSnake
    );

    localStorage.setItem(
        "ownedSnakes",
        JSON.stringify(ownedSnakes)
    );

    localStorage.setItem(
        "modernSnakeCoins",
        coins
    );
}


// =====================================
// COIN SAYACI
// =====================================

function drawCoinCounter() {

    let counter =
        document.getElementById("coinCounter");

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

    counter.textContent =
        "🪙 " + coins;
}


// =====================================
// YILAN MENÜSÜ
// =====================================

function createSnakeMenu() {

    let old =
        document.getElementById("snakeMenu");

    if (old) {
        old.remove();
    }


    const menu =
        document.createElement("div");

    menu.id = "snakeMenu";

    menu.style.margin =
        "15px auto";

    menu.style.maxWidth =
        "400px";

    menu.style.padding =
        "15px";

    menu.style.borderRadius =
        "20px";

    menu.style.background =
        "#111827";

    menu.style.border =
        "1px solid #263449";

    menu.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.35)";


    const title =
        document.createElement("div");

    title.textContent =
        "🐍 YILANLAR";

    title.style.color =
        "#ffffff";

    title.style.fontSize =
        "22px";

    title.style.fontWeight =
        "bold";

    title.style.textAlign =
        "center";

    title.style.marginBottom =
        "12px";

    menu.appendChild(title);


    Object.keys(snakes).forEach(
        id => {

            const snakeData =
                snakes[id];

            const button =
                document.createElement("button");

            const owned =
                ownedSnakes.includes(id);

            const selected =
                selectedSnake === id;


            if (selected) {

                button.textContent =
                    "✓ " +
                    snakeData.name +
                    "  • SEÇİLİ";

            } else if (owned) {

                button.textContent =
                    "🐍 " +
                    snakeData.name +
                    "  • SEÇ";

            } else {

                button.textContent =
                    "🔒 " +
                    snakeData.name +
                    "  • " +
                    snakeData.price +
                    " 🪙";
            }


            button.style.display =
                "block";

            button.style.width =
                "100%";

            button.style.margin =
                "8px 0";

            button.style.padding =
                "13px";

            button.style.border =
                "none";

            button.style.borderRadius =
                "12px";

            button.style.fontSize =
                "16px";

            button.style.fontWeight =
                "bold";

            button.style.cursor =
                "pointer";

            button.style.background =

function createSnakeMenu() {

    const old = document.getElementById("snakeMenu");

    if (old) {
        old.remove();
        return;
    }

    const menu = document.createElement("div");

    menu.id = "snakeMenu";

    menu.style.cssText = `
        position:fixed;
        inset:0;
        width:100vw;
        height:100vh;
        background:rgba(3,8,18,.95);
        backdrop-filter:blur(8px);
        z-index:999999;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        box-sizing:border-box;
        overflow:hidden;
    `;

    const panel = document.createElement("div");

    panel.style.cssText = `
        width:100%;
        max-width:380px;
        max-height:88vh;
        overflow-y:auto;
        box-sizing:border-box;
        padding:20px;
        border-radius:24px;
        background:linear-gradient(#18263d,#0d1524);
        border:1px solid #00dfff;
        box-shadow:0 0 35px #00dfff44;
    `;

    panel.innerHTML = `
        <h2 style="
            color:white;
            text-align:center;
            margin:0 0 8px;
            font-size:28px;
        ">🐍 YILANLAR</h2>

        <div style="
            color:#ffd54a;
            text-align:center;
            font-weight:bold;
            margin-bottom:18px;
        ">🪙 ${coins} COIN</div>
    `;

    Object.keys(snakes).forEach(id => {

        const s = snakes[id];

        const owned = ownedSnakes.includes(id);
        const selected = selectedSnake === id;

        const button =
            document.createElement("button");

        button.style.cssText = `
            width:100%;
            padding:15px;
            margin:6px 0;
            border:0;
            border-radius:14px;
            font-size:17px;
            font-weight:bold;
            text-align:left;
            background:${selected ? "#00dfff" : "#24344d"};
            color:${selected ? "#06202a" : "white"};
        `;

        if (selected) {

            button.textContent =
                "🐍 " + s.name + "  ✓ SEÇİLİ";

        } else if (owned) {

            button.textContent =
                "🐍 " + s.name + "  → SEÇ";

        } else {

            button.textContent =
                "🔒 " + s.name +
                "   🪙 " + s.price;
        }

        button.onclick = () => {

            if (owned) {

                selectedSnake = id;

                saveData();

                menu.remove();

                return;
            }

            if (coins >= s.price) {

                coins -= s.price;

                ownedSnakes.push(id);

                selectedSnake = id;

                saveData();

                drawCoinCounter();

                menu.remove();

            } else {

                alert(
                    "Yeterli coin yok!\n\n" +
                    s.name +
                    " için " +
                    s.price +
                    " coin gerekiyor."
                );
            }
        };

        panel.appendChild(button);
    });

    const close =
        document.createElement("button");

    close.textContent = "KAPAT";

    close.style.cssText = `
        width:100%;
        padding:14px;
        margin-top:10px;
        border:0;
        border-radius:14px;
        background:#ff3158;
        color:white;
        font-size:17px;
        font-weight:bold;
    `;

    close.onclick = () => menu.remove();

    panel.appendChild(close);

    menu.appendChild(panel);

    document.body.appendChild(menu);
}

// =====================================
// YILANLAR BUTONU
// =====================================

function createSnakeButton() {

    let button =
        document.getElementById(
            "snakesButton"
        );

    if (button) {
        return;
    }


    button =
        document.createElement("button");

    button.id =
        "snakesButton";

    button.textContent =
        "🐍 YILANLAR";

    button.style.display =
        "block";

    button.style.margin =
        "10px auto";

    button.style.padding =
        "12px 30px";

    button.style.border =
        "none";

    button.style.borderRadius =
        "15px";

    button.style.background =
        "#243044";

    button.style.color =
        "#ffffff";

    button.style.fontSize =
        "17px";

    button.style.fontWeight =
        "bold";


    button.onclick =
        function () {

            createSnakeMenu();
        };


    startButton.parentElement.appendChild(
        button
    );
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


    scoreText.textContent =
        "Skor: 0";


    createFood();
    createCoin();


    gameRunning = true;


    startButton.textContent =
        "YENİDEN BAŞLAT";


    clearInterval(gameLoop);


    gameLoop =
        setInterval(
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


    direction =
        nextDirection;


    const head = {

        x:
            snake[0].x +
            direction.x,

        y:
            snake[0].y +
            direction.y
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

        if (
            eatingAnimation === 0
        ) {

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

        saveSnakeData();

        drawCoinCounter();

        createCoin();
    }


    // =================================
    // DİL
    // =================================

    if (
        tongueTimer > 0
    ) {

        tongueTimer--;

        if (
            tongueTimer <= 0
        ) {

            tonguePower = 0;
        }
    }


    // =================================
    // YEM ANİMASYONU
    // =================================

    if (
        eatingAnimation > 0
    ) {

        eatingAnimation--;


        if (
            eatingAnimation <= 0
        ) {

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

    ctx.fillStyle =
        "#101522";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // IZGARA

    ctx.strokeStyle =
        "#182131";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

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

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

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

    let currentFood =
        food;


    if (
        !currentFood &&
        eatenFood
    ) {

        currentFood =
            eatenFood;
    }


    if (!currentFood) {
        return;
    }


    const x =
        currentFood.x +
        grid / 2;


    const y =
        currentFood.y +
        grid / 2;


    let size = 9;


    if (
        eatingAnimation > 0
    ) {

        size =
            9 *
            (
                eatingAnimation /
                8
            );
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


    ctx.fillStyle =
        gradient;


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
        coin.x +
        grid / 2;


    const y =
        coin.y +
        grid / 2;


    ctx.shadowColor =
        "#ffd54a";

    ctx.shadowBlur =
        12;


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


    ctx.fillStyle =
        gradient;


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        8,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.shadowBlur =
        0;


    ctx.fillStyle =
        "#8a5c00";


    ctx.font =
        "bold 11px Arial";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        "$",
        x,
        y + 1
    );
}


// =====================================
// YILAN
// =====================================

function drawSnake() {

    if (
        snake.length === 0
    ) {
        return;
    }


    const style =
        snakes[selectedSnake];


    let bodyColors;


    if (
        style.color ===
        "brown"
    ) {

        bodyColors =
            [
                "#d6a75b",
                "#a8753f",
                "#70472c",
                "#3d281d"
            ];
    }


    else if (
        style.color ===
        "cobra"
    ) {

        bodyColors =
            [
                "#6f8f55",
                "#3f6034",
                "#263b24",
                "#182719"
            ];
    }


    else if (
        style.color ===
        "anaconda"
    ) {

        bodyColors =
            [
                "#657047",
                "#39462d",
                "#20291c",
                "#11170f"
            ];
    }


    else if (
        style.color ===
        "kingcobra"
    ) {

        bodyColors =
            [
                "#c9a85d",
                "#8b6a32",
                "#49391d",
                "#211b10"
            ];
    }


    else {

        bodyColors =
            [
                "#fff4c4",
                "#e9d48a",
                "#c5a85e",
                "#8d743e"
            ];
    }


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );


    gradient.addColorStop(
        0,
        bodyColors[0]
    );


    gradient.addColorStop(
        0.35,
        bodyColors[1]
    );


    gradient.addColorStop(
        0.7,
        bodyColors[2]
    );


    gradient.addColorStop(
        1,
        bodyColors[3]
    );


    ctx.save();


    ctx.strokeStyle =
        gradient;


    ctx.lineWidth =
        selectedSnake ===
        "anaconda"
            ? 22
            : 19;


    ctx.lineCap =
        "round";


    ctx.lineJoin =
        "round";


    drawSmoothSnakePath();


    ctx.stroke();


    // PARLAKLIK

    ctx.strokeStyle =
        "rgba(255,230,170,0.30)";


    ctx.lineWidth =
        4;


    drawSmoothSnakePath();


    ctx.stroke();


    // DESENLER

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


        if (
            selectedSnake ===
            "python"
        ) {

            drawPythonPattern(
                x,
                y
            );
        }


        else if (
            selectedSnake ===
            "anaconda"
        ) {

            drawAnacondaPattern(
                x,
                y
            );
        }


        else if (
            selectedSnake ===
            "cobra"
        ) {

            drawCobraPattern(
                x,
                y
            );
        }


        else if (
            selectedSnake ===
            "kingcobra"
        ) {

            drawKingCobraPattern(
                x,
                y
            );
        }


        else {

            drawAlbinoPattern(
                x,
                y
            );
        }
    }


    ctx.restore();


    drawSnakeHead();
}


// =====================================
// PITON DESENİ
// =====================================

function drawPythonPattern(
    x,
    y
) {

    ctx.fillStyle =
        "rgba(45,25,15,.72)";


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
}


// =====================================
// ANAKONDA DESENİ
// =====================================

function drawAnacondaPattern(
    x,
    y
) {

    ctx.fillStyle =
        "rgba(20,30,14,.8)";


    ctx.beginPath();


    ctx.ellipse(
        x,
        y,
        7,
        4,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


// =====================================
// KOBRA DESENİ
// =====================================

function drawCobraPattern(
    x,
    y
) {

    ctx.strokeStyle =
        "rgba(210,230,160,.45)";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.moveTo(
        x - 6,
        y
    );


    ctx.lineTo(
        x + 6,
        y
    );


    ctx.stroke();
}


// =====================================
// KRAL KOBRA
// =====================================

function drawKingCobraPattern(
    x,
    y
) {

    ctx.strokeStyle =
        "rgba(25,20,10,.75)";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.moveTo(
        x - 5,
        y - 3
    );


    ctx.lineTo(
        x + 5,
        y + 3
    );


    ctx.stroke();
}


// =====================================
// ALBİNO
// =====================================

function drawAlbinoPattern(
    x,
    y
) {

    ctx.fillStyle =
        "rgba(180,80,60,.55)";


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        3,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


// =====================================
// YUMUŞAK GÖVDE
// =====================================

function drawSmoothSnakePath() {

    if (
        snake.length < 2
    ) {
        return;
    }


    const points =
        snake.map(
            part => ({
                x:
                    part.x +
                    grid / 2,

                y:
                    part.y +
                    grid / 2
            })
        );


    ctx.beginPath();


    ctx.moveTo(
        points[
            points.length - 1
        ].x,

        points[
            points.length - 1
        ].y
    );


    for (
        let i =
            points.length - 1;

        i > 0;

        i--
    ) {

        const current =
            points[i];


        const next =
            points[i - 1];


        const midX =
            (
                current.x +
                next.x
            ) / 2;


        const midY =
            (
                current.y +
                next.y
            ) / 2;


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
// YILAN BAŞI
// =====================================

function drawSnakeHead() {

    const head =
        snake[0];


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


    let angle = 0;


    if (
        direction.x > 0
    ) {
        angle = 0;
    }


    if (
        direction.x < 0
    ) {
        angle = Math.PI;
    }


    if (
        direction.y < 0
    ) {
        angle =
            -Math.PI / 2;
    }


    if (
        direction.y > 0
    ) {
        angle =
            Math.PI / 2;
    }


    ctx.rotate(angle);


    const style =
        snakes[selectedSnake];


    // KOBRA BAŞLIĞI

    if (
        selectedSnake ===
        "cobra" ||
        selectedSnake ===
        "kingcobra"
    ) {

        ctx.fillStyle =
            selectedSnake ===
            "cobra"
                ? "#526b3e"
                : "#725b2b";


        ctx.beginPath();


        ctx.ellipse(
            -4,
            0,
            25,
            18,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();
    }


    // GÖLGE

    ctx.fillStyle =
        "rgba(0,0,0,.4)";


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


    // BAŞ GRADIENT

    const headGradient =
        ctx.createRadialGradient(
            -6,
            -6,
            2,
            0,
            0,
            20
        );


    if (
        style.color ===
        "brown"
    ) {

        headGradient.addColorStop(
            0,
            "#e0b86e"
        );

        headGradient.addColorStop(
            .45,
            "#a97842"
        );

        headGradient.addColorStop(
            1,
            "#4b3021"
        );
    }


    else if (
        style.color ===
        "cobra"
    ) {

        headGradient.addColorStop(
            0,
            "#9bbd75"
        );

        headGradient.addColorStop(
            .5,
            "#527342"
        );

        headGradient.addColorStop(
            1,
            "#20311d"
        );
    }


    else if (
        style.color ===
        "anaconda"
    ) {

        headGradient.addColorStop(
            0,
            "#81905c"
        );

        headGradient.addColorStop(
            .5,
            "#4c5c36"
        );

        headGradient.addColorStop(
            1,
            "#20291a"
        );
    }


    else if (
        style.color ===
        "kingcobra"
    ) {

        headGradient.addColorStop(
            0,
            "#d7bd73"
        );

        headGradient.addColorStop(
            .5,
            "#8e7138"
        );

        headGradient.addColorStop(
            1,
            "#302511"
        );
    }


    else {

        headGradient.addColorStop(
            0,
            "#fff7d4"
        );

        headGradient.addColorStop(
            .5,
            "#e8d38d"
        );

        headGradient.addColorStop(
            1,
            "#a18a50"
        );
    }


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


    // GÖZLER

    ctx.fillStyle =
        selectedSnake ===
        "albino"
            ? "#d85b68"
            : "#d9b62e";


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


    // GÖZ BEBEKLERİ

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


    // BURUN

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


    // DİL

    if (
        tonguePower > 0
    ) {

        drawTongue();
    }


    ctx.restore();
}


// =====================================
// DİL
// =====================================

function drawTongue() {

    const length = 32;


    ctx.strokeStyle =
        "#e51f45";


    ctx.lineWidth =
        2;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    ctx.moveTo(
        15,
        0
    );


    ctx.lineTo(
        length,
        0
    );


    ctx.moveTo(
        length,
        0
    );


    ctx.lineTo(
        length + 8,
        -4
    );


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


    setTimeout(
        () => {

            alert(
                "Oyun bitti! Skorun: " +
                score +
                "\n\n🪙 Coin: " +
                coins
            );

        },
        100
    );
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
// BUTONLAR
// =====================================

startButton.addEventListener(
    "click",
    startGame
);


drawCoinCounter();

createSnakeButton();
