declare global {
    type Constructor<T> = new (...args: any[]) => T;
    interface Resettable { reset?: () => void; }
}


declare module "cc" {

    interface Asset {
        Hook_AssetKey?: string;
    }

    interface Sprite {
        Hook_CurAssetKey?: string;
    }
}

export { }