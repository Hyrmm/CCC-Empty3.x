import type { INetTransport } from "./socket/Transport";

export const TransportState = {
    Idle: "idle",
    Connecting: "connecting",
    Open: "open",
    Closing: "closing",
    Closed: "closed",
} as const;

export const HttpMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
} as const;

export const HttpResponseType = {
    JSON: "json",
    Text: "text",
    ArrayBuffer: "arrayBuffer",
    Blob: "blob",
    Raw: "raw",
} as const;

export type MaybePromise<T> = T | Promise<T>;
export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];
export type HttpResponseType = typeof HttpResponseType[keyof typeof HttpResponseType];
export type SocketEncodeResult = MaybePromise<TransportPayload>;
export type SocketDecodeResult<T> = MaybePromise<T>;
export type SocketTransportFactory = () => INetTransport;

export interface SocketCodec<TSend = unknown, TReceive = unknown> {
    encode(payload: TSend): SocketEncodeResult;
    decode(payload: TransportPayload): SocketDecodeResult<TReceive>;
}

export interface SocketChannelEvents<TReceive = unknown> {
    onOpen?: () => void;
    onClose?: (ev?: { code?: number; reason?: string; wasClean?: boolean }) => void;
    onError?: (error: unknown) => void;
    onMessage?: (payload: TReceive, raw: TransportPayload) => void;
}

export interface SocketChannel<TSend = unknown, TReceive = unknown> {
    readonly key: string;
    readonly state: TransportState;
    connect(): Promise<void>;
    send(payload: TSend): Promise<void>;
    close(code?: number, reason?: string): void;
    setEvents(events: SocketChannelEvents<TReceive>): SocketChannel<TSend, TReceive>;
}

export type SocketTransportProvider = string | INetTransport | SocketTransportFactory;
export type SocketCodecProvider<TSend = unknown, TReceive = unknown> = string | SocketCodec<TSend, TReceive>;

export interface SocketCreateOptions<TSend = unknown, TReceive = unknown> {
    key: string;
    url: string;
    protocols?: string | string[];
    transport?: SocketTransportProvider;
    codec?: SocketCodecProvider<TSend, TReceive>;
    events?: SocketChannelEvents<TReceive>;
}

export type HttpQueryValue = string | number | boolean | null | undefined;

export interface HttpRequestOptions<TBody = unknown> {
    url: string;
    method?: HttpMethod;
    query?: Record<string, HttpQueryValue>;
    headers?: Record<string, string>;
    body?: TBody;
    timeoutMs?: number;
    responseType?: HttpResponseType;
    credentials?: RequestCredentials;
    signal?: AbortSignal;
    throwOnHttpError?: boolean;
}

export interface HttpResponse<TData = unknown> {
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    headers: Record<string, string>;
    data: TData;
    raw: Response;
}

// declare global {
//     type TransportPayload = string | ArrayBuffer | Uint8Array;
//     type TransportState = typeof TransportState[keyof typeof TransportState];
// }

export { };
