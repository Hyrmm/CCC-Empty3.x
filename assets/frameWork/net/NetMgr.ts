import { MgrBase } from "../core/MgrBase";
import {
    HttpMethod,
    HttpRequestOptions,
    HttpResponse,
    HttpResponseType,
    SocketChannel,
    SocketChannelEvents,
    SocketCodec,
    SocketCodecProvider,
    SocketCreateOptions,
    SocketTransportFactory,
    SocketTransportProvider,
} from "./Types";
import type { INetTransport } from "./socket/Transport";
import { WebSocketTransport } from "./socket/WebSocketTransport";

const textDecoder = new TextDecoder();

class SocketChannelImpl<TSend = unknown, TReceive = unknown> implements SocketChannel<TSend, TReceive> {
    public readonly key: string;
    public readonly url: string;
    public readonly protocols?: string | string[];

    private readonly transport: INetTransport;
    private readonly codec: SocketCodec<TSend, TReceive>;
    private events: SocketChannelEvents<TReceive> = {};

    constructor(param: {
        key: string;
        url: string;
        protocols?: string | string[];
        transport: INetTransport;
        codec: SocketCodec<TSend, TReceive>;
        events?: SocketChannelEvents<TReceive>;
    }) {
        this.key = param.key;
        this.url = param.url;
        this.protocols = param.protocols;
        this.transport = param.transport;
        this.codec = param.codec;
        this.events = param.events || {};

        this.bindTransportEvents();
    }

    public get state(): TransportState {
        return this.transport.state;
    }

    public async connect(): Promise<void> {
        await this.transport.connect(this.url, this.protocols);
    }

    public async send(payload: TSend): Promise<void> {
        const encoded = await this.codec.encode(payload);
        this.transport.send(encoded);
    }

    public close(code?: number, reason?: string): void {
        this.transport.close(code, reason);
    }

    public setEvents(events: SocketChannelEvents<TReceive>): SocketChannel<TSend, TReceive> {
        this.events = events || {};
        return this;
    }

    public resetEvents(): void {
        this.events = {};
        this.transport.onOpen = undefined;
        this.transport.onClose = undefined;
        this.transport.onError = undefined;
        this.transport.onMessage = undefined;
    }

    private bindTransportEvents(): void {
        this.transport.onOpen = () => this.events.onOpen?.();
        this.transport.onClose = (ev) => this.events.onClose?.(ev);
        this.transport.onError = (error) => this.events.onError?.(error);
        this.transport.onMessage = (raw) => {
            void this.handleIncoming(raw);
        };
    }

    private async handleIncoming(raw: TransportPayload): Promise<void> {
        try {
            const decoded = await this.codec.decode(raw);
            this.events.onMessage?.(decoded, raw);
        } catch (error) {
            this.events.onError?.(error);
        }
    }
}

export class HttpError<T = unknown> extends Error {
    public readonly response: HttpResponse<T>;

    constructor(response: HttpResponse<T>) {
        super(`HTTP ${response.status}: ${response.statusText}`);
        this.name = "HttpError";
        this.response = response;
    }
}

export class NetMgr extends MgrBase {
    private httpBaseUrl: string = "";
    private httpTimeoutMs: number = 15000;
    private readonly httpDefaultHeaders: Map<string, string> = new Map();

    private readonly socketChannels: Map<string, SocketChannelImpl<unknown, unknown>> = new Map();
    private readonly socketTransportFactories: Map<string, SocketTransportFactory> = new Map();
    private readonly socketCodecs: Map<string, SocketCodec<unknown, unknown>> = new Map();

    constructor() {
        super();
    }

    public async initialize(): Promise<void> {
        this.registerSocketTransport("websocket", () => new WebSocketTransport());
        this.registerSocketCodec("raw", this.createRawCodec());
        this.registerSocketCodec("text", this.createTextCodec());
        this.registerSocketCodec("json", this.createJsonCodec());
    }

    public async onShutdown(): Promise<void> {
        for (const key of Array.from(this.socketChannels.keys())) {
            this.removeSocket(key, 1000, "manager_shutdown");
        }
        this.socketChannels.clear();
        this.socketCodecs.clear();
        this.socketTransportFactories.clear();
    }

    public setHttpBaseUrl(baseUrl: string): void {
        this.httpBaseUrl = baseUrl || "";
    }

    public setHttpTimeout(timeoutMs: number): void {
        this.httpTimeoutMs = Math.max(0, timeoutMs || 0);
    }

    public setHttpDefaultHeader(key: string, value: string): void {
        this.httpDefaultHeaders.set(key, value);
    }

