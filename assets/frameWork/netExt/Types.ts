export const TransportState = {
    Idle: "idle",
    Connecting: "connecting",
    Open: "open",
    Closing: "closing",
    Closed: "closed",
} as const;

declare global {
    type TransportPayload = string | ArrayBuffer | Uint8Array;
    type TransportState = typeof TransportState[keyof typeof TransportState];

    interface SocketChannel<TSend = unknown, TReceive = unknown> {
        readonly key: string;
        readonly state: TransportState;
        connect(): Promise<void>;
        send(payload: TSend): Promise<void>;
        close(code?: number, reason?: string): void;
        setEvents(events: SocketChannelEvents<TReceive>): SocketChannel<TSend, TReceive>;
    }

    interface SocketChannelEvents<TReceive = unknown> {
        onOpen?: () => void;
        onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
        onError?: (error: unknown) => void;
        onMessage?: (payload: TReceive, raw: TransportPayload) => void;
    }
}

export { };