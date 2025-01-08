export interface AnimationFrame {
    img: HTMLImageElement;
    duration: number;
}

export interface Sprite {
    render(ctx: CanvasRenderingContext2D, dt: number, x: number, y: number, width: number, height: number): void;
}

export class ImageSprite implements Sprite {
    img: HTMLImageElement;

    constructor(img: HTMLImageElement) {
        this.img = img;
    }

    render(ctx: CanvasRenderingContext2D, dt: number, x: number, y: number, width: number, height: number) {
        ctx.drawImage(this.img, x, y, width, height);
    }
}

export class AnimatedSprite implements Sprite {
    frames: AnimationFrame[];
    currentFrame: number;


    constructor(frames: AnimationFrame[]) {
        this.frames = frames;
        this.currentFrame = 0;
    }

    // render function that depending on the time passed renders the correct frame
    // according to the duration
    render(ctx: CanvasRenderingContext2D, dt: number, x: number, y: number, width: number, height: number) {
        const frame = this.frames[this.currentFrame];
        ctx.drawImage(frame.img, x, y, width, height);
        frame.duration -= dt;
        if (frame.duration <= 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.frames[this.currentFrame].duration = frame.duration;
        }
    }
}

export interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;

    render(ctx: CanvasRenderingContext2D, dt: number): void;
}

export function loadImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
}

export interface GameState {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    mainMenu: HTMLDivElement,
    audioMuted: boolean,
    paused: boolean,
    showPopup: (message: string) => void,
}

export interface Level extends GameState {
    startNextLevel(): void,
    renderFn(level: Level, dt: number): void, 
    updateFn(level: Level, dt: number): void, 
    shouldContinueFn(level: Level): boolean,
    cleanUpFn(level: Level): void,
}

let last_frame: number = -1;
export function loop<L extends Level>(level: L, timestamp: number) {
    let dt = last_frame > 0 ? timestamp - last_frame : 0;
    last_frame = timestamp;

    if (level.shouldContinueFn(level)) {
        level.updateFn(level, dt);
        level.renderFn(level, dt);
        requestAnimationFrame((dt) => loop(level, dt));
    } else {
        level.cleanUpFn(level);
        level.startNextLevel();
    }
}

// Simple score class that 
// increases score but can 
// be subscribed to for updates
// Avoids duplicate reports of the 
// score change
export class Score {
    value: number
    subscribers: ((value: number) => void)[]

    constructor() {
        this.value = 0
        this.subscribers = []
    }

    subscribe(fn: (value: number) => void) {
        this.subscribers.push(fn)
    }

    increment() {
        this.value += 1
        this.subscribers.forEach(fn => fn(this.value))
    }

    decrement() {
        this.value -= 1
        // do not notify subscribers when score is decreased
        // this.subscribers.forEach(fn => fn(this.value))
    }

    get() {
        return this.value
    }
}