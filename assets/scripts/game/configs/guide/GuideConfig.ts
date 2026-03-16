import { GuideStepConfig } from "../../types/GameTypes";

export const GuideConfigs: GuideStepConfig[] = [
    {
        id: "tap-rice",
        target: "world.grain.first-rice",
        text: "先点击一粒米，确认基础交互。",
        blockInput: true,
    },
    {
        id: "tap-bean",
        target: "world.grain.first-bean",
        text: "找到绿色的豆子并点击拾取。",
        blockInput: true,
    },
    {
        id: "check-display",
        target: "hud.bean-display",
        text: "下方区域会记录你已经捡到的绿豆。",
        blockInput: false,
    },
    {
        id: "answer-count",
        target: "hud.answer-button",
        text: "全部找完后输入绿豆数量即可通关。",
        blockInput: true,
    },
];
