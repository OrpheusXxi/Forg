import { AnimatedSprite, Entity, GameState, StaticSprite as StaticSprite, Level, loadImage, loop, Score, Sprite } from "./common";
import watefallUrl from './assets/gifs/level1-river.gif';
import plantsUrl from './assets/gifs/level1-plants.gif';
import treeUrl from './assets/gifs/level1-tree.gif';
import bgMusicUrl from "./assets/sounds/Joca Perpignan - No mundo da percussão.mp3?url"

const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;

//import frogStaticUrl from "./assets/gifs/frogblink.gif";
import frog_blink_anim_f1 from "./assets/gifs/frog_blink_anim/IMG_2885.png";
import frog_blink_anim_f2 from "./assets/gifs/frog_blink_anim/IMG_2886.png";

import frogLeftUrl from "./assets/gifs/frogLeft.gif";
import frogRightUrl from "./assets/gifs/frogRight.gif";
const frogStaticImage = new AnimatedSprite([
    {img: loadImage(frog_blink_anim_f1), duration: 3000},
    {img: loadImage(frog_blink_anim_f2), duration: 500},
]);
const frogLeftImage = new StaticSprite(loadImage(frogLeftUrl));
const frogRightImage = new StaticSprite(loadImage(frogRightUrl));
// new AnimatedSprite([
//     {img: loadImage(frogRightUrl), duration: 100},
//     {img: loadImage(frogStaticUrl), duration: 100},
//     {img: loadImage(frogRightUrl), duration: 100},
// ]);

import frogGlitchUrl from "./assets/gifs/frogGlitch.gif";
const frogGlitchImage = new AnimatedSprite([
    {img: loadImage(frogGlitchUrl), duration: 100},
]);

export function start(gameState: GameState, startNextLevel: () => void) {
    const level1: Level1 = {
        ...gameState,
        frog: new Frog(800, 600),
        score: new Score(),
        bugs: [],
        trash: [],
        startNextLevel: startNextLevel,
        keydown: undefined as any as (e: KeyboardEvent) => void,
        keyup: undefined as any as (e: KeyboardEvent) => void,
        treeGif: document.createElement('img'),
        waterfallGif: document.createElement('img'),
        plantsGif: document.createElement('img'),
        renderFn: draw,
        updateFn: update,
        shouldContinueFn: shouldContinue,
        cleanUpFn: cleanUp,
    };

    level1.canvas.className = 'level1';

    if (!gameState.audioMuted) bgMusic.play();

    const waterfall = loadImage(watefallUrl);
    const plants = loadImage(plantsUrl);
    const tree = loadImage(treeUrl);

    // TODO move gifs to entitites and animationsprites
    level1.treeGif.src = tree.src;
    level1.treeGif.style.position = 'absolute';
    level1.treeGif.style.left = '0px';
    level1.treeGif.style.top = '0px';
    level1.treeGif.style.width = 'auto';
    level1.treeGif.style.height = 'auto';
    document.body.appendChild(level1.treeGif);

    level1.waterfallGif.src = waterfall.src;
    level1.waterfallGif.style.position = 'absolute';
    level1.waterfallGif.style.left = '6px';
    level1.waterfallGif.style.top = '0px';
    level1.waterfallGif.style.width = 'auto';
    level1.waterfallGif.style.height = 'auto';
    level1.waterfallGif.style.zIndex = "-1";
    document.body.appendChild(level1.waterfallGif);

    level1.plantsGif.src = plants.src;
    level1.plantsGif.style.position = 'absolute';
    level1.plantsGif.style.left = '0px';
    level1.plantsGif.style.top = '8px';
    level1.plantsGif.style.width = 'auto';
    level1.plantsGif.style.height = 'auto';
    document.body.appendChild(level1.plantsGif);

    level1.keydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            level1.frog.turn('left');
            level1.frog.x = Math.max(0, level1.frog.x - 10);
            //level1.frogGif.src = level1.frogLeft.src;
        }
        if (e.key === 'ArrowRight') {
            level1.frog.turn('right');
            level1.frog.x = Math.min(1820, level1.frog.x + 10);
            //frogGif.src = frogRight.src;
        }
        // console.log(`GIF Source: ${frogGif.src}`);
        //frogGif.style.left = `${frog.x}px`;
    }
    level1.keyup = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            level1.frog.turn('static');
        }
    };
    document.addEventListener('keydown', level1.keydown);
    document.addEventListener('keyup', level1.keyup);


    level1.score.subscribe((score) => {
        if (score === 5) {
            level1.showPopup("Yum! The insects I just ate are mostly very toxic, that’s where I got my coloring from a long, long time ago. Oh and also many species of frogs from my family, Dendrobatidae, are highly toxic themselves because of their diet.");
        } else if (score === 10) {
            level1.showPopup("The chemicals that me and my fellow frogs produce are called alkaloids and they are secreted from my skin. These alkaloids can be used as muscle relaxants, heart stimulants, appetite suppressants and they can also kill people!");
        } else if (score === 15) {
            level1.showPopup("I am called a Poison dart frog because the aboriginal South Americans used my toxins to poison the tips of their darts. It made hunting prey a lot easier.");
        } else if (score === 20) {
            level1.showPopup("I look cute and welcoming, however I am quite the beast. Both males and females in our family fight for the attention of the other sex. And even after mating, the females try to scare away other females from their mate, as they want him to only look after their own children.");
        } else if (score === 25) {
            level1.showPopup("But I was a beast as a small tadpole as well. In order to grow big and live longer than the usual one to three years, I had to eat my siblings. Well, not all of them… But they tasted pretty good!");
        }
    });

    setInterval(() => spawnItem(level1), 1000);

    // start game loop
    loop(level1, 0);
}

