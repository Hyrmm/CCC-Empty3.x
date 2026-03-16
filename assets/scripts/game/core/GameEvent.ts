export const GameEvent = {
    BootstrapReady: "game:bootstrap:ready",
    StateChanged: "game:state:changed",
    LevelPrepared: "game:level:prepared",
    GrainCollected: "game:grain:collected",
} as const;

export type GameEvent = typeof GameEvent[keyof typeof GameEvent];
