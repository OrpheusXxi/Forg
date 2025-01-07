export class Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    sprite: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, sprite: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }
    render(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
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
    renderFn(level: Level): void, 
    updateFn(level: Level, dt: number): void, 
    shouldContinueFn(level: Level): boolean,
    cleanUpFn(level: Level): void,
}

export function loop<L extends Level>(level: L, dt: number) {
    if (level.shouldContinueFn(level)) {
        level.updateFn(level, dt);
        level.renderFn(level);
        requestAnimationFrame((dt) => loop(level, dt));
    } else {
        level.cleanUpFn(level);
        level.startNextLevel();
    }
}