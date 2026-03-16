import { MgrBase } from "../core/MgrBase";
import { SocketChannel } from "./socket/SocketChannel";
export class NetMgr extends MgrBase {
    private readonly channels: Map<string, SocketChannel<unknown, unknown>> = new Map();

    public async initialize(): Promise<void> {
        await super.initialize();
    }

    public async onShutdown(): Promise<void> {
        for (const channel of this.channels.values()) {
            channel.close(1000, "NetMgr shutdown");
            this.channels.delete(channel.key);
        }

        await super.onShutdown();
    }

    public createChannel<TSend, TReceive>(params: SocketChannelParams<TSend, TReceive>): SocketChannel<TSend, TReceive> {
        const existed = this.channels.get(params.key);
        if (existed) return existed as SocketChannel<TSend, TReceive>;

        const channel = new SocketChannel<TSend, TReceive>({
            key: params.key,
            url: params.url,
            codec: params.codec,
            events: params.events,
        });

        this.channels.set(params.key, channel);
        return channel;
    }

    public removeChannel(key: string, close = true): boolean {
        const channel = this.channels.get(key);
        if (!channel) return false;

        if (close) {
            channel.close(1000, "Channel removed");
        }

        return this.channels.delete(key);
    }
}
