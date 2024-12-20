import { GameState } from "./gameState";

export interface Level extends GameState {
    startNextLevel: () => void,
}