import { Node } from "cc";

export class WorldScene {
    public readonly cameraRoot: Node;
    public readonly bowlRoot: Node;
    public readonly grainRoot: Node;
    public readonly effectRoot: Node;

    constructor(public readonly root: Node | null) {
        this.cameraRoot = this.ensureNode("CameraRoot");
        this.bowlRoot = this.ensureNode("BowlRoot");
        this.grainRoot = this.ensureNode("GrainRoot");
        this.effectRoot = this.ensureNode("EffectRoot");
    }

    private ensureNode(name: string): Node {
        if (!this.root) return null;

        let node = this.root.getChildByName(name);
        if (!node) {
            node = new Node(name);
            this.root.addChild(node);
        }

        return node;
    }
}
