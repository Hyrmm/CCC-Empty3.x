import { IPlatformAdapter, PlatformSystemInfo, SharePayload } from "../IPlatformAdapter";

export class WebPlatformAdapter implements IPlatformAdapter {
    public async login(): Promise<void> {
        return Promise.resolve();
    }

    public async getLocationProvince(): Promise<string | null> {
        return Promise.resolve(null);
    }

    public async showRewardAd(adUnitId: string): Promise<boolean> {
        console.log("[WebPlatformAdapter] mock reward ad", adUnitId);
        return Promise.resolve(true);
    }

    public async share(data: SharePayload): Promise<boolean> {
        console.log("[WebPlatformAdapter] mock share", data);
        return Promise.resolve(true);
    }

    public vibrateShort(): void {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(20);
        }
    }

    public getSystemInfo(): PlatformSystemInfo {
        return {
            platform: "web",
            version: "dev",
        };
    }
}
