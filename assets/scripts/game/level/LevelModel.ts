import { LevelConfig, LevelRuntimeData } from "../types/GameTypes";

export class LevelModel {
    constructor(
        public readonly config: LevelConfig,
        public readonly runtime: LevelRuntimeData,
    ) {
    }
}
