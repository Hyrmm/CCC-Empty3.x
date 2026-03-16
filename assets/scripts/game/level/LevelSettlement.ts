import { LevelRuntimeData, LevelSettlementResult } from "../types/GameTypes";

export class LevelSettlement {
    public settle(runtime: LevelRuntimeData, inputBeanCount: number, unlockedLevelId: number, nextLevelId: number): LevelSettlementResult {
        const success = inputBeanCount === runtime.beanCount;
        const resolvedNextLevelId = success ? nextLevelId : runtime.levelId;

        return {
            success,
            inputBeanCount,
            expectedBeanCount: runtime.beanCount,
            nextLevelId: resolvedNextLevelId,
            unlockedLevelId: success ? Math.max(unlockedLevelId, resolvedNextLevelId) : unlockedLevelId,
        };
    }
}
