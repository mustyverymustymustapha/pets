const moods = ['😊 Happy', '😢 Sad', '😠 Angry', '😴 Sleepy', '🤪 Silly'];
let currentMood = moods[0];
let moodTimer;

function updateMood() {
    if (!isPaused && !isFixed) {
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        currentMood = randomMood;
        updatePetAppearance();
    }
}

function updatePetAppearance() {
    const [emoji, moodText] = currentMood.split(' ');
    pet.textContent = emoji;
    state.textContent = moodText;

    switch (moodText) {
        case 'Happy':
            pet.style.transform = 'scale(1.1)';
            break;
        case 'Sad':
            pet.style.transform = 'scale(0.9)';
            break;
        case 'Angry':
            pet.style.transform = 'rotate(-10deg)';
            break;
        case 'Sleepy':
            pet.style.transform = 'rotate(10deg)';
            break;
        case 'Silly':
            pet.style.animation = 'dance 0.5s infinite';
            break;
        default:
            pet.style.transform = 'none';
            pet.style.animation = 'none';
    }
}

function startMoodSystem() {
    updateMood();
    moodTimer = setInterval(updateMood, 10000); 
}

startMoodSystem();


const pet = document.getElementById('pet');
const petName = document.getElementById('petName');
const state = document.getElementById('state');
const feedBtn = document.getElementById('feedBtn');
const danceBtn = document.getElementById('danceBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');
const fixBtn = document.getElementById('fixBtn');
const pauseBtn = document.getElementById('pauseBtn');
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
let isPaused = false;
let aliveTime = 0;
let fatalStateTime = 0;
let timerInterval;
let fatalStateInterval;
let stateChangeTimeout;
let needsInterval;
let morphInterval;
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
    if (!isFixed && !isPaused) {
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
    if (!isPaused) {
        pet.textContent = animals[Math.floor(Math.random() * animals.length)];
        const newName = await getRandomName();
        petName.textContent = newName;
    }
}

function randomStateChange() {
    if (!isFixed && !isPaused) {
        const newState = states[Math.floor(Math.random() * states.length)];
        updateState(newState);
    }
}

function feed() {
    if (!isPaused) {
        updateState('Happy');
        hunger = Math.min(hunger + 30, 100);
        happiness = Math.min(happiness + 10, 100);
        updateNeedsBars();
    }
}

function dance() {
    if (!isPaused) {
        updateState('Excited');
        pet.style.animation = 'dance 0.5s ease-in-out';
        setTimeout(() => {
            pet.style.animation = '';
        }, 500);
        happiness = Math.min(happiness + 20, 100);
        energy = Math.max(energy - 10, 0);
        updateNeedsBars();
    }
}

function play() {
    if (!isPaused) {
        updateState('Playful');
        happiness = Math.min(happiness + 30, 100);
        energy = Math.max(energy - 20, 0);
        hunger = Math.max(hunger - 10, 0);
        updateNeedsBars();
    }
}

function sleep() {
    if (!isPaused) {
        updateState('Sleepy');
        energy = Math.min(energy + 50, 100);
        hunger = Math.max(hunger - 20, 0);
        updateNeedsBars();
    }
}

function fix() {
    if (!isPaused) {
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
}

function updateTimer() {
    if (!isPaused) {
        aliveTime++;
        timerElement.textContent = `Alive for: ${aliveTime} seconds`;
    }
}

function checkFatalState() {
    if (!isPaused) {
        fatalStateTime++;
        if (fatalStateTime >= 15 || hunger <= 0 || energy <= 0 || happiness <= 0) {
            alert('Your pet has died!');
            resetPet();
        }
    }
}

async function resetPet() {
    clearInterval(timerInterval);
    clearInterval(fatalStateInterval);
    clearTimeout(stateChangeTimeout);
    clearInterval(needsInterval);
    clearInterval(morphInterval);
    clearInterval(moodTimer);
    updateHighScores(aliveTime);
    aliveTime = 0;
    fatalStateTime = 0;
    hunger = 100;
    energy = 100;
    happiness = 100;
    updateNeedsBars();
    updateState('Happy');
    await morphPet();
    startIntervals();
    startMoodSystem();
}

function updateHighScores(score) {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    highScoresElement.textContent = 'Highest times: ' + highScores.join(', ') + ' seconds';
}

function updateNeeds() {
    if (!isPaused) {
        hunger = Math.max(hunger - 2, 0);
        energy = Math.max(energy - 1, 0);
        happiness = Math.max(happiness - 1, 0);
        updateNeedsBars();
        updateStateBasedOnNeeds();
    }
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

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';

    const petContainer = document.querySelector('.pet-container');
    petContainer.classList.toggle('paused', isPaused);

    if (isPaused) {
        clearInterval(timerInterval);
        clearInterval(fatalStateInterval);
        clearTimeout(stateChangeTimeout);
        clearInterval(needsInterval);
        clearInterval(morphInterval);
    } else {
        startIntervals();
    }
}

function startIntervals() {
    timerInterval = setInterval(updateTimer, 1000);
    stateChangeTimeout = setTimeout(randomStateChange, 5000);
    needsInterval = setInterval(updateNeeds, 5000);
    morphInterval = setInterval(morphPet, 60000);
}

feedBtn.addEventListener('click', feed);
danceBtn.addEventListener('click', dance);
playBtn.addEventListener('click', play);
sleepBtn.addEventListener('click', sleep);
fixBtn.addEventListener('click', fix);
pauseBtn.addEventListener('click', togglePause);

startIntervals();
morphPet();
updateNeedsBars();