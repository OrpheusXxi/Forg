import { Entity, GameState, StaticSprite, Level, loadImage, loop, Score } from "./common";

import bgMusicUrl from "./assets/sounds/Wesly Thomas - Afternoon in Rio.mp3?url";
const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;

import borderUrl from "./assets/images/level2-border.png";
const border = loadImage(borderUrl)
import border2Url from './assets/images/level2-border2.png';
const border2 = loadImage(border2Url)
/*import islandsUrl from "./assets/images/level2-islandsMain.png";
const islandsImage = loadImage(islandsUrl);
import islands2Url from "./assets/images/level2-islands1.png";
const islands2Image = loadImage(islands2Url)*/

import bgrUrl from "./assets/images/level2-bgr.png";
const bgr = loadImage(bgrUrl)

import frogUrl from './assets/gifs/frogblink.gif'
const frogImage = new StaticSprite(loadImage(frogUrl))

import trash1Url from "./assets/images/level2-trash1.png"
import trash2Url from "./assets/images/level2-trash2.png"
import trash3Url from "./assets/images/level2-trash3.png"
import trash4Url from "./assets/images/level2-trash4.png"
import trash5Url from "./assets/images/level2-trash5.png"
import trash6Url from "./assets/images/level2-trash6.png"
const trashImages = [
    trash1Url, trash2Url, trash3Url, trash4Url, trash5Url, trash6Url
].map(loadImage).map(img => new StaticSprite(img));

import islandUrl1 from "./assets/images/IMG_2872.png";
import islandUrl2 from "./assets/images/IMG_2873.png";
import islandUrl3 from "./assets/images/IMG_2874.png";
import islandUrl4 from "./assets/images/IMG_2875.png";
import islandUrl5 from "./assets/images/IMG_2876.png";
import islandUrl6 from "./assets/images/IMG_2877.png";
import islandUrl7 from "./assets/images/IMG_2878.png";
import islandUrl8 from "./assets/images/IMG_2879.png";
import islandUrl9 from "./assets/images/IMG_2882.png";
import islandUrl10 from "./assets/images/IMG_2883.png";
import islandUrl11 from "./assets/images/IMG_2884.png";
const islandsImages = [
    islandUrl1, islandUrl2, islandUrl3, islandUrl4, islandUrl5, islandUrl6, islandUrl7, islandUrl8, islandUrl9, islandUrl10, islandUrl11,
].map(loadImage).map(img => new StaticSprite(img));


enum KeyState {
    Up,
    Pressed,
    Down,
    NotPressed
}

interface Level2 extends Level {
    frog: Frog,
    islands: Island[],
    trash: Trash[],
    trashCollected: Score,
    keydown: (e: KeyboardEvent) => void,
    keyup: (e: KeyboardEvent) => void,
    glitch_video: HTMLVideoElement,
    glitch: boolean,
    keyPressed: Map<"ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight", KeyState>,
}

class Frog implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    dy: number = 0;
    gravity: number = 0.2;
    x_speed: number = 0.5;
    y_speed: number = 3;
    is_on_island: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isFrogOnIsland(frog: Frog, islands: Island[]): boolean {
        return islands.some(island => {
            const collision = (
                (frog.y + frog.height) - island.y < 0.001 &&
                frog.x + frog.width > island.x &&
                frog.x < island.x + island.width
            );
            return collision;
        });
    }

    update(level: Level2, dt: number) {
        const colliding_island = level.islands.find(island => {
            const collision = (
                (this.y + this.height) >= island.y &&
                (this.y + this.height) <= (island.y + island.height) &&
                this.x + this.width > island.x &&
                this.x < island.x + island.width
            );
            return collision;
        });

        if (colliding_island !== undefined) {
            this.dy = 0;
            this.y = colliding_island.y - this.height;
            this.is_on_island = true;
        } else if (level.frog.y + level.frog.height >= 1080) {
            this.dy = 0;
            this.y = 1080 - this.height;
            this.is_on_island = true;
        } else {
            this.is_on_island = false; 
        }
        // level2.frog.y -= 50;
        // level2.frog.y += 50;
        // level2.frog.x -= 10;
        // level2.frog.x += 10;

        if (level.keyPressed.get("ArrowUp") === KeyState.Down && this.is_on_island) {
            console.log("jumping");
            this.dy = -this.y_speed * dt;
        }
        if (level.keyPressed.get("ArrowLeft") === KeyState.Pressed) {
            this.x += -this.x_speed * dt;
        }
        if (level.keyPressed.get("ArrowRight") === KeyState.Pressed) {
            this.x += this.x_speed * dt;
        }
        if (!this.is_on_island) {
            this.dy += this.gravity * dt;
        }
        
        this.y += this.dy;
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        frogImage.render(ctx, dt, this.x, this.y, this.width, this.height);
    }

}

class Island implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;    
    dx: number;
    type: number;

    constructor(x: number, y: number, width: number, height: number, dx: number, type: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.type = type;
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        const sprite = islandsImages[this.type];
        if (sprite) {
            sprite.render(ctx, dt, this.x, this.y, this.width, this.height); // Render the image
        } else {
            console.error(`Island sprite not found for type: ${this.type}`);
        }
    }
}

class Trash implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    collected: boolean;
    trash_type: number;

    constructor(x: number, y: number, width: number, height: number, trash_type: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collected = false;
        this.trash_type = trash_type;
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        if (!this.collected)
            trashImages[this.trash_type].render(ctx, dt, this.x, this.y, this.width, this.height);
    }
}

