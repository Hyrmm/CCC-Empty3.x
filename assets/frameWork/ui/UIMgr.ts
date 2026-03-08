
import { MgrBase } from "../core/MgrBase";
import { instantiate, Node, Prefab } from "cc";
import { LayerType } from "./layer/Types";
import FormBase from "./form/FormBase";
import { LayerCtrBase } from "./layer/LayerCtr";
import { FormAnimation, FrameworkFormType } from "./form/Types";
import { DefaultLayerCtr } from "./layer/DefaultLayerCtr";
import { ToastLayerCtr } from "./layer/ToastLayerCtr";
import { SystemLayerCtr } from "./layer/SystemLayerCtr";
import { LRUCache } from "../utils/LRUCache";
import { ResLoader } from "../res/ResLoader";
import { tween, v3 } from "cc";
import { FormAnimInfos } from "./form/FormAnim";
import { ReferencePools } from "../utils/ReferencePools";
import { ResSpriteUtil } from "../res/ResSpriteUtil";

type UIMgrConfig = {
    rootNode: Node;
    formCacheSize: number;
}

export class UIMgr extends MgrBase {

    private root: Node = null;
    private resLoader: ResLoader = ResLoader.create();

    private formIdGenerator: number = 0;
    private formId2LayerCtr: Map<number, LayerCtrBase> = new Map();
    private formType2LayerCtr: Map<FormType, LayerCtrBase> = new Map();
    private layerType2LayerCtr: Map<LayerType, LayerCtrBase> = new Map();

    private formName2FormConfig: Map<keyof FormNameMap, FormConfig> = new Map();
    private formName2FormCache: LRUCache<FormBase> = new LRUCache({ maxSize: 5, onRelease: (form: FormBase) => this.releaseForm(form) });

    private openFormCurrent: { formName: FormName, payload: FormNameMap[FormName], resolve: (form: FormBase) => void } = null;
    private openFormQueue: { formName: FormName, payload: FormNameMap[FormName], resolve: (form: FormBase) => void }[] = [];

    constructor() {
        super();
        ReferencePools.register(ResSpriteUtil);
    }

    public async initialize() {
        super.initialize();

        this.registerLayer(LayerType.Default, DefaultLayerCtr, [FrameworkFormType.View, FrameworkFormType.Modal]);
        this.registerLayer(LayerType.Toast, ToastLayerCtr, []);
        this.registerLayer(LayerType.System, SystemLayerCtr, []);

        FormAnimInfos.forEach(info => FormBase.registerFormAnim(info));
    }

    public setCofig(config: UIMgrConfig) {
        if (config.rootNode) this.setRoot(config.rootNode);
        if (config.formCacheSize) this.formName2FormCache.setSize(config.formCacheSize);
    }

    public openForm(formName: FormName, payload: FormNameMap[FormName]): Promise<FormBase | void> {
        return new Promise((resolve, reject) => this.openFormQueue.push({ formName, payload, resolve }));
    }

    public closeForm(form: FormBase) {
        const layerCtr = this.formType2LayerCtr.get(form.formType);
        if (layerCtr) layerCtr.removeForm(form.formId);
        this.formId2LayerCtr.delete(form.formId);
        this.formName2FormCache.set(form.formConfig.formName, form);
    }

    private releaseForm(form: FormBase): void {
        form.onRelease();
        form.node.destroy();
        this.resLoader.releaseByAsset(form.prefeb);
    }

    public addFormConfig<T extends FormConfig>(config: T | T[]): void {
        if (Array.isArray(config)) {
            config.forEach(item => this.formName2FormConfig.set(item.formName, item))
        } else {
            this.formName2FormConfig.set(config.formName as FormName, config);
        }
    }

    public getFormConfig<T extends FormConfig>(formName: keyof FormNameMap): T {
        return this.formName2FormConfig.get(formName) as T;
    }

    public registerLayer<T extends LayerCtrBase>(layerType: LayerType, ctr: Constructor<T>, formTypes: FormType[]): void {

        const layerCtr = new ctr({ layer: new Node(layerType) });
        layerCtr.onReset();

        this.layerType2LayerCtr.set(layerType, layerCtr);
        formTypes.forEach(formType => this.formType2LayerCtr.set(formType, layerCtr));
    }

    public onUpdate(dt: number): void {

        if (!this.openFormCurrent && this.openFormQueue.length) {
            this.openFormInternal()
        }

        for (const layerCtr of this.layerType2LayerCtr.values()) {
            layerCtr.onUpdate(dt);
        }
    }

    public onShutdown(): Promise<void> {

        for (const layerCtr of this.layerType2LayerCtr.values()) {
            layerCtr.onDestroy();
        }

        this.layerType2LayerCtr.clear();
        this.formType2LayerCtr.clear();
        this.formName2FormConfig.clear();
        this.formId2LayerCtr.clear();
        this.formName2FormCache.clear();

        this.formIdGenerator = 0;

        this.openFormCurrent = null;
        this.openFormQueue = [];

        return Promise.resolve();
    }

    private setRoot(root: Node): void {
        for (const layerCtr of this.layerType2LayerCtr.values()) {
            layerCtr.onReset();
            root.addChild(layerCtr.layer);
        }

        this.root = root;
    }

    private async openFormInternal(): Promise<void> {

        this.openFormCurrent = this.openFormQueue.shift();
        const { formName, payload, resolve } = this.openFormCurrent;
        const config = this.getFormConfig(formName);

        const cache = this.formName2FormCache.get(formName);

        let formComp: FormBase;

        if (cache) {
            formComp = cache.value;
            formComp.onInit({ formId: this.formIdGenerator++ });
        } else {

            if (!config) {
                resolve(null);
                this.openFormCurrent = null;
                return console.error(`Form config not found for formName: ${formName}`);
            }

            const prefeb = await this.resLoader.loadPrefab(config.prefebPath);
            if (!prefeb) {
                resolve(null);
                this.openFormCurrent = null;
                return console.error(`Form prefeb not found for formName: ${formName}`);
            }

            formComp = instantiate(prefeb).getComponent(FormBase);
            formComp.onInit({ config, formId: this.formIdGenerator++, prefeb });
        }

        const layerCtr = this.formType2LayerCtr.get(formComp.formType);
        if (layerCtr) {
            layerCtr.addForm(formComp, payload);
            this.formId2LayerCtr.set(formComp.formId, layerCtr);
        }

        resolve(formComp);
        this.openFormCurrent = null;
    }
}
