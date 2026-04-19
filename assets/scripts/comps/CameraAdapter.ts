import { _decorator, Component, Camera, view, screen } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('CameraAdapter')
@menu('comps/CameraAdapter')
export class CameraAdapter extends Component {
    @property(Camera)
    private camera: Camera | null = null;

    @property
    private targetWorldWidth = 20;

    @property
    private targetWorldHeight = 20;

    protected onLoad(): void {
        this.updateCameraSize();
    }

    public updateCameraSize(): void {
        if (!this.camera) return;

        const visibleSize = view.getVisibleSize();
        const aspect = visibleSize.width / visibleSize.height;

        const orthoHeightByHeight = this.targetWorldHeight * 0.5;
        const orthoHeightByWidth = this.targetWorldWidth / (2 * aspect);

        this.camera.orthoHeight = Math.max(orthoHeightByHeight, orthoHeightByWidth);
    }
}