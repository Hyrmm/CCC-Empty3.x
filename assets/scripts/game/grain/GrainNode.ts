import { Node } from "cc";

export class GrainNode {
    constructor(
        public readonly grainId: number,
        public readonly node: Node,
    ) {
    }
}
