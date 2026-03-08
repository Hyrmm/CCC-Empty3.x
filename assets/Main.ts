import { _decorator, Component, Node } from 'cc';
import { FormConfigs } from './scripts/configs/UIConfig';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node)
    private UiRoot: Node = null;

    protected start() {

        FrameWork.initialize().then(() => {

            FrameWork.mgrHub.ui.setCofig({
                rootNode: this.UiRoot,
                formCacheSize: -1
            })

            FrameWork.mgrHub.ui.addFormConfig(FormConfigs)
            FrameWork.mgrHub.ui.openForm("common:confirm:modal", {})
            // FrameWork.mgrHub.event.emit("fw:ready", {})
            FrameWork.mgrHub.event.emit("fw:ready", null)
            // FrameWork.mgrHub.ui.openForm("common:confirm:modal", {})
            // FrameWork.mgrHub.ui.openForm("common:map:view", {})

            FrameWork.mgrHub.ui.openForm("common:toast:view", {})

        });

    }

    protected update(deltaTime: number) {
        FrameWork.update(deltaTime);
    }
}

