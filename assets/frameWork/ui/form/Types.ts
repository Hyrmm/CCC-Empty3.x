import { Node } from "cc";

export const FrameworkFormType = {
    View: "View",
    Modal: "Modal",
} as const;

export interface FrameworkFormNameMap {
    "gfw:error:dialog": {}
}

export const FormAnimation = {
    None: "None",
    ZoomOpen: "ZoomOpen",
    ZoomClose: "ZoomClose",
} as const;

export type FormAnimation = typeof FormAnimation[keyof typeof FormAnimation];

export type FormAnimFn = (node: Node) => Promise<void>;
export type FormAnimRestFn = (node: Node) => void;

export type FormAnimRegistetOpt = {
    type: "open" | "close",
    animation: string,
    /** 动画执行函数 */
    fnAnim: FormAnimFn,
    /** 动画结束后的重置函数，用于重置节点状态 */
    fnReset: FormAnimRestFn
}

declare global {

    interface FormTypeMap {
        View: "View";
        Modal: "Modal";
    }

    interface FormConfig {
        formName: FormName;
        prefebPath: string;
    }

    interface FormNameMap extends FrameworkFormNameMap {
    }

    type FormType = FormTypeMap[keyof FormTypeMap];
    type FormName = keyof FormNameMap;
}