// script.js
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const resultMessage = document.getElementById('result-message');
const newGameButton = document.getElementById('new-game');
const difficultyButtons = document.querySelectorAll('.difficulty-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let difficulty = 'easy';

function createBoard() {
    boardElement.innerHTML = '';
    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = index;
        cell.textContent = value;
        cell.addEventListener('click', handleClick);
        boardElement.appendChild(cell);
    });
}

function handleClick(event) {
    const index = event.target.dataset.index;
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        if (checkWinner()) {
            endGame(`${currentPlayer} wins!`);
        } else if (board.every(cell => cell !== '')) {
            endGame('Draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(() => computerMove(), 500);
            }
        }
        createBoard();
    }
}

function computerMove() {
    if (!gameActive) return;

    let availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (difficulty === 'easy') {
        makeRandomMove(availableMoves);
    } else if (difficulty === 'medium') {
        if (!makeBlockingMove() && availableMoves.length > 0) {
            makeRandomMove(availableMoves);
        }
    } else if (difficulty === 'hard') {
        makeBestMove();
    }

    currentPlayer = 'X';
    if (checkWinner()) {
        endGame('O wins!');
    } else if (board.every(cell => cell !== '')) {
        endGame('Draw!');
    }
    createBoard();
}

function makeRandomMove(availableMoves) {
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[randomMove] = 'O';
}

function makeBlockingMove() {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner()) {
                board[i] = '';
                return true;
            }
            board[i] = '';
        }
    }
    return false;
}

function makeBestMove() {
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    if (bestMove !== null) {
        board[bestMove] = 'O';
    }
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell !== '')) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function endGame(message) {
    gameActive = false;
    resultMessage.textContent = message;
    gameScreen.style.display = 'none';
    resultScreen.style.display = 'flex';
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = '';
    createBoard();
}

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficulty = button.dataset.difficulty;
        homeScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        resetGame();
    });
});

resetButton.addEventListener('click', resetGame);

newGameButton.addEventListener('click', () => {
    resultScreen.style.display = 'none';
    homeScreen.style.display = 'flex';
});

createBoard();
