import type { GameState } from './gameState.js';
import {start as level1Start} from './level1.js';

const levels: ((gameState: GameState, startNextLevel: () => void)=>void)[] = [level1Start];

const canvas: HTMLCanvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const mainMenu = document.getElementById('main-menu') as HTMLDivElement;
const cutscene = document.getElementById('cutscene') as HTMLVideoElement;
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
    muteBtn!.textContent = gameState.audioMuted ? "Unmute" : "Mute";
});

playBtn!.addEventListener('click', () => {
    mainMenu!.style.display = 'none';
    canvas.style.display = 'block';

    startNextLevel(); // Load the first level
});

// Stub for credits
creditsBtn!.addEventListener('click', () => alert("Created by Your Name"));


function showCutscene() {
    canvas.style.display = 'none';
    cutscene.style.display = 'block';
    cutscene.src = "./assets/videos/Untitled_Artwork.mp4";
    cutscene.play();
    cutscene.onended = () => {
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
    // TODO
}