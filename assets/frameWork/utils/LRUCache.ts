type LRUCacheParam<T> = {
    maxSize?: number;
    onRelease?: (value: T) => void;
}

type keyType = number | string | object;

export class LRUNode<T> {
    public key: keyType;
    public value: T;
    public prev: LRUNode<T> = null;
    public next: LRUNode<T> = null;

    constructor(key: keyType, value: T) {
        this.key = key;
        this.value = value;
    }
}

export class LRUCache<T> {
    private head: LRUNode<T> = null;
    private tail: LRUNode<T> = null;
    private cacheMap: Map<keyType, LRUNode<T>> = new Map();

    private param: LRUCacheParam<T>;

    constructor(param: LRUCacheParam<T>) {
        this.param = param;
    }

    public get(key: keyType): LRUNode<T> | void {
        if (!this.cacheMap.has(key)) return console.warn(`LRUCache: key=${key} not found`);
        const node = this.cacheMap.get(key);
        this.removeNode(node);
        return node;
    }

    public set(key: keyType, value: T): void {
        if (this.cacheMap.has(key)) return console.error(`LRUCache: key=${key} already exists`);
        const node = new LRUNode(key, value);
        this.cacheMap.set(key, node);
        this.addNode(node);

        if (this.param.maxSize != null && this.param.maxSize >= 0 && this.cacheMap.size > this.param.maxSize) {
            this.recycle();
        }
    }

    public has(key: keyType): boolean {
        return this.cacheMap.has(key);
    }

    public clear(): void {
        this.cacheMap.clear();
        this.head = null;
        this.tail = null;
    }

    public release(key: keyType): void {
        const node = this.cacheMap.get(key);
        if (!node) return console.error(`LRUCache: key=${key} not found`);
        this.removeNode(node);
        this.param.onRelease?.(node.value);
    }

    public setSize(size: number): void {
        this.param.maxSize = size;
        if (this.param.maxSize != null && this.param.maxSize >= 0) this.recycle();
    }

    private addNode(node: LRUNode<T>): void {
        if (this.head) {
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        } else {
            this.head = node;
            this.tail = node;
        }
    }

    private removeNode(node: LRUNode<T>): void {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
        this.cacheMap.delete(node.key);
    }

    private recycle(): void {
        if (this.param.maxSize == null || this.param.maxSize < 0) return;
        for (let i = 0; i < this.cacheMap.size - this.param.maxSize; i++) {
            if (!this.tail) break;
            this.release(this.tail.key);
        }
    }
}
