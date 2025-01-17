const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");



canvas.width = window.innerWidth * 0.98;  
canvas.height = window.innerHeight * 0.98; 


const player1 = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    color: "blue",
    speed: 7,
    bullets: [],
    powerUp: null,
    powerUpEndTime: 0,
    direction: { x: 0, y: 0 }, 
    health: 5 
};


const player2 = {
    x: canvas.width - 70,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    color: "red",
    speed: 7, 
    bullets: [],
    powerUp: null,
    powerUpEndTime: 0,
    direction: { x: 0, y: 0 },
    health: 5 
};


const powerUps = [];
const powerUpTypes = ["multipleShooters", "streamBullets", "grenade", "circleBullets"];
const powerUpColors = {
    multipleShooters: "yellow",
    streamBullets: "orange", 
    grenade: "green",
    circleBullets: "purple" 
};


const obstacles = [];


let keysPressed = {};
document.addEventListener("keydown", function (e) {
    keysPressed[e.key] = true;
});
document.addEventListener("keyup", function (e) {
    delete keysPressed[e.key];
});


function drawHealthBars() {
    ctx.fillStyle = "blue";
    ctx.fillRect(10, 10, player1.health * 30, 20);
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - player2.health * 30 - 10, 10, player2.health * 30, 20);
}


function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    player.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}


function movePlayer(player, upKey, downKey, leftKey, rightKey) {
    let moved = false;
    if (keysPressed[upKey] && canMove(player, 0, -player.speed)) {
        player.y -= player.speed;
        player.direction = { x: 0, y: -1 };
        moved = true;
    }
    if (keysPressed[downKey] && canMove(player, 0, player.speed)) {
        player.y += player.speed;
        player.direction = { x: 0, y: 1 };
        moved = true;
    }
    if (keysPressed[leftKey] && canMove(player, -player.speed, 0)) {
        player.x -= player.speed;
        player.direction = { x: -1, y: 0 };
        moved = true;
    }
    if (keysPressed[rightKey] && canMove(player, player.speed, 0)) {
        player.x += player.speed;
        player.direction = { x: 1, y: 0 };
        moved = true;
    }
    if (!moved) {
        player.direction = player.direction;
    }
}


function shootBullet(player, shootKey) {
    if (keysPressed[shootKey]) {
        let bullets = [];
        if (player.powerUp === "grenade") {
            bullets = [{ x: player.x + player.width / 2, y: player.y + player.height / 2, width: 10, height: 10, color: "green", speed: 5, direction: { x: player.direction.x, y: player.direction.y } }];
        } else if (player.powerUp === "circleBullets") {
            for (let i = 0; i < 360; i++) {
                const angle = i * Math.PI / 180;
                bullets.push({
                    x: player.x + player.width / 2,
                    y: player.y + player.height / 2,
                    width: 5,
                    height: 5,
                    color: "purple",
                    speed: 5,
                    direction: { x: Math.cos(angle), y: Math.sin(angle) }
                });
            }
        } else {
            bullets = [{ x: player.x + player.width / 2, y: player.y + player.height / 2, width: 5, height: 5, color: player.color, speed: 7, direction: { x: player.direction.x, y: player.direction.y } }];
            if (player.powerUp === "multipleShooters") {
                bullets.push({ x: player.x + player.width / 2, y: player.y + player.height / 2 - 10, width: 5, height: 5, color: player.color, speed: 7, direction: { x: player.direction.x, y: player.direction.y } });
                bullets.push({ x: player.x + player.width / 2, y: player.y + player.height / 2 + 10, width: 5, height: 5, color: player.color, speed: 7, direction: { x: player.direction.x, y: player.direction.y } });
            } else if (player.powerUp === "streamBullets") {
                bullets.push({ x: player.x + player.width / 2, y: player.y + player.height / 2 - 5, width: 5, height: 5, color: "orange", speed: 7, direction: { x: player.direction.x, y: player.direction.y } });
                bullets.push({ x: player.x + player.width / 2, y: player.y + player.height / 2 + 5, width: 5, height: 5, color: "orange", speed: 7, direction: { x: player.direction.x, y: player.direction.y } });
            }
        }
        bullets.forEach(bullet => player.bullets.push(bullet));
        delete keysPressed[shootKey];
    }
}


