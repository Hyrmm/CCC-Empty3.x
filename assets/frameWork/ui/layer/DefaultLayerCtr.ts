import { Sprite, Widget, Texture2D, SpriteFrame, Node, UIOpacity, Layers } from "cc";
import FormBase from "../form/FormBase";
import { FrameworkFormType } from "../form/Types";
import { LayerCtrBase, ILayerCtr } from "./LayerCtr";
import FormModal from "../form/FormModal";
import FormView from "../form/FormView";

export class DefaultLayerCtr extends LayerCtrBase implements ILayerCtr {

    private mask: Node = null;
    private formStack: FormBase[] = [];

    public onReset() {
        super.onReset();
        if (!this.mask) this.createMask();
    }

    public onDestroy() {
        super.onDestroy();

        this.mask.getComponent(Sprite).spriteFrame.texture.destroy();
        this.mask.getComponent(Sprite).spriteFrame.destroy();
        this.mask.destroy();
        this.mask = null;
        this.formStack = [];
    }

    public addForm<T extends FormBase>(form: T, payload: FormNameMap[FormName]) {
        super.addForm(form, payload);
        this.formStack.push(form);
        this.applyMask();
        this.applyVisible();
    }

    public getForm(formId: number): FormBase {
        return this.formStack.find(f => f.formId === formId);
    }

    public removeForm(formId: number) {
        super.removeForm(formId);
        const form = this.getForm(formId);
        this.formStack.splice(this.formStack.indexOf(form), 1);
        this.applyMask();
        this.applyVisible();
    }

    private applyMask(): void {
        if (!this.formStack.length) return this.mask.removeFromParent();
        const topForm = this.formStack[this.formStack.length - 1] as (FormModal | FormView);
        if (topForm.formType !== FrameworkFormType.Modal) return this.mask.removeFromParent();
        this.layer.insertChild(this.mask, this.formStack.indexOf(topForm));
        this.mask.getComponent(UIOpacity).opacity = topForm.alphaMask ? 180 : 0;
    }

    private applyVisible(): void {
        if (!this.formStack.length) return;

        const stackLen = this.formStack.length;
        const topForm = this.formStack[this.formStack.length - 1];

        if (!topForm.node.active) {
            topForm.node.active = true;
            topForm.onShow();
        }

        if (stackLen <= 1) return;

        switch (topForm.formType) {
            case FrameworkFormType.Modal: {
                this.applyVisibleModal();
                break;
            }
            case FrameworkFormType.View: {
                this.applyVisibleView();
                break;
            }
            default: {
                break;
            }
        }
    }

    private applyVisibleView(): void {

        for (let i = 0, stackLen = this.formStack.length; i < stackLen - 1; i++) {

            const form = this.formStack[i];
            const active = false;
            const prevActive = form.node.active;

            if (active !== prevActive) {
                form.node.active = active;
                active ? form.onShow() : form.onHide();
            }
        }
    }

    private applyVisibleModal(): void {

        const stackLen = this.formStack.length;

        let lastViewFormIdx = -1;

        for (let i = stackLen - 2; i >= 0; i--) {
            if (this.formStack[i].formType === FrameworkFormType.View) {
                lastViewFormIdx = i;
                break;
            }
        }

        for (let i = 0; i < this.formStack.length - 1; i++) {

            const form = this.formStack[i];
            const active = lastViewFormIdx == -1 || i >= lastViewFormIdx;
            const prevActive = form.node.active;

            if (active !== prevActive) {
                form.node.active = active;
                active ? form.onShow() : form.onHide();
            }
        }

    }

    private createMask(): void {

        if (this.mask) return;
        this.mask = new Node("mask");

        this.mask.layer = Layers.Enum.UI_2D;

        this.mask.addComponent(Widget);
        this.mask.getComponent(Widget).isAlignTop = true;
        this.mask.getComponent(Widget).isAlignBottom = true;
        this.mask.getComponent(Widget).isAlignLeft = true;
        this.mask.getComponent(Widget).isAlignRight = true;
        this.mask.getComponent(Widget).top = 0;
        this.mask.getComponent(Widget).bottom = 0;
        this.mask.getComponent(Widget).left = 0;
        this.mask.getComponent(Widget).right = 0;
        this.mask.getComponent(Widget).updateAlignment();

        this.mask.addComponent(UIOpacity);
        this.mask.getComponent(UIOpacity).opacity = 180;

        const texture = new Texture2D();
        texture.reset({ width: 1, height: 1, format: Texture2D.PixelFormat.RGBA8888 });
        texture.uploadData(new Uint8Array([0, 0, 0, 255]));
        this.mask.addComponent(Sprite);
        this.mask.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
        this.mask.getComponent(Sprite).spriteFrame = new SpriteFrame();
        this.mask.getComponent(Sprite).spriteFrame.texture = texture;
    }
}