import { TransportState } from "../Types";
import type { INetTransport } from "./Transport";

export class WebSocketTransport implements INetTransport {
    public state: TransportState = TransportState.Idle;

    public onOpen?: () => void;
    public onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
    public onError?: (error: unknown) => void;
    public onMessage?: (payload: TransportPayload) => void;

    private socket: WebSocket = null;

    public connect(url: string, protocols?: string | string[]): Promise<void> {
        if (this.state === TransportState.Open || this.state === TransportState.Connecting) {
            return Promise.resolve();
        }

        this.close(1000, "reconnect");
        this.state = TransportState.Connecting;

        return new Promise((resolve, reject) => {
            let settled = false;

            try {
                this.socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);
                this.socket.binaryType = "arraybuffer";

                this.socket.onopen = () => {
                    this.state = TransportState.Open;
                    this.onOpen?.();
                    if (!settled) {
                        settled = true;
                        resolve();
                    }
                };

                this.socket.onclose = (ev) => {
                    this.state = TransportState.Closed;
                    this.onClose?.({ code: ev.code, reason: ev.reason, wasClean: ev.wasClean });
                    if (!settled) {
                        settled = true;
                        reject(new Error(`WebSocket closed before open: code=${ev.code}, reason=${ev.reason || "unknown"}`));
                    }
                };

                this.socket.onerror = (error) => {
                    this.onError?.(error);
                    if (!settled) {
                        settled = true;
                        reject(error instanceof Error ? error : new Error("WebSocket connect failed"));
                    }
                };

                this.socket.onmessage = async (event) => {
                    const payload = await this.normalizePayload(event.data);
                    if (payload == null) return;
                    this.onMessage?.(payload);
                };
            } catch (error) {
                this.state = TransportState.Closed;
                reject(error instanceof Error ? error : new Error("WebSocket connect failed"));
            }
        });
    }

    public send(payload: TransportPayload): void {
        if (this.state !== TransportState.Open || !this.socket) {
            throw new Error("WebSocket is not open");
        }

        this.socket.send(payload);
    }

    public close(code?: number, reason?: string): void {
        if (!this.socket) {
            this.state = TransportState.Closed;
            return;
        }

        if (this.state === TransportState.Open || this.state === TransportState.Connecting) {
            this.state = TransportState.Closing;
        }

        this.socket.close(code, reason);
        this.detachSocket();
        this.state = TransportState.Closed;
        this.onClose?.({ code, reason, wasClean: true });
    }

    private async normalizePayload(data: unknown): Promise<TransportPayload | null> {
        if (typeof data === "string") return data;
        if (data instanceof ArrayBuffer) return data;
        if (data instanceof Uint8Array) return data;

        if (typeof Blob !== "undefined" && data instanceof Blob) {
            return await data.arrayBuffer();
        }

        if (ArrayBuffer.isView(data)) {
            return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        }

        return null;
    }

    private detachSocket(): void {
        if (!this.socket) return;
        this.socket.onopen = null;
        this.socket.onclose = null;
        this.socket.onerror = null;
        this.socket.onmessage = null;
        this.socket = null;
    }
}
