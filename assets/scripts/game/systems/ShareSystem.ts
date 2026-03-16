import { IPlatformAdapter, SharePayload } from "../platform/IPlatformAdapter";

export class ShareSystem {
    constructor(private readonly platformAdapter: IPlatformAdapter) {
    }

    public share(payload: SharePayload): Promise<boolean> {
        return this.platformAdapter.share(payload);
    }
}
