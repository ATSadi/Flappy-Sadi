const bird = document.getElementById('bird');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const gameOver = document.getElementById('gameOver');
const gameArea = document.getElementById('gameArea');
const scoreBoard = document.getElementById('scoreBoard');

let birdY = 350; // Centered in the updated game area
let birdVelocity = 0;
let gravity = 0.6; // Decreased gravity
let gameRunning = false;
let pipes = [];
let pipeInterval = 2000; // Starting interval for adding new pipes
let lastPipeTime = 0;
let score = 0;
let scoreUpdateInterval = 100;
const pipeSpeedIncrement = 2; // Speed increment after every 250 points
let currentPipeSpeed = 3.5; // Starting speed for pipes
const minPipeInterval = 750; // Minimum interval for pipes

document.addEventListener('keydown', function(event) {
    if (event.key === ' ' && gameRunning) {
        birdFlap();
    }
});

gameArea.addEventListener('click', function() {
    if (gameRunning) {
        birdFlap();
    }
});

gameArea.addEventListener('touchstart', function() {
    if (gameRunning) {
        birdFlap();
    }
});

startButton.addEventListener('click', function() {
    startGame();
    startButton.style.display = 'none';
});

retryButton.addEventListener('click', function() {
    gameOver.style.display = 'none';
    startGame();
});

function birdFlap() {
    if (gameRunning) {
        birdVelocity = -8; // Adjusted flap strength
    }
}

function addPipe() {
    let gap = 250; // Increased gap size
    let pipeHeight = Math.floor(Math.random() * (400 - 100 + 1) + 100);
    let pipeTopHeight = 700 - pipeHeight - gap;
    let pipe = document.createElement('div');
    pipe.classList.add('pipe');
    pipe.style.height = `${pipeHeight}px`;
    pipe.style.left = '1000px'; // Adjusted for the wider game area
    gameArea.appendChild(pipe);
    let pipeTop = document.createElement('div');
    pipeTop.classList.add('pipeTop');
    pipeTop.style.height = `${pipeTopHeight}px`;
    pipeTop.style.left = '1000px';
    pipeTop.style.top = '0';
    gameArea.appendChild(pipeTop);
    pipes.push({pipe, pipeTop});
}

function movePipes() {
    pipes.forEach((pipePair, index) => {
        let pipe = pipePair.pipe;
        let pipeTop = pipePair.pipeTop;
        let currentLeft = parseInt(pipe.style.left);
        if (currentLeft <= -100) { // Adjusted for wider pipes
            pipe.remove();
            pipeTop.remove();
            pipes.splice(index, 1);
        } else {
            pipe.style.left = `${currentLeft - currentPipeSpeed}px`;
            pipeTop.style.left = `${currentLeft - currentPipeSpeed}px`;
        }
    });
}

function checkCollision() {
    pipes.forEach(pipePair => {
        let pipeRect = pipePair.pipe.getBoundingClientRect();
        let pipeTopRect = pipePair.pipeTop.getBoundingClientRect();
        let birdRect = bird.getBoundingClientRect();

        if (birdRect.left < pipeRect.right && birdRect.right > pipeRect.left &&
            (birdRect.top < pipeTopRect.bottom || birdRect.bottom > pipeRect.top)) {
            endGame();
        }
    });
}

function updateScore() {
    if (gameRunning) {
        score += 1;
        scoreBoard.innerText = 'Score: ' + score;
        if (score % 250 === 0) {
            currentPipeSpeed += pipeSpeedIncrement; // Increase pipe speed every 250 points
            decreasePipeInterval(); // Call function to decrease the pipe interval
        }
    }
}

setInterval(updateScore, scoreUpdateInterval);

function decreasePipeInterval() {
    if (pipeInterval > minPipeInterval) {
        pipeInterval = Math.max(minPipeInterval, pipeInterval - 100); // Decrease interval, but not below 750ms
    }
}

function startGame() {
    birdY = 350;
    birdVelocity = 0;
    bird.style.top = `${birdY}px`;
    gameRunning = true;
    pipes = [];
    gameArea.querySelectorAll('.pipe, .pipeTop').forEach(elem => elem.remove());
    lastPipeTime = performance.now();
    requestAnimationFrame(gameLoop);
    score = 0;
    currentPipeSpeed = 3.5; // Reset to starting speed
    pipeInterval = 2000; // Reset interval
    scoreBoard.innerText = 'Score: ' + score;
}

function endGame() {
    gameRunning = false;
    gameOver.style.display = 'flex';
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    if (timestamp - lastPipeTime > pipeInterval) {
        lastPipeTime = timestamp;
        addPipe();
    }

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = `${birdY}px`;

    movePipes();
    checkCollision();

    if (birdY >= 655 || birdY <= 0) {
        endGame();
    }

    requestAnimationFrame(gameLoop);
}

// Hide game elements until started
startButton.style.display = 'block';
gameOver.style.display = 'none';
