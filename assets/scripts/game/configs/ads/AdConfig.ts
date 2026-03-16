import { AdConfig, AdPlacement } from "../../types/GameTypes";

export const AdConfigs: AdConfig[] = [
    {
        placement: AdPlacement.AnswerHint,
        unitId: "mock-answer-hint",
        cooldownSeconds: 15,
        fallbackEnabled: true,
    },
    {
        placement: AdPlacement.ExtraTime,
        unitId: "mock-extra-time",
        cooldownSeconds: 15,
        fallbackEnabled: true,
    },
    {
        placement: AdPlacement.DisplayZone,
        unitId: "mock-display-zone",
        cooldownSeconds: 10,
        fallbackEnabled: true,
    },
    {
        placement: AdPlacement.Settlement,
        unitId: "mock-settlement",
        cooldownSeconds: 30,
        fallbackEnabled: true,
    },
];
