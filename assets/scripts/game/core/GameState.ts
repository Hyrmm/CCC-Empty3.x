export const GameState = {
    Boot: "Boot",
    Loading: "Loading",
    Guide: "Guide",
    LevelPrepare: "LevelPrepare",
    LevelPlaying: "LevelPlaying",
    LevelInputAnswer: "LevelInputAnswer",
    LevelSuccess: "LevelSuccess",
    LevelFail: "LevelFail",
    Settlement: "Settlement",
} as const;

export type GameState = typeof GameState[keyof typeof GameState];