    public removeHttpDefaultHeader(key: string): void {
        this.httpDefaultHeaders.delete(key);
    }

    public clearHttpDefaultHeaders(): void {
        this.httpDefaultHeaders.clear();
    }

    public async request<TData = unknown, TBody = unknown>(opt: HttpRequestOptions<TBody>): Promise<HttpResponse<TData>> {
        const method = opt.method || HttpMethod.GET;
        const url = this.buildRequestUrl(opt.url, opt.query);
        const timeoutMs = opt.timeoutMs ?? this.httpTimeoutMs;
        const throwOnHttpError = opt.throwOnHttpError !== false;

        const headers = this.buildHeaders(opt.headers);
        const body = this.resolveBody(opt.body, headers);
        const controller = new AbortController();
        const signal = controller.signal;
        const externalSignal = opt.signal;
        let onAbort: () => void = null;

        if (externalSignal) {
            onAbort = () => controller.abort();
            if (externalSignal.aborted) {
                controller.abort();
            } else {
                externalSignal.addEventListener("abort", onAbort, { once: true });
            }
        }

        const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;

        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal,
                credentials: opt.credentials,
            });

            const responseType = opt.responseType || HttpResponseType.JSON;
            const data = await this.resolveResponseData<TData>(response, responseType);
            const normalized = this.normalizeHttpResponse(response, data);

            if (!normalized.ok && throwOnHttpError) throw new HttpError(normalized);
            return normalized;
        } finally {
            if (timer) clearTimeout(timer);
            if (externalSignal && onAbort) {
                externalSignal.removeEventListener("abort", onAbort);
            }
        }
    }

    public get<TData = unknown>(opt: Omit<HttpRequestOptions<never>, "method">): Promise<HttpResponse<TData>> {
        return this.request<TData, never>({ ...opt, method: HttpMethod.GET });
    }

    public post<TData = unknown, TBody = unknown>(opt: Omit<HttpRequestOptions<TBody>, "method">): Promise<HttpResponse<TData>> {
        return this.request<TData, TBody>({ ...opt, method: HttpMethod.POST });
    }

    public registerSocketTransport(name: string, factory: SocketTransportFactory): void {
        this.socketTransportFactories.set(name, factory);
    }

    public registerSocketCodec<TSend = unknown, TReceive = unknown>(name: string, codec: SocketCodec<TSend, TReceive>): void {
        this.socketCodecs.set(name, codec as SocketCodec<unknown, unknown>);
    }

    public createSocket<TSend = unknown, TReceive = unknown>(opt: SocketCreateOptions<TSend, TReceive>): SocketChannel<TSend, TReceive> {
        if (this.socketChannels.has(opt.key)) {
            this.removeSocket(opt.key, 1000, "channel_recreated");
        }

        const transport = this.resolveSocketTransport(opt.transport);
        const codec = this.resolveSocketCodec(opt.codec);
        const channel = new SocketChannelImpl<TSend, TReceive>({
            key: opt.key,
            url: opt.url,
            protocols: opt.protocols,
            transport,
            codec,
            events: opt.events,
        });

        this.socketChannels.set(opt.key, channel as SocketChannelImpl<unknown, unknown>);
        return channel;
    }

    public async openSocket<TSend = unknown, TReceive = unknown>(opt: SocketCreateOptions<TSend, TReceive>): Promise<SocketChannel<TSend, TReceive>> {
        const channel = this.createSocket(opt);
        await channel.connect();
        return channel;
    }

    public getSocket<TSend = unknown, TReceive = unknown>(key: string): SocketChannel<TSend, TReceive> {
        return this.socketChannels.get(key) as unknown as SocketChannel<TSend, TReceive>;
    }

    public async sendSocket<TSend = unknown>(key: string, payload: TSend): Promise<void> {
        const channel = this.getSocket<TSend, unknown>(key);
        if (!channel) throw new Error(`Socket channel not found: ${key}`);
        await channel.send(payload);
    }

    public closeSocket(key: string, code?: number, reason?: string): void {
        const channel = this.socketChannels.get(key);
        if (!channel) return;
        channel.close(code, reason);
    }

    public removeSocket(key: string, code?: number, reason?: string): void {
        const channel = this.socketChannels.get(key);
        if (!channel) return;
        channel.close(code, reason);
        channel.resetEvents();
        this.socketChannels.delete(key);
    }

    private resolveSocketTransport(provider?: SocketTransportProvider): INetTransport {
        if (!provider) {
            return this.resolveSocketTransport("websocket");
        }

        if (typeof provider === "string") {
            const factory = this.socketTransportFactories.get(provider);
            if (!factory) throw new Error(`Socket transport not registered: ${provider}`);
            return factory();
        }

        if (typeof provider === "function") {
            return provider();
        }

        return provider;
    }

    private resolveSocketCodec<TSend = unknown, TReceive = unknown>(provider?: SocketCodecProvider<TSend, TReceive>): SocketCodec<TSend, TReceive> {
        if (!provider) {
            return this.resolveSocketCodec<TSend, TReceive>("raw");
        }

        if (typeof provider === "string") {
            const codec = this.socketCodecs.get(provider);
            if (!codec) throw new Error(`Socket codec not registered: ${provider}`);
            return codec as SocketCodec<TSend, TReceive>;
        }

        return provider;
    }

    private buildRequestUrl(path: string, query?: Record<string, string | number | boolean | null | undefined>): string {
        const base = this.httpBaseUrl || "";
        const hasAbsolutePrefix = /^https?:\/\//i.test(path);
        const rawUrl = hasAbsolutePrefix ? path : `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
        if (!query) return rawUrl;

        const search = new URLSearchParams();
        Object.keys(query).forEach((k) => {
            const value = query[k];
            if (value === null || value === undefined) return;
            search.append(k, String(value));
        });

        const serialized = search.toString();
        if (!serialized) return rawUrl;
        return `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}${serialized}`;
    }
    
    private buildHeaders(headers?: Record<string, string>): Headers {
        const merged = new Headers();
        this.httpDefaultHeaders.forEach((value, key) => merged.set(key, value));
        if (headers) {
            Object.keys(headers).forEach((key) => merged.set(key, headers[key]));
        }
        return merged;
    }

    private resolveBody(body: unknown, headers: Headers): BodyInit | undefined {
        if (body === null || body === undefined) return undefined;
        if (typeof body === "string") return body;
        if (body instanceof FormData) return body;
        if (body instanceof URLSearchParams) return body;
        if (typeof Blob !== "undefined" && body instanceof Blob) return body;
        if (body instanceof ArrayBuffer) return body;
        if (body instanceof Uint8Array) return body;
        if (ArrayBuffer.isView(body)) return body as ArrayBufferView;

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        return JSON.stringify(body);
    }

    private async resolveResponseData<TData>(response: Response, responseType: string): Promise<TData> {
        if (responseType === HttpResponseType.Raw) {
            return response as unknown as TData;
        }

        if (response.status === 204 || response.status === 205) {
            return null as unknown as TData;
        }

        switch (responseType) {
            case HttpResponseType.Text:
                return await response.text() as unknown as TData;
            case HttpResponseType.ArrayBuffer:
                return await response.arrayBuffer() as unknown as TData;
            case HttpResponseType.Blob:
                return await response.blob() as unknown as TData;
            case HttpResponseType.JSON:
            default: {
                const text = await response.text();
                if (!text) return null as unknown as TData;
                return JSON.parse(text) as TData;
            }
        }
    }

    private normalizeHttpResponse<TData>(response: Response, data: TData): HttpResponse<TData> {
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers,
            data,
            raw: response,
        };
    }

    private createRawCodec(): SocketCodec<TransportPayload, TransportPayload> {
        return {
            encode(payload) {
                if (typeof payload === "string" || payload instanceof ArrayBuffer || payload instanceof Uint8Array) {
                    return payload;
                }
                throw new Error("Raw codec only supports string/ArrayBuffer/Uint8Array");
            },
            decode(payload) {
                return payload;
            },
        };
    }

    private createTextCodec(): SocketCodec<unknown, string> {
        return {
            encode(payload) {
                if (typeof payload === "string") return payload;
                if (payload instanceof Uint8Array || payload instanceof ArrayBuffer) return payload;
                return String(payload);
            },
            decode(payload) {
                return payloadToText(payload);
            },
        };
    }

    private createJsonCodec(): SocketCodec<unknown, unknown> {
        return {
            encode(payload) {
                return JSON.stringify(payload);
            },
            decode(payload) {
                const text = payloadToText(payload);
                return text ? JSON.parse(text) : null;
            },
        };
    }
}

function payloadToText(payload: TransportPayload): string {
    if (typeof payload === "string") return payload;
    if (payload instanceof Uint8Array) return textDecoder.decode(payload);
    if (payload instanceof ArrayBuffer) return textDecoder.decode(new Uint8Array(payload));
    return String(payload);
}
