const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const startButton = document.getElementById("startButton");

const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;

canvas.style.display = "block";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.touchAction = "none";

game.appendChild(canvas);

const ctx = canvas.getContext("2d");

const grid = 20;

let snake = [];
let food = null;
let coin = null;

let direction = { x: grid, y: 0 };
let nextDirection = { x: grid, y: 0 };

let score = 0;
let coins = Number(
    localStorage.getItem("modernSnakeCoins") || 0
);

let gameRunning = false;
let gameLoop = null;

let tongueTimer = 0;
let tonguePower = 0;

let eatingAnimation = 0;
let eatenFood = null;

let selectedSnake =
    localStorage.getItem("selectedSnake") || "python";

let ownedSnakes = JSON.parse(
    localStorage.getItem("ownedSnakes") ||
    '["python"]'
);


// =====================================================
// YILANLAR
// =====================================================

const snakes = {

    python: {
        name: "Piton",
        price: 0,
        type: "python"
    },

    cobra: {
        name: "Kobra",
        price: 50,
        type: "cobra"
    },

    anaconda: {
        name: "Anakonda",
        price: 100,
        type: "anaconda"
    },

    kingcobra: {
        name: "Kral Kobra",
        price: 150,
        type: "kingcobra"
    },

    albino: {
        name: "Albino Piton",
        price: 200,
        type: "albino"
    }
};


// =====================================================
// VERİLERİ KAYDET
// =====================================================

function saveData() {

    localStorage.setItem(
        "modernSnakeCoins",
        String(coins)
    );

    localStorage.setItem(
        "selectedSnake",
        selectedSnake
    );

    localStorage.setItem(
        "ownedSnakes",
        JSON.stringify(ownedSnakes)
    );
}


// =====================================================
// COIN
// =====================================================

function drawCoinCounter() {

    let counter =
        document.getElementById("coinCounter");

    if (!counter) {

        counter =
            document.createElement("div");

        counter.id =
            "coinCounter";

        counter.style.textAlign =
            "center";

        counter.style.fontSize =
            "22px";

        counter.style.fontWeight =
            "900";

        counter.style.color =
            "#ffd54a";

        counter.style.margin =
            "8px 0 12px";

        game.parentElement.insertBefore(
            counter,
            game
        );
    }

    counter.textContent =
        "🪙 " + coins;
}


// =====================================================
// YILANLAR BUTONU
// =====================================================

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

    button.style.width =
        "calc(100% - 40px)";

    button.style.maxWidth =
        "400px";

    button.style.margin =
        "12px auto";

    button.style.padding =
        "15px";

    button.style.border =
        "none";

    button.style.borderRadius =
        "16px";

    button.style.background =
        "#26344b";

    button.style.color =
        "#ffffff";

    button.style.fontSize =
        "18px";

    button.style.fontWeight =
        "900";

    button.style.boxShadow =
        "0 8px 25px rgba(0,0,0,.25)";

    button.onclick =
        function () {

            createSnakeMenu();
        };

    startButton.parentElement.appendChild(
        button
    );
}


// =====================================================
// TAM EKRAN YILAN MENÜSÜ
// =====================================================