function moveBullets() {
    player1.bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed * bullet.direction.x;
        bullet.y += bullet.speed * bullet.direction.y;
        if (bullet.x > canvas.width || bullet.x < 0 || bullet.y > canvas.height || bullet.y < 0 || isCollidingWithObstacle(bullet)) {
            player1.bullets.splice(index, 1);
        }
    });


    player2.bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed * bullet.direction.x;
        bullet.y += bullet.speed * bullet.direction.y;
        if (bullet.x > canvas.width || bullet.x < 0 || bullet.y > canvas.height || bullet.y < 0 || isCollidingWithObstacle(bullet)) {
            player2.bullets.splice(index, 1);
        }
    });
}


function detectCollisions() {
    player1.bullets.forEach((bullet, bulletIndex) => {
        if (bullet.x < player2.x + player2.width &&
            bullet.x + bullet.width > player2.x &&
            bullet.y < player2.y + player2.height &&
            bullet.y + bullet.height > player2.y) {
            player1.bullets.splice(bulletIndex, 1);
            if (bullet.width === 10 && bullet.height === 10) {
                player2.health = 0;
            } else {
                player2.health -= 1;
            }
            if (player2.health <= 0) {
                alert("Player 1 wins!");
                document.location.reload();
            }
        }
    });


    player2.bullets.forEach((bullet, bulletIndex) => {
        if (bullet.x < player1.x + player1.width &&
            bullet.x + bullet.width > player1.x &&
            bullet.y < player1.y + player1.height &&
            bullet.y + bullet.height > player1.y) {
            player2.bullets.splice(bulletIndex, 1);
            if (bullet.width === 10 && bullet.height === 10) {
                player1.health = 0;
            } else {
                player1.health -= 1;
            }
            if (player1.health <= 0) {
                alert("Player 2 wins!");
                document.location.reload();
            }
        }
    });
}


function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUpColors[powerUp.type];
        ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
    });
}


function checkPowerUpCollision(player) {
    powerUps.forEach((powerUp, index) => {
        if (player.x < powerUp.x + 20 &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + 20 &&
            player.y + player.height > powerUp.y) {
            player.powerUp = powerUp.type;
            player.powerUpEndTime = Date.now() + 5000;
            powerUps.splice(index, 1);
        }
    });


    if (Date.now() > player.powerUpEndTime) {
        player.powerUp = null;
    }
}


function generatePowerUps() {
    const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    let x, y;
    do {
        x = Math.random() * (canvas.width - 20);
        y = Math.random() * (canvas.height - 20);
    } while (isCollidingWithObstacle({ x: x, y: y, width: 20, height: 20 }));
    powerUps.push({ x: x, y: y, type: powerUpType });
}


function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = "black";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}


function generateObstacles() {
    obstacles.length = 0;
    for (let i = 0; i < 10; i++) {
        const width = Math.random() * 50 + 20;
        const height = Math.random() * 50 + 20;
        let x, y;
        do {
            x = Math.random() * (canvas.width - width);
            y = Math.random() * (canvas.height - height);
        } while (isCollidingWithObstacle({ x: x, y: y, width: width, height: height }));
        obstacles.push({ x: x, y: y, width: width, height: height });
    }
}


function isCollidingWithObstacle(rect) {
    return obstacles.some(obstacle => {
        return rect.x < obstacle.x + obstacle.width &&
            rect.x + rect.width > obstacle.x &&
            rect.y < obstacle.y + obstacle.height &&
            rect.y + rect.height > obstacle.y;
    });
}


function canMove(player, dx, dy) {
    const newRect = { x: player.x + dx, y: player.y + dy, width: player.width, height: player.height };
    return !isCollidingWithObstacle(newRect);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player1);
    drawPlayer(player2);
    drawObstacles();
    drawPowerUps();
    moveBullets();
    detectCollisions();
    checkPowerUpCollision(player1);
    checkPowerUpCollision(player2);
    drawHealthBars();
    movePlayer(player1, "w", "s", "a", "d");
    movePlayer(player2, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
    shootBullet(player1, " ");
    shootBullet(player2, "Enter");
    requestAnimationFrame(draw);
}


setInterval(generatePowerUps, 5000);
generateObstacles();
draw();
