import { TransportState } from "../../Types";
import { TransportBase } from "./TransportBase";

export class WsTransport extends TransportBase {
    private readonly socket: WebSocket;

    public readonly state: TransportState = TransportState.Idle;

    public connect(url: string, protocols?: string | string[]): Promise<void> {
        return Promise.resolve();
    }

    public send(payload: TransportPayload): void {
        return;
    }

    public close(code?: number, reason?: string): void {
        return;
    }

    public onOpen?: () => void;
    public onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
    public onError?: (error: unknown) => void;
    public onMessage?: (payload: TransportPayload) => void;
}