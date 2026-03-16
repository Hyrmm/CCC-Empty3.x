import { Node } from "cc";

export class BowlController {
    constructor(public readonly root: Node | null) {
    }

    public get bowlNode(): Node | null {
        return this.root;
    }
}
