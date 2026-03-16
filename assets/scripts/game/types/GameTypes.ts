import { Node, Vec3 } from "cc";

export const GrainType = {
    Rice: 1,
    Bean: 2,
} as const;

export type GrainType = typeof GrainType[keyof typeof GrainType];
export type LevelRange = [number, number];
export type DisplayZoneConfig = [number, number, number];
export type AchievementMetric = "startCount" | "winCount" | "maxLevelId" | "riceCollected" | "beanCollected";

export interface GrainData {
    id: number;
    type: GrainType;
    layer: number;
    localPos: Vec3;
    rotation: Vec3;
    scale: number;
    exposed: boolean;
    collected: boolean;
    blockersAbove: number[];
    supportsBelow: number[];
}

export interface LevelConfig {
    id: number;
    riceRange: LevelRange;
    beanRange: LevelRange;
    timeLimit: number;
    displayZones: DisplayZoneConfig;
    hintDelta: number;
    rewardExtraTime: number;
    topBeanRatioMin: number;
}

export interface LevelRuntimeData {
    levelId: number;
    riceCount: number;
    beanCount: number;
    remainingTime: number;
    collectedRice: number;
    collectedBean: number;
    exposedCount: number;
    usedHintAd: boolean;
    usedExtraTimeAd: boolean;
    grains: GrainData[];
}

export interface LevelSettlementResult {
    success: boolean;
    inputBeanCount: number;
    expectedBeanCount: number;
    nextLevelId: number;
    unlockedLevelId: number;
}

export interface AchievementConfig {
    id: string;
    title: string;
    description: string;
    metric: AchievementMetric;
    target: number;
}

export const AdPlacement = {
    AnswerHint: "answer_hint",
    ExtraTime: "extra_time",
    DisplayZone: "display_zone",
    Settlement: "settlement",
} as const;

export type AdPlacement = typeof AdPlacement[keyof typeof AdPlacement];

export interface AdConfig {
    placement: AdPlacement;
    unitId: string;
    cooldownSeconds: number;
    fallbackEnabled: boolean;
}

export interface GuideStepConfig {
    id: string;
    target: string;
    text: string;
    blockInput: boolean;
}

export interface ProvinceRankEntry {
    provinceCode: string;
    totalBeanCollected: string;
}

export interface PlayerRankEntry {
    playerId: string;
    provinceCode: string;
    totalBeanCollected: string;
    rank: number;
}

export interface PlayerSaveData {
    version: number;
    playerId: string;
    guideFinished: boolean;
    provinceCode: string | null;
    unlockedLevelId: number;
    maxPassedLevelId: number;
    totalStartCount: number;
    totalWinCount: number;
    totalRiceCollected: string;
    totalBeanCollected: string;
    unlockedAchievements: string[];
    settings: {
        music: boolean;
        sound: boolean;
        vibration: boolean;
    };
}

export interface GameBootstrapOptions {
    uiRoot: Node | null;
    worldRoot: Node | null;
}
