import { GameState } from "../core/GameState";
import { GameStateMachine } from "../core/GameStateMachine";
import { LevelController } from "../level/LevelController";
import { LevelModel } from "../level/LevelModel";
import { IPlatformAdapter } from "../platform/IPlatformAdapter";
import { AdSystem } from "../systems/AdSystem";
import { AchievementSystem } from "../systems/AchievementSystem";
import { AnalyticsSystem } from "../systems/AnalyticsSystem";
import { AudioSystem } from "../systems/AudioSystem";
import { ConfigSystem } from "../systems/ConfigSystem";
import { RankSystem, RankUploadPayload } from "../systems/RankSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { ShareSystem } from "../systems/ShareSystem";
import { AdPlacement, GameBootstrapOptions, LevelSettlementResult } from "../types/GameTypes";
import { BowlController } from "../world/BowlController";
import { CameraController } from "../world/CameraController";
import { PrototypeHUD } from "../world/PrototypeHUD";
import { PrototypeLevelView } from "../world/PrototypeLevelView";
import { WorldScene } from "../world/WorldScene";

export class GameApp {
    public readonly stateMachine = new GameStateMachine();
    public readonly configSystem = new ConfigSystem();
    public readonly saveSystem = new SaveSystem();
    public readonly achievementSystem = new AchievementSystem(this.configSystem);
    public readonly rankSystem = new RankSystem();
    public readonly audioSystem = new AudioSystem();
    public readonly analyticsSystem = new AnalyticsSystem();
    public readonly worldScene: WorldScene;
    public readonly bowlController: BowlController;
    public readonly cameraController: CameraController;
    public readonly levelController = new LevelController();
    public readonly adSystem: AdSystem;
    public readonly shareSystem: ShareSystem;
    public readonly prototypeHUD: PrototypeHUD;
    public readonly prototypeLevelView: PrototypeLevelView;

    private pendingLevelResetHandle: ReturnType<typeof setTimeout> | null = null;
    private initializationWarnings: string[] = [];

    constructor(
        public readonly options: GameBootstrapOptions,
        private readonly platformAdapter: IPlatformAdapter,
    ) {
        this.worldScene = new WorldScene(options.worldRoot);
        this.bowlController = new BowlController(this.worldScene.bowlRoot);
        this.cameraController = new CameraController(options.worldRoot);
        this.adSystem = new AdSystem(this.configSystem, platformAdapter);
        this.shareSystem = new ShareSystem(platformAdapter);
        this.prototypeHUD = new PrototypeHUD(options.uiRoot);
        this.prototypeLevelView = new PrototypeLevelView(this.worldScene);
    }

    public async initialize(): Promise<void> {
        this.stateMachine.setState(GameState.Boot);
        await this.configSystem.initialize();
        await this.saveSystem.initialize();
        this.audioSystem.applySettings(this.saveSystem.data);
        await this.platformAdapter.login();
        this.stateMachine.setState(GameState.Loading);

        if (!this.saveSystem.data.provinceCode) {
            const provinceCode = await this.platformAdapter.getLocationProvince();
            if (provinceCode) this.saveSystem.bindProvinceCode(provinceCode);
        }

        this.initializationWarnings = this.prototypeLevelView.initialize(this.cameraController.activeCamera);
        this.prototypeLevelView.setPickHandler(this.handlePrototypePick.bind(this));
        this.prototypeHUD.setActions({
            onRestart: this.handleRestart.bind(this),
            onHint: this.handleHint.bind(this),
            onExtraTime: this.handleExtraTime.bind(this),
        });

        const systemInfo = this.platformAdapter.getSystemInfo();
        this.prototypeHUD.setTitle(`无聊的米 3D 原型 · ${systemInfo.platform}`);
        this.setPrototypeTip("点击可见颗粒进行拾取。方块代表米粒，胶囊代表绿豆。右上角可直接重开、看提示或加时。");
        this.prepareEntryLevel();
    }

    public dispose(): void {
        this.clearScheduledLevelReset();
        this.prototypeLevelView.dispose();
        this.prototypeHUD.dispose();
    }

    public prepareEntryLevel(): LevelModel | null {
        this.clearScheduledLevelReset();

        const levelId = this.saveSystem.data.unlockedLevelId;
        const config = this.configSystem.getEntryLevelConfig(levelId);
        if (!config) {
            this.setPrototypeTip("未找到任何关卡配置，无法启动原型。请先补充 `LevelConfigs`。");
            return null;
        }

        this.saveSystem.applyLevelStart();
        this.stateMachine.setState(this.saveSystem.data.guideFinished ? GameState.LevelPrepare : GameState.Guide);
        const level = this.levelController.prepareLevel(config);
        this.prototypeLevelView.render(level);
        this.stateMachine.setState(GameState.LevelPlaying);
        this.updatePrototypeHUD();

        if (!this.saveSystem.data.guideFinished) {
            const guideStep = this.configSystem.getGuideConfigs()[0];
            if (guideStep) {
                this.setPrototypeTip(`引导：${guideStep.text}`);
            }
        } else {
            this.setPrototypeTip("点击可见颗粒进行拾取。右上角可直接重开、看提示或加时。");
        }

        this.analyticsSystem.track("level_prepare", {
            levelId: config.id,
            riceCount: level.runtime.riceCount,
            beanCount: level.runtime.beanCount,
        });
        return level;
    }

