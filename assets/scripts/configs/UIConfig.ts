import { FrameworkFormType } from "../../frameWork/ui/form/Types";

export const FormConfigs: FormConfig[] = [] as const;

const ExtraFormType = {
} as const


declare global {

    interface FormNameMap {
        "common:map:view": {}
        "common:confirm:modal": {}
        "common:toast:view": {}
    }

    interface FormTypeMap {
    }
}

FormConfigs.push({
    formName: "common:confirm:modal",
    prefebPath: "prefab/form/confirmModal@common",
})

FormConfigs.push({
    formName: "common:map:view",
    prefebPath: "prefab/form/mapView@common",
})