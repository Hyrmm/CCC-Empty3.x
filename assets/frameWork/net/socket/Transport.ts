export interface INetTransport {
    readonly state: TransportState;

    connect(url: string, protocols?: string | string[]): Promise<void>;
    send(payload: TransportPayload): void;
    close(code?: number, reason?: string): void;

    onOpen?: () => void;
    onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
    onError?: (error: unknown) => void;
    onMessage?: (payload: TransportPayload) => void;
}


