export interface GameState {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    mainMenu: HTMLDivElement,
    audioMuted: boolean,
    paused: boolean,
    showPopup: (message: string) => void,
}