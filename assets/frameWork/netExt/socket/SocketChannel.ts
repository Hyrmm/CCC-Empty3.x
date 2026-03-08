import { SocketCodec } from "../../net/Types";
import { CodexBase } from "./codex/CodexBase";
import { TransportBase } from "./transport/TransportBase";

export class SocketChannel<TSend, TReceive> {
    public readonly key: string;
    public readonly state: TransportState;
    public readonly transport: TransportBase;
    public readonly codec: CodexBase<TSend, TReceive>;
    public readonly events: SocketChannelEvents<TReceive>;

    constructor(param: {
        key: string;
        transport: TransportBase;
        codec: CodexBase<TSend, TReceive>;
    }) {
        this.key = param.key;
        this.transport = param.transport;
        this.codec = param.codec;
        this.events = {};
    }
}