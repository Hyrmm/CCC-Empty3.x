import { _decorator, Component, Node } from 'cc';
import { FormConfigs } from './scripts/configs/UIConfig';
import { GameBootstrap } from './scripts/game/app/GameBootstrap';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node)
    private UiRoot: Node = null;

    protected async start() {
        await FrameWork.initialize();

        FrameWork.mgrHub.ui.setCofig({
            rootNode: this.UiRoot,
            formCacheSize: -1
        });

        FrameWork.mgrHub.ui.addFormConfig(FormConfigs);

        await GameBootstrap.initialize({
            uiRoot: this.UiRoot,
            worldRoot: this.node.getChildByName('3DRoot'),
        });

        FrameWork.mgrHub.event.emit('fw:ready', undefined);
    }

    protected update(deltaTime: number) {
        FrameWork.update(deltaTime);
        const gameApp = GameBootstrap.getApp();
        if (gameApp) {
            gameApp.update(deltaTime);
        }
    }

    protected onDestroy() {
        GameBootstrap.dispose();
    }
}
