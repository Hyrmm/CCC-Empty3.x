import { Canvas } from 'cc';
import { view } from 'cc';
import { _decorator, Component, game, Game, ResolutionPolicy, screen } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('CanvasAdapter')
@menu('comps/CanvasAdapter')
export class CanvasAdapter extends Component {
    @property(Canvas)
    private canvas: Canvas | null = null;

    protected onLoad(): void {
        screen.on('window-resize', this.canvasScaler, this);
        this.canvasScaler();
    }

    private canvasScaler(): void {
        const designSize = view.getDesignResolutionSize();
        const screenRatio = screen.windowSize.width / screen.windowSize.height;
        const designRatio = designSize.width / designSize.height;

        if (screenRatio <= 1 && screenRatio <= designRatio) {
            view.setDesignResolutionSize(designSize.width, designSize.height, ResolutionPolicy.FIXED_WIDTH);
        }
        else {
            view.setDesignResolutionSize(designSize.width, designSize.height, ResolutionPolicy.FIXED_HEIGHT);
        }
    }

}