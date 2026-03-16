import { AchievementConfig, PlayerSaveData } from "../types/GameTypes";
import { compareIntegerString } from "../utils/BigNumberString";
import { ConfigSystem } from "./ConfigSystem";

export class AchievementSystem {
    constructor(private readonly configSystem: ConfigSystem) {
    }

    public refresh(saveData: PlayerSaveData): string[] {
        const unlocked = new Set(saveData.unlockedAchievements);
        const newlyUnlocked: string[] = [];

        this.configSystem.getAchievementConfigs().forEach((config) => {
            if (unlocked.has(config.id)) return;
            if (!this.isReached(config, saveData)) return;
            unlocked.add(config.id);
            newlyUnlocked.push(config.id);
        });

        return newlyUnlocked;
    }

    private isReached(config: AchievementConfig, saveData: PlayerSaveData): boolean {
        switch (config.metric) {
            case "startCount":
                return saveData.totalStartCount >= config.target;
            case "winCount":
                return saveData.totalWinCount >= config.target;
            case "maxLevelId":
                return saveData.maxPassedLevelId >= config.target;
            case "riceCollected":
                return compareIntegerString(saveData.totalRiceCollected, String(config.target)) >= 0;
            case "beanCollected":
                return compareIntegerString(saveData.totalBeanCollected, String(config.target)) >= 0;
            default:
                return false;
        }
    }
}
