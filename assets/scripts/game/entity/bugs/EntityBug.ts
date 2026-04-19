import { MeshRenderer, SpriteFrame, _decorator, Component } from 'cc';
import { EDITOR } from 'cc/env';
import { BugMotionConfig, BugMoveJitterController } from './BugMoveJitterController';
import { BugConfigs } from '../../Configs';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('EntityBug')
@executeInEditMode
export class EntityBug extends Component {

    @property(MeshRenderer)
    public mesh: MeshRenderer = null;

    @property(SpriteFrame)
    public spriteFrame: SpriteFrame = null;

    @property(BugMoveJitterController)
    public bugMotionConfig: BugMoveJitterController = null;

    protected onEnable() {
        this.applyUvRect();
    }

    protected onValidate() {
        this.applyUvRect();
    }

    private applyUvRect() {
        const mesh = this.mesh ?? this.getComponent(MeshRenderer);
        const spriteFrame = this.spriteFrame;
        if (!mesh || !spriteFrame) {
            return;
        }

        const uvs = spriteFrame.uv;
        if (!uvs || uvs.length < 8) {
            return;
        }

        const minU = Math.min(uvs[0], uvs[2], uvs[4], uvs[6]);
        const maxU = Math.max(uvs[0], uvs[2], uvs[4], uvs[6]);
        const minV = Math.min(uvs[1], uvs[3], uvs[5], uvs[7]);
        const maxV = Math.max(uvs[1], uvs[3], uvs[5], uvs[7]);

        mesh.setInstancedAttribute('uvRect', [minU, minV, maxU, maxV]);
        this.bugMotionConfig?.syncShaderWiggleInstancedAttributes(mesh);
        this.mesh = mesh;
    }

    protected start() {
        // if(EDITOR) {
        //     return;
        // }

        this.bugMotionConfig?.applyExportConfig(BugConfigs.bugs[2] as BugMotionConfig, BugConfigs.sharedAnimation);
        this.applyUvRect();
    }
}
