import { _decorator, Camera, CCBoolean, CCInteger, Component, Label, Node, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StandardCameraConfig')
export class StandardCameraConfig {
    @property(Vec3) public position = new Vec3(0, 0, 0);
    @property(CCInteger) public preferredWidth: number = 0;
    @property(CCInteger) public preferredHeight: number = 0;
}

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Camera) protected m_camera: Camera;

    @property(StandardCameraConfig) private m_horizontalCam1: StandardCameraConfig = new StandardCameraConfig();
    @property(StandardCameraConfig) private m_verticalCam1: StandardCameraConfig = new StandardCameraConfig();
    @property(StandardCameraConfig) private m_horizontalCam2: StandardCameraConfig = new StandardCameraConfig();
    @property(StandardCameraConfig) private m_verticalCam2: StandardCameraConfig = new StandardCameraConfig();
    @property(Label) private m_lblDebug: Label = null;
    @property(CCBoolean) private m_debug: boolean = false;

    private m_activeCam2: boolean = false;

    protected start(): void {
        window.addEventListener('resize', () => {
            this.m_camera.node.setWorldPosition(this.getCamWorldPos());
            this.m_camera.orthoHeight = this.calcOrthoSize();
            this.showLog();
        });
    }

    public activeCam1() {
        this.m_activeCam2 = false;
        this.m_camera.node.setWorldPosition(this.getCamWorldPos());
        this.m_camera.orthoHeight = this.calcOrthoSize();
        this.showLog();
    }

    protected showLog() {
        this.m_lblDebug.string = `screen: ${window.innerWidth}x${window.innerHeight}\n position: ${this.m_camera.node.worldPosition}\n orthoHeight: ${this.m_camera.orthoHeight}`;
    }

    private getCamWorldPos() {
        const isHorizontal = window.innerWidth >= window.innerHeight;
        if (this.m_activeCam2) {
            if (isHorizontal)
                return this.m_horizontalCam2.position;
            return this.m_verticalCam2.position;
        }
        else {
            if (isHorizontal)
                return this.m_horizontalCam1.position;
            return this.m_verticalCam1.position;
        }
    }

    public activeCam2() {
        this.m_activeCam2 = true;
        this.setCameraPos(this.getCamWorldPos());
        this.setCameraSize(this.calcOrthoSize());
    }

    protected update(dt: number): void {
        if (this.m_debug) {
            this.m_camera.node.setWorldPosition(this.getCamWorldPos());
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
        // const standardRatio = 1.2;
        let screenRatio = window.innerWidth / window.innerHeight;
        // if (ratio >= standardRatio) {
        //     const horizontalWidth = this.m_activeCam2 ? this.m_horizontalCam2.width : this.m_horizontalCam1.width;
        //     const standardRatio = 4 / 3;
        //     if (ratio <= standardRatio) {
        //         orthoHeight = this.calcOrthoHeight(horizontalWidth);
        //     }
        //     else {
        //         orthoHeight = horizontalWidth / standardRatio;
        //     }
        // }
        // else {
        //     const verticalWidth = this.m_activeCam2 ? this.m_verticalCam2.width : this.m_verticalCam1.width;
        //     orthoHeight = this.calcOrthoHeight(verticalWidth);
        // }
        if (screenRatio > 1) {
            const preferredWidth = this.m_activeCam2 ? this.m_horizontalCam2.preferredWidth : this.m_horizontalCam1.preferredWidth;
            //const preferredHeight = this.m_activeCam2 ? this.m_horizontalCam2.preferredHeight : this.m_horizontalCam1.preferredHeight;
            orthoHeight = preferredWidth / screenRatio;
        } else {
            const preferredWidth = this.m_activeCam2 ? this.m_verticalCam2.preferredWidth : this.m_verticalCam1.preferredWidth;
            orthoHeight = preferredWidth / screenRatio;
        }
        return orthoHeight;
    }
}


