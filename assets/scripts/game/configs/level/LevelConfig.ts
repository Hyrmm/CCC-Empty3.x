import { LevelConfig } from "../../types/GameTypes";

export const LevelConfigs: LevelConfig[] = [
    {
        id: 10001,
        riceRange: [50, 60],
        beanRange: [5, 8],
        timeLimit: 60,
        displayZones: [2, 2, 5],
        hintDelta: 1,
        rewardExtraTime: 15,
        topBeanRatioMin: 0.25,
    },
    {
        id: 10002,
        riceRange: [70, 90],
        beanRange: [8, 12],
        timeLimit: 75,
        displayZones: [2, 3, 6],
        hintDelta: 1,
        rewardExtraTime: 15,
        topBeanRatioMin: 0.2,
    },
    {
        id: 10003,
        riceRange: [100, 140],
        beanRange: [10, 16],
        timeLimit: 90,
        displayZones: [3, 3, 8],
        hintDelta: 2,
        rewardExtraTime: 20,
        topBeanRatioMin: 0.18,
    },
];
