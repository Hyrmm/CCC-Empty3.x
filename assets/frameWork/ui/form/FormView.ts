import { CCBoolean, _decorator } from "cc";
import FormBase from "./FormBase";
import { FrameworkFormType } from "./Types";

const { ccclass, property } = _decorator;

@ccclass
export default class FormView extends FormBase {
    public formType: FormType = FrameworkFormType.View;

    @property({ type: CCBoolean, visible: false })
    public alphaMask: boolean = false;
}
