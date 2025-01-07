import { Entity, GameState, Level, loadImage, loop } from "./common";

// flowerImages: HTMLImageElement[],
// plainboxImage: HTMLImageElement,
// acornImage: HTMLImageElement,
// frogImage: HTMLImageElement,
// frogglitchImage: HTMLImageElement,
// treesImage: HTMLImageElement,
// bgMusic: HTMLAudioElement,

import flower1Url from './assets/images/level3_flower1.png';
import flower2Url from './assets/images/level3_flower2.png';
import flower3Url from './assets/images/level3_flower3.png';
import flower4Url from './assets/images/level3_flower4.png';
import flower5Url from './assets/images/level3_flower5.png';
import flower6Url from './assets/images/level3_flower6.png';
import flower7Url from './assets/images/level3_flower7.png';
import flower8Url from './assets/images/level3_flower8.png';
import flower9Url from './assets/images/level3_flower9.png';
import flower10Url from './assets/images/level3_flower10.png';
import flower11Url from './assets/images/level3_flower11.png';
import flower12Url from './assets/images/level3_flower12.png';
import flower13Url from './assets/images/level3_flower13.png';
import flower14Url from './assets/images/level3_flower14.png';
import flower15Url from './assets/images/level3_flower15.png';
import flower16Url from './assets/images/level3_flower16.png';
import flower17Url from './assets/images/level3_flower17.png';
import flower18Url from './assets/images/level3_flower18.png';
import plainboxUrl from './assets/images/level3_plainbox.png';
import acorn1Url from './assets/images/level3_acorn1.png';
import frogUrl from './assets/gifs/frogblink.gif';
import frogglitchUrl from './assets/gifs/frogglitch.gif';
import treesUrl from './assets/gifs/level3-trees.gif';
import bgMusicUrl from './assets/sounds/Le Marigold - Aaraam.mp3?url';  

const flowerImages = [ loadImage(flower1Url), loadImage(flower2Url), loadImage(flower3Url), loadImage(flower4Url), loadImage(flower5Url), loadImage(flower6Url), loadImage(flower7Url), loadImage(flower8Url), loadImage(flower9Url), loadImage(flower10Url), loadImage(flower11Url), loadImage(flower12Url), loadImage(flower13Url), loadImage(flower14Url), loadImage(flower15Url), loadImage(flower16Url), loadImage(flower17Url), loadImage(flower18Url) ];
const plainboxImage = loadImage(plainboxUrl);
const acorn1Image = loadImage(acorn1Url);
const frogImage = loadImage(frogUrl);
const frogglitchImage = loadImage(frogglitchUrl);
const treesImage = loadImage(treesUrl);
const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;

interface Level3 extends Level {

    cards: Card[],
    firstCard: Card | null,
    secondCard: Card | null,
    matchedPairs: number,
    timer: number,
    interval: number,
    click: (e: MouseEvent) => void,
}

class Card extends Entity {
    revealed: boolean;
    matched: boolean;
    backSprite: HTMLImageElement;
    value: number;

    constructor(x: number, y: number, width: number, height: number, sprite: HTMLImageElement, backSprite: HTMLImageElement, value: number) {
        super(x, y, width, height, sprite);
        this.revealed = false;
        this.matched = false;
        this.backSprite = backSprite;
        this.value = value;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.revealed || this.matched) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);            
        } else {
            ctx.drawImage(this.backSprite, this.x, this.y, this.width, this.height);
        }
    }
}

