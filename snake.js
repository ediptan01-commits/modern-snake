let currentArena = "orman";

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

const forestArenaImage = new Image();
forestArenaImage.src = "forest-arena.svg";

const grid = 20;

let snake = [];
let food = null;
let coin = null;

let direction = { x: grid, y: 0 };
let nextDirection = { x: grid, y: 0 };

let score = 0;
let foodGrowth = 0;
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

function createArenaButton() {

    if (document.getElementById("arenaButton"))
        return;

    const button = document.createElement("button");

    button.id = "arenaButton";
    button.textContent = "🌍 ARENALAR";

    button.style.display = "block";
    button.style.width = "85%";
    button.style.margin = "12px auto";
    button.style.padding = "15px";
    button.style.border = "none";
    button.style.borderRadius = "18px";
    button.style.background =
        "linear-gradient(135deg,#26734d,#183d2c)";
    button.style.color = "white";
    button.style.fontSize = "20px";
    button.style.fontWeight = "bold";

    button.onclick = createArenaMenu;

    startButton.parentElement.appendChild(button);
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
    
    foodGrowth = 0;
    
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
    head.x === food.x &&
    head.y === food.y &&
    eatingAnimation === 0
) {

    score += 10;

    scoreText.textContent =
        "Skor: " + score;

    foodGrowth++;

    eatenFood = {
        x: food.x,
        y: food.y
    };

    food = null;

    tonguePower = 1;
    tongueTimer = 8;
    eatingAnimation = 8;

    // Her yemden sonra az miktarda uzasın
snake.pop();

if (foodGrowth >= 1) {
    foodGrowth = 0;
}

} else {

    // Normal hareketlerde kuyruğu çıkar
    snake.pop();

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
   
  // ARENA ARKA PLANI


if (currentArena === "orman" && forestArenaImage.complete) {

    ctx.drawImage(
        forestArenaImage,
        0,
        0,
        canvas.width,
        canvas.height
    );

} else {

    ctx.fillStyle = "#101522";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

    drawFood();

    drawCoin();

    drawSnake3D();
}
function drawSnake3D() {

    if (!snake || snake.length < 2) return;

    ctx.save();

    // -----------------------------
    // 3D GÖVDE AYARLARI
    // -----------------------------

    let light = "#9fcf62";
    let middle = "#4f8238";
    let dark = "#172812";

    if (selectedSnake === "python") {
        light = "#b88b55";
        middle = "#70451f";
        dark = "#24150b";
    }

    if (selectedSnake === "cobra") {
        light = "#91d09a";
        middle = "#3d754b";
        dark = "#102718";
    }

    if (selectedSnake === "anaconda") {
        light = "#8fa866";
        middle = "#49623a";
        dark = "#182516";
    }

    if (selectedSnake === "kingcobra") {
        light = "#d0b967";
        middle = "#76632d";
        dark = "#211b09";
    }

    if (selectedSnake === "albino") {
        light = "#ffe9d2";
        middle = "#d88d86";
        dark = "#713941";
    }

    // -----------------------------
    // GÖLGE
    // -----------------------------

    ctx.save();

    ctx.translate(4, 7);

    ctx.strokeStyle = "rgba(0,0,0,.45)";
    ctx.lineWidth =
        selectedSnake === "anaconda" ? 28 : 24;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawSmoothSnakePath();

    ctx.stroke();

    ctx.restore();

    // -----------------------------
    // ANA 3D GÖVDE
    // -----------------------------

    const bodyGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        400
    );

    bodyGradient.addColorStop(0, light);
    bodyGradient.addColorStop(.28, middle);
    bodyGradient.addColorStop(.72, dark);
    bodyGradient.addColorStop(1, "#050805");

    ctx.strokeStyle = bodyGradient;

    ctx.lineWidth =
        selectedSnake === "anaconda" ? 25 :
        selectedSnake === "cobra" ? 22 :
        21;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawSmoothSnakePath();

    ctx.stroke();

    // -----------------------------
    // ÜST PARLAKLIK
    // -----------------------------

    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    drawSmoothSnakePath();

    ctx.stroke();

    // -----------------------------
    // PULLAR
    // -----------------------------

    for (let i = 1; i < snake.length; i++) {

        const x = snake[i].x + grid / 2;
        const y = snake[i].y + grid / 2;

        ctx.fillStyle =
            selectedSnake === "albino"
                ? "rgba(255,245,235,.30)"
                : "rgba(20,15,10,.32)";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 3,
            3.2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // küçük parlak nokta
        ctx.fillStyle = "rgba(255,255,255,.18)";

        ctx.beginPath();

        ctx.arc(
            x - 1,
            y - 4,
            1.2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // -----------------------------
    // ALT GÖLGE
    // -----------------------------

    ctx.strokeStyle = "rgba(0,0,0,.25)";
    ctx.lineWidth = 3;

    drawSmoothSnakePath();

    ctx.stroke();

    ctx.restore();

    // KAFAYI EN ÜSTE ÇİZ
    drawSnakeHead();
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
    if (!snake || snake.length === 0) return;

    ctx.save();

    let base = "#4f7f35";
    let dark = "#18240f";
    let light = "#a9c76b";

    if (selectedSnake === "python") {
        base = "#6f8f42";
        dark = "#283617";
        light = "#c0d58a";
    }

    if (selectedSnake === "cobra") {
        base = "#3f7438";
        dark = "#102815";
        light = "#9dcc86";
    }

    if (selectedSnake === "anaconda") {
        base = "#315d32";
        dark = "#0d2111";
        light = "#6e9d62";
    }

    if (selectedSnake === "kingcobra") {
        base = "#6b6330";
        dark = "#29250e";
        light = "#c8b95b";
    }

    if (selectedSnake === "albino") {
        base = "#d6b98b";
        dark = "#76583d";
        light = "#fff0c9";
    }

    const points = snake.map(part => ({
        x: part.x + grid / 2,
        y: part.y + grid / 2
    }));

    // GÖLGE
    ctx.save();
    ctx.translate(2, 4);
    ctx.lineWidth = selectedSnake === "anaconda" ? 27 : 23;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    drawSmoothSnakePath();
    ctx.stroke();
    ctx.restore();

    // ANA GÖVDE GRADIENT
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, light);
    gradient.addColorStop(.28, base);
    gradient.addColorStop(.65, base);
    gradient.addColorStop(1, dark);

    ctx.lineWidth = selectedSnake === "anaconda" ? 25 : 21;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = gradient;

    drawSmoothSnakePath();
    ctx.stroke();

    // ÜST PARLAKLIK
    ctx.lineWidth = selectedSnake === "anaconda" ? 7 : 5;
    ctx.strokeStyle = "rgba(255,255,255,.20)";
    drawSmoothSnakePath();
    ctx.stroke();

    // PUL / DESENLER
    for (let i = 1; i < snake.length; i++) {

        const x = snake[i].x + grid / 2;
        const y = snake[i].y + grid / 2;

        ctx.save();

        if (selectedSnake === "python") {
            drawPythonPattern(x, y);
        }
        else if (selectedSnake === "anaconda") {
            drawAnacondaPattern(x, y);
        }
        else if (selectedSnake === "cobra") {
            drawCobraPattern(x, y);
        }
        else if (selectedSnake === "kingcobra") {
            drawKingCobraPattern(x, y);
        }
        else if (selectedSnake === "albino") {
            drawAlbinoPattern(x, y);
        }

        ctx.restore();
    }

    // KÜÇÜK IŞIK NOKTALARI
    for (let i = 1; i < snake.length; i += 2) {

        const x = snake[i].x + grid / 2 - 3;
        const y = snake[i].y + grid / 2 - 4;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(255,255,255,.28)";
        ctx.fill();
    }

    ctx.restore();

    // KAFA
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
    if (!snake || snake.length < 2) return;

    const points = snake.map(part => ({
        x: part.x + grid / 2,
        y: part.y + grid / 2
    }));

    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {

        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[
            Math.min(points.length - 1, i + 2)
        ];

        const cp1 = {
            x: p1.x + (p2.x - p0.x) / 6,
            y: p1.y + (p2.y - p0.y) / 6
        };

        const cp2 = {
            x: p2.x - (p3.x - p1.x) / 6,
            y: p2.y - (p3.y - p1.y) / 6
        };

        ctx.bezierCurveTo(
            cp1.x,
            cp1.y,
            cp2.x,
            cp2.y,
            p2.x,
            p2.y
        );
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

// =====================================================
// YILAN BAŞI
// =====================================================


function drawSnakeHead() {

    if (!snake || snake.length === 0) return;

    const head = snake[0];

    const headX = head.x + grid / 2;
    const headY = head.y + grid / 2;

    ctx.save();

    // YÖN
    let angle = 0;

    if (direction.x > 0) {
        angle = 0;
    } else if (direction.x < 0) {
        angle = Math.PI;
    } else if (direction.y < 0) {
        angle = -Math.PI / 2;
    } else if (direction.y > 0) {
        angle = Math.PI / 2;
    }

    ctx.translate(headX, headY);
    ctx.rotate(angle);

    // ------------------------------------------------
    // 3D GÖLGE
    // ------------------------------------------------

    ctx.shadowColor = "rgba(0,0,0,.65)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 7;

    // ------------------------------------------------
    // RENKLER
    // ------------------------------------------------

    let light = "#9bcf62";
    let middle = "#4f8436";
    let dark = "#172b12";

    if (selectedSnake === "python") {
        light = "#b98a52";
        middle = "#704522";
        dark = "#24160d";
    }

    if (selectedSnake === "cobra") {
        light = "#8fcf9b";
        middle = "#39734b";
        dark = "#102d19";
    }

    if (selectedSnake === "anaconda") {
        light = "#8da866";
        middle = "#456238";
        dark = "#172414";
    }

    if (selectedSnake === "kingcobra") {
        light = "#c0a85a";
        middle = "#66572c";
        dark = "#211d0c";
    }

    if (selectedSnake === "albino") {
        light = "#fff0d0";
        middle = "#d99088";
        dark = "#743b45";
    }

    // ------------------------------------------------
    // ANA 3D KAFA
    // ------------------------------------------------

    const headGradient = ctx.createRadialGradient(
        -7,
        -9,
        2,
        3,
        3,
        24
    );

    headGradient.addColorStop(0, "#ffffff");
    headGradient.addColorStop(.12, light);
    headGradient.addColorStop(.48, middle);
    headGradient.addColorStop(.82, dark);
    headGradient.addColorStop(1, "#050805");

    ctx.fillStyle = headGradient;

    ctx.beginPath();

    ctx.ellipse(
        2,
        0,
        22,
        16,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Gölgeyi kapat
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // ------------------------------------------------
    // ÜST PARLAKLIK
    // ------------------------------------------------

    const shine = ctx.createRadialGradient(
        -8,
        -9,
        1,
        -3,
        -5,
        14
    );

    shine.addColorStop(0, "rgba(255,255,255,.75)");
    shine.addColorStop(.35, "rgba(255,255,255,.22)");
    shine.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = shine;

    ctx.beginPath();

    ctx.ellipse(
        -5,
        -6,
        10,
        6,
        -.3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // ------------------------------------------------
    // PULLAR
    // ------------------------------------------------

    ctx.strokeStyle = "rgba(0,0,0,.22)";
    ctx.lineWidth = 1;

    for (let x = -12; x <= 13; x += 7) {

        for (let y = -9; y <= 9; y += 6) {

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                3,
                0,
                Math.PI * 2
            );

            ctx.stroke();
        }
    }

    // ------------------------------------------------
    // GÖZLER
    // ------------------------------------------------

    function drawEye(x, y) {

        const eyeGradient = ctx.createRadialGradient(
            x - 2,
            y - 2,
            1,
            x,
            y,
            6
        );

        eyeGradient.addColorStop(0, "#ffffff");
        eyeGradient.addColorStop(.35, "#e7c95a");
        eyeGradient.addColorStop(1, "#80630b");

        ctx.fillStyle = eyeGradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Göz bebeği
        ctx.fillStyle = "#050505";

        ctx.beginPath();

        ctx.ellipse(
            x + 1,
            y,
            1.7,
            4,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Göz parlaması
        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            x - 2,
            y - 2,
            1.3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    drawEye(9, -8);
    drawEye(9, 8);

    // ------------------------------------------------
    // BURUN DELİKLERİ
    // ------------------------------------------------

    ctx.fillStyle = "#090909";

    ctx.beginPath();
    ctx.arc(20, -5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(20, 5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // ------------------------------------------------
    // AĞIZ ÇİZGİSİ
    // ------------------------------------------------

    ctx.strokeStyle = "rgba(20,10,5,.75)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(
        15,
        4,
        21,
        0
    );

    ctx.stroke();

    // ------------------------------------------------
    // DİŞLER
    // ------------------------------------------------

    if (
        tongueTimer > 0 ||
        eatingAnimation > 0
    ) {

        ctx.fillStyle = "#fff4d6";

        ctx.beginPath();

        ctx.moveTo(17, 1);
        ctx.lineTo(19, 5);
        ctx.lineTo(21, 1);
        ctx.closePath();

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(17, -1);
        ctx.lineTo(19, -5);
        ctx.lineTo(21, -1);
        ctx.closePath();

        ctx.fill();
    }

    // ------------------------------------------------
    // DİL
    // ------------------------------------------------

    if (tongueTimer > 0) {

        ctx.strokeStyle = "#d83b4b";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(20, 0);
        ctx.lineTo(31, 0);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(31, 0);
        ctx.lineTo(36, -4);

        ctx.moveTo(31, 0);
        ctx.lineTo(36, 4);

        ctx.stroke();
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
