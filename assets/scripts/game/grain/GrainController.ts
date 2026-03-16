import { GrainType, LevelRuntimeData } from "../types/GameTypes";
import { GrainModel } from "./GrainModel";

export class GrainController {
    private readonly grainModel = new GrainModel();
    private runtime: LevelRuntimeData = null;

    public bindRuntime(runtime: LevelRuntimeData): void {
        this.runtime = runtime;
        this.grainModel.reset(runtime.grains);
        this.runtime.exposedCount = this.grainModel.getExposed().length;
    }

    public collect(grainId: number): boolean {
        const grain = this.grainModel.getById(grainId);
        if (!grain || grain.collected || !grain.exposed) return false;

        grain.collected = true;
        grain.exposed = false;

        if (grain.type === GrainType.Bean) {
            this.runtime.collectedBean += 1;
        } else {
            this.runtime.collectedRice += 1;
        }

        grain.supportsBelow.forEach((belowId) => {
            const below = this.grainModel.getById(belowId);
            if (!below || below.collected || below.exposed) return;

            const blocked = below.blockersAbove.some((blockerId) => {
                const blocker = this.grainModel.getById(blockerId);
                return blocker && !blocker.collected;
            });

            if (!blocked) {
                below.exposed = true;
            }
        });

        this.runtime.exposedCount = this.grainModel.getExposed().length;
        return true;
    }

    public getExposedGrains() {
        return this.grainModel.getExposed();
    }
}
