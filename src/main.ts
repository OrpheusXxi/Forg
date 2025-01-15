import { GameState } from './common';
import {start as level1Start} from './level1';
import {start as level2Start} from './level2';
import {start as level3Start} from './level3';

const levels = [
    level1Start,
    level2Start,
    level3Start,
];

const canvas: HTMLCanvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const mainMenu = document.getElementById('main-menu') as HTMLDivElement;
const cutscene = document.getElementById('cutscene') as HTMLVideoElement;
cutscene.style.position = 'absolute';
cutscene.style.top = '0';
cutscene.style.left = '0';
cutscene.style.width = '100%';
cutscene.style.height = '100%';
cutscene.style.zIndex = '1000';
const playBtn = document.getElementById('play-btn');
const muteBtn = document.getElementById('mute-btn');
const creditsBtn = document.getElementById('credits-btn');

const gameState: GameState = {
    canvas,
    ctx,
    mainMenu,
    audioMuted: false,
    paused: false,
    showPopup: showPopup,
};


muteBtn!.addEventListener('click', () => {
    gameState.audioMuted = !gameState.audioMuted;
    muteBtn!.textContent = gameState.audioMuted ? 'Unmute' : 'Mute';
});

playBtn!.addEventListener('click', () => {
    mainMenu!.style.display = 'none';
    canvas.style.display = 'block';

    startNextLevel(); // Load the first level
});

// Stub for credits
creditsBtn!.addEventListener('click', () => showPopup("Created by Vik Kovbasjuk, 2025 with the support of VOŠ Václava Hollara"));


function showCutscene() {
    canvas.style.display = 'none';
    cutscene.style.display = 'block';
    cutscene.play();
    cutscene.onended = () => {
        cutscene.style.display = 'none';
        mainMenu.style.display = 'flex';
    };
    cutscene.onerror = () => {
        console.error("Error loading video. Please check the video format and path.");
        cutscene.style.display = 'none';
        mainMenu.style.display = 'flex';
    };
}

function startNextLevel() {
    const currentLevelStartMethod = levels.shift();
    if (currentLevelStartMethod) 
        currentLevelStartMethod(gameState, startNextLevel);
    else
        showCutscene();
}

function showPopup(message: string): void {
    const popup = document.createElement('div');
    popup.className = 'popup';
    

    const popupMessage = document.createElement('p');
    popupMessage.textContent = message;
    popup.appendChild(popupMessage);

    const resumeButton = document.createElement('button');
    resumeButton.className = 'resumeButton';
    resumeButton.textContent = 'Resume';
    resumeButton.addEventListener('click', () => {
        popup.style.display = 'none';
        gameState.paused = false;
    });
    popup.appendChild(resumeButton);

    document.body.appendChild(popup);

    gameState.paused = true;
    popup.style.display = 'block';
}