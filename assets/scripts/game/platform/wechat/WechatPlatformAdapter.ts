import { IPlatformAdapter, PlatformSystemInfo, SharePayload } from "../IPlatformAdapter";

export class WechatPlatformAdapter implements IPlatformAdapter {
    public async login(): Promise<void> {
        return Promise.resolve();
    }

    public async getLocationProvince(): Promise<string | null> {
        return Promise.resolve(null);
    }

    public async showRewardAd(adUnitId: string): Promise<boolean> {
        console.log("[WechatPlatformAdapter] reward ad placeholder", adUnitId);
        return Promise.resolve(false);
    }

    public async share(data: SharePayload): Promise<boolean> {
        console.log("[WechatPlatformAdapter] share placeholder", data);
        return Promise.resolve(false);
    }

    public vibrateShort(): void {
    }

    public getSystemInfo(): PlatformSystemInfo {
        return {
            platform: "wechat",
            version: "placeholder",
        };
    }
}