    public update(deltaTime: number): void {
        this.levelController.tick(deltaTime);
        this.updatePrototypeHUD();

        const runtime = this.levelController.runtime;
        if (!runtime || runtime.remainingTime !== 0 || this.pendingLevelResetHandle) return;

        this.setPrototypeTip("时间到，原型自动重开当前关。你也可以手动点右上角的重开或加时。");
        this.scheduleNextLevel(1000);
    }

    public collectGrain(grainId: number): boolean {
        const success = this.levelController.collectGrain(grainId);
        if (success) {
            this.analyticsSystem.track("grain_collect", { grainId });
            this.platformAdapter.vibrateShort();
        }
        return success;
    }

    public async useHintAd(): Promise<boolean> {
        const runtime = this.levelController.runtime;
        if (!runtime) return false;

        const success = await this.adSystem.showRewardAd(AdPlacement.AnswerHint);
        if (success) {
            this.levelController.markHintUsed();
            const remainingBeans = Math.max(0, runtime.beanCount - runtime.collectedBean);
            this.setPrototypeTip(`提示：本关共有 ${runtime.beanCount} 颗绿豆，当前还剩 ${remainingBeans} 颗未拾取。`);
            this.updatePrototypeHUD();
        }
        return success;
    }

    public async useExtraTimeAd(): Promise<boolean> {
        const runtime = this.levelController.runtime;
        if (!runtime) return false;

        const success = await this.adSystem.showRewardAd(AdPlacement.ExtraTime);
        if (success) {
            const config = this.configSystem.getLevelConfig(runtime.levelId);
            this.clearScheduledLevelReset();
            this.levelController.applyExtraTime(config ? config.rewardExtraTime : 15);
            this.setPrototypeTip("原型版已追加时间奖励。继续拾取即可。");
            this.updatePrototypeHUD();
        }
        return success;
    }

    public submitAnswer(inputBeanCount: number): { settlement: LevelSettlementResult | null; rankPayload: RankUploadPayload | null } {
        const runtime = this.levelController.runtime;
        if (!runtime) {
            return { settlement: null, rankPayload: null };
        }

        this.stateMachine.setState(GameState.LevelInputAnswer);
        const nextLevelId = this.configSystem.getNextLevelId(runtime.levelId);
        const settlement = this.levelController.settle(inputBeanCount, this.saveSystem.data.unlockedLevelId, nextLevelId);
        if (!settlement) {
            return { settlement: null, rankPayload: null };
        }

        this.saveSystem.applyLevelResult(runtime, settlement);
        const unlockedAchievements = this.achievementSystem.refresh(this.saveSystem.data);
        this.saveSystem.unlockAchievements(unlockedAchievements);

        this.stateMachine.setState(settlement.success ? GameState.LevelSuccess : GameState.LevelFail);
        this.stateMachine.setState(GameState.Settlement);

        const rankPayload = this.rankSystem.buildUploadPayload(
            this.saveSystem.data.playerId,
            this.saveSystem.data.provinceCode,
            runtime,
        );

        this.analyticsSystem.track("level_settlement", settlement);
        return { settlement, rankPayload };
    }

    private handleRestart(): void {
        this.setPrototypeTip("已手动重开当前关。");
        this.prepareEntryLevel();
    }

    private async handleHint(): Promise<void> {
        await this.useHintAd();
    }

    private async handleExtraTime(): Promise<void> {
        await this.useExtraTimeAd();
    }

    private handlePrototypePick(grainId: number): void {
        if (this.pendingLevelResetHandle) return;

        const success = this.collectGrain(grainId);
        if (!success) return;

        const runtime = this.levelController.runtime;
        if (!runtime) return;

        this.prototypeLevelView.refresh(runtime);
        this.updatePrototypeHUD();

        if (!this.levelController.canAnswer()) return;

        const result = this.submitAnswer(runtime.beanCount);
        const settlement = result.settlement;
        const isSuccess = settlement ? settlement.success : false;
        if (isSuccess && !this.saveSystem.data.guideFinished) {
            this.saveSystem.markGuideFinished();
        }

        const message = isSuccess
            ? settlement && settlement.nextLevelId !== runtime.levelId
                ? `已自动提交正确答案 ${runtime.beanCount}，1 秒后进入下一关。`
                : "已完成当前最高配置关卡，1 秒后继续挑战本关。"
            : "原型自动提交失败，1 秒后重开当前关。";
        this.setPrototypeTip(message);
        this.scheduleNextLevel(1000);
    }

    private updatePrototypeHUD(): void {
        const runtime = this.levelController.runtime;
        const extraMessage = runtime && this.levelController.canAnswer()
            ? "全部绿豆已捡出，原型将自动结算。"
            : "点击当前可见颗粒，隐藏颗粒会在上层移除后露出。";
        this.prototypeHUD.update(runtime, extraMessage);
    }

    private setPrototypeTip(message: string): void {
        if (!this.initializationWarnings.length) {
            this.prototypeHUD.setTip(message);
            return;
        }

        this.prototypeHUD.setTip(`${this.initializationWarnings.join("\n")}\n${message}`);
    }

    private scheduleNextLevel(delayMs: number): void {
        if (this.pendingLevelResetHandle) return;

        this.pendingLevelResetHandle = setTimeout(() => {
            this.pendingLevelResetHandle = null;
            this.prepareEntryLevel();
        }, delayMs);
    }

    private clearScheduledLevelReset(): void {
        if (!this.pendingLevelResetHandle) return;
        clearTimeout(this.pendingLevelResetHandle);
        this.pendingLevelResetHandle = null;
    }
}
