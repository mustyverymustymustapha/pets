const pet = document.getElementById('pet');
const state = document.getElementById('state');
const feedBtn = document.getElementById('feedBtn');
const danceBtn = document.getElementById('danceBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');
const fixBtn = document.getElementById('fixBtn');
const timerElement = document.getElementById('timer');

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

function updateState(newState) {
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

function morphPet() {
    pet.textContent = animals[Math.floor(Math.random() * animals.length)];
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