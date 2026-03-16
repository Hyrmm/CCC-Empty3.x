import { sys } from "cc";
import { LevelRuntimeData, LevelSettlementResult, PlayerSaveData } from "../types/GameTypes";
import { addIntegerString } from "../utils/BigNumberString";

const SAVE_KEY = "wuliaodemi.player.save.v1";

export class SaveSystem {
    private saveData: PlayerSaveData = null;

    public async initialize(): Promise<void> {
        this.saveData = this.load();
    }

    public get data(): PlayerSaveData {
        return this.saveData;
    }

    public markGuideFinished(): void {
        this.saveData.guideFinished = true;
        this.persist();
    }

    public bindProvinceCode(provinceCode: string | null): void {
        this.saveData.provinceCode = provinceCode;
        this.persist();
    }

    public applyLevelStart(): void {
        this.saveData.totalStartCount += 1;
        this.persist();
    }

    public applyLevelResult(runtime: LevelRuntimeData, settlement: LevelSettlementResult): void {
        this.saveData.totalRiceCollected = addIntegerString(this.saveData.totalRiceCollected, runtime.collectedRice);
        this.saveData.totalBeanCollected = addIntegerString(this.saveData.totalBeanCollected, runtime.collectedBean);

        if (settlement.success) {
            this.saveData.totalWinCount += 1;
            this.saveData.maxPassedLevelId = Math.max(this.saveData.maxPassedLevelId, runtime.levelId);
            this.saveData.unlockedLevelId = Math.max(this.saveData.unlockedLevelId, settlement.nextLevelId);
        }

        this.persist();
    }

    public unlockAchievements(ids: string[]): void {
        if (!ids.length) return;

        const unlocked = new Set(this.saveData.unlockedAchievements);
        ids.forEach((id) => unlocked.add(id));
        this.saveData.unlockedAchievements = [...unlocked];
        this.persist();
    }

    private load(): PlayerSaveData {
        const defaults = this.createDefaultSaveData();

        try {
            const raw = sys.localStorage.getItem(SAVE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<PlayerSaveData>;
                return {
                    ...defaults,
                    ...parsed,
                    unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : defaults.unlockedAchievements,
                    settings: {
                        ...defaults.settings,
                        ...(parsed.settings || {}),
                    },
                };
            }
        } catch (error) {
            console.warn("[SaveSystem] failed to load save", error);
        }

        return defaults;
    }

    private persist(): void {
        if (!this.saveData) return;
        sys.localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData));
    }

    private createDefaultSaveData(): PlayerSaveData {
        return {
            version: 1,
            playerId: `player-${Date.now()}`,
            guideFinished: false,
            provinceCode: null,
            unlockedLevelId: 10001,
            maxPassedLevelId: 0,
            totalStartCount: 0,
            totalWinCount: 0,
            totalRiceCollected: "0",
            totalBeanCollected: "0",
            unlockedAchievements: [],
            settings: {
                music: true,
                sound: true,
                vibration: true,
            },
        };
    }
}
