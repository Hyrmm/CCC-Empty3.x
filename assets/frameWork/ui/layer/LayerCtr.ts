import { Node, Sprite, SpriteFrame, Texture2D, Widget, CCObject } from "cc";
import FormBase from "../form/FormBase";
import { FrameworkFormType } from "../form/Types";

export interface ILayerCtr {
    addForm<T extends FormBase>(form: T, payload: FormNameMap[FormName]): void;
    getForm(formId: number): FormBase;
    removeForm(formId: number): void;
    onReset(): void;
    onDestroy(): void;
    onUpdate(dt: number): void;
}

export abstract class LayerCtrBase implements ILayerCtr {
    public layer: Node = null;

    constructor(param: { layer: Node; }) {
        this.layer = param.layer;
        this.fitLayer();
    }

    abstract getForm(formId: number): FormBase;

    private fitLayer(): void {

        let widget = this.layer.getComponent(Widget);
        if (!widget) widget = this.layer.addComponent(Widget);

        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;

        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;

        widget.updateAlignment();
    }

    public addForm<T extends FormBase>(form: T, payload: FormNameMap[FormName]) {
        this.layer.addChild(form.node);
        form.onEnterScene();
        form.onOpen(payload);
    }

    public removeForm(formId: number) {
        const formComp = this.getForm(formId);
        if (!formComp) throw new Error(`Form not found for formId: ${formId}`);
        formComp.onClose();
        formComp.node.removeFromParent();
        formComp.onExitScene();
    }

    public onReset() {
        this.layer.removeFromParent();
    }

    public onDestroy() {
        this.layer.removeFromParent();
    }

    public onUpdate(dt: number) {
    }
}