function createSnakeMenu() {

    const oldMenu =
        document.getElementById(
            "snakeMenu"
        );

    if (oldMenu) {

        oldMenu.remove();

        return;
    }


    // -------------------------------------------------
    // ARKA PLAN
    // -------------------------------------------------

    const overlay =
        document.createElement("div");

    overlay.id =
        "snakeMenu";


    Object.assign(
        overlay.style,
        {
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",

            width: "100vw",
            height: "100dvh",

            boxSizing: "border-box",

            background:
                "rgba(4,9,20,.94)",

            backdropFilter:
                "blur(10px)",

            WebkitBackdropFilter:
                "blur(10px)",

            zIndex: "999999",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            padding:
                "20px",

            overflow:
                "hidden"
        }
    );


    // -------------------------------------------------
    // PANEL
    // -------------------------------------------------

    const panel =
        document.createElement("div");


    Object.assign(
        panel.style,
        {
            width: "100%",

            maxWidth: "390px",

            maxHeight: "90dvh",

            boxSizing: "border-box",

            overflowY: "auto",

            overflowX: "hidden",

            padding: "20px",

            borderRadius: "24px",

            background:
                "linear-gradient(180deg,#18263d,#0d1524)",

            border:
                "1px solid rgba(0,225,255,.35)",

            boxShadow:
                "0 0 40px rgba(0,225,255,.22)",

            scrollbarWidth: "thin"
        }
    );


    // -------------------------------------------------
    // BAŞLIK
    // -------------------------------------------------

    const title =
        document.createElement("div");

    title.innerHTML =
        "🐍 YILANLAR";

    Object.assign(
        title.style,
        {
            color: "#ffffff",

            fontSize: "28px",

            fontWeight: "900",

            textAlign: "center",

            marginBottom: "8px"
        }
    );

    panel.appendChild(title);


    // -------------------------------------------------
    // COIN
    // -------------------------------------------------

    const balance =
        document.createElement("div");

    balance.textContent =
        "🪙 " + coins + " COIN";

    Object.assign(
        balance.style,
        {
            color: "#ffd54a",

            fontSize: "18px",

            fontWeight: "900",

            textAlign: "center",

            marginBottom: "18px"
        }
    );

    panel.appendChild(balance);


    // -------------------------------------------------
    // YILAN LİSTESİ
    // -------------------------------------------------

    Object.keys(snakes).forEach(
        id => {

            const data =
                snakes[id];

            const owned =
                ownedSnakes.includes(id);

            const selected =
                selectedSnake === id;


            const item =
                document.createElement("div");


            Object.assign(
                item.style,
                {
                    width: "100%",

                    boxSizing: "border-box",

                    padding: "13px",

                    marginBottom: "10px",

                    borderRadius: "17px",

                    background:
                        selected
                            ? "linear-gradient(135deg,#00e5ff,#00aeca)"
                            : "#202d43",

                    border:
                        selected
                            ? "2px solid #8fffff"
                            : "1px solid #34445d",

                    color:
                        "#ffffff"
                }
            );


            // SATIR

            const row =
                document.createElement("div");


            Object.assign(
                row.style,
                {
                    width: "100%",

                    display: "flex",

                    alignItems: "center",

                    gap: "10px",

                    boxSizing: "border-box"
                }
            );


            // İKON

            const icon =
                document.createElement("div");

            icon.textContent =
                "🐍";

            icon.style.fontSize =
                "32px";

            icon.style.flexShrink =
                "0";

            row.appendChild(icon);


            // BİLGİ

            const info =
                document.createElement("div");

            info.style.flex =
                "1";

            info.style.minWidth =
                "0";


            const name =
                document.createElement("div");

            name.textContent =
                data.name;

            Object.assign(
                name.style,
                {
                    fontSize: "17px",

                    fontWeight: "900",

                    color:
                        selected
                            ? "#06202a"
                            : "#ffffff"
                }
            );

            info.appendChild(name);


            const status =
                document.createElement("div");


            if (selected) {

                status.textContent =
                    "✓ SEÇİLİ";

            } else if (owned) {

                status.textContent =
                    "Kullanılabilir";

            } else {

                status.textContent =
                    "🔒 " +
                    data.price +
                    " 🪙";
            }


            Object.assign(
                status.style,
                {
                    marginTop: "3px",

                    fontSize: "13px",

                    fontWeight: "700",

                    color:
                        selected
                            ? "#07303a"
                            : "#aebbd0"
                }
            );


            info.appendChild(status);

            row.appendChild(info);


            // BUTON

            const button =
                document.createElement("button");


            if (selected) {

                button.textContent =
                    "SEÇİLİ";

            } else if (owned) {

                button.textContent =
                    "SEÇ";

            } else {

                button.textContent =
                    "AÇ";
            }


            Object.assign(
                button.style,
                {
                    flexShrink: "0",

                    border: "none",

                    borderRadius: "10px",

                    padding: "10px 12px",

                    background:
                        selected
                            ? "#07303a"
                            : "#00d9ff",

                    color:
                        selected
                            ? "#ffffff"
                            : "#061018",

                    fontSize: "13px",

                    fontWeight: "900"
                }
            );


            button.onclick =
                function () {

                    // SAHİPSE SEÇ

                    if (owned) {

                        selectedSnake =
                            id;

                        saveData();

                        overlay.remove();

                        return;
                    }


                    // SATIN AL

                    if (
                        coins >=
                        data.price
                    ) {

                        coins -=
                            data.price;

                        ownedSnakes.push(
                            id
                        );

                        selectedSnake =
                            id;

                        saveData();

                        drawCoinCounter();

                        overlay.remove();

                    } else {

                        alert(
                            data.name +
                            " için " +
                            data.price +
                            " coin gerekiyor.\n\n" +
                            "Mevcut coin: " +
                            coins
                        );
                    }
                };


            row.appendChild(button);

            item.appendChild(row);

            panel.appendChild(item);
        }
    );


    // -------------------------------------------------
    // KAPAT
    // -------------------------------------------------

    const closeButton =
        document.createElement("button");

    closeButton.textContent =
        "KAPAT";


    Object.assign(
        closeButton.style,
        {
            width: "100%",

            padding: "14px",

            marginTop: "5px",

            border: "none",

            borderRadius: "14px",

            background: "#ff3158",

            color: "#ffffff",

            fontSize: "17px",

            fontWeight: "900"
        }
    );


    closeButton.onclick =
        function () {

            overlay.remove();
        };


    panel.appendChild(
        closeButton
    );


    // -------------------------------------------------
    // DIŞARI TIKLAMA
    // -------------------------------------------------

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();
            }
        }
    );


    overlay.appendChild(
        panel
    );

    document.body.appendChild(
        overlay
    );
}


