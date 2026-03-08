export class EventHandler<T> {
    public cb: ((payload: T) => void) | null = null;
    public context: any | null = null;

    public init(cb: (payload: T) => void, context: any): void {
        this.cb = cb;
        this.context = context;
    }

    public reset(): void {
        this.cb = null;
        this.context = null;
    }
}