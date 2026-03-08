import { Node, Prefab } from "cc";
import FormBase from "./FormBase";
import { FormAnimation, FrameworkFormType } from "./Types";
import { _decorator, CCBoolean } from "cc";
import { Enum } from "cc";
const { ccclass, property } = _decorator;


export default class FormModal extends FormBase {

    @property({ type: CCBoolean })
    public alphaMask: boolean = false;

    @property({ type: CCBoolean })
    public quickClose: boolean = false;

    public formType: FormType = FrameworkFormType.Modal;

    private onQuickClose(): void {
        this.close();
    }

    public onInit(payload: { formId: number, config?: FormConfig, prefeb?: Prefab }): void {
        super.onInit(payload);
        this.node.off(Node.EventType.TOUCH_END, this.onQuickClose, this);
        if (this.quickClose) this.node.on(Node.EventType.TOUCH_END, this.onQuickClose, this);
    }
}
