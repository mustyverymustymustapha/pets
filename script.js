const pet = document.getElementById('pet');
const petName = document.getElementById('petName');
const state = document.getElementById('state');
const feedBtn = document.getElementById('feedBtn');
const danceBtn = document.getElementById('danceBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');
const fixBtn = document.getElementById('fixBtn');
const timerElement = document.getElementById('timer');
const highScoresElement = document.getElementById('highScores');

const hungerBar = document.getElementById('hunger');
const energyBar = document.getElementById('energy');
const happinessBar = document.getElementById('happiness');

const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵'];
const states = ['Happy', 'Sad', 'Hungry', 'Excited', 'Sleepy', 'Playful', 'Sick', 'Lonely'];
const fatalStates = ['Sad', 'Sleepy', 'Sick', 'Lonely'];

let currentState = 'Happy';
let isFixed = false;
let aliveTime = 0;
let fatalStateTime = 0;
let timerInterval;
let fatalStateInterval;
let stateChangeTimeout;
let needsInterval;
let highScores = [];

let hunger = 100;
let energy = 100;
let happiness = 100;

async function getRandomName() {
    try {
        const response = await fetch('https://api.namefake.com/');
        const data = await response.json();
        return data.name.split(' ')[0];
    } catch (error) {
        console.error('Error fetching name:', error);
        return 'Pet';
    }
}

async function updateState(newState) {
    if (!isFixed) {
        currentState = newState;
        state.textContent = currentState;

        if (fatalStates.includes(currentState)) {
            if (!fatalStateInterval) {
                fatalStateInterval = setInterval(checkFatalState, 1000);
            }
            clearTimeout(stateChangeTimeout);
            stateChangeTimeout = setTimeout(randomStateChange, 20000);
        } else {
            clearInterval(fatalStateInterval);
            fatalStateInterval = null;
            fatalStateTime = 0;
            clearTimeout(stateChangeTimeout);
            stateChangeTimeout = setTimeout(randomStateChange, 5000);
        }
    }
}

async function morphPet() {
    pet.textContent = animals[Math.floor(Math.random() * animals.length)];
    const newName = await getRandomName();
    petName.textContent = newName;
}

function randomStateChange() {
    if (!isFixed) {
        const newState = states[Math.floor(Math.random() * states.length)];
        updateState(newState);
    }
}

function feed() {
    updateState('Happy');
    hunger = Math.min(hunger + 30, 100);
    happiness = Math.min(happiness + 10, 100);
    updateNeedsBars();
}

function dance() {
    updateState('Excited');
    pet.style.animation = 'dance 0.5s ease-in-out';
    setTimeout(() => {
        pet.style.animation = '';
    }, 500);
    happiness = Math.min(happiness + 20, 100);
    energy = Math.max(energy - 10, 0);
    updateNeedsBars();
}

function play() {
    updateState('Playful');
    happiness = Math.min(happiness + 30, 100);
    energy = Math.max(energy - 20, 0);
    hunger = Math.max(hunger - 10, 0);
    updateNeedsBars();
}

function sleep() {
    updateState('Sleepy');
    energy = Math.min(energy + 50, 100);
    hunger = Math.max(hunger - 20, 0);
    updateNeedsBars();
}

function fix() {
    isFixed = !isFixed;
    fixBtn.textContent = isFixed ? 'Unfix' : 'Fix';
    if (isFixed) {
        clearTimeout(stateChangeTimeout);
        clearInterval(needsInterval);
    } else {
        stateChangeTimeout = setTimeout(randomStateChange, 5000);
        needsInterval = setInterval(updateNeeds, 5000);
    }
}

function updateTimer() {
    aliveTime++;
    timerElement.textContent = `Alive for: ${aliveTime} seconds`;
}

function checkFatalState() {
    fatalStateTime++;
    if (fatalStateTime >= 15 || hunger <= 0 || energy <= 0 || happiness <= 0) {
        alert('Your pet has died!');
        resetPet();
    }
}

async function resetPet() {
    clearInterval(timerInterval);
    clearInterval(fatalStateInterval);
    clearTimeout(stateChangeTimeout);
    clearInterval(needsInterval);
    updateHighScores(aliveTime);
    aliveTime = 0;
    fatalStateTime = 0;
    hunger = 100;
    energy = 100;
    happiness = 100;
    updateNeedsBars();
    updateState('Happy');
    await morphPet();
    timerInterval = setInterval(updateTimer, 1000);
    stateChangeTimeout = setTimeout(randomStateChange, 5000);
    needsInterval = setInterval(updateNeeds, 5000);
}

function updateHighScores(score) {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    highScoresElement.textContent = 'Highest times: ' + highScores.join(', ') + ' seconds';
}

function updateNeeds() {
    hunger = Math.max(hunger - 2, 0);
    energy = Math.max(energy - 1, 0);
    happiness = Math.max(happiness - 1, 0);
    updateNeedsBars();
    updateStateBasedOnNeeds();
}

function updateNeedsBars() {
    hungerBar.value = hunger;
    energyBar.value = energy;
    happinessBar.value = happiness;
}

function updateStateBasedOnNeeds() {
    if (hunger < 30) {
        updateState('Hungry');
    } else if (energy < 30) {
        updateState('Sleepy');
    } else if (happiness < 30) {
        updateState('Sad');
    } else if (hunger > 80 && energy > 80 && happiness > 80) {
        updateState('Happy');
    }
}

feedBtn.addEventListener('click', feed);
danceBtn.addEventListener('click', dance);
playBtn.addEventListener('click', play);
sleepBtn.addEventListener('click', sleep);
fixBtn.addEventListener('click', fix);

setInterval(morphPet, 60000);

timerInterval = setInterval(updateTimer, 1000);
stateChangeTimeout = setTimeout(randomStateChange, 5000);
needsInterval = setInterval(updateNeeds, 5000);

morphPet();
updateNeedsBars();