export const CommonUIConfig: FormConfig[] = [
    {
        formName: 'common:confirm:modal',
        prefebPath: 'prefab/form/confirmModal@common',
    },
]

declare global {
    interface FormNameMap {
        "common:confirm:modal": {}
    }
}