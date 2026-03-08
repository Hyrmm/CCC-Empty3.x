import { MgrHub } from "./core/MgrHub";
class GameFrameWork {

    public mgrHub: MgrHub = null;

    constructor() {
        this.mgrHub = new MgrHub();
    }

    public async initialize(): Promise<void> {
        this.mgrHub.registerDefaults();
        await this.mgrHub.initializeAll();
    }

    public update(dt: number): void {
        this.mgrHub.updateAll(dt);
    }
};

declare global { const FrameWork: GameFrameWork };
Object.assign(globalThis, { FrameWork: new GameFrameWork() });
