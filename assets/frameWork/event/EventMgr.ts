import { MgrBase } from "../core/MgrBase";
import { ReferencePools } from "../utils/ReferencePools";
import { EventHandler } from "./EventHandler";

export class EventMgr<T> extends MgrBase {
    private listeners: Map<keyof T, Map<unknown, EventHandler<T[keyof T]>>> = new Map();

    constructor() {
        super();
        ReferencePools.register(EventHandler);
    }

    public on<K extends keyof T>(event: K, handler: (payload: T[K]) => void, context: any) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Map());

        const eventHandlers = this.listeners.get(event);
        const eventHandler = ReferencePools.acquire(EventHandler<T[keyof T]>);
        eventHandler.init(handler, context);
        eventHandlers.set(eventHandler.cb, eventHandler);
    }

    public emit<K extends keyof T>(event: K, data: T[K]) {
        const eventHandlers = this.listeners.get(event);
        if (!eventHandlers) return;

        eventHandlers.forEach((handler) => {
            handler.cb.call(handler.context || {}, data);
        });
    }

    public offByContext<K extends keyof T>(event: K, context: any) {
        const eventHandlers = this.listeners.get(event);
        if (!eventHandlers) return;

        eventHandlers.forEach((handler, key) => {
            if (handler.context !== context) return;
            ReferencePools.release(EventHandler, handler);
            eventHandlers.delete(key);
        });
    }
}
