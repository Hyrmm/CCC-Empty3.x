import { LevelRuntimeData, PlayerRankEntry, ProvinceRankEntry } from "../types/GameTypes";

export interface RankUploadPayload {
    playerId: string;
    provinceCode: string | null;
    levelId: number;
    deltaBeanCount: number;
    deltaRiceCount: number;
    happenedAt: number;
}

export class RankSystem {
    private provinceRanks: ProvinceRankEntry[] = [];
    private provincePlayerRanks: PlayerRankEntry[] = [];

    public buildUploadPayload(playerId: string, provinceCode: string | null, runtime: LevelRuntimeData): RankUploadPayload {
        return {
            playerId,
            provinceCode,
            levelId: runtime.levelId,
            deltaBeanCount: runtime.collectedBean,
            deltaRiceCount: runtime.collectedRice,
            happenedAt: Date.now(),
        };
    }

    public setProvinceRanks(entries: ProvinceRankEntry[]): void {
        this.provinceRanks = [...entries];
    }

    public setProvincePlayerRanks(entries: PlayerRankEntry[]): void {
        this.provincePlayerRanks = [...entries];
    }

    public getProvinceRanks(): ProvinceRankEntry[] {
        return [...this.provinceRanks];
    }

    public getProvincePlayerRanks(): PlayerRankEntry[] {
        return [...this.provincePlayerRanks];
    }
}
