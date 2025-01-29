const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player1 = { x: 50, y: 550, width: 20, height: 20, color: 'red', speed: 5 };
const player2 = { x: 750, y: 550, width: 20, height: 20, color: 'blue', speed: 5 };

const endPoint = { x: 380, y: 10, width: 20, height: 20 };

const spikes = [
    { x: 100, y: 500, width: 20, height: 10 },
    { x: 200, y: 450, width: 20, height: 10 },
    { x: 300, y: 400, width: 20, height: 10 },
];

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
    // Player 1 movement
    if (keys.w && player1.y > 0) player1.y -= player1.speed;
    if (keys.a && player1.x > 0) player1.x -= player1.speed;
    if (keys.s && player1.y < canvas.height - player1.height) player1.y += player1.speed;
    if (keys.d && player1.x < canvas.width - player1.width) player1.x += player1.speed;

    // Player 2 movement
    if (keys.ArrowUp && player2.y > 0) player2.y -= player2.speed;
    if (keys.ArrowLeft && player2.x > 0) player2.x -= player2.speed;
    if (keys.ArrowDown && player2.y < canvas.height - player2.height) player2.y += player2.speed;
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

    // Check for collisions with spikes
    spikes.forEach(spike => {
        if (checkCollision(player1, spike)) resetPlayer(player1);
        if (checkCollision(player2, spike)) resetPlayer(player2);
    });

    draw();
    requestAnimationFrame(update);
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
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > 10) {
        declareWinner();
    } else {
        // Reset players and end point positions for the next level
        resetPlayer(player1);
        resetPlayer(player2);
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(endPoint.x, endPoint.y, endPoint.width, endPoint.height);

    ctx.fillStyle = 'black';
    spikes.forEach(spike => {
        ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
    });
}

update();
