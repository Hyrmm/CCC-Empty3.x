import { Asset, AssetManager, assetManager, Sprite } from "cc";
import { MgrBase } from "../core/MgrBase"
import { ReferencePools } from "../utils/ReferencePools";
import { ResLoadTask } from "./ResLoadTask";
import { ResLoader } from "./ResLoader";
import { ResSpriteUtil } from "./ResSpriteUtil";


export class ResMgr extends MgrBase {

    private loadedAssets: Map<string, { asset: Asset, refLoaders: ResLoader[] }> = new Map();
    private loadedBundles: Map<string, AssetManager.Bundle> = new Map();
    private loadingTasks: Map<string, ResLoadTask<Asset>> = new Map();

    constructor() {
        super();
        ReferencePools.register(ResLoader);
        ReferencePools.register(ResLoadTask);
    }

    public initialize(): Promise<void> {
        return Promise.resolve();
    }

    public getBundle(bundleName: string): AssetManager.Bundle {
        if (this.loadedBundles.has(bundleName)) return this.loadedBundles.get(bundleName);
        return null;
    }

    public async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        if (this.loadedBundles.has(bundleName)) return Promise.resolve(this.loadedBundles.get(bundleName));

        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    reject(err);
                } else {
                    this.loadedBundles.set(bundleName, bundle);
                    resolve(bundle);
                }
            });
        });
    }

    public async loadAsset<T extends Asset>(opt: { path: string, type: Constructor<T>, loader: ResLoader }): Promise<T> {
        const key = `${opt.path}@${opt.type.name}`;

        if (this.loadedAssets.has(key)) {
            const cached = this.loadedAssets.get(key);
            if (opt.loader.isValid && !cached.refLoaders.includes(opt.loader)) {
                cached.refLoaders.push(opt.loader);
            }
            if (!cached.asset.Hook_AssetKey) cached.asset.Hook_AssetKey = key;
            return cached.asset as T;
        }

        let task = this.loadingTasks.get(key) as ResLoadTask<T>;

        if (task) return task.promise;

        task = ResLoadTask.create<T>({ path: opt.path, type: opt.type });
        this.loadingTasks.set(key, task);

        task.promise.then((asset) => {

            if (opt.loader.isValid) {
                if (this.loadedAssets.has(key)) {
                    this.loadedAssets.get(key).refLoaders.push(opt.loader);
                } else {
                    this.loadedAssets.set(key, { asset, refLoaders: [opt.loader] });
                }

                asset.addRef();
                asset.Hook_AssetKey = key;
            } else {
                if (!asset.refCount) assetManager.releaseAsset(asset);
            }

            this.loadingTasks.delete(key);
            ReferencePools.release(ResLoadTask, task);
            return asset;
        }).catch((error) => {
            console.error(`Failed to load asset: ${opt.path}`, error);

            this.loadingTasks.delete(key);
            ReferencePools.release(ResLoadTask, task);

            return null;
        });

        return task.promise as Promise<T>;
    }

    public releaseAsset(opt: { asset: Asset, loader: ResLoader }): void {

        const key = opt.asset.Hook_AssetKey;
        if (!key) return console.error(`Asset not found Hook_AssetKey for release: ${key}`);

        if (this.loadedAssets.has(key)) {
            const loadedAsset = this.loadedAssets.get(key);
            loadedAsset.refLoaders = loadedAsset.refLoaders.filter((l) => l !== opt.loader);
            if (loadedAsset.refLoaders.length === 0) {
                loadedAsset.asset.decRef();
                this.loadedAssets.delete(key);
            }
        } else {
            console.error(`Asset not found for release: ${key}`);
        }

        if (this.loadingTasks.has(key)) {
            const loadingTask = this.loadingTasks.get(key);
            loadingTask.cancle();
            this.loadingTasks.delete(key);
        }
    }

    public acquireResLoader(): ResLoader {
        return ResLoader.create();
    }

    public acquireResSpriteUtil(): ResSpriteUtil {
        return ResSpriteUtil.create();
    }

    public releaseResLoader(resLoader: ResLoader): void {
        resLoader.releaseAll();
        ReferencePools.release(ResLoader, resLoader);
    }

    public releaseResSpriteUtil(resSpriteUtil: ResSpriteUtil): void {
        ReferencePools.release(ResSpriteUtil, resSpriteUtil);
    }

    public async onShutdown(): Promise<void> {

        for (const task of this.loadingTasks.values()) {
            task.cancle();
        }

        this.loadingTasks.clear();

        for (const asset of this.loadedAssets.values()) {
            asset.asset.decRef();
        }

        this.loadedAssets.clear();
    }
}
