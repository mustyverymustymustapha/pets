let hunger = 100;
let energy = 100;
let happiness = 100;
let aliveTime = 0;
let fatalStateTime = 0;
let timerInterval;
let fatalStateInterval;
let stateChangeTimeout;
let needsInterval;
let morphInterval;
let isPaused = false;
let isFixed = false;
let feedCount = 0;
let lastFeedTime = 0;
let isDemon = false;
let demonTimer;

const pet = document.getElementById('pet');
const state = document.getElementById('state');
const hungerBar = document.getElementById('hunger-bar');
const energyBar = document.getElementById('energy-bar');
const happinessBar = document.getElementById('happiness-bar');
const timer = document.getElementById('timer');

function updateNeedsBars() {
    hungerBar.style.width = `${hunger}%`;
    energyBar.style.width = `${energy}%`;
    happinessBar.style.width = `${happiness}%`;
}

function updateState(newState) {
    state.textContent = newState;
}

function updateTimer() {
    aliveTime++;
    timer.textContent = `Time: ${aliveTime}s`;
}

function updateNeeds() {
    if (!isPaused && !isFixed) {
        hunger = Math.max(hunger - 2, 0);
        energy = Math.max(energy - 2, 0);
        happiness = Math.max(happiness - 2, 0);
        updateNeedsBars();
        checkFatalState();
    }
}

function checkFatalState() {
    if (hunger <= 0 || energy <= 0 || happiness <= 0) {
        fatalStateTime++;
        if (fatalStateTime >= 5) {
            alert('Game Over! Your pet has died.');
            resetPet();
        } else {
            updateState('Dying');
        }
    } else {
        fatalStateTime = 0;
    }
}

function feed() {
    const now = Date.now();
    if (now - lastFeedTime < 5000) {
        feedCount++;
    } else {
        feedCount = 1;
    }
    lastFeedTime = now;

    if (feedCount >= 5 && !isDemon) {
        transformToDemon();
    } else if (!isPaused) {
        updateState('Happy');
        hunger = Math.min(hunger + 30, 100);
        happiness = Math.min(happiness + 10, 100);
        updateNeedsBars();
    }
}

function transformToDemon() {
    isDemon = true;
    pet.textContent = '👹';
    state.textContent = 'Demonic';
    clearInterval(needsInterval);
    needsInterval = setInterval(updateDemonNeeds, 1000);
    demonTimer = setTimeout(() => {
        isDemon = false;
        pet.textContent = '🐶';
        clearInterval(needsInterval);
        needsInterval = setInterval(updateNeeds, 5000);
        resetPet();
    }, 30000);
}

function updateDemonNeeds() {
    hunger = Math.max(hunger - 5, 0);
    energy = Math.max(energy - 5, 0);
    happiness = Math.max(happiness - 5, 0);
    updateNeedsBars();
    if (hunger <= 0 || energy <= 0 || happiness <= 0) {
        alert('Your demon pet has been exorcised!');
        clearTimeout(demonTimer);
        isDemon = false;
        resetPet();
    }
}

function sleep() {
    if (!isPaused) {
        updateState('Sleeping');
        energy = Math.min(energy + 30, 100);
        hunger = Math.max(hunger - 10, 0);
        updateNeedsBars();
    }
}

function play() {
    if (!isPaused) {
        updateState('Playing');
        happiness = Math.min(happiness + 30, 100);
        energy = Math.max(energy - 10, 0);
        updateNeedsBars();
    }
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? 'Resume' : 'Pause';
}

function toggleFix() {
    isFixed = !isFixed;
    document.getElementById('fix-btn').textContent = isFixed ? 'Unfix' : 'Fix';
}

function resetPet() {
    clearInterval(timerInterval);
    clearInterval(fatalStateInterval);
    clearTimeout(stateChangeTimeout);
    clearInterval(needsInterval);
    clearInterval(morphInterval);
    clearTimeout(demonTimer);
    updateHighScores(aliveTime);
    aliveTime = 0;
    fatalStateTime = 0;
    hunger = 100;
    energy = 100;
    happiness = 100;
    isDemon = false;
    feedCount = 0;
    updateNeedsBars();
    updateState('Happy');
    pet.textContent = '🐶';
    startIntervals();
}

function startIntervals() {
    timerInterval = setInterval(updateTimer, 1000);
    fatalStateInterval = setInterval(checkFatalState, 1000);
    needsInterval = setInterval(updateNeeds, 5000);
    morphInterval = setInterval(morph, 60000);
}

function morph() {
    if (!isPaused && !isFixed && !isDemon) {
        const morphChance = Math.random();
        if (morphChance < 0.3) {
            pet.textContent = '🐱';
        } else if (morphChance < 0.6) {
            pet.textContent = '🐰';
        } else {
            pet.textContent = '🐶';
        }
    }
}

function updateHighScores(score) {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoresList = document.getElementById('high-scores');
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${score}s`;
        highScoresList.appendChild(li);
    });
}

startIntervals();
displayHighScores();