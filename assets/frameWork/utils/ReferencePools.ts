class ReferencePool<T extends object & Resettable> {
    private pool: T[] = [];
    private readonly factory: () => T;
    private readonly maxSize: number;

    constructor(ctor: Constructor<T>, maxSize: number = 100) {
        this.factory = () => new ctor();
        this.maxSize = maxSize;
    }

    public acquire(): T {
        return this.pool.pop() ?? this.factory();
    }

    public release(obj: T): void {
        if (obj.reset) obj.reset();

        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
        }
    }

    get size(): number {
        return this.pool.length;
    }
}

export const ReferencePools = new class {
    private pools: Map<Constructor<Resettable>, ReferencePool<any>> = new Map();

    /**
     * 注册一个类型的对象池
     */
    public register<T extends Resettable>(ctor: Constructor<T>, maxSize: number = 100): void {
        if (!this.pools.has(ctor)) {
            this.pools.set(ctor, new ReferencePool(ctor, maxSize));
        }
    }

    /**
     * 获取对象
     */
    public acquire<T extends Resettable>(ctor: Constructor<T>): T {
        const pool = this.pools.get(ctor);
        if (!pool) {
            throw new Error(`ReferencePool for "${ctor.name}" not registered`);
        }
        return pool.acquire();
    }

    /**
     * 回收对象
     */
    public release<T extends Resettable>(ctor: Constructor<T>, obj: T): void {
        const pool = this.pools.get(ctor);
        if (!pool) {
            throw new Error(`ReferencePool for "${ctor.name}" not registered`);
        }
        pool.release(obj);
    }

    /**
     * 获取某个池的可用数量
     */
    public size<T extends Resettable>(ctor: Constructor<T>): number {
        return this.pools.get(ctor)?.size ?? 0;
    }
};
