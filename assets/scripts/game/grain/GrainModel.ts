import { GrainData } from "../types/GameTypes";

export class GrainModel {
    private readonly grainMap = new Map<number, GrainData>();

    public reset(grains: GrainData[]): void {
        this.grainMap.clear();
        grains.forEach((grain) => this.grainMap.set(grain.id, grain));
    }

    public getById(grainId: number): GrainData | null {
        return this.grainMap.get(grainId) || null;
    }

    public getAll(): GrainData[] {
        return [...this.grainMap.values()];
    }

    public getExposed(): GrainData[] {
        return this.getAll().filter((grain) => grain.exposed && !grain.collected);
    }
}
