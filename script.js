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