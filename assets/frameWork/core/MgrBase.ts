export interface IMgr {
    initialize(): Promise<void>;
    onUpdate(dt: number): void;
    onShutdown(): Promise<void>;
}

export abstract class MgrBase implements IMgr {
    public async initialize(): Promise<void> { }
    public onUpdate(dt: number): void { }
    public async onShutdown(): Promise<void> { }
}