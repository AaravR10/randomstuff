// script.js
const board = document.getElementById('board');
const randomBlock = document.getElementById('random-block');
let points = 0;

// Create board grid
for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    board.appendChild(cell);
}

randomBlock.addEventListener('dragstart', dragStart);
randomBlock.addEventListener('dragend', dragEnd);

board.addEventListener('dragover', dragOver);
board.addEventListener('dragenter', dragEnter);
board.addEventListener('dragleave', dragLeave);
board.addEventListener('drop', drop);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.outerHTML);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('hovered');
}

function dragLeave(e) {
    e.target.classList.remove('hovered');
}

function drop(e) {
    e.preventDefault();
    e.target.classList.remove('hovered');
    
    const data = e.dataTransfer.getData('text/plain');
    const shape = document.createElement('div');
    shape.classList.add('shape');
    shape.style.backgroundColor = getRandomColor();

    if (!e.target.hasChildNodes() && e.target.className === 'cell') {
        e.target.appendChild(shape);
        updateScore();
        generateRandomBlock();
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateScore() {
    points += 10;
    document.getElementById('points').innerText = points;
}

function generateRandomBlock() {
    randomBlock.style.backgroundColor = getRandomColor();
}

generateRandomBlock();
