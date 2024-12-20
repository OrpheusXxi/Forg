const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('main-menu');
const cutscene = document.getElementById('cutscene');
const playBtn = document.getElementById('play-btn');
const muteBtn = document.getElementById('mute-btn');
const creditsBtn = document.getElementById('credits-btn');
let audioMuted = false;

muteBtn.addEventListener('click', () => {
    audioMuted = !audioMuted;
    muteBtn.textContent = audioMuted ? "Unmute" : "Mute";
});

playBtn.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    canvas.style.display = 'block';
    startLevel1(); // Load the first level
});

// Stub for credits
creditsBtn.addEventListener('click', () => alert("Created by Your Name"));

function startLevel1() {
    import('./level1.js').then((module) => module.default(ctx, startLevel2));
}

function startLevel2() {
    import('./level2.js').then((module) => module.default(ctx, startLevel3));
}

function startLevel3() {
    import('./level3.js').then((module) => module.default(ctx, showCutscene));
}

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
