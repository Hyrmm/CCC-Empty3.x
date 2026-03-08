import { CodexBase } from "./CodexBase";

const textDecoder = new TextDecoder();

export class CodexJson extends CodexBase<object, string> {
    public encode(payload): TransportPayload {
        return JSON.stringify(payload);
    }

    public decode(payload): string {
        if (typeof payload === "string") return JSON.parse(payload);
        if (payload instanceof Uint8Array) return textDecoder.decode(payload);
        if (payload instanceof ArrayBuffer) return textDecoder.decode(new Uint8Array(payload));
        return String(payload);
    }
}