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
let highScores = [];

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
}

function dance() {
    updateState('Excited');
    pet.style.animation = 'dance 0.5s ease-in-out';
    setTimeout(() => {
        pet.style.animation = '';
    }, 500);
}

function play() {
    updateState('Playful');
}

function sleep() {
    updateState('Sleepy');
}

function fix() {
    isFixed = !isFixed;
    fixBtn.textContent = isFixed ? 'Unfix' : 'Fix';
    if (isFixed) {
        clearTimeout(stateChangeTimeout);
    } else {
        stateChangeTimeout = setTimeout(randomStateChange, 5000);
    }
}

function updateTimer() {
    aliveTime++;
    timerElement.textContent = `Alive for: ${aliveTime} seconds`;
}

function checkFatalState() {
    fatalStateTime++;
    if (fatalStateTime >= 15) {
        alert('Your pet has died!');
        resetPet();
    }
}

async function resetPet() {
    clearInterval(timerInterval);
    clearInterval(fatalStateInterval);
    clearTimeout(stateChangeTimeout);
    updateHighScores(aliveTime);
    aliveTime = 0;
    fatalStateTime = 0;
    updateState('Happy');
    await morphPet();
    timerInterval = setInterval(updateTimer, 1000);
    stateChangeTimeout = setTimeout(randomStateChange, 5000);
}

function updateHighScores(score) {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    highScoresElement.textContent = 'Highest times: ' + highScores.join(', ') + ' seconds';
}

feedBtn.addEventListener('click', feed);
danceBtn.addEventListener('click', dance);
playBtn.addEventListener('click', play);
sleepBtn.addEventListener('click', sleep);
fixBtn.addEventListener('click', fix);

setInterval(morphPet, 60000);

timerInterval = setInterval(updateTimer, 1000);
stateChangeTimeout = setTimeout(randomStateChange, 5000);

morphPet();