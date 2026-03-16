import { Camera, Node } from "cc";

export class CameraController {
    private readonly camera: Camera | null;

    constructor(root: Node | null) {
        this.camera = root ? root.getComponentInChildren(Camera) || null : null;
    }

    public get activeCamera(): Camera | null {
        return this.camera;
    }
}
