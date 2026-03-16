export interface SharePayload {
    title: string;
    query?: string;
    imageUrl?: string;
}

export interface PlatformSystemInfo {
    platform: string;
    version: string;
}

export interface IPlatformAdapter {
    login(): Promise<void>;
    getLocationProvince(): Promise<string | null>;
    showRewardAd(adUnitId: string): Promise<boolean>;
    share(data: SharePayload): Promise<boolean>;
    vibrateShort(): void;
    getSystemInfo(): PlatformSystemInfo;
}
