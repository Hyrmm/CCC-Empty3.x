import { Asset } from "cc";
import { ReferencePools } from "../utils/ReferencePools";
import { ResMgr } from "./ResMgr";
import { ResLoadTaskState } from "./Types";
import { assetManager } from "cc";
import { SpriteFrame } from "cc";
import { Texture2D } from "cc";


export class ResLoadTask<T extends Asset> {

    public static create<T extends Asset>(opt: { path: string, type: Constructor<T>; }): ResLoadTask<T> {
        const task = ReferencePools.acquire(ResLoadTask);

        task.path = opt.path;
        task.type = opt.type;
        task.load();

        return task as ResLoadTask<T>;
    }

    public path: string = "";
    public type: Constructor<T> = null;
    public promise: Promise<T> = null;
    public state: ResLoadTaskState = ResLoadTaskState.Pending;

    private resolve: ((value: T) => void) | null = null;
    private reject: ((reason?: Error) => void) | null = null;

    public cancle(): void {
        this.fail(new Error('Task Cancelled'));
    }

    public reset(): void {
        this.path = "";
        this.type = null;
        this.promise = null;
        this.resolve = null;
        this.reject = null;
        this.state = ResLoadTaskState.Pending;
    }

    public load(): void {
        this.promise = new Promise(async (resolve, reject) => {

            this.resolve = resolve;
            this.reject = reject;

            const [resPath, bundleName] = this.path.split("@");
            const resMgr = FrameWork.mgrHub.getMgr(ResMgr);
            const bundle = resMgr.getBundle(bundleName) || await resMgr.loadBundle(bundleName);

            const pathExt = this.pathExtFromType(this.type);
            const loadPath = `${resPath}${pathExt ? "/" + pathExt : ""}`;
            bundle.load(loadPath, (error, asset) => {
                if (error) {
                    this.fail(error);
                } else {
                    if (this.state !== ResLoadTaskState.Pending) {
                        if (!asset.refCount) assetManager.releaseAsset(asset);
                    } else {
                        this.complete(asset as T);
                    }
                }
            });

        });
    }

    private fail(error: Error): void {
        if (this.state !== ResLoadTaskState.Pending) return;
        this.state = ResLoadTaskState.Failed;
        this.reject?.(error);
    }

    private complete(asset: T): void {
        if (this.state !== ResLoadTaskState.Pending) return;
        this.state = ResLoadTaskState.Completed;
        this.resolve?.(asset);
    }

    private pathExtFromType(type: Constructor<T>): string {
        let pathExt = "";
        if (type.name == Texture2D.name) {
            pathExt = `texture`;
        } else if (type.name == SpriteFrame.name) {
            pathExt = `spriteFrame`;
        }
        return pathExt;
    }
}