const levels = [
    // Level 1: Simple 3x3
    {
        rows: 3,
        cols: 3,
        blocks: [
            { r: 0, c: 1, dir: 'up' },
            { r: 1, c: 1, dir: 'right' },
            { r: 1, c: 0, dir: 'left' },
            { r: 2, c: 1, dir: 'down' }
        ]
    },
    // Level 2: 4x4
    {
        rows: 4,
        cols: 4,
        blocks: [
            { r: 1, c: 1, dir: 'up' },
            { r: 1, c: 2, dir: 'right' },
            { r: 2, c: 1, dir: 'left' },
            { r: 2, c: 2, dir: 'down' },
            { r: 0, c: 1, dir: 'up' },
            { r: 3, c: 2, dir: 'down' }
        ]
    },
    // Level 3: 5x5 complex
    {
        rows: 5,
        cols: 5,
        blocks: [
            { r: 2, c: 2, dir: 'up' },
            { r: 1, c: 2, dir: 'right' },
            { r: 2, c: 1, dir: 'left' },
            { r: 2, c: 3, dir: 'right' },
            { r: 3, c: 2, dir: 'down' },
            { r: 1, c: 1, dir: 'up' },
            { r: 3, c: 3, dir: 'down' },
            { r: 0, c: 2, dir: 'up' },
            { r: 4, c: 2, dir: 'down' }
        ]
    }
];

let currentLevelIndex = 0;
let currentBlocks = [];
let gridSize = { rows: 0, cols: 0 };
let blockElements = []; // Store references to DOM elements

const gridEl = document.getElementById('grid');
const levelIndicator = document.getElementById('level-indicator');
const winMessage = document.getElementById('win-message');
const nextLevelBtn = document.getElementById('next-level-btn');

// Constants from CSS
const BLOCK_SIZE = 60;
const GRID_GAP = 8;

const arrowSymbols = {
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→'
};

function initGame() {
    nextLevelBtn.addEventListener('click', loadNextLevel);
    loadLevel(currentLevelIndex);
}

function loadLevel(index) {
    if (index >= levels.length) {
        // Game Complete
        levelIndicator.textContent = "All Levels Complete!";
        gridEl.innerHTML = "";
        winMessage.classList.add('hidden'); // Fixed nitpick: explicitly hide the win-message on completion
        return;
    }

    winMessage.classList.add('hidden');
    levelIndicator.textContent = `Level ${index + 1}`;

    const levelData = levels[index];
    gridSize.rows = levelData.rows;
    gridSize.cols = levelData.cols;

    // Deep copy blocks so we don't modify the original level data
    currentBlocks = JSON.parse(JSON.stringify(levelData.blocks));
    blockElements = [];

    renderGrid();
}

function renderGrid() {
    gridEl.innerHTML = "";

    // Set grid CSS
    gridEl.style.gridTemplateColumns = `repeat(${gridSize.cols}, ${BLOCK_SIZE}px)`;
    gridEl.style.gridTemplateRows = `repeat(${gridSize.rows}, ${BLOCK_SIZE}px)`;

    // Create base cells (optional, for aesthetics)
    for (let r = 0; r < gridSize.rows; r++) {
        for (let c = 0; c < gridSize.cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gridEl.appendChild(cell);
        }
    }

    // Create blocks
    currentBlocks.forEach((blockData, index) => {
        const block = document.createElement('div');
        block.classList.add('block');
        block.dataset.id = index;

        // Calculate position based on grid layout
        // +15 for the grid padding
        const top = 15 + blockData.r * (BLOCK_SIZE + GRID_GAP);
        const left = 15 + blockData.c * (BLOCK_SIZE + GRID_GAP);

        block.style.top = `${top}px`;
        block.style.left = `${left}px`;

        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.textContent = arrowSymbols[blockData.dir];
        block.appendChild(arrow);

        block.addEventListener('click', () => onBlockClick(index));

        gridEl.appendChild(block);
        blockElements[index] = block;
    });
}

function onBlockClick(id) {
    const block = currentBlocks[id];
    if (!block || block.removed) return;

    const element = blockElements[id];

    if (canMove(block)) {
        // Move is valid
        block.removed = true;

        // Calculate visual destination
        let animClass = '';
        if (block.dir === 'up') animClass = 'fly-up';
        if (block.dir === 'down') animClass = 'fly-down';
        if (block.dir === 'left') animClass = 'fly-left';
        if (block.dir === 'right') animClass = 'fly-right';

        element.style.zIndex = 100; // Bring to front while animating
        element.classList.add(animClass);

        // Remove from DOM after animation
        setTimeout(() => {
            if(element.parentNode) {
                element.parentNode.removeChild(element);
            }
            checkWinCondition();
        }, 500); // matches CSS animation duration

    } else {
        // Move is blocked - play error shake
        element.classList.remove('shake');
        // Force reflow
        void element.offsetWidth;
        element.classList.add('shake');
    }
}

function canMove(block) {
    let r = block.r;
    let c = block.c;
    const dir = block.dir;

    while(true) {
        if (dir === 'up') r--;
        else if (dir === 'down') r++;
        else if (dir === 'left') c--;
        else if (dir === 'right') c++;

        // Check if out of bounds (success)
        if (r < 0 || r >= gridSize.rows || c < 0 || c >= gridSize.cols) {
            return true;
        }

        // Check if blocked by another block
        const blockingBlock = currentBlocks.find(b => !b.removed && b.r === r && b.c === c);
        if (blockingBlock) {
            return false;
        }
    }
}

function checkWinCondition() {
    const allRemoved = currentBlocks.every(b => b.removed);
    if (allRemoved) {
        winMessage.classList.remove('hidden');
    }
}

function loadNextLevel() {
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
}

// Start game
document.addEventListener('DOMContentLoaded', initGame);