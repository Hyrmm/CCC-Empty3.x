import { Sprite } from "cc";
import { ResLoader } from "./ResLoader";
import { ReferencePools } from "../utils/ReferencePools";
import { SpriteFrame } from "cc";

export class ResSpriteUtil implements Resettable {

    private resLoader: ResLoader = null;

    public static create(): ResSpriteUtil {
        return ReferencePools.acquire(ResSpriteUtil);
    }

    public reset(): void {
        this.resLoader = null;
    }

    public bindResLoader(resLoader: ResLoader): ResSpriteUtil {
        this.resLoader = resLoader;
        return this;
    }

    public async setSpriteFrame(opt: { sprite: Sprite, path: string }): Promise<void> {

        if (!this.resLoader) return console.error('ResSpriteUtil not bound to ResLoader');

        const { sprite, path } = opt;

        if (sprite.spriteFrame?.Hook_AssetKey) {
            this.resLoader.releaseByKey(sprite.spriteFrame.Hook_AssetKey);
        }

        sprite.Hook_CurAssetKey = `${path}@${SpriteFrame.name}`;
        const spriteFrame = await this.resLoader.loadSpriteFrame(path);
        if (!spriteFrame) return;

        if (spriteFrame.Hook_AssetKey == sprite.Hook_CurAssetKey) {
            sprite.spriteFrame = spriteFrame;
        } else {
            this.resLoader.releaseByAsset(spriteFrame);
        }
    }
}