import { Vec3 } from "cc";
import { GrainData, GrainType, LevelConfig, LevelRuntimeData } from "../types/GameTypes";

export class LevelGenerator {
    public generate(config: LevelConfig): LevelRuntimeData {
        const riceCount = this.randomRange(config.riceRange[0], config.riceRange[1]);
        const beanCount = this.randomRange(config.beanRange[0], config.beanRange[1]);
        const totalCount = riceCount + beanCount;
        const layerCount = Math.max(4, Math.min(14, Math.ceil(totalCount / 24)));
        const layerBuckets = this.buildLayerBuckets(totalCount, layerCount);
        const beanIds = this.pickBeanIds(totalCount, beanCount, layerBuckets, config.topBeanRatioMin);
        const grains = this.buildGrains(layerBuckets, beanIds);

        this.linkExposure(grains, layerBuckets);

        return {
            levelId: config.id,
            riceCount,
            beanCount,
            remainingTime: config.timeLimit,
            collectedRice: 0,
            collectedBean: 0,
            exposedCount: grains.filter((grain) => grain.exposed).length,
            usedHintAd: false,
            usedExtraTimeAd: false,
            grains,
        };
    }

    private buildLayerBuckets(totalCount: number, layerCount: number): number[][] {
        const weights = Array.from({ length: layerCount }, (_, index) => layerCount - index);
        const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
        const buckets = Array.from({ length: layerCount }, () => [] as number[]);
        let nextId = 1;

        for (let layer = 0; layer < layerCount; layer += 1) {
            const ratio = weights[layer] / weightSum;
            const count = layer === layerCount - 1
                ? totalCount - buckets.reduce((sum, bucket) => sum + bucket.length, 0)
                : Math.max(1, Math.round(totalCount * ratio));

            for (let index = 0; index < count && nextId <= totalCount; index += 1) {
                buckets[layer].push(nextId);
                nextId += 1;
            }
        }

        while (nextId <= totalCount) {
            buckets[layerCount - 1].push(nextId);
            nextId += 1;
        }

        return buckets;
    }

    private pickBeanIds(totalCount: number, beanCount: number, layerBuckets: number[][], topBeanRatioMin: number): Set<number> {
        const beanIds = new Set<number>();
        const topBuckets = layerBuckets.slice(Math.max(0, layerBuckets.length - 2)).reduce((result, bucket) => {
            result.push(...bucket);
            return result;
        }, [] as number[]);
        const topBeanCount = Math.min(beanCount, Math.max(1, Math.ceil(beanCount * topBeanRatioMin)));

        while (beanIds.size < topBeanCount && beanIds.size < topBuckets.length) {
            beanIds.add(topBuckets[this.randomRange(0, topBuckets.length - 1)]);
        }

        while (beanIds.size < beanCount) {
            beanIds.add(this.randomRange(1, totalCount));
        }

        return beanIds;
    }

    private buildGrains(layerBuckets: number[][], beanIds: Set<number>): GrainData[] {
        const grains: GrainData[] = [];
        const baseRadius = 4.2;

        layerBuckets.forEach((bucket, layer) => {
            const layerRadius = baseRadius * (1 - (layer / Math.max(1, layerBuckets.length)) * 0.45);
            bucket.forEach((grainId) => {
                const radius = Math.sqrt(Math.random()) * layerRadius;
                const angle = Math.random() * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = layer * 0.18 + Math.random() * 0.03;

                grains.push({
                    id: grainId,
                    type: beanIds.has(grainId) ? GrainType.Bean : GrainType.Rice,
                    layer,
                    localPos: new Vec3(x, y, z),
                    rotation: new Vec3(Math.random() * 360, Math.random() * 360, Math.random() * 360),
                    scale: 0.9 + Math.random() * 0.2,
                    exposed: false,
                    collected: false,
                    blockersAbove: [],
                    supportsBelow: [],
                });
            });
        });

        return grains;
    }

    private linkExposure(grains: GrainData[], layerBuckets: number[][]): void {
        const grainMap = new Map<number, GrainData>();
        grains.forEach((grain) => grainMap.set(grain.id, grain));

        for (let layer = 0; layer < layerBuckets.length - 1; layer += 1) {
            const currentLayer = layerBuckets[layer];
            const nextLayer = layerBuckets[layer + 1];
            currentLayer.forEach((grainId) => {
                const grain = grainMap.get(grainId);
                nextLayer.forEach((candidateId) => {
                    const blocker = grainMap.get(candidateId);
                    const distance = Vec3.distance(grain.localPos, blocker.localPos);
                    if (distance > 1.15) return;
                    grain.blockersAbove.push(blocker.id);
                    blocker.supportsBelow.push(grain.id);
                });
            });
        }

        grains.forEach((grain) => {
            grain.exposed = grain.blockersAbove.length === 0;
        });
    }

    private randomRange(min: number, max: number): number {
        if (min >= max) return min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
