const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 2; // Increased gravity speed
const player1 = { x: 50, y: canvas.height - 20, width: 20, height: 20, color: 'blue', health: 100, direction: '', shoot: false, reloadTime: 0, bulletDirection: 'right' };
const player2 = { x: 730, y: canvas.height - 20, width: 20, height: 20, color: 'red', health: 100, direction: '', shoot: false, reloadTime: 0, bulletDirection: 'left' };
const bullets = [];
const powerUps = [];
const obstacles = [];

let lastPowerUpSpawn = 0;
let lastObstacleSpawn = 0;

// Helper functions
function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function createBullet(player) {
    if (player.reloadTime <= 0) {
        bullets.push({ x: player.x + (player.bulletDirection === 'right' ? player.width : 0), y: player.y + player.height / 2, width: 5, height: 5, color: player.color, direction: player.bulletDirection });
        player.reloadTime = 20; // Example reload time
    }
}

function createPowerUp() {
    const types = ['triple', 'shield', 'large'];
    const colors = ['green', 'yellow', 'purple'];
    const type = types[Math.floor(Math.random() * types.length)];
    const color = colors[types.indexOf(type)];
    powerUps.push({ x: Math.random() * (canvas.width - 20), y: canvas.height - (Math.random() * 50 + 20), width: 20, height: 20, color, type, spawnTime: Date.now() });
}

function createObstacle() {
    obstacles.push({ x: Math.random() * (canvas.width - 30), y: canvas.height - (Math.random() * 50 + 20), width: 30, height: 30, color: 'gray' });
}

function applyGravity(player) {
    if (player.y + player.height < canvas.height) {
        player.y += gravity;
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move players
    if (player1.direction === 'left' && player1.x > 0) player1.x -= 2;
    if (player1.direction === 'right' && player1.x + player1.width < canvas.width) player1.x += 2;
    if (player1.direction === 'up' && player1.y > 0) player1.y -= 2;
    if (player1.direction === 'down' && player1.y + player1.height < canvas.height) player1.y += 2;
    applyGravity(player1);

    if (player2.direction === 'left' && player2.x > 0) player2.x -= 2;
    if (player2.direction === 'right' && player2.x + player2.width < canvas.width) player2.x += 2;
    if (player2.direction === 'up' && player2.y > 0) player2.y -= 2;
    if (player2.direction === 'down' && player2.y + player2.height < canvas.height) player2.y += 2;
    applyGravity(player2);

    // Shoot bullets
    if (player1.shoot) createBullet(player1);
    if (player2.shoot) createBullet(player2);

    bullets.forEach((bullet, index) => {
        bullet.x += bullet.direction === 'left' ? -5 : 5;
        if (bullet.x < 0 || bullet.x > canvas.width) bullets.splice(index, 1);
        if (checkCollision(bullet, player1)) {
            player1.health -= 10;
            bullets.splice(index, 1);
        }
        if (checkCollision(bullet, player2)) {
            player2.health -= 10;
            bullets.splice(index, 1);
        }
        drawRect(bullet);
    });

    // Draw players
    drawRect(player1);
    drawRect(player2);

    // Reduce reload time
    if (player1.reloadTime > 0) player1.reloadTime--;
    if (player2.reloadTime > 0) player2.reloadTime--;

    // Create power-ups
    if (Date.now() - lastPowerUpSpawn > 3000) {
        createPowerUp();
        lastPowerUpSpawn = Date.now();
    }

    // Draw power-ups
    powerUps.forEach((powerUp, index) => {
        drawRect(powerUp);
        if (Date.now() - powerUp.spawnTime > 5000) powerUps.splice(index, 1);
    });

    // Create obstacles
    if (Date.now() - lastObstacleSpawn > 3000) {
        createObstacle();
        lastObstacleSpawn = Date.now();
    }

    // Draw obstacles
    obstacles.forEach((obstacle) => drawRect(obstacle));

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': player1.direction = 'up'; break;
        case 'KeyA': player1.direction = 'left'; break;
        case 'KeyS': player1.shoot = true; player1.bulletDirection = 'right'; break;
        case 'KeyD': player1.direction = 'right'; break;
        case 'ArrowUp': player2.direction = 'up'; break;
        case 'ArrowLeft': player2.direction = 'left'; break;
        case 'ArrowDown': player2.shoot = true; player2.bulletDirection = 'left'; break;
        case 'ArrowRight': player2.direction = 'right'; break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': case 'KeyA': case 'KeyD': player1.direction = ''; break;
        case 'KeyS': player1.shoot = false; break;
        case 'ArrowUp': case 'ArrowLeft': case 'ArrowRight': player2.direction = ''; break;
        case 'ArrowDown': player2.shoot = false; break;
    }
});

update();
