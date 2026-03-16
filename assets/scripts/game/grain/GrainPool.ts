import { Node } from "cc";
import { GrainNode } from "./GrainNode";

export class GrainPool {
    private readonly nodes = new Map<number, GrainNode>();

    public bind(grainId: number, node: Node): GrainNode {
        const grainNode = new GrainNode(grainId, node);
        this.nodes.set(grainId, grainNode);
        return grainNode;
    }

    public get(grainId: number): GrainNode | null {
        return this.nodes.get(grainId) || null;
    }

    public release(grainId: number): void {
        this.nodes.delete(grainId);
    }

    public clear(): void {
        this.nodes.clear();
    }
}