export function start(gameState: GameState, startNextLevel: () => void) {
    const level3: Level3 = {
        ...gameState,
        startNextLevel: startNextLevel,
        renderFn: draw,
        updateFn: update,
        cleanUpFn: cleanUp,
        cards: [],
        firstCard: null,
        secondCard: null,
        matchedPairs: 0,
        timer: 120,
        interval: 1000,
        shouldContinueFn: () => true,
        click: undefined as any as (e: MouseEvent) => void,
    }    
    level3.canvas.className = 'level3';

    if (!level3.audioMuted) bgMusic.play();

    // Initialize cards
    const allCards = [...flowerImages, ...flowerImages];
    allCards.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 36; i++) {
        level3.cards.push(
            new Card((i % 6) * 300 + 100, Math.floor(i / 6) * 300 + 50, 200, 200, allCards[i] || flowerImages[0], plainboxImage, i));
    }

    level3.click = (e: MouseEvent) => {
        const rect = level3.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleClick(level3, x, y);
    };
    level3.canvas.addEventListener('click', level3.click);

    loop(level3, 0);
}

function draw(level: Level3) {
    // Draw the level
    level.ctx.clearRect(0, 0, 1920, 1080);
    level.ctx.drawImage(treesImage, 0, 0, 1920, 1080);

    level.cards.forEach(card => card.render(level.ctx));

    level.ctx.fillStyle = "black";
    level.ctx.font = "30px Arial";
    level.ctx.fillText(`Time: ${level.timer}s`, 20, 50);
    level.ctx.fillText(`Matches: ${level.matchedPairs}/13`, 20, 100);
}

function update(level: Level3, dt: number) {
    // Update the level
    if (level.timer <= 0) {
        clearInterval(level.interval);
        alert("Time's up! Restarting level.");

        // restart the level by the basic mechanism
        // of overriding the startNextLevel function
        const nextLevel = level.startNextLevel;
        level.startNextLevel = () => start(level, nextLevel);
        level.shouldContinueFn = () => false;
    }

    level.interval -= dt;
    if (level.interval <= 0) {
        level.timer--;
        level.interval = 1000;
    }
}

function cleanUp(level: Level3) {
    // Clean up the level
    //frogGif.remove();
    //treesGif.remove();
    bgMusic.pause();
    level.canvas.removeEventListener('click', level.click);
}

function handleClick(level: Level3, x: number, y: number) {
    if (level.firstCard && level.secondCard) return;

    const clickedCard = level.cards.find(card => {
        return (
            x > card.x &&
            x < card.x + card.width &&
            y > card.y &&
            y < card.y + card.height
        );
    });

    if (!clickedCard || clickedCard.revealed || clickedCard.matched) return;

    clickedCard.revealed = true;

    if (!level.firstCard) {
        level.firstCard = clickedCard;
    } else {
        level.secondCard = clickedCard;
        checkMatch(level);
    }
}

function checkMatch(level: Level3) {
    if (level.firstCard && level.secondCard &&
        level.firstCard.value === level.secondCard.value) {

        level.firstCard.matched = true;
        level.secondCard.matched = true;
        level.matchedPairs++;

        if (level.matchedPairs >= 18) {
            level.shouldContinueFn = () => false;
            alert("Level completed!");
            level.ctx.drawImage(frogglitchImage, 800, 400, 300, 300);
        }
    } else if (level.firstCard && level.secondCard) {
        level.firstCard.revealed = false;
        level.secondCard.revealed = false;
    }
    level.firstCard = null;
    level.secondCard = null;
}


    
    // const frogGif = document.createElement('img');
    //  frogGif.src = frogImage.src;
    //  frogGif.style.position = 'absolute';
    //  frogGif.style.left = `${frog.x}px`;
    //  frogGif.style.top = `${frog.y}px`;
    //  frogGif.style.width = `${frog.width}px`;
    //  frogGif.style.height = `${frog.height}px`;
    //  document.body.appendChild(frogGif);

    // const treesGif = document.createElement('img');
    //  treesGif.src = trees.src;
    //  treesGif.style.position = 'absolute';
    //  treesGif.style.left = '0px';
    //  treesGif.style.top = '0px';
    //  treesGif.style.width = 'auto';
    //  treesGif.style.height = 'auto';
    //  document.body.appendChild(treesGif);