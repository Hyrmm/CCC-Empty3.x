const textDecoder = new TextDecoder();

export class CodexJson implements ICodex<object, string> {
    public encode(payload): SocketChannelPayload {
        return JSON.stringify(payload);
    }

    public decode(payload: SocketChannelPayload): string {
        if (typeof payload === "string") return JSON.parse(payload);
        if (payload instanceof Uint8Array) return textDecoder.decode(payload);
        if (payload instanceof ArrayBuffer) return textDecoder.decode(new Uint8Array(payload));
        return String(payload);
    }
}