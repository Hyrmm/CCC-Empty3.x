import { GameState } from "./GameState";

export type GameStateChangeListener = (previous: GameState | null, current: GameState) => void;

export class GameStateMachine {
    private currentState: GameState | null = null;
    private readonly listeners: GameStateChangeListener[] = [];

    public get current(): GameState | null {
        return this.currentState;
    }

    public setState(next: GameState): void {
        if (this.currentState === next) return;

        const previous = this.currentState;
        this.currentState = next;
        this.listeners.forEach((listener) => listener(previous, next));
    }

    public onChange(listener: GameStateChangeListener): void {
        this.listeners.push(listener);
    }
}
