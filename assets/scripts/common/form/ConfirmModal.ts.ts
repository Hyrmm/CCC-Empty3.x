import { _decorator, Component, Node } from 'cc';
import FormModal from '../../../frameWork/ui/form/FormModal';
import { Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConfirmModal')
export class ConfirmModal extends FormModal {

    @property(Sprite)
    public titleSprite: Sprite = null;


    protected start() {
        this.resSpriteUtil.setSpriteFrame({ sprite: this.titleSprite, path: "texture/icon_gift@common" });
    }

    protected update(deltaTime: number) {

    }
}