export function start(gameState: GameState, startNextLevel: () => void): void {
    if (!gameState.audioMuted) bgMusic.play();

    const level2: Level2 = {
        ...gameState,
        startNextLevel: startNextLevel,
        frog: new Frog(800, 950, 100, 100),
        islands: [],
        trash: [],
        paused: false,
        trashCollected: new Score(),
        renderFn: draw,
        updateFn: update,
        shouldContinueFn: shouldContinue,
        cleanUpFn: cleanUp,
        keydown: undefined as any as (e: KeyboardEvent) => void,
        keyup: undefined as any as (e: KeyboardEvent) => void,
        glitch_video: document.createElement('video'),
        glitch: false,
        keyPressed: new Map([["ArrowUp", KeyState.NotPressed], ["ArrowDown", KeyState.NotPressed], ["ArrowLeft", KeyState.NotPressed], ["ArrowRight", KeyState.NotPressed]]),
    };
    level2.glitch_video.src = "assets/gifs/rivervid-0000.avi";
    level2.glitch_video.loop = true;
    level2.trashCollected.subscribe((number) => {
        if (number === 13) {
            level2.glitch = true;
            level2.glitch_video.play();
        }
    })
    

    // TODO move this into a score subscriber
    // alá level1:117-129
    // if ([1, 4, 9, 13].includes(level.trashCollected.get())) {
    //     level.paused = true;
    //     level.showPopup(`Educational message for trash piece #${level.trashCollected}`);
    //     level.paused = false;
    // }

    level2.trashCollected.subscribe((number) => {
        if (number === 1) {
            level2.showPopup("Yum! The insects I just ate are mostly very toxic, that’s where I got my coloring from a long, long time ago. Oh and also many species of frogs from my family, Dendrobatidae, are highly toxic themselves because of their diet.");
        } else if (number === 4) {
            level2.showPopup("The chemicals that me and my fellow frogs produce are called alkaloids and they are secreted from my skin. These alkaloids can be used as muscle relaxants, heart stimulants, appetite suppressants and they can also kill people!");
    }});

    // Create islands and trash
    for (let i = 0; i < 13; i++) {
        const randomType = Math.floor(Math.random() * islandsImages.length);
        level2.islands.push(
            new Island(i * 150 + Math.random() * 100, 200 + Math.random() * 600,
                150, 30, Math.random() > 0.5 ? 1 : -1, randomType));
        level2.trash.push(
            new Trash(i * 150 + Math.random() * 100, 200 + Math.random() * 600,
                60, 60, i % trashImages.length));
    }

    console.log(level2.islands)

    level2.canvas.className = 'level2';

    level2.keydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') level2.keyPressed.set("ArrowUp", KeyState.Down);
        if (e.key === 'ArrowDown') level2.keyPressed.set("ArrowDown", KeyState.Down);
        if (e.key === 'ArrowLeft') level2.keyPressed.set("ArrowLeft", KeyState.Down);
        if (e.key === 'ArrowRight') level2.keyPressed.set("ArrowRight", KeyState.Down);
    };
    document.addEventListener('keydown', level2.keydown);
    level2.keyup = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') level2.keyPressed.set("ArrowUp", KeyState.Up);
        if (e.key === 'ArrowDown') level2.keyPressed.set("ArrowDown", KeyState.Up);
        if (e.key === 'ArrowLeft') level2.keyPressed.set("ArrowLeft", KeyState.Up);
        if (e.key === 'ArrowRight') level2.keyPressed.set("ArrowRight", KeyState.Up);
    }
    document.addEventListener('keyup', level2.keyup);

    loop(level2, 0);
}

function draw(level: Level2, dt: number) {
    //level.ctx.clearRect(0, 0, 1920, 1080);

    if (level.glitch)
        level.ctx.drawImage(level.glitch_video, 0, 0, 1920, 1080);
    else {
        // Draw background and borders
        level.ctx.drawImage(bgr, 0, 0, 1920, 1080);
    }

    // Draw islands
    level.islands.forEach(island => island.render(level.ctx, dt));
    // Draw trash
    level.trash.forEach(trash => trash.render(level.ctx, dt));

    // Draw frog
    level.frog.render(level.ctx, dt);

    // Score
    level.ctx.fillStyle = "black";
    level.ctx.font = "30px Arial";
    level.ctx.fillText(`Trash Collected: ${level.trashCollected.get()}/13`, 20, 50);
}

function checkCollision(level: Level2, item: Entity) {
    return (
        level.frog.x < item.x + 60 &&
        level.frog.x + level.frog.width > item.x &&
        level.frog.y < item.y + 60 &&
        level.frog.y + level.frog.height > item.y
    );
}

function update(level: Level2, dt: number) {
    level.frog.update(level, dt);

    // Move islands
    level.islands.forEach(island => {
        island.x += island.dx;
        if (island.x <= 0 || island.x + island.width >= 1920) {
            island.dx *= -1; // Reverse direction
        }
    });

    // Check for trash collection
    level.trash.forEach(item => {
        if (!item.collected && checkCollision(level, item)) {
            item.collected = true;
            level.trashCollected.increment();
        }
    });

    level.keyPressed.forEach((value, key) => {
        if (value === KeyState.Down) {
            level.keyPressed.set(key, KeyState.Pressed);
        } else if (value === KeyState.Up) {
            level.keyPressed.set(key, KeyState.NotPressed);
        }
    })
}

function resetFrog(level: Level2) {
    level.frog.x = 800;
    level.frog.y = 950;
}

function shouldContinue(level: Level2) {
    return level.trashCollected.get() < 13;
}

function cleanUp(level: Level2) {
    document.removeEventListener('keydown', level.keydown);
    document.removeEventListener('keyup', level.keyup);
    bgMusic.pause();
}