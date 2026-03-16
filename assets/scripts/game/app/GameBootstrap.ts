import { GameBootstrapOptions } from "../types/GameTypes";
import { IPlatformAdapter } from "../platform/IPlatformAdapter";
import { WebPlatformAdapter } from "../platform/web/WebPlatformAdapter";
import { WechatPlatformAdapter } from "../platform/wechat/WechatPlatformAdapter";
import { GameApp } from "./GameApp";

export class GameBootstrap {
    private static app: GameApp | null = null;

    public static async initialize(options: GameBootstrapOptions): Promise<GameApp> {
        if (this.app) return this.app;

        const platformAdapter = this.createPlatformAdapter();
        this.app = new GameApp(options, platformAdapter);
        await this.app.initialize();
        return this.app;
    }

    public static getApp(): GameApp | null {
        return this.app;
    }

    public static dispose(): void {
        if (!this.app) return;
        this.app.dispose();
        this.app = null;
    }

    private static createPlatformAdapter(): IPlatformAdapter {
        const isWechat = typeof window !== "undefined" && "wx" in window;
        return isWechat ? new WechatPlatformAdapter() : new WebPlatformAdapter();
    }
}
