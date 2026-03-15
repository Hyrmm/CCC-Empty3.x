import { EventMgr } from "../event/EventMgr";
import { NetMgr } from "../netExt/NetMgr";
import { ResMgr } from "../res/ResMgr";
import { UIMgr } from "../ui/UIMgr";
import { IMgr } from "./MgrBase";

export class MgrHub {

    private mgrs: IMgr[] = [];

    public registerDefaults() {
        this.register(new EventMgr<EventMap>());
        this.register(new NetMgr());
        this.register(new ResMgr());
        this.register(new UIMgr());
    }

    public register<T extends IMgr>(mgr: T): T {
        this.mgrs.push(mgr);
        return mgr;
    }

    public async initializeAll() {
        for (const m of this.mgrs) await m.initialize();
    }

    public updateAll(dt: number) {
        for (const m of this.mgrs) m.onUpdate(dt);
    }

    public async shutdownAll() {
        for (let i = this.mgrs.length - 1; i >= 0; --i) await this.mgrs[i].onShutdown();
    }

    public getMgr<T extends IMgr>(mgr: Constructor<T>): T {
        return this.mgrs.find(m => m instanceof mgr) as T;
    }

    public get ui(): UIMgr {
        return this.getMgr(UIMgr);
    }

    public get res(): ResMgr {
        return this.getMgr(ResMgr);
    }

    public get net(): NetMgr {
        return this.getMgr(NetMgr);
    }

    public get event(): EventMgr<EventMap> {
        return this.getMgr(EventMgr<EventMap>);
    }

}

