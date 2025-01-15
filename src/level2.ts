import { AnimatedSprite, Entity, GameState, StaticSprite, Level, loadImage, loop, Score } from "./common";

import bgMusicUrl from "./assets/sounds/Wesly Thomas - Afternoon in Rio.mp3?url";
const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;

import borderUrl from "./assets/images/level2-border.png";
const border = loadImage(borderUrl)
import border2Url from './assets/images/level2-border2.png';
const border2 = loadImage(border2Url)

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

import frog_glitch_f1 from "./assets/gifs/frog_glitch_anim/IMG_2885.png";
import frog_glitch_f2 from "./assets/gifs/frog_glitch_anim/IMG_2888.png";
import frog_glitch_f3 from "./assets/gifs/frog_glitch_anim/IMG_2889.png";
import frog_glitch_f4 from "./assets/gifs/frog_glitch_anim/IMG_2890.png";
import frog_glitch_f5 from "./assets/gifs/frog_glitch_anim/IMG_2891.png";
import frog_glitch_f6 from "./assets/gifs/frog_glitch_anim/IMG_2892.png";

const frogGlitchImage = new AnimatedSprite([
    {img: loadImage(frog_glitch_f1), duration: 100},
    {img: loadImage(frog_glitch_f2), duration: 100},
    {img: loadImage(frog_glitch_f3), duration: 100},
    {img: loadImage(frog_glitch_f4), duration: 100},
    {img: loadImage(frog_glitch_f5), duration: 100},
    {img: loadImage(frog_glitch_f6), duration: 100},
]);

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
    island?: Island;

    constructor(x: number, y: number, width: number, height: number, trash_type: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collected = false;
        this.trash_type = trash_type;
    }

    update() {
        if (this.island) {
            // Update trash position based on island position
            this.x = this.island.x + this.island.width / 2 - this.width / 2;
            this.y = this.island.y - this.height;
        }
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
        frog: new Frog(800, 950, 150, 150),
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
    level2.glitch_video.src = "assets/videos/rivervid-0000.mp4";
    level2.glitch_video.loop = true;
    level2.trashCollected.subscribe((number) => {
        if (number === 13) {
            level2.glitch = true;
            level2.glitch_video.play();
        }
    })
    

    level2.trashCollected.subscribe((number) => {
        if (number === 1) {
            level2.showPopup("Nice job! But really be careful about the river. Due to climate change, amphibian chytrid fungus, a kind of parasitic mushroom, is causing many of the species from my family to go extinct.");
        } else if (number === 4) {
            level2.showPopup("Also, the river is poisoned by mercury in many places as it is leaked from gold mines around Amazon that are using mercury for gold purification.");
        } else if (number === 9) {
            level2.showPopup("People’s trash is not helping the situation at all, as you can see. Many South American countries, like Brazil, where I live, suffer from inequality. Therefore many people don’t have access to a proper sewage or trash system and the river is the only place where their trash goes.");
        } else if (number === 13) {
            level2.showPopup("Congratulations! You have collected all the trash. Now you can see the river in its full beauty. But remember, the river is still in danger. You can help by spreading the word about the importance of clean water and by supporting organizations that help to protect the Amazon river. Now come with me, I'll show you another part of the forest.");
         } 
    });

    level2.showPopup("Look at this! This is my home, the Amazon river and its surroundings, the Amazon rainforest! But it’s very dirty as of late. Help me collect the trash that is polluting the river. Use the arrow keys to move me around. Let's go!"); 

    // Create islands and trash
    /*for (let i = 0; i < 13; i++) {
        const randomType = Math.floor(Math.random() * islandsImages.length);
        level2.islands.push(
            new Island(i * 150 + Math.random() * 100, 200 + Math.random() * 600,
                150, 30, Math.random() > 0.5 ? 1 : -1, randomType));
        level2.trash.push(
            new Trash(i * 150 + Math.random() * 100, 200 + Math.random() * 600,
                60, 60, i % trashImages.length));
    }*/

    // Create islands and trash
for (let i = 0; i < 13; i++) {
    const randomType = Math.floor(Math.random() * islandsImages.length); // Random type for island
    const island = new Island(
        i * 150 + Math.random() * 100, // Random x-position
        200 + Math.random() * 600,    // Random y-position
        150,                          // Width
        30,                           // Height
        Math.random() > 0.5 ? 1 : -1, // Random direction
        randomType                    // Island type
    );

    level2.islands.push(island);

    // Create trash linked to this island
    const trash = new Trash(
        island.x + island.width / 2 - 30, // Center trash on the island
        island.y - 60,                   // Position trash slightly above the island
        60,                              // Width of trash
        60,                              // Height of trash
        i % trashImages.length           // Random trash type
        
    );

    // Store the linked island in the trash object
    trash.island = island;

    level2.trash.push(trash);
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
    level.ctx.fillStyle = "rgba(255, 208, 0)";
    level.ctx.font = "35px lores-12";
    level.ctx.fillText(`Trash Collected: ${level.trashCollected.get()}/13`, 1750, 50);
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
    if (!level.paused) {
    level.islands.forEach(island => {
        island.x += island.dx;
        if (island.x <= 0 || island.x + island.width >= 1920) {
            island.dx *= -1; // Reverse direction
        }
    });

    level.trash.forEach(trash => trash.update());

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
else {
    console.log("Level is paused")
}
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