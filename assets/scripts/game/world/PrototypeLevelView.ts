import { Camera, EventTouch, geometry, Input, input, instantiate, Node, Vec3 } from "cc";
import { LevelModel } from "../level/LevelModel";
import { GrainData, GrainType, LevelRuntimeData } from "../types/GameTypes";
import { WorldScene } from "./WorldScene";

export type GrainPickHandler = (grainId: number) => void;

export class PrototypeLevelView {
    private readonly grainNodes = new Map<number, { node: Node; grain: GrainData; halfExtents: Vec3 }>();
    private readonly pickRay = geometry.Ray.create();
    private pickHandler: GrainPickHandler | null = null;
    private runtime: LevelRuntimeData | null = null;
    private camera: Camera | null = null;
    private riceTemplate: Node | null = null;
    private beanTemplate: Node | null = null;
    private floorNode: Node | null = null;

    constructor(private readonly worldScene: WorldScene) {
    }

    public initialize(camera: Camera | null): string[] {
        const warnings: string[] = [];
        this.camera = camera;
        this.riceTemplate = this.worldScene.root ? this.worldScene.root.getChildByName("Cube") || null : null;
        this.beanTemplate = this.worldScene.root ? this.worldScene.root.getChildByName("Capsule") || null : null;

        if (!this.camera) warnings.push("未找到 3D Camera，当前只会显示 HUD。请确认 `3DRoot/Camera` 存在。");
        if (!this.riceTemplate || !this.beanTemplate) warnings.push("未在 `3DRoot` 下找到 `Cube` 或 `Capsule` 模板，颗粒原型将不可见。");

        if (this.riceTemplate) this.riceTemplate.active = false;
        if (this.beanTemplate) this.beanTemplate.active = false;

        this.ensureFloor();
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        if (this.camera) {
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        return warnings;
    }

    public setPickHandler(handler: GrainPickHandler): void {
        this.pickHandler = handler;
    }

    public render(level: LevelModel): void {
        this.runtime = level.runtime;
        this.clearGrainNodes();

        level.runtime.grains.forEach((grain) => {
            const template = grain.type === GrainType.Bean ? (this.beanTemplate || this.riceTemplate) : (this.riceTemplate || this.beanTemplate);
            if (!template) return;

            const node = instantiate(template);
            node.active = grain.exposed && !grain.collected;
            node.name = `Grain-${grain.id}`;
            node.parent = this.worldScene.grainRoot || this.worldScene.root;
            node.setPosition(this.toScenePosition(grain.localPos));
            node.setRotationFromEuler(grain.rotation.x, grain.rotation.y, grain.rotation.z);

            const scale = this.toSceneScale(grain);
            node.setScale(scale);

            this.grainNodes.set(grain.id, {
                node,
                grain,
                halfExtents: new Vec3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5),
            });
        });
    }

    public refresh(runtime: LevelRuntimeData): void {
        this.runtime = runtime;
        runtime.grains.forEach((grain) => {
            const view = this.grainNodes.get(grain.id);
            if (!view) return;
            view.node.active = grain.exposed && !grain.collected;
        });
    }

    public dispose(): void {
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.clearGrainNodes();
    }

    private ensureFloor(): void {
        if (this.floorNode || !this.riceTemplate) return;

        this.floorNode = instantiate(this.riceTemplate);
        this.floorNode.name = "PrototypeFloor";
        this.floorNode.parent = this.worldScene.bowlRoot || this.worldScene.root;
        this.floorNode.active = true;
        this.floorNode.setPosition(0, -3, 0);
        this.floorNode.setScale(28, 0.6, 28);
    }

    private onTouchEnd(event: EventTouch): void {
        if (!this.pickHandler || !this.camera || !this.runtime) return;

        const location = event.getLocation();
        const ray = this.camera.screenPointToRay(location.x, location.y, this.pickRay);

        let selectedGrainId: number | null = null;
        let minDistance = Number.MAX_VALUE;

        this.grainNodes.forEach((view, grainId) => {
            if (view.grain.collected || !view.grain.exposed || !view.node.activeInHierarchy) return;

            const worldPosition = view.node.worldPosition;
            const bounds = geometry.AABB.create(
                worldPosition.x,
                worldPosition.y,
                worldPosition.z,
                view.halfExtents.x,
                view.halfExtents.y,
                view.halfExtents.z,
            );
            const distance = geometry.intersect.rayAABB(ray, bounds);
            if (distance <= 0 || distance >= minDistance) return;

            minDistance = distance;
            selectedGrainId = grainId;
        });

        if (selectedGrainId !== null) {
            this.pickHandler(selectedGrainId);
        }
    }

    private clearGrainNodes(): void {
        this.grainNodes.forEach((view) => view.node.destroy());
        this.grainNodes.clear();
    }

    private toScenePosition(localPos: Vec3): Vec3 {
        return new Vec3(localPos.x * 5, localPos.y * 5, localPos.z * 5);
    }

    private toSceneScale(grain: GrainData): Vec3 {
        if (grain.type === GrainType.Bean) {
            return new Vec3(1.1 * grain.scale, 0.75 * grain.scale, 1.1 * grain.scale);
        }

        return new Vec3(1.3 * grain.scale, 0.25 * grain.scale, 0.65 * grain.scale);
    }
}
