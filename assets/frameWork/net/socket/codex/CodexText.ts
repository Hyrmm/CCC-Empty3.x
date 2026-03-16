export class CodexText implements ICodex<string, string> {
    public encode(payload: string): SocketChannelPayload {
        return payload;
    }

    public decode(payload: SocketChannelPayload): string {
        if (typeof payload === "string") return payload;
        if (payload instanceof Uint8Array) return new TextDecoder().decode(payload);
        if (payload instanceof ArrayBuffer) return new TextDecoder().decode(new Uint8Array(payload));
        return String(payload);
    }
}