const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
const jumpPower = -10;
const jumpHeight = -jumpPower / gravity * 2; // Estimated jump height
const player1 = { x: 50, y: 550, width: 20, height: 20, color: 'red', speed: 5, vy: 0, onGround: false };
const player2 = { x: 750, y: 550, width: 20, height: 20, color: 'blue', speed: 5, vy: 0, onGround: false };

const endPoint = { x: 380, y: 10, width: 20, height: 20 };

let player1Score = 0;
let player2Score = 0;
let currentLevel = 1;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false
};

document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

function update() {
    applyGravity(player1);
    applyGravity(player2);

    // Player 1 movement
    if (keys.w && player1.onGround) player1.vy = jumpPower;
    if (keys.a && player1.x > 0) player1.x -= player1.speed;
    if (keys.d && player1.x < canvas.width - player1.width) player1.x += player1.speed;

    // Player 2 movement
    if (keys.ArrowUp && player2.onGround) player2.vy = jumpPower;
    if (keys.ArrowLeft && player2.x > 0) player2.x -= player2.speed;
    if (keys.ArrowRight && player2.x < canvas.width - player2.width) player2.x += player2.speed;

    // Check if players reached the end point
    if (checkCollision(player1, endPoint)) {
        player1Score++;
        nextLevel();
    }
    if (checkCollision(player2, endPoint)) {
        player2Score++;
        nextLevel();
    }

    // Check for collisions with obstacles
    obstacles.forEach(obstacle => {
        handleObstacleCollision(player1, obstacle);
        handleObstacleCollision(player2, obstacle);
    });

    draw();
    requestAnimationFrame(update);
}

function applyGravity(player) {
    player.vy += gravity;
    player.y += player.vy;
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.vy = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

function resetPlayer(player) {
    player.x = (player === player1) ? 50 : 750;
    player.y = 550;
    player.vy = 0;
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > 10) {
        declareWinner();
    } else {
        resetPlayer(player1);
        resetPlayer(player2);
        generateValidObstacles();
    }
}

function declareWinner() {
    let winner = 'It\'s a tie!';
    if (player1Score > player2Score) {
        winner = 'Player 1 wins!';
    } else if (player2Score > player1Score) {
        winner = 'Player 2 wins!';
    }
    alert(winner);
    document.location.reload();
}

function generateValidObstacles() {
    obstacles = [];
    const obstacleCount = Math.floor(Math.random() * 5) + 3;
    let lastX = 0;
    let lastY = canvas.height - 20;

    for (let i = 0; i < obstacleCount; i++) {
        let x, y;
        do {
            x = Math.random() * (canvas.width - 50);
            y = Math.random() * (canvas.height - 100);
        } while (Math.abs(x - lastX) > jumpHeight || Math.abs(y - lastY) > jumpHeight);

        const obstacle = {
            x: x,
            y: y,
            width: 50,
            height: 10,
            color: 'black'
        };

        obstacles.push(obstacle);
        lastX = x;
        lastY = y;
    }
}

function handleObstacleCollision(player, obstacle) {
    if (player.vy > 0 && checkCollision(player, obstacle)) {
        player.y = obstacle.y - player.height;
        player.vy = 0;
        player.onGround = true;
    } else if (player.vy < 0 && checkCollision(player, obstacle)) {
        player.y = obstacle.y + obstacle.height;
        player.vy = 0;
    }
}
function handleObstacleCollision(player, obstacle) {
    if (player.vy > 0 && checkCollision(player, obstacle)) {
        player.y = obstacle.y - player.height;
        player.vy = 0;
        player.onGround = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(endPoint.x, endPoint.y, endPoint.width, endPoint.height);

    ctx.fillStyle = 'black';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Initialize the game
generateValidObstacles();
update();
