import { FormAnimation, FormAnimRegistetOpt } from "./Types";
import { Node, tween, v3 } from "cc";

export const FormAnimInfos: FormAnimRegistetOpt[] = [
    {
        type: "open",
        animation: FormAnimation.ZoomOpen,
        fnAnim: (node: Node) => {
            node.setScale(0, 0, 0);
            return new Promise<void>((resolve) => tween(node).to(.35, { scale: v3(1, 1, 1) }, { easing: "backOut" }).call(() => resolve()).start())
        },
        fnReset: (node: Node) => {
            node.setScale(1, 1, 1);
        }
    },
    {
        type: "close",
        animation: FormAnimation.ZoomClose,
        fnAnim: (node: Node) => {
            node.setScale(1, 1, 1);
            return new Promise<void>((resolve) => tween(node).to(.25, { scale: v3(0, 0, 1) }, { easing: "backIn" }).call(() => resolve()).start())
        },
        fnReset: (node: Node) => {
            node.setScale(1, 1, 1);
        }
    }
]