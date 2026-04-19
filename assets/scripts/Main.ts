import { _decorator, Component, Node } from 'cc';
import { FormConfigs } from './configs/UIConfig';
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
        FrameWork.mgrHub.event.emit('fw:ready', undefined);
    }

    protected update(deltaTime: number) {
        FrameWork.update(deltaTime);
    }
}
