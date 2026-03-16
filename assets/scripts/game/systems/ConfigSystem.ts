import { AchievementConfigs } from "../configs/achievement/AchievementConfig";
import { AdConfigs } from "../configs/ads/AdConfig";
import { GuideConfigs } from "../configs/guide/GuideConfig";
import { LevelConfigs } from "../configs/level/LevelConfig";
import { AchievementConfig, AdConfig, GuideStepConfig, LevelConfig } from "../types/GameTypes";

export class ConfigSystem {
    private readonly levelConfigs = new Map<number, LevelConfig>();
    private readonly achievementConfigs: AchievementConfig[] = [];
    private readonly adConfigs = new Map<string, AdConfig>();
    private readonly guideConfigs: GuideStepConfig[] = [];

    public async initialize(): Promise<void> {
        LevelConfigs.forEach((config) => this.levelConfigs.set(config.id, config));
        this.achievementConfigs.push(...AchievementConfigs);
        AdConfigs.forEach((config) => this.adConfigs.set(config.placement, config));
        this.guideConfigs.push(...GuideConfigs);
    }

    public getLevelConfig(levelId: number): LevelConfig | null {
        return this.levelConfigs.get(levelId) || null;
    }

    public getFirstLevelConfig(): LevelConfig | null {
        return LevelConfigs[0] || null;
    }

    public getEntryLevelConfig(levelId: number): LevelConfig | null {
        const exact = this.getLevelConfig(levelId);
        if (exact) return exact;

        const next = LevelConfigs.find((config) => config.id >= levelId);
        if (next) return next;

        return this.getLastLevelConfig();
    }

    public getLastLevelConfig(): LevelConfig | null {
        return LevelConfigs.length ? LevelConfigs[LevelConfigs.length - 1] : null;
    }

    public getNextLevelId(levelId: number): number {
        const index = LevelConfigs.findIndex((config) => config.id === levelId);
        if (index < 0) {
            const entry = this.getEntryLevelConfig(levelId);
            return entry ? entry.id : levelId;
        }

        const next = LevelConfigs[index + 1];
        return next ? next.id : LevelConfigs[index].id;
    }

    public getAchievementConfigs(): AchievementConfig[] {
        return [...this.achievementConfigs];
    }

    public getGuideConfigs(): GuideStepConfig[] {
        return [...this.guideConfigs];
    }

    public getAdConfig(placement: string): AdConfig | null {
        return this.adConfigs.get(placement) || null;
    }
}