// =====================================================
// OYUNU BAŞLAT
// =====================================================

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


    gameRunning =
        true;


    startButton.textContent =
        "YENİDEN BAŞLAT";


    clearInterval(
        gameLoop
    );


    gameLoop =
        setInterval(
            update,
            120
        );


    draw();

    drawCoinCounter();
}


// =====================================================
// OYUN GÜNCELLE
// =====================================================

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

        head.x >=
            canvas.width ||

        head.y >=
            canvas.height

    ) {

        endGame();

        return;
    }


    // KENDİNE ÇARPMA

    if (

        snake.some(
            part =>

                part.x ===
                head.x &&

                part.y ===
                head.y
        )

    ) {

        endGame();

        return;
    }


    snake.unshift(head);


    // =================================================
    // YEM
    // =================================================

    if (

        food &&

        head.x ===
        food.x &&

        head.y ===
        food.y &&

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


    // =================================================
    // COIN
    // =================================================

    if (

        coin &&

        head.x ===
        coin.x &&

        head.y ===
        coin.y

    ) {

        coins++;

        saveData();

        drawCoinCounter();

        createCoin();
    }


    // =================================================
    // DİL
    // =================================================

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


    // =================================================
    // YEM ANİMASYONU
    // =================================================

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


// =====================================================
// ÇİZİM
// =====================================================

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


// =====================================================
// YEM
// =====================================================

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
        .5,
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
        .45,
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


    ctx.shadowBlur = 0;


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


// =====================================================
// YILAN ÇİZ
// =====================================================

function drawSnake() {

    if (
        snake.length === 0
    ) {
        return;
    }


    let colors;


    if (
        selectedSnake ===
        "python"
    ) {

        colors = [
            "#d6a75b",
            "#a8753f",
            "#70472c",
            "#3d281d"
        ];

    } else if (
        selectedSnake ===
        "cobra"
    ) {

        colors = [
            "#91ad65",
            "#587642",
            "#344c2d",
            "#1d2c1a"
        ];

    } else if (
        selectedSnake ===
        "anaconda"
    ) {

        colors = [
            "#758653",
            "#4c6037",
            "#2d3b22",
            "#182015"
        ];

    } else if (
        selectedSnake ===
        "kingcobra"
    ) {

        colors = [
            "#d2b766",
            "#96763b",
            "#59451f",
            "#2d220f"
        ];

    } else {

        colors = [
            "#fff5c9",
            "#e8d58e",
            "#c7aa62",
            "#8d753e"
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
        colors[0]
    );

    gradient.addColorStop(
        .35,
        colors[1]
    );

    gradient.addColorStop(
        .7,
        colors[2]
    );

    gradient.addColorStop(
        1,
        colors[3]
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


    // PARLAK ÜST KISIM

    ctx.strokeStyle =
        "rgba(255,235,170,.28)";


    ctx.lineWidth = 4;


    drawSmoothSnakePath();

    ctx.stroke();


    // DESEN

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

        } else if (
            selectedSnake ===
            "anaconda"
        ) {

            drawAnacondaPattern(
                x,
                y
            );

        } else if (
            selectedSnake ===
            "cobra"
        ) {

            drawCobraPattern(
                x,
                y
            );

        } else if (
            selectedSnake ===
            "kingcobra"
        ) {

            drawKingCobraPattern(
                x,
                y
            );

        } else {

            drawAlbinoPattern(
                x,
                y
            );
        }
    }


    ctx.restore();


    drawSnakeHead();
}
// =====================================================
// COIN ÇİZ
// =====================================================

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
        .45,
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


    ctx.shadowBlur = 0;


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


// =====================================================
// YILAN ÇİZ
// =====================================================

function drawSnake() {

    if (
        snake.length === 0
    ) {
        return;
    }


    let colors;


    if (
        selectedSnake ===
        "python"
    ) {

        colors = [
            "#d6a75b",
            "#a8753f",
            "#70472c",
            "#3d281d"
        ];

    } else if (
        selectedSnake ===
        "cobra"
    ) {

        colors = [
            "#91ad65",
            "#587642",
            "#344c2d",
            "#1d2c1a"
        ];

    } else if (
        selectedSnake ===
        "anaconda"
    ) {

        colors = [
            "#758653",
            "#4c6037",
            "#2d3b22",
            "#182015"
        ];

    } else if (
        selectedSnake ===
        "kingcobra"
    ) {

        colors = [
            "#d2b766",
            "#96763b",
            "#59451f",
            "#2d220f"
        ];

    } else {

        colors = [
            "#fff5c9",
            "#e8d58e",
            "#c7aa62",
            "#8d753e"
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
        colors[0]
    );

    gradient.addColorStop(
        .35,
        colors[1]
    );

    gradient.addColorStop(
        .7,
        colors[2]
    );

    gradient.addColorStop(
        1,
        colors[3]
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


    // PARLAK ÜST KISIM

    ctx.strokeStyle =
        "rgba(255,235,170,.28)";


    ctx.lineWidth = 4;


    drawSmoothSnakePath();

    ctx.stroke();


    // DESEN

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

        } else if (
            selectedSnake ===
            "anaconda"
        ) {

            drawAnacondaPattern(
                x,
                y
            );

        } else if (
            selectedSnake ===
            "cobra"
        ) {

            drawCobraPattern(
                x,
                y
            );

        } else if (
            selectedSnake ===
            "kingcobra"
        ) {

            drawKingCobraPattern(
                x,
                y
            );

        } else {

            drawAlbinoPattern(
                x,
                y
            );
        }
    }


    ctx.restore();


    drawSnakeHead();
}
 // =====================================================
// PITON DESEN
// =====================================================

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


// =====================================================
// ANAKONDA DESEN
// =====================================================

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


// =====================================================
// KOBRA DESEN
// =====================================================

function drawCobraPattern(
    x,
    y
) {

    ctx.strokeStyle =
        "rgba(210,230,160,.45)";


    ctx.lineWidth = 2;


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


// =====================================================
// KRAL KOBRA DESEN
// =====================================================

function drawKingCobraPattern(
    x,
    y
) {

    ctx.strokeStyle =
        "rgba(25,20,10,.75)";


    ctx.lineWidth = 2;


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


// =====================================================
// ALBİNO DESEN
// =====================================================

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


// =====================================================
// YUMUŞAK GÖVDE
// =====================================================

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

// =====================================================
// YILAN BAŞI
// =====================================================

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

    } else if (
        direction.x < 0
    ) {

        angle =
            Math.PI;

    } else if (
        direction.y < 0
    ) {

        angle =
            -Math.PI / 2;

    } else if (
        direction.y > 0
    ) {

        angle =
            Math.PI / 2;
    }


    ctx.rotate(angle);


    // KOBRA BOYUNU

    if (
        selectedSnake ===
        "cobra" ||
        selectedSnake ===
        "kingcobra"
    ) {

        ctx.fillStyle =
            selectedSnake ===
            "cobra"
                ? "#536d3e"
                : "#735c2d";


        ctx.beginPath();


        ctx.ellipse(
            -5,
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
        "rgba(0,0,0,.42)";


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


    // BAŞ

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
        selectedSnake ===
        "python"
    ) {

        headGradient.addColorStop(
            0,
            "#e4bd74"
        );

        headGradient.addColorStop(
            .5,
            "#a87842"
        );

        headGradient.addColorStop(
            1,
            "#4b3021"
        );

    } else if (
        selectedSnake ===
        "cobra"
    ) {

        headGradient.addColorStop(
            0,
            "#a8c97d"
        );

        headGradient.addColorStop(
            .5,
            "#587944"
        );

        headGradient.addColorStop(
            1,
            "#20321c"
        );

    } else if (
        selectedSnake ===
        "anaconda"
    ) {

        headGradient.addColorStop(
            0,
            "#8b9c63"
        );

        headGradient.addColorStop(
            .5,
            "#52663a"
        );

        headGradient.addColorStop(
            1,
            "#202a19"
        );

    } else if (
        selectedSnake ===
        "kingcobra"
    ) {

        headGradient.addColorStop(
            0,
            "#dfc77d"
        );

        headGradient.addColorStop(
            .5,
            "#92753b"
        );

        headGradient.addColorStop(
            1,
            "#302511"
        );

    } else {

        headGradient.addColorStop(
            0,
            "#fff8d8"
        );

        headGradient.addColorStop(
            .5,
            "#e8d58e"
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
            ? "#e05b6d"
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

// =====================================================
// DİL ANİMASYONU
// =====================================================

function drawTongue() {

    const length =
        32;


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


// =====================================================
// YEM OLUŞTUR
// =====================================================

function createFood() {

    let valid = false;


    while (!valid) {

        food = {

            x:
                Math.floor(
                    Math.random() *
                    (
                        canvas.width /
                        grid
                    )
                ) * grid,

            y:
                Math.floor(
                    Math.random() *
                    (
                        canvas.height /
                        grid
                    )
                ) * grid
        };


        valid =
            !snake.some(
                part =>

                    part.x ===
                    food.x &&

                    part.y ===
                    food.y
            );
    }
}


// =====================================================
// COIN OLUŞTUR
// =====================================================

function createCoin() {

    let valid = false;


    while (!valid) {

        coin = {

            x:
                Math.floor(
                    Math.random() *
                    (
                        canvas.width /
                        grid
                    )
                ) * grid,

            y:
                Math.floor(
                    Math.random() *
                    (
                        canvas.height /
                        grid
                    )
                ) * grid
        };


        valid =
            !snake.some(
                part =>

                    part.x ===
                    coin.x &&

                    part.y ===
                    coin.y
            );


        if (
            food &&

            coin.x ===
            food.x &&

            coin.y ===
            food.y
        ) {

            valid = false;
        }
    }
}


// =====================================================
// OYUN BİTTİ
// =====================================================

function endGame() {

    gameRunning =
        false;


    clearInterval(
        gameLoop
    );


    startButton.textContent =
        "TEKRAR OYNA";


    setTimeout(
        function () {

            alert(
                "Oyun bitti!\n\n" +
                "Skor: " +
                score +
                "\n" +
                "🪙 Coin: " +
                coins
            );

        },
        100
    );
}


// =====================================================
// KLAVYE
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (!gameRunning) {
            return;
        }


        if (

            event.key ===
            "ArrowUp" &&

            direction.y === 0

        ) {

            nextDirection = {
                x: 0,
                y: -grid
            };
        }


        if (

            event.key ===
            "ArrowDown" &&

            direction.y === 0

        ) {

            nextDirection = {
                x: 0,
                y: grid
            };
        }


        if (

            event.key ===
            "ArrowLeft" &&

            direction.x === 0

        ) {

            nextDirection = {
                x: -grid,
                y: 0
            };
        }


        if (

            event.key ===
            "ArrowRight" &&

            direction.x === 0

        ) {

            nextDirection = {
                x: grid,
                y: 0
            };
        }
    }
);


// =====================================================
// TELEFON KONTROLÜ
// =====================================================

let touchStartX = 0;
let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    function (event) {

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
    function (event) {

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


// =====================================================
// BAŞLAT
// =====================================================

startButton.addEventListener(
    "click",
    startGame
);


// =====================================================
// İLK AYARLAR
// =====================================================

drawCoinCounter();

createSnakeButton();
