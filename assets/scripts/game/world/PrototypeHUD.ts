import { Color, HorizontalTextAlignment, Label, Node, UITransform, Vec3, VerticalTextAlignment } from "cc";
import { LevelRuntimeData } from "../types/GameTypes";

export interface PrototypeHUDActions {
    onRestart?: () => void;
    onHint?: () => void;
    onExtraTime?: () => void;
}

export class PrototypeHUD {
    private readonly titleLabel: Label | null;
    private readonly statusLabel: Label | null;
    private readonly tipLabel: Label | null;
    private readonly restartActionNode: Node | null;
    private readonly hintActionNode: Node | null;
    private readonly extraTimeActionNode: Node | null;

    constructor(private readonly uiRoot: Node | null) {
        this.titleLabel = this.createLabel("PrototypeTitle", new Vec3(-380, 275, 0), 28, new Color(255, 240, 200, 255));
        this.statusLabel = this.createLabel("PrototypeStatus", new Vec3(-380, 220, 0), 22, new Color(255, 255, 255, 255), new Vec3(520, 220, 0));
        this.tipLabel = this.createLabel("PrototypeTip", new Vec3(-380, -255, 0), 20, new Color(180, 255, 180, 255), new Vec3(560, 140, 0));
        this.restartActionNode = this.createActionLabel("PrototypeActionRestart", "[重开本关]", new Vec3(275, 275, 0), new Color(255, 210, 140, 255));
        this.hintActionNode = this.createActionLabel("PrototypeActionHint", "[提示广告]", new Vec3(275, 230, 0), new Color(150, 220, 255, 255));
        this.extraTimeActionNode = this.createActionLabel("PrototypeActionExtraTime", "[加时广告]", new Vec3(275, 185, 0), new Color(170, 255, 170, 255));

        this.setTitle("无聊的米 3D 原型");
    }

    public setTitle(message: string): void {
        if (!this.titleLabel) return;
        this.titleLabel.string = message;
    }

    public update(runtime: LevelRuntimeData | null, extraMessage = ""): void {
        if (!this.statusLabel) return;
        if (!runtime) {
            this.statusLabel.string = "等待关卡生成...";
            return;
        }

        const remainingTime = runtime.remainingTime < 0 ? "∞" : String(Math.ceil(runtime.remainingTime));
        this.statusLabel.string = [
            `关卡: ${runtime.levelId}`,
            `剩余时间: ${remainingTime}`,
            `米粒: ${runtime.collectedRice}/${runtime.riceCount}`,
            `绿豆: ${runtime.collectedBean}/${runtime.beanCount}`,
            `可点击颗粒: ${runtime.exposedCount}`,
            runtime.usedHintAd ? "提示广告: 已使用" : "提示广告: 未使用",
            runtime.usedExtraTimeAd ? "加时广告: 已使用" : "加时广告: 未使用",
            extraMessage,
        ].filter(Boolean).join("\n");
    }

    public setTip(message: string): void {
        if (!this.tipLabel) return;
        this.tipLabel.string = message;
    }

    public setActions(actions: PrototypeHUDActions): void {
        this.bindAction(this.restartActionNode, actions.onRestart);
        this.bindAction(this.hintActionNode, actions.onHint);
        this.bindAction(this.extraTimeActionNode, actions.onExtraTime);
    }

    public dispose(): void {
        [this.restartActionNode, this.hintActionNode, this.extraTimeActionNode].forEach((node) => {
            if (!node) return;
            node.targetOff(this);
        });
    }

    private createLabel(name: string, position: Vec3, fontSize: number, color: Color, size = new Vec3(400, 80, 0)): Label | null {
        if (!this.uiRoot) return null;

        let node = this.uiRoot.getChildByName(name);
        if (!node) {
            node = new Node(name);
            this.uiRoot.addChild(node);
        }

        node.setPosition(position);

        let transform = node.getComponent(UITransform);
        if (!transform) transform = node.addComponent(UITransform);
        transform.setContentSize(size.x, size.y);

        let label = node.getComponent(Label);
        if (!label) label = node.addComponent(Label);
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 8;
        label.color = color;
        label.cacheMode = Label.CacheMode.NONE;
        label.horizontalAlign = HorizontalTextAlignment.LEFT;
        label.verticalAlign = VerticalTextAlignment.TOP;
        return label;
    }

    private createActionLabel(name: string, text: string, position: Vec3, color: Color): Node | null {
        if (!this.uiRoot) return null;

        let node = this.uiRoot.getChildByName(name);
        if (!node) {
            node = new Node(name);
            this.uiRoot.addChild(node);
        }

        node.setPosition(position);

        let transform = node.getComponent(UITransform);
        if (!transform) transform = node.addComponent(UITransform);
        transform.setContentSize(180, 36);

        let label = node.getComponent(Label);
        if (!label) label = node.addComponent(Label);
        label.string = text;
        label.fontSize = 22;
        label.lineHeight = 30;
        label.color = color;
        label.cacheMode = Label.CacheMode.NONE;
        label.horizontalAlign = HorizontalTextAlignment.CENTER;
        label.verticalAlign = VerticalTextAlignment.CENTER;
        return node;
    }

    private bindAction(node: Node | null, handler?: () => void): void {
        if (!node) return;

        node.targetOff(this);
        if (!handler) return;
        node.on(Node.EventType.TOUCH_END, handler, this);
    }
}
