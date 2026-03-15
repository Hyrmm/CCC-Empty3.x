import { SocketChannelState } from "../Types";

export class SocketChannel<TSend, TReceive> {

    public readonly url: string;
    public readonly key: string;
    public readonly codec: ICodex<TSend, TReceive>;

    private events: SocketChannelEvents<TReceive> = {};
    private socket: WebSocket;
    private connectTask: Promise<void>;

    public state: SocketChannelState = SocketChannelState.Idle;

    constructor(param: SocketChannelParams<TSend, TReceive>) {
        this.key = param.key;
        this.url = param.url;
        this.codec = param.codec;
        this.events = param.events || {};
    }

    public async connect(): Promise<void> {
        if (this.state === SocketChannelState.Open) return;
        if (this.connectTask) return this.connectTask;

        const socket = new WebSocket(this.url);
        socket.binaryType = "arraybuffer";
        this.socket = socket;
        this.state = SocketChannelState.Connecting;

        this.connectTask = new Promise<void>((resolve, reject) => {
            let settled = false;

            const resolveOnce = () => {
                if (settled) return;
                settled = true;
                this.connectTask = undefined;
                resolve();
            };

            const rejectOnce = (error: unknown) => {
                if (settled) return;
                settled = true;
                this.connectTask = undefined;
                reject(error);
            };

            socket.onopen = () => {
                if (this.socket !== socket) return;
                this.state = SocketChannelState.Open;
                this.events.onOpen?.();
                resolveOnce();
            };

            socket.onclose = (ev) => {
                if (this.socket !== socket) return;

                this.socket = undefined;
                this.state = SocketChannelState.Closed;
                this.events.onClose?.({
                    code: ev.code,
                    reason: ev.reason,
                    wasClean: ev.wasClean,
                });

                if (!settled) {
                    rejectOnce(new Error(`WebSocket closed before open (code=${ev.code}, reason=${ev.reason || "unknown"})`));
                }
            };

            socket.onerror = (error) => {
                if (this.socket !== socket) return;
                this.events.onError?.(error);
                if (!settled) rejectOnce(error);
            };

            socket.onmessage = (ev) => {
                if (this.socket !== socket) return;
                void this.onMessage(ev.data);
            };
        });

        return this.connectTask;
    }

    public send(payload: TSend): void {
        const socket = this.socket;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            throw new Error(`SocketChannel(${this.key}) is not connected.`);
        }

        const encoded = this.codec.encode(payload);
        socket.send(encoded as string | ArrayBufferLike | Blob | ArrayBufferView);
    }

    public close(code?: number, reason?: string): void {
        const socket = this.socket;
        if (!socket) {
            this.state = SocketChannelState.Closed;
            return;
        }

        if (socket.readyState === WebSocket.CLOSED) {
            this.socket = undefined;
            this.state = SocketChannelState.Closed;
            return;
        }

        if (socket.readyState === WebSocket.CLOSING) {
            this.state = SocketChannelState.Closing;
            return;
        }

        this.state = SocketChannelState.Closing;
        this.events = {};

        socket.close(code, reason);
    }

    private onMessage(raw: SocketChannelPayload): void {
        try {
            const decoded = this.codec.decode(raw);
            this.events.onMessage?.(decoded, raw);
        } catch (error) {
            console.error(error);
            this.events.onError?.(error);
        }
    }
}

