const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player1 = { x: 50, y: 50, width: 20, height: 20, color: 'blue', health: 100, direction: '', shoot: false };
const player2 = { x: 730, y: 50, width: 20, height: 20, color: 'red', health: 100, direction: '', shoot: false };
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
    bullets.push({ x: player.x + player.width / 2, y: player.y, width: 5, height: 5, color: player.color, direction: player === player1 ? 'up' : 'down' });
}

function createPowerUp() {
    const types = ['triple', 'shield', 'large'];
    const type = types[Math.floor(Math.random() * types.length)];
    powerUps.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), width: 20, height: 20, color: 'green', type });
}

function createObstacle() {
    obstacles.push({ x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height - 30), width: 30, height: 30, color: 'gray' });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move players
    if (player1.direction === 'left' && player1.x > 0) player1.x -= 2;
    if (player1.direction === 'right' && player1.x + player1.width < canvas.width) player1.x += 2;
    if (player1.direction === 'up' && player1.y > 0) player1.y -= 2;
    if (player1.direction === 'down' && player1.y + player1.height < canvas.height) player1.y += 2;

    if (player2.direction === 'left' && player2.x > 0) player2.x -= 2;
    if (player2.direction === 'right' && player2.x + player2.width < canvas.width) player2.x += 2;
    if (player2.direction === 'up' && player2.y > 0) player2.y -= 2;
    if (player2.direction === 'down' && player2.y + player2.height < canvas.height) player2.y += 2;

    // Shoot bullets
    if (player1.shoot) createBullet(player1);
    if (player2.shoot) createBullet(player2);

    bullets.forEach((bullet, index) => {
        bullet.y += bullet.direction === 'up' ? -5 : 5;
        if (bullet.y < 0 || bullet.y > canvas.height) bullets.splice(index, 1);
        drawRect(bullet);
    });

    // Draw players
    drawRect(player1);
    drawRect(player2);

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
        case 'KeyS': player1.shoot = true; break;
        case 'KeyD': player1.direction = 'right'; break;
        case 'ArrowUp': player2.direction = 'up'; break;
        case 'ArrowLeft': player2.direction = 'left'; break;
        case 'ArrowDown': player2.shoot = true; break;
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
