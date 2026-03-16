import { LevelConfig, LevelRuntimeData, LevelSettlementResult } from "../types/GameTypes";
import { GrainController } from "../grain/GrainController";
import { LevelGenerator } from "./LevelGenerator";
import { LevelModel } from "./LevelModel";
import { LevelSettlement } from "./LevelSettlement";

export class LevelController {
    private readonly levelGenerator = new LevelGenerator();
    private readonly grainController = new GrainController();
    private readonly levelSettlement = new LevelSettlement();
    private currentLevel: LevelModel = null;

    public prepareLevel(config: LevelConfig): LevelModel {
        const runtime = this.levelGenerator.generate(config);
        this.currentLevel = new LevelModel(config, runtime);
        this.grainController.bindRuntime(runtime);
        return this.currentLevel;
    }

    public tick(deltaTime: number): void {
        if (!this.currentLevel) return;
        if (this.currentLevel.runtime.remainingTime < 0) return;
        this.currentLevel.runtime.remainingTime = Math.max(0, this.currentLevel.runtime.remainingTime - deltaTime);
    }

    public collectGrain(grainId: number): boolean {
        return this.grainController.collect(grainId);
    }

    public applyExtraTime(extraSeconds: number): void {
        if (!this.currentLevel) return;
        this.currentLevel.runtime.remainingTime += extraSeconds;
        this.currentLevel.runtime.usedExtraTimeAd = true;
    }

    public markHintUsed(): void {
        if (!this.currentLevel) return;
        this.currentLevel.runtime.usedHintAd = true;
    }

    public canAnswer(): boolean {
        return !!this.currentLevel && this.currentLevel.runtime.collectedBean >= this.currentLevel.runtime.beanCount;
    }

    public settle(inputBeanCount: number, unlockedLevelId: number, nextLevelId: number): LevelSettlementResult | null {
        if (!this.currentLevel) return null;
        return this.levelSettlement.settle(this.currentLevel.runtime, inputBeanCount, unlockedLevelId, nextLevelId);
    }

    public get runtime(): LevelRuntimeData | null {
        return this.currentLevel ? this.currentLevel.runtime : null;
    }

    public get exposedGrains() {
        return this.grainController.getExposedGrains();
    }
}