const frogSprites: Map<Direction, Sprite> = new Map([
    ["static", frogStaticImage as Sprite], // typechecking workaround
    ["left", frogLeftImage],
    ["right", frogRightImage],
    //["glitch", new AnimatedSprite([])],
]);
type Direction = "static" | "left" | "right"// | "glitch";
class Frog implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    direction: Direction;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 300;
        this.height = 300;  
        this.direction = "static";
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        frogSprites.get(this.direction)?.render(ctx, dt, this.x, this.y, this.width, this.height);
    }
    turn(direction: Direction) {
        this.direction = direction;
    }
}

import bug1Url from "./assets/images/level1-bug1.png";
import bug2Url from "./assets/images/level1-bug2.png";
import bug3Url from "./assets/images/level1-bug3.png";

const bug_types = {
    bug1: new StaticSprite(loadImage(bug1Url)),
    bug2: new StaticSprite(loadImage(bug2Url)),
    bug3: new StaticSprite(loadImage(bug3Url)),
}

type BugType = keyof typeof bug_types;
class Bug implements Entity {
    type: BugType;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(type: BugType, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 75;
        this.height = 75;
        this.type = type;
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        bug_types[this.type].render(ctx, dt, this.x, this.y, this.width, this.height);
    }
}

import trashUrl from "./assets/images/shit-main.png";
const trashImage = new StaticSprite(loadImage(trashUrl));
class Trash implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 75;
        this.height = 75;
    }

    render(ctx: CanvasRenderingContext2D, dt: number): void {
        trashImage.render(ctx, dt, this.x, this.y, this.width, this.height)
    }
}

interface Level1 extends Level {
    frog: Frog,
    score: Score,
    bugs: Bug[],
    trash: Trash[],
    keydown: (e: KeyboardEvent) => void,
    keyup: (e: KeyboardEvent) => void,

    treeGif: HTMLImageElement,
    waterfallGif: HTMLImageElement,
    plantsGif: HTMLImageElement,
}

function cleanUp(level: Level1) {
    //frogGif.remove();
    level.treeGif.remove();
    level.waterfallGif.remove();
    level.plantsGif.remove();

    document.removeEventListener('keydown', level.keydown);
    document.removeEventListener('keyup', level.keyup);
}


function draw(level: Level1, dt: number) {
    level.ctx.clearRect(0, 0, 1920, 1080);

    // // Background layers
    // level.ctx.drawImage(level.waterfallGif, 0, 0, 1920, 1080);
    // level.ctx.drawImage(level.plantsGif, 0, 0, 1920, 1080);
    // level.ctx.drawImage(level.treeGif, 0, 0, 1920, 1080);

    level.bugs.forEach(b => b.render(level.ctx, dt));
    level.trash.forEach(t => t.render(level.ctx, dt));
    level.frog.render(level.ctx, dt);

    // Score
    level.ctx.fillStyle = "black";
    level.ctx.font = "30px lores-12";
    level.ctx.fillText(`Score: ${level.score.get()}`, 20, 50);
}

function spawnItem(level: Level1) {
    const itemX = Math.random() * 1720 + 50;
    if (Math.random() > 0.5) {
        const type = Object.entries(bug_types)[Math.floor(Math.random() * 3)][0];
        level.bugs.push(new Bug(type as BugType, itemX, 0));
    } else {
        level.trash.push(new Trash(itemX, 0));
    }
}

function checkCollision(level: Level1, item: Entity) {
    return (
        level.frog.x < item.x + 75 &&
        level.frog.x + level.frog.width > item.x &&
        level.frog.y < item.y + 75 &&
        level.frog.y + level.frog.height > item.y
    );
}

function update(level: Level1) {
    level.bugs.forEach(bug => bug.y += 3);
    level.trash.forEach(trash => trash.y += 3);

    level.bugs.forEach((bug, index) => {
        if (checkCollision(level, bug)) {
            level.score.increment()
            level.bugs.splice(index, 1);
        }
    });
    level.trash.forEach((trash, index) => {
        if (checkCollision(level, trash)) {
            level.score.decrement()
            level.trash.splice(index, 1);
        }
    });

    // Remove items that fall off-screen
    level.bugs = level.bugs.filter(bug => bug.y < 1080);
    level.trash = level.trash.filter(item => item.y < 1080);
}

function shouldContinue(level: Level1): boolean {
    if (level.score.get() >= 30) {
        level.showPopup("Thanks for the help, human. I am full and I would like to dip my feet in some water.");
        return false;
    }

    return true;
}