import { Asset, Prefab, SpriteFrame } from "cc"
import { ReferencePools } from "../utils/ReferencePools";

export class ResLoader implements Resettable {

    public static create(): ResLoader {
        const loader = ReferencePools.acquire(ResLoader);
        loader.isValid = true;
        return loader;
    }

    public isValid: boolean = true;
    public loadResMap: Map<string, { asset: Asset, useCount: number }> = new Map()

    public reset(): void {
        this.isValid = false;
        this.loadResMap.clear();
    }

    public async loadPrefab(path: string): Promise<Prefab> {
        return await this.loadAsset({ path, type: Prefab });
    }

    public async loadSpriteFrame(path: string): Promise<SpriteFrame> {
        return await this.loadAsset({ path, type: SpriteFrame });
    }

    private async loadAsset<T extends Asset>(opt: { path: string, type: Constructor<T> }): Promise<T> {
        const key = `${opt.path}@${opt.type.name}`;

        const cache = this.loadResMap.get(key);

        if (!cache) {
            const asset = await FrameWork.mgrHub.res.loadAsset({ path: opt.path, type: opt.type, loader: this });
            if (!asset) return null;
            this.loadResMap.set(key, { asset, useCount: 1 });
            return asset as T;
        } else {
            cache.useCount++;
            return cache.asset as T;
        }
    }

    public releaseAll(): void {
        this.loadResMap.forEach(({ asset }) => FrameWork.mgrHub.res.releaseAsset({ asset, loader: this }));
    }

    public releaseByKey(key: string): void {
        const cache = this.loadResMap.get(key);
        if (!cache) return console.warn(`Asset not found for release: ${key}`);

        cache.useCount--;
        if (cache.useCount === 0) {
            FrameWork.mgrHub.res.releaseAsset({ asset: cache.asset, loader: this });
            this.loadResMap.delete(key);
        }
    }

    public releaseByAsset(asset: Asset): void {
        const key = asset.Hook_AssetKey;
        if (!key) return console.warn(`Asset not found Hook_AssetKey for release: ${key}`);

        const cache = this.loadResMap.get(key);
        if (!cache) return console.warn(`Asset not found for release: ${key}`);

        cache.useCount--;
        if (cache.useCount === 0) {
            FrameWork.mgrHub.res.releaseAsset({ asset: cache.asset, loader: this });
            this.loadResMap.delete(key);
        }
    }
}
