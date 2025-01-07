import { Entity, GameState, Level, loadImage, loop } from "./common";

import bgMusicUrl from "./assets/sounds/Wesly Thomas - Afternoon in Rio.mp3?url";
const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;

import borderUrl from "./assets/images/level2-border.png";
const border = loadImage(borderUrl)
import border2Url from './assets/images/level2-border2.png';
const border2 = loadImage(border2Url)
import islandsUrl from "./assets/images/level2-islandsMain.png";
const islandsImage = loadImage(islandsUrl);
import islands2Url from "./assets/images/level2-islands1.png";
const islands2Image = loadImage(islands2Url)

import bgrUrl from "./assets/images/level2-bgr.png";
const bgr = loadImage(bgrUrl)

import frogUrl from './assets/gifs/frogblink.gif'
const frogImage = loadImage(frogUrl)

import trash1Url from "./assets/images/level2-trash1.png"
import trash2Url from "./assets/images/level2-trash2.png"
import trash3Url from "./assets/images/level2-trash3.png"
import trash4Url from "./assets/images/level2-trash4.png"
import trash5Url from "./assets/images/level2-trash5.png"
import trash6Url from "./assets/images/level2-trash6.png"
const trashImages = [
    trash1Url, trash2Url, trash3Url, trash4Url, trash5Url, trash6Url
].map(loadImage)


interface Level2 extends Level {
    frog: Frog,
    islands: Island[],
    trash: Trash[],
    trashCollected: number,
    keydown: (e: KeyboardEvent) => void,
}

class Frog extends Entity {
}

class Island extends Entity {
    dx: number;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    constructor(x: number, y: number, width: number, height: number, dx: number) {
        super(x, y, width, height, undefined as any as HTMLImageElement);
        this.dx = dx;
    }
}

class Trash extends Entity {
    collected: boolean;

    constructor(x: number, y: number, width: number, height: number, img: HTMLImageElement) {
        super(x, y, width, height, img);
        this.collected = false;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.collected)
            ctx.drawImage(this.sprite, this.x, this.y, 60, 60);
    }
}

export function start(gameState: GameState, startNextLevel: () => void): void {
    if (!gameState.audioMuted)
        bgMusic.play();

    const level2: Level2 = {
        ...gameState,
        startNextLevel: startNextLevel,
        frog: new Frog(800, 950, 100, 100, frogImage),
        islands: [],
        trash: [],
        paused: false,
        trashCollected: 0,
        renderFn: draw,
        updateFn: update,
        shouldContinueFn: shouldContinue,
        cleanUpFn: cleanUp,
        keydown: undefined as any as (e: KeyboardEvent) => void,
    };

    // Create islands and trash
    for (let i = 0; i < 13; i++) {
        level2.islands.push(
            new Island(i * 150 + Math.random() * 100, 200 + Math.random() * 600,
                150, 30, Math.random() > 0.5 ? 1 : -1));
        level2.trash.push(
            new Trash(i * 150 + Math.random() * 100, 200 + Math.random() * 600,
                60, 60, trashImages[i % trashImages.length]));
    }

    level2.canvas.className = 'level2';

    level2.keydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') level2.frog.y -= 50;
        if (e.key === 'ArrowDown') level2.frog.y += 50;
        if (e.key === 'ArrowLeft') level2.frog.x -= 10;
        if (e.key === 'ArrowRight') level2.frog.x += 10;
    };

    document.addEventListener('keydown', level2.keydown);

    loop(level2, 0);
}

function draw(level: Level2) {
    level.ctx.clearRect(0, 0, 1920, 1080);

    // Draw background and borders
    level.ctx.drawImage(bgr, 0, 0, 1920, 1080);
    level.ctx.drawImage(border, 0, 0, 1920, 1080);
    level.ctx.drawImage(border2, 0, 0, 1920, 1080);

    // Draw islands
    level.islands.forEach(island => island.render(level.ctx));
    // Draw trash
    level.trash.forEach(trash => trash.render(level.ctx));

    // Draw frog
    level.frog.render(level.ctx);

    // Score
    level.ctx.fillStyle = "black";
    level.ctx.font = "30px Arial";
    level.ctx.fillText(`Trash Collected: ${level.trashCollected}/13`, 20, 50);
}

function checkCollision(level: Level2, item: Entity) {
    return (
        level.frog.x < item.x + 60 &&
        level.frog.x + level.frog.width > item.x &&
        level.frog.y < item.y + 60 &&
        level.frog.y + level.frog.height > item.y
    );
}

function update(level: Level2) {
    // Move islands
    level.islands.forEach(island => {
        island.x += island.dx;
        if (island.x <= 0 || island.x + island.width >= 1920) {
            island.dx *= -1; // Reverse direction
        }
    });

    // Check if frog is on an island
    const onIsland = level.islands.some(island => {
        return (
            level.frog.y + level.frog.height === island.y &&
            level.frog.x + level.frog.width > island.x &&
            level.frog.x < island.x + island.width
        );
    });

    if (!onIsland && level.frog.y < 580) {
        resetFrog(level); // Frog fell into water
    }

    // Check for trash collection
    level.trash.forEach(item => {
        if (!item.collected && checkCollision(level, item)) {
            item.collected = true;
            level.trashCollected++;
            if ([1, 4, 9, 13].includes(level.trashCollected)) {
                level.paused = true;
                alert(`Educational message for trash piece #${level.trashCollected}`);
                level.paused = false;
            }
        }
    });
}

function resetFrog(level: Level2) {
    level.frog.x = 800;
    level.frog.y = 950;
}

function shouldContinue(level: Level2) {
    return level.trashCollected < 13;
}

function cleanUp(level: Level2) {
    document.removeEventListener('keydown', level.keydown);
    bgMusic.pause();
}