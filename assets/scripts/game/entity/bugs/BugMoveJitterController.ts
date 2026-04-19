import { _decorator, Component, MeshRenderer, Node, Quat, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const TAU = Math.PI * 2;

type MovementTypeName = 'NORMAL' | 'DASHER';
type HeightLevelName = 'GROUNDED' | 'CRAWLING' | 'FLYING' | 'SOARING';

interface Range2 {
    x: number;
    y: number;
}

interface NamedEnum<T extends string> {
    value: number;
    name: T;
}

interface Axis3 {
    x: number;
    y: number;
    z: number;
}

export interface BugSharedAnimationConfig {
    prefabBase: {
        scaleFactor: number;
        edgeBuffer: number;
    };
    bounce: {
        minimumBounceAngle: number;
        skimmingBounceAdjustment: number;
    };
}

export interface BugMotionConfig {
    bugID: number;
    bugName: string;
    visual: {
        baseScale: number;
        scaleVariation: number;
        heightLevel: NamedEnum<HeightLevelName>;
        visualTiltRange: Range2;
    };
    movement: {
        movementType: NamedEnum<MovementTypeName>;
        moveSpeed: number;
        turnSpeedRange: Range2;
        turnConstantlyWhileMoving: boolean;
        pivotOnNewPath: boolean;
        alternateTurnDirection: boolean;
        movementPathDurationRange: Range2;
        visualTurnSmoothing: number;
    };
    dash: {
        dashRechargeDuration: number;
        dashHeightRaiseAmount: number;
        dashScaleAmount: number;
        dashHeightRaiseEase: NamedEnum<string>;
        dashHeightLowerEase: NamedEnum<string>;
    };
    shaderWiggle: {
        wiggleSpeed: number;
        wiggleAmount: number;
        holdTiltDuration: number;
        movementExtents: Range2;
        wiggleAxis: Axis3;
        mirrorWiggle: boolean;
    };
}

@ccclass('BugMoveJitterController')
export class BugMoveJitterController extends Component {
    private static readonly PLANE_NORMAL = new Vec3(0, 0, 1);
    private static readonly AXIS_X = new Vec3(1, 0, 0);
    private static readonly AXIS_Y = new Vec3(0, 1, 0);

    @property(Node)
    public visual: Node | null = null;

    @property
    public playAreaWidth = 20;

    @property
    public playAreaHeight = 20;

    @property
    public visualAngleOffsetDeg = 180;

    private readonly _moveDir = new Vec3();
    private readonly _movePos = new Vec3();
    private readonly _rootPos = new Vec3();
    private readonly _visualBaseScale = new Vec3(1, 1, 1);
    private readonly _visualScale = new Vec3(1, 1, 1);
    private readonly _visualPos = new Vec3();
    private readonly _visualRot = new Quat();
    private readonly _targetVisualRot = new Quat();
    private readonly _yawRot = new Quat();
    private readonly _turnRot = new Quat();
    private readonly _identityRot = new Quat();

    private _config: BugMotionConfig | null = null;
    private _shared: BugSharedAnimationConfig | null = null;

    private _baseUniformScale = 1;
    private _currentHeight = 0;
    private _visualTiltDeg = 0;
    private _currentSpeed = 0;
    private _currentPathDuration = 0;
    private _currentPathRotateAmountDeg = 0;
    private _pathTimer = 0;

    private _isRechargingDash = false;
    private _dashRechargeTimer = 0;

    private _isPlayingDash = false;
    private _dashTimer = 0;
    private _dashDuration = 0;
    private _wiggleTimer = 0;
    private _wigglePhaseOffset = 0;
    private _usesShaderWiggle = false;

    protected onLoad(): void {
        this.resolveVisualNode();
    }

    public applyExportConfig(
        bugConfig: BugMotionConfig,
        sharedConfig: BugSharedAnimationConfig,
        spawnLocalPosition?: Readonly<Vec3>,
        specialScaleMultiplier = 1
    ): void {
        this._config = bugConfig;
        this._shared = sharedConfig;

        this._baseUniformScale =
            bugConfig.visual.baseScale *
            this.randomRange(1 - bugConfig.visual.scaleVariation, 1 + bugConfig.visual.scaleVariation) *
            sharedConfig.prefabBase.scaleFactor *
            specialScaleMultiplier;

        this._visualBaseScale.set(this._baseUniformScale, this._baseUniformScale, this._baseUniformScale);
        this._visualScale.set(this._visualBaseScale.x, this._visualBaseScale.y, this._visualBaseScale.z);

        this._currentHeight = this.randomHeightByLevel(bugConfig.visual.heightLevel.name);
        this._visualTiltDeg = this.randomRange(
            bugConfig.visual.visualTiltRange.x,
            bugConfig.visual.visualTiltRange.y
        );
        this._currentSpeed = bugConfig.movement.moveSpeed;
        this._wiggleTimer = Math.random() * TAU;
        this._wigglePhaseOffset = Math.random();
        this._usesShaderWiggle = false;

        const startPos = spawnLocalPosition ?? this.node.position;
        this._movePos.set(startPos.x, startPos.y, this._currentHeight);
        this._rootPos.set(this._movePos.x, this._movePos.y, this._movePos.z);
        this.node.setRotation(this._identityRot);
        this.node.setPosition(this._rootPos);

        this.setRandomForward();
        this.chooseNewPath(true);
        this.updateVisualRotation(1, true);
        this.applyVisualTransform();
    }

    public update(dt: number): void {
        if (!this.resolveVisualNode() || !this._config || !this._shared) {
            return;
        }

        if (this._isRechargingDash) {
            this._dashRechargeTimer += dt;
            if (this._dashRechargeTimer >= this._config.dash.dashRechargeDuration) {
                this._isRechargingDash = false;
                this.startDashVisual();
            }
        }

        if (!this._isRechargingDash) {
            this._pathTimer += dt;
            if (this._pathTimer >= this._currentPathDuration) {
                this.chooseNewPath(false);
            }
        }

        if (this._config.movement.turnConstantlyWhileMoving) {
            this.changeMoveDirection(this._currentPathRotateAmountDeg * dt);
        }

        const moveSpeed = this._isRechargingDash ? 0 : this._currentSpeed;
        this._movePos.x += this._moveDir.x * moveSpeed * dt;
        this._movePos.y += this._moveDir.y * moveSpeed * dt;
        this._movePos.z = this._currentHeight;

        const bouncedX = this.checkBounceX();
        const bouncedY = this.checkBounceY();

        this._rootPos.set(this._movePos.x, this._movePos.y, this._movePos.z);
        this.node.setPosition(this._rootPos);

        this.updateDashVisual(dt);
        this.updateWiggleVisual(dt);
        this.updateVisualRotation(dt, bouncedX || bouncedY);
        this.applyVisualTransform();
    }

    public syncShaderWiggleInstancedAttributes(meshRenderer: MeshRenderer | null): boolean {
        if (!meshRenderer || !this._config) {
            this._usesShaderWiggle = false;
            return false;
        }

        const wiggle = this._config.shaderWiggle;
        const wingLike = wiggle.mirrorWiggle || Math.abs(wiggle.wiggleAxis.z) > 0.5;
        const cyclesPerSecond = this.computeShaderWiggleCycles(wiggle, wingLike);
        const deformAmount = this.computeShaderWiggleAmplitude(wiggle, wingLike);

        try {
            meshRenderer.setInstancedAttribute('wiggleMeta0', [
                cyclesPerSecond,
                deformAmount,
                this.clamp(wiggle.holdTiltDuration, 0, 1),
                this._wigglePhaseOffset,
            ]);
            meshRenderer.setInstancedAttribute('wiggleMeta1', [
                wiggle.wiggleAxis.x,
                wiggle.wiggleAxis.y,
                wiggle.wiggleAxis.z,
                wiggle.mirrorWiggle ? 1 : 0,
            ]);
            meshRenderer.setInstancedAttribute('wiggleMeta2', [
                wiggle.movementExtents.x,
                wiggle.movementExtents.y,
                wingLike ? 1 : 0,
                wingLike ? 0 : this.computeShaderBodyJitter(wiggle),
            ]);
            this._usesShaderWiggle = true;
            return true;
        } catch {
            this._usesShaderWiggle = false;
            return false;
        }
    }

    private chooseNewPath(wasJustSpawned: boolean): void {
        if (!this._config) {
            return;
        }

        const currentSign = this._currentPathRotateAmountDeg === 0 ? 1 : Math.sign(this._currentPathRotateAmountDeg);
        const turnSign = this._config.movement.alternateTurnDirection ? -currentSign : this.randomSign();

        this._currentPathRotateAmountDeg =
            turnSign * this.randomRange(this._config.movement.turnSpeedRange.x, this._config.movement.turnSpeedRange.y);

        if (this._config.movement.pivotOnNewPath) {
            this.changeMoveDirection(this._currentPathRotateAmountDeg);
        }

        this._currentPathDuration = this.randomRange(
            this._config.movement.movementPathDurationRange.x,
            this._config.movement.movementPathDurationRange.y
        );
        this._pathTimer = 0;

        if (this._config.movement.movementType.name === 'DASHER') {
            this._isRechargingDash = true;
            this._dashRechargeTimer = 0;
        }

        if (wasJustSpawned) {
            this.updateVisualRotation(1, true);
        }
    }

    private changeMoveDirection(deltaYawDeg: number): void {
        Quat.fromAxisAngle(this._turnRot, BugMoveJitterController.PLANE_NORMAL, deltaYawDeg * DEG_TO_RAD);
        Vec3.transformQuat(this._moveDir, this._moveDir, this._turnRot);
        this._moveDir.z = 0;
        this._moveDir.normalize();
    }

    private checkBounceX(): boolean {
        if (!this._shared) {
            return false;
        }

        const limit = this.playAreaWidth - this._baseUniformScale * this._shared.prefabBase.edgeBuffer;
        const half = limit * 0.5;

        if (Math.abs(this._movePos.x) <= half) {
            return false;
        }

        this._movePos.x = Math.sign(this._movePos.x) * half;
        this._moveDir.x *= -1;

        if (this.angleToAxisDeg(this._moveDir, BugMoveJitterController.AXIS_Y) < this._shared.bounce.minimumBounceAngle) {
            this._moveDir.x += -Math.sign(this._movePos.x) * this._shared.bounce.skimmingBounceAdjustment;
            this._moveDir.z = 0;
            this._moveDir.normalize();
        }

        return true;
    }

    private checkBounceY(): boolean {
        if (!this._shared) {
            return false;
        }

        const limit = this.playAreaHeight - this._baseUniformScale * this._shared.prefabBase.edgeBuffer;
        const half = limit * 0.5;

        if (Math.abs(this._movePos.y) <= half) {
            return false;
        }

        this._movePos.y = Math.sign(this._movePos.y) * half;
        this._moveDir.y *= -1;

        if (this.angleToAxisDeg(this._moveDir, BugMoveJitterController.AXIS_X) < this._shared.bounce.minimumBounceAngle) {
            this._moveDir.y += -Math.sign(this._movePos.y) * this._shared.bounce.skimmingBounceAdjustment;
            this._moveDir.z = 0;
            this._moveDir.normalize();
        }

        return true;
    }

    private startDashVisual(): void {
        if (!this._config) {
            return;
        }

        this._isPlayingDash = true;
        this._dashTimer = 0;
        this._dashDuration = Math.max(this._currentPathDuration, 0.0001);
    }

    private updateDashVisual(dt: number): void {
        if (!this._config) {
            return;
        }

        if (!this._isPlayingDash) {
            this._visualScale.set(this._visualBaseScale.x, this._visualBaseScale.y, this._visualBaseScale.z);
            this._visualPos.set(0, 0, 0);
            return;
        }

        this._dashTimer += dt;

        const half = this._dashDuration * 0.5;
        const dashScale = this._config.dash.dashScaleAmount;
        const dashHeight = this._config.dash.dashHeightRaiseAmount;

        if (this._dashTimer <= half) {
            const t = this.ease(
                this._config.dash.dashHeightRaiseEase.name,
                this.clamp01(this._dashTimer / half)
            );
            const scale = this.lerp(1, dashScale, t);
            this._visualScale.set(
                this._visualBaseScale.x * scale,
                this._visualBaseScale.y * scale,
                this._visualBaseScale.z * scale
            );
            this._visualPos.set(0, 0, this.lerp(0, dashHeight, t));
            return;
        }

        if (this._dashTimer <= this._dashDuration) {
            const t = this.ease(
                this._config.dash.dashHeightLowerEase.name,
                this.clamp01((this._dashTimer - half) / half)
            );
            const scale = this.lerp(dashScale, 1, t);
            this._visualScale.set(
                this._visualBaseScale.x * scale,
                this._visualBaseScale.y * scale,
                this._visualBaseScale.z * scale
            );
            this._visualPos.set(0, 0, this.lerp(dashHeight, 0, t));
            return;
        }

        this._isPlayingDash = false;
        this._visualScale.set(this._visualBaseScale.x, this._visualBaseScale.y, this._visualBaseScale.z);
        this._visualPos.set(0, 0, 0);
    }

    private updateWiggleVisual(dt: number): void {
        if (!this._config) {
            return;
        }

        if (this._usesShaderWiggle) {
            return;
        }

        const wiggle = this._config.shaderWiggle;
        const wingLike = wiggle.mirrorWiggle || Math.abs(wiggle.wiggleAxis.z) > 0.5;
        const extentSpan = Math.abs(wiggle.movementExtents.y - wiggle.movementExtents.x);
        const cyclesPerSecond = this.clamp(wiggle.wiggleSpeed / 20, 0.6, wingLike ? 4.5 : 3);
        const amplitude = this.computeWiggleAmplitude(wiggle, wingLike) *
            this.lerp(0.9, 1.15, this.clamp01(extentSpan * 0.5));

        this._wiggleTimer += dt;

        const rawWave = Math.sin(this._wiggleTimer * cyclesPerSecond * TAU);
        const wave = this.applyHoldToWave(rawWave, wiggle.holdTiltDuration);

        if (wingLike) {
            const widthScale = 1 + wave * amplitude;
            const heightScale = 1 - wave * amplitude * 0.42 + Math.abs(rawWave) * amplitude * 0.12;
            this._visualScale.set(
                this._visualScale.x * widthScale,
                this._visualScale.y * heightScale,
                this._visualScale.z
            );
            return;
        }

        const bodyScaleY = 1 + wave * amplitude;
        const bodyScaleX = 1 + wave * amplitude * 0.45;
        this._visualScale.set(
            this._visualScale.x * bodyScaleX,
            this._visualScale.y * bodyScaleY,
            this._visualScale.z
        );
    }

    private updateVisualRotation(dt: number, snap: boolean): void {
        const visual = this.resolveVisualNode();
        if (!visual || !this._config) {
            return;
        }

        const lookX = -this._moveDir.x;
        const lookY = -this._moveDir.y;
        const angleDeg = Math.atan2(lookY, lookX) * RAD_TO_DEG - 90 + this.visualAngleOffsetDeg;

        Quat.fromEuler(this._targetVisualRot, this._visualTiltDeg, 0, angleDeg);

        if (snap) {
            visual.setRotation(this._targetVisualRot);
            return;
        }

        visual.getRotation(this._visualRot);
        const t = this.clamp01(dt * this._config.movement.visualTurnSmoothing);
        Quat.slerp(this._yawRot, this._visualRot, this._targetVisualRot, t);
        visual.setRotation(this._yawRot);
    }

    private applyVisualTransform(): void {
        const visual = this.resolveVisualNode();
        if (!visual) {
            return;
        }

        visual.setPosition(this._visualPos);
        visual.setScale(this._visualScale);
    }

    private resolveVisualNode(): Node | null {
        if (this.visual && this.visual !== this.node) {
            return this.visual;
        }

        // Older prefab data may still point `visual` at the root node.
        const fallback = this.node.getChildByName('node_visual') ?? this.node.children[0] ?? null;
        if (fallback) {
            this.visual = fallback;
        }

        return this.visual;
    }

    private computeWiggleAmplitude(wiggle: BugMotionConfig['shaderWiggle'], wingLike: boolean): number {
        const amplitude = wiggle.wiggleAmount * 0.05;
        if (wingLike) {
            return this.clamp(amplitude, 0.03, 0.1);
        }

        return this.clamp(amplitude, 0.015, 0.04);
    }

    private computeShaderWiggleCycles(wiggle: BugMotionConfig['shaderWiggle'], wingLike: boolean): number {
        return this.clamp(wiggle.wiggleSpeed / 18, 0.8, wingLike ? 4.8 : 3.2);
    }

    private computeShaderWiggleAmplitude(wiggle: BugMotionConfig['shaderWiggle'], wingLike: boolean): number {
        const amplitude = wiggle.wiggleAmount * (wingLike ? 0.07 : 0.05);
        if (wingLike) {
            return this.clamp(amplitude, 0.035, 0.11);
        }

        return this.clamp(amplitude, 0.02, 0.055);
    }

    private computeShaderBodyJitter(wiggle: BugMotionConfig['shaderWiggle']): number {
        return this.clamp(wiggle.wiggleAmount * 0.04, 0.005, 0.025);
    }

    private applyHoldToWave(wave: number, holdTiltDuration: number): number {
        if (wave <= 0 || holdTiltDuration <= 0) {
            return wave;
        }

        const holdStrength = this.clamp(holdTiltDuration * 2.5, 0, 0.8);
        return this.lerp(wave, 1, holdStrength * wave);
    }

    private setRandomForward(): void {
        const angle = Math.random() * Math.PI * 2;
        this._moveDir.set(Math.cos(angle), Math.sin(angle), 0);
        this._moveDir.normalize();
    }

    private randomHeightByLevel(level: HeightLevelName): number {
        switch (level) {
            case 'GROUNDED':
                return this.randomRange(1.5, 2);
            case 'CRAWLING':
                return this.randomRange(2.5, 3);
            case 'FLYING':
                return this.randomRange(7, 8);
            case 'SOARING':
                return this.randomRange(10, 11);
            default:
                return 1;
        }
    }

    private angleToAxisDeg(dir: Readonly<Vec3>, axis: Readonly<Vec3>): number {
        const dot =
            dir.x * axis.x +
            dir.y * axis.y +
            dir.z * axis.z;
        const dirLen = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
        const axisLen = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);

        if (dirLen <= 1e-6 || axisLen <= 1e-6) {
            return 0;
        }

        const normalizedDot = this.clamp(dot / (dirLen * axisLen), -1, 1);
        return Math.acos(normalizedDot) * RAD_TO_DEG;
    }

    private ease(easeName: string, t: number): number {
        const x = this.clamp01(t);

        switch (easeName) {
            case 'OutQuad':
                return 1 - (1 - x) * (1 - x);
            case 'InQuad':
                return x * x;
            case 'InCubic':
                return x * x * x;
            case 'InOutQuad':
                return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) * 0.5;
            case 'OutExpo':
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            case 'OutBack': {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            }
            case 'OutBounce': {
                const n1 = 7.5625;
                const d1 = 2.75;

                if (x < 1 / d1) {
                    return n1 * x * x;
                }
                if (x < 2 / d1) {
                    const t2 = x - 1.5 / d1;
                    return n1 * t2 * t2 + 0.75;
                }
                if (x < 2.5 / d1) {
                    const t2 = x - 2.25 / d1;
                    return n1 * t2 * t2 + 0.9375;
                }
                const t2 = x - 2.625 / d1;
                return n1 * t2 * t2 + 0.984375;
            }
            default:
                return x;
        }
    }

    private randomRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    private randomSign(): number {
        return Math.random() < 0.5 ? -1 : 1;
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private clamp01(v: number): number {
        return this.clamp(v, 0, 1);
    }

    private clamp(v: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, v));
    }
}

/*
Usage:

1. Attach this component to the bug root node.
2. Drag the visual child node (your sprite / plane node) into `visual`.
3. Load one bug row from `bug_animation_params_for_cocos.json`.
4. Call:

bugMove.applyExportConfig(
    bugConfig,
    {
        prefabBase: exported.sharedAnimation.prefabBase,
        bounce: exported.sharedAnimation.bounce,
    },
    new Vec3(spawnX, spawnY, 0),
);

Notes:
- This file focuses on the "moving jitter" part:
  root movement on XY + path turning around Z + visual follow rotation around Z + dasher hop.
- The current bug atlas is authored head-up, so the default `visualAngleOffsetDeg` is `180`.
- `dash` lift is currently written to local Z. In a pure 2D orthographic setup this often needs to be
  replaced with scale-only feedback or a fake shadow, because Z motion may not be visually apparent.
- Unity's exported shader wiggle values are mapped to instanced vertex deformation first, with
  script-side scale pulse kept as a fallback if instanced attributes are unavailable.
*/
