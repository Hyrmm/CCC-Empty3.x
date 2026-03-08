export abstract class TransportBase {
    readonly state: TransportState;

    abstract connect(url: string, protocols?: string | string[]): Promise<void>;
    abstract send(payload: TransportPayload): void;
    abstract close(code?: number, reason?: string): void;

    onOpen?: () => void;
    onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
    onError?: (error: unknown) => void;
    onMessage?: (payload: TransportPayload) => void;
}