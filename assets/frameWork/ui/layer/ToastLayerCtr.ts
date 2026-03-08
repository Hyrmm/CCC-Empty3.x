import FormBase from "../form/FormBase";
import { LayerCtrBase, ILayerCtr } from "./LayerCtr";

export class ToastLayerCtr extends LayerCtrBase implements ILayerCtr {

    private formMap: Map<number, FormBase> = new Map();

    public getForm(formId: number): FormBase {
        return this.formMap.get(formId);
    }

    public addForm(form: FormBase, payload: FormNameMap[FormName]): void {
        super.addForm(form, payload);
        this.formMap.set(form.formId, form);
    }

    public removeForm(formId: number): void {
        super.removeForm(formId);
        this.formMap.delete(formId);
    }

    public onReset() {
        this.formMap.clear();
    }

    public onDestroy() {
        this.formMap.clear();
    }
}
