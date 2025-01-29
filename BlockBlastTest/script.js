// script.js
const board = document.getElementById('board');
const randomBlock = document.getElementById('random-block');
let points = 0;

// Create board grid
for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
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
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.backgroundColor = getRandomColor();

    if (!e.target.hasChildNodes() && e.target.className === 'cell') {
        e.target.appendChild(block);
        updateScore();
        generateRandomBlock();
        checkForCompletedRows();
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
    const shapes = [
        // Define different shapes as arrays of cell indices
        [0, 1, 10, 11], // Square
        [0, 1, 2, 3], // Line
        [0, 1, 2, 12], // T-shape
        // Add more shapes as needed
    ];

    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    randomBlock.innerHTML = '';
    randomShape.forEach(index => {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.backgroundColor = getRandomColor();
        randomBlock.appendChild(block);
    });
}

function checkForCompletedRows() {
    for (let row = 0; row < 10; row++) {
        const rowCells = Array.from(board.children).slice(row * 10, row * 10 + 10);
        if (rowCells.every(cell => cell.hasChildNodes())) {
            rowCells.forEach(cell => {
                cell.innerHTML = '';
            });
            updateScore();
        }
    }
}

generateRandomBlock();
