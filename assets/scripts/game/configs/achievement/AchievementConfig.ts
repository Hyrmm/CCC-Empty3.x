import { AchievementConfig } from "../../types/GameTypes";

export const AchievementConfigs: AchievementConfig[] = [
    {
        id: "start-10",
        title: "熟能生巧",
        description: "累计开始 10 局游戏。",
        metric: "startCount",
        target: 10,
    },
    {
        id: "win-10",
        title: "初显身手",
        description: "累计通关 10 次。",
        metric: "winCount",
        target: 10,
    },
    {
        id: "level-10",
        title: "一路向前",
        description: "关卡模式通过到第 10 关。",
        metric: "maxLevelId",
        target: 10010,
    },
    {
        id: "rice-1000",
        title: "粒粒皆辛苦",
        description: "累计捡出 1000 粒米。",
        metric: "riceCollected",
        target: 1000,
    },
    {
        id: "bean-100",
        title: "绿豆观察家",
        description: "累计捡出 100 颗绿豆。",
        metric: "beanCollected",
        target: 100,
    },
];
