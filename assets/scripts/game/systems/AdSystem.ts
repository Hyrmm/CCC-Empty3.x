import { AdPlacement } from "../types/GameTypes";
import { IPlatformAdapter } from "../platform/IPlatformAdapter";
import { ConfigSystem } from "./ConfigSystem";

export class AdSystem {
    private readonly lastShownAt = new Map<AdPlacement, number>();

    constructor(
        private readonly configSystem: ConfigSystem,
        private readonly platformAdapter: IPlatformAdapter,
    ) {
    }

    public async showRewardAd(placement: AdPlacement): Promise<boolean> {
        const config = this.configSystem.getAdConfig(placement);
        if (!config) return false;

        const now = Date.now();
        const lastShownAt = this.lastShownAt.get(placement) || 0;
        if (now - lastShownAt < config.cooldownSeconds * 1000) {
            return config.fallbackEnabled;
        }

        const completed = await this.platformAdapter.showRewardAd(config.unitId);
        if (completed) {
            this.lastShownAt.set(placement, now);
        }

        return completed || config.fallbackEnabled;
    }
}
