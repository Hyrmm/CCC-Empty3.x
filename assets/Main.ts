import { _decorator, Component, Node } from 'cc';
import { FormConfigs } from './scripts/configs/UIConfig';
import { CodexJson } from './frameWork/netExt/socket/codex/CodexJson';
import { CodexText } from './frameWork/netExt/socket/codex/CodexText';
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
            FrameWork.mgrHub.event.emit("fw:ready", null)

            const channel = FrameWork.mgrHub.net.createChannel<string, string>({
                key: "test",
                url: "ws://localhost:8080/text",
                codec: new CodexText(),
                events: {
                    onMessage: (payload, raw) => {
                        console.log(payload, raw);
                    }
                }
            })

            channel.connect().then(() => {
                channel.send("Hello, world! text");
            })

        });

    }

    protected update(deltaTime: number) {
        FrameWork.update(deltaTime);
    }
}

