
import { Component, _decorator, Enum, CCBoolean, Prefab } from "cc";
import { ResLoader } from "../../res/ResLoader";
import { Sprite } from "cc";
import { FormAnimation, FormAnimFn, FormAnimRegistetOpt, FormAnimRestFn } from "./Types";
import { ResSpriteUtil } from "../../res/ResSpriteUtil";
const { ccclass, property } = _decorator;

@ccclass
export default abstract class FormBase extends Component {

    private static FormAnimRegistry = {
        open: new Map<string, { fnAnim: FormAnimFn, fnReset: FormAnimRestFn }>(),
        close: new Map<string, { fnAnim: FormAnimFn, fnReset: FormAnimRestFn }>(),
    };

    static registerFormAnim(opt: FormAnimRegistetOpt): void {
        const { type, animation, fnAnim, fnReset } = opt;
        this.FormAnimRegistry[type].set(animation, { fnAnim, fnReset });
    }

    abstract formType: FormType;

    @property({ type: Enum(FormAnimation) })
    public openAnimation: string = FormAnimation.None;

    @property({ type: Enum(FormAnimation) })
    public closeAnimation: string = FormAnimation.None;

    public formId: number = 0;
    public formConfig: FormConfig = null;
    public prefeb: Prefab = null;

    public resLoader: ResLoader = null;
    public resSpriteUtil: ResSpriteUtil = null;

    private inOpening: boolean = false;
    private inClosing: boolean = false;

    public onInit(payload: { formId: number, config?: FormConfig, prefeb?: Prefab }): void {

        this.formId = payload.formId;
        this.formConfig = payload.config || this.formConfig;
        this.prefeb = payload.prefeb || this.prefeb;

        this.resLoader = FrameWork.mgrHub.res.acquireResLoader();
        this.resSpriteUtil = FrameWork.mgrHub.res.acquireResSpriteUtil().bindResLoader(this.resLoader);

        this.inOpening = false;
        this.inClosing = false;
    }

    public onRelease(): void {
        FrameWork.mgrHub.res.releaseResSpriteUtil(this.resSpriteUtil);
        FrameWork.mgrHub.res.releaseResLoader(this.resLoader);
    }

    public onOpen(payload: FormNameMap[FormName]): void { }
    public onClose(): void { }

    public onShow(): void { }
    public onHide(): void { }

    public onAnimationOpenStart(): void {
        this.inOpening = true;
    }

    public onAnimationOpenEnd(): void {
        this.inOpening = false;
    }

    public onAnimationCloseStart(): void {
        this.inClosing = true;
    }

    public onAnimationCloseEnd(): void {
        this.inClosing = false;
    }

    public onEnterScene(): void {
        if (this.openAnimation) this.doOpenAnimation();
    }

    public onExitScene(): void {
    }

    public close(): void {
        if (this.inOpening || this.inClosing) return;

        if (this.closeAnimation) {
            this.doCloseAnimation().then(() => FrameWork.mgrHub.ui.closeForm(this));
        } else {
            FrameWork.mgrHub.ui.closeForm(this);
        }
    }

    private async doOpenAnimation(): Promise<void> {
        const animInfo = FormBase.FormAnimRegistry.open.get(this.openAnimation);
        if (!animInfo) return console.error(`Animation not found: ${this.openAnimation}`);

        this.onAnimationOpenStart();
        await animInfo.fnAnim(this.node);
        this.onAnimationOpenEnd();
        animInfo.fnReset(this.node);
    }

    private async doCloseAnimation(): Promise<void> {
        const animInfo = FormBase.FormAnimRegistry.close.get(this.closeAnimation);
        if (!animInfo) return console.error(`Animation not found: ${this.closeAnimation}`);

        this.onAnimationCloseStart();
        await animInfo.fnAnim(this.node);
        this.onAnimationCloseEnd();
        animInfo.fnReset(this.node);
    }


}
