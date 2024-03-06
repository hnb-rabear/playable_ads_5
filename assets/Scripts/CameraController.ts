import { _decorator, Camera, CCBoolean, CCInteger, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Camera) protected m_camera: Camera;

    @property(CCInteger) private m_horizontalCamWidth1: number = 1200;
    @property(CCInteger) private m_verticalCamWidth1: number = 960;
    @property(Vec3) private m_camWorldPos1: Vec3 = new Vec3(30, 1000, 1000);

    @property(CCInteger) private m_horizontalCamWidth2: number = 1200;
    @property(CCInteger) private m_verticalCamWidth2: number = 960;
    @property(Vec3) private m_camWorldPos2: Vec3 = new Vec3(700, 700, 1000);

    @property(CCBoolean) private m_debug: boolean = false;

    private m_activeCam2: boolean = false;

    protected start(): void {
        window.addEventListener('resize', () => {
            this.m_camera.orthoHeight = this.calcOrthoSize();
        });

        this.m_camera.node.setWorldPosition(this.m_camWorldPos1);
        this.m_camera.orthoHeight = this.calcOrthoSize();
    }

    protected update(dt: number): void {
        if (this.m_debug) {
            this.m_camera.node.setWorldPosition(this.m_activeCam2 ? this.m_camWorldPos2 : this.m_camWorldPos1);
            this.m_camera.orthoHeight = this.calcOrthoSize();
        }
    }

    public setCameraSize(size: number) {
        let duration = Math.abs(size - this.m_camera.orthoHeight) / 100;
        duration = Math.round(duration * 10) / 10;
        if (duration == 0) {
            this.m_camera.orthoHeight = size;
            return;
        }
        duration = Math.min(duration, 1);
        tween(this.m_camera).to(duration, { orthoHeight: size }).start();
    }

    public setCameraPos(worldPos: Vec3) {
        let duration = Vec3.distance(this.m_camera.node.worldPosition, worldPos) / 100;
        duration = Math.round(duration * 10) / 100;
        if (duration == 0) {
            this.m_camera.node.setWorldPosition(worldPos);
            return;
        }
        duration = Math.min(duration, 1);
        tween(this.m_camera.node).to(duration, { worldPosition: worldPos }).start();
    }

    protected calcOrthoSize() {
        let orthoHeight = 0;
        const standardRatio = 1.2;
        let ratio = window.innerWidth / window.innerHeight;
        if (ratio >= standardRatio) {
            const horizontalWidth = this.m_activeCam2 ? this.m_horizontalCamWidth2 : this.m_horizontalCamWidth1;
            const standardRatio = 4 / 3;
            if (ratio <= standardRatio) {
                orthoHeight = this.calcOrthoHeight(horizontalWidth);
            }
            else {
                orthoHeight = horizontalWidth / standardRatio;
            }
        }
        else {
            const verticalWidth = this.m_activeCam2 ? this.m_verticalCamWidth2 : this.m_verticalCamWidth1;
            orthoHeight = this.calcOrthoHeight(verticalWidth);
        }
        return orthoHeight;
    }

    protected calcOrthoHeight(desiredWidth: number): number {
        let aspectRatio = window.innerWidth / window.innerHeight;
        let orthoHeight = desiredWidth / aspectRatio;
        return orthoHeight;
    }
}


