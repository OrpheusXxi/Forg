import { Entity, GameState, StaticSprite, Level, loadImage, loop, AnimatedSprite } from "./common";

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

/*import trees_f1 from './assets/gifs/trees3_anim/Layer 1.png';
import trees_f2 from './assets/gifs/trees3_anim/Layer 5.png';
import trees_f3 from './assets/gifs/trees3_anim/Layer 9.png';
import trees_f4 from './assets/gifs/trees3_anim/Layer 13.png';

const treesImage = new AnimatedSprite([
    {img: loadImage(trees_f1), duration: 1000},
    {img: loadImage(trees_f2), duration: 1000},
    {img: loadImage(trees_f3), duration: 1000},
    {img: loadImage(trees_f4), duration: 1000},
])*/

const flowerImages = [ loadImage(flower1Url), loadImage(flower2Url), loadImage(flower3Url), loadImage(flower4Url), loadImage(flower5Url), loadImage(flower6Url), loadImage(flower7Url), loadImage(flower8Url), loadImage(flower9Url), loadImage(flower10Url), loadImage(flower11Url), loadImage(flower12Url), loadImage(flower13Url), loadImage(flower14Url), loadImage(flower15Url), loadImage(flower16Url), loadImage(flower17Url), loadImage(flower18Url) ].map(img => new StaticSprite(img));
const plainboxImage = loadImage(plainboxUrl);
const acorn1Image = new StaticSprite (loadImage(acorn1Url));
const frogImage = loadImage(frogUrl);
const frogglitchImage = loadImage(frogglitchUrl);
const treesImage = loadImage(treesUrl);
const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;

interface Level3 extends Level {

    cards: Card[],
    firstCard: number | null,
    secondCard: number | null,
    matchedPairs: number,
    timer: number,
    interval: number,
    click: (e: MouseEvent) => void,
}

class Card implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    revealed: boolean;
    matched: boolean;
    value: number;
    index: number;

    constructor(x: number, y: number, width: number, height: number, value: number, index: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.revealed = false;
        this.matched = false;
        this.value = value;
        this.index = index;
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        if (this.revealed || this.matched) {
            flowerImages[this.value % flowerImages.length].render(ctx, dt, this.x, this.y, 90, 90);
        } else {
            acorn1Image.render(ctx, dt, this.x, this.y, 190, 190);
        }
    }
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = array.slice();
    for (let iters = 0; iters < 100; iters++) {
       for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
    }
    return shuffled;
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

    /*const treesGif = document.createElement('img');
    treesGif.src = treesImage.src;
    treesGif.style.position = 'absolute';
    treesGif.style.left = '0px';
    treesGif.style.top = '0px';
    treesGif.style.width = 'auto';
    treesGif.style.height = 'auto';
    document.body.appendChild(treesGif);*/

    // Initialize cards
    let allCards = new Array(36).fill(0).map((_, i) => i % 18);
    allCards = shuffleArray(allCards);
    console.log(allCards);

    allCards.forEach((value, i) => {
        level3.cards.push(
            new Card((i % 6) * 110 + 591, Math.floor(i / 6) * 110 + 169, 190, 190, value, i));
    });

    level3.click = (e: MouseEvent) => {
        const rect = level3.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleClick(level3, x, y);
    };
    level3.canvas.addEventListener('click', level3.click);

    loop(level3, 0);
}

function draw(level: Level3, dt: number) {
    // Draw the level
    level.ctx.clearRect(0, 0, 1920, 1080);
    level.ctx.drawImage(treesImage, 0, 0, 1920, 1080);
    level.ctx.drawImage(plainboxImage, 591, 169, 740, 740);

    level.cards.forEach(card => card.render(level.ctx, dt));

    level.ctx.fillStyle = "black";
    level.ctx.font = "30px lores-12";
    level.ctx.fillText(`Time: ${level.timer}s`, 20, 50);
    level.ctx.fillText(`Matches: ${level.matchedPairs}/18`, 20, 100);
}

function update(level: Level3, dt: number) {
    // Update the level
    if (level.timer <= 0) {
        clearInterval(level.interval);
        resetLevel(level);
    }

    level.interval -= dt;
    if (level.interval <= 0) {
        level.timer--;
        level.interval = 1000;
    }
}


function resetLevel(level: Level3) { 
    level.timer = 120; // Reset timer
    level.cards.forEach(card => {
        card.revealed = false;
        card.matched = false;
    });
    level.matchedPairs = 0;
    level.firstCard = null;
    level.secondCard = null;
    level.shouldContinueFn = () => true;
    level.showPopup("Time's up! Restarting level.");
}

function cleanUp(level: Level3) {
    // Clean up the level
    //frogGif.remove();
    //treesGif.remove();
    bgMusic.pause();
    level.canvas.removeEventListener('click', level.click);
}

function handleClick(level: Level3, x: number, y: number) {
    console.log("Clicked!", x, y, level.firstCard, level.secondCard);
    if (level.firstCard && level.secondCard) {
        level.cards[level.firstCard].revealed = false;
        level.cards[level.secondCard].revealed = false;
        level.firstCard = null;
        level.secondCard = null;
    }

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
        level.firstCard = clickedCard.index;
    } else {
        level.secondCard = clickedCard.index;
        checkMatch(level);
    }
}

function checkMatch(level: Level3) {
    if (level.firstCard && level.secondCard &&
        level.cards[level.firstCard].value === level.cards[level.secondCard].value) {

        level.cards[level.firstCard].matched = true;
        level.cards[level.secondCard].matched = true;
        level.matchedPairs++;

        if (level.matchedPairs === 1) {
            level.showPopup("Great! You found your first match!");
        }


        if (level.matchedPairs >= 18) {
            level.shouldContinueFn = () => false;
            level.showPopup("Level completed!");
            level.ctx.drawImage(frogglitchImage, 800, 400, 300, 300);
        }

        level.showPopup("Welcome to the jungle! Oh wait, where are all the trees and other plants? Let's fix that by repopulating the forest with beautiful plants again. Click on the acorns to reveal the flowers and match them. You have 120 seconds to complete the level. Good luck!");
       }
}
    
    // const frogGif = document.createElement('img');
    //  frogGif.src = frogImage.src;
    //  frogGif.style.position = 'absolute';
    //  frogGif.style.left = `${frog.x}px`;
    //  frogGif.style.top = `${frog.y}px`;
    //  frogGif.style.width = `${frog.width}px`;
    //  frogGif.style.height = `${frog.height}px`;
    //  document.body.appendChild(frogGif);
