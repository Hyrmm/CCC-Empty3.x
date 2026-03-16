export const SocketChannelState = {
    Idle: "idle",
    Connecting: "connecting",
    Open: "open",
    Closing: "closing",
    Closed: "closed",
} as const;

declare global {
    type SocketChannelPayload = string | ArrayBuffer | Uint8Array;
    type SocketChannelState = typeof SocketChannelState[keyof typeof SocketChannelState];

    type SocketChannelEvents<TReceive = unknown> = {
        onOpen?: () => void;
        onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
        onError?: (error: unknown) => void;
        onMessage?: (payload: TReceive, raw: SocketChannelPayload) => void;
    }

    type SocketChannelParams<TSend, TReceive> = {
        key: string;
        url: string;
        codec: ICodex<TSend, TReceive>;
        events?: SocketChannelEvents<TReceive>;
    }

    interface ICodex<TSend, TReceive> {
        encode(payload: TSend): SocketChannelPayload;
        decode(payload: SocketChannelPayload): TReceive;
    }
}