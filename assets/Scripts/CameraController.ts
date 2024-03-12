import { _decorator, Camera, CCBoolean, CCInteger, Component, Label, Node, tween, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Camera) protected m_camera: Camera;

    @property(UITransform) private m_horizontalCam1: UITransform = new UITransform();
    @property(UITransform) private m_verticalCam1: UITransform = new UITransform();
    @property(UITransform) private m_horizontalCam2: UITransform = new UITransform();
    @property(UITransform) private m_verticalCam2: UITransform = new UITransform();
    @property(Label) private m_lblDebug: Label = null;

    private m_activeCam2: boolean = false;
    private m_lockByTween: boolean = false;

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
        let targetPos: Vec3 = new Vec3();
        if (this.m_activeCam2) {
            if (isHorizontal)
                targetPos.set(this.m_horizontalCam2.node.getWorldPosition());
            else
                targetPos.set(this.m_verticalCam2.node.getWorldPosition());
        }
        else {
            if (isHorizontal)
                targetPos.set(this.m_horizontalCam1.node.getWorldPosition());
            else
                targetPos.set(this.m_verticalCam1.node.getWorldPosition());
        }
        return new Vec3(targetPos.x, targetPos.y, this.m_camera.node.worldPosition.z);
    }

    public activeCam2() {
        this.m_activeCam2 = true;
        this.setCameraPos(this.getCamWorldPos());
        this.setCameraSize(this.calcOrthoSize());
    }

    protected update(dt: number): void {
        if (!this.m_lockByTween) {
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
        this.m_lockByTween = true;
        tween(this.m_camera.node)
            .to(duration, { worldPosition: worldPos })
            .call(() => {
                this.m_lockByTween = false;
            })
            .start();
    }

    protected calcOrthoSize() {
        let orthoHeight = 0;
        const screenRatio = window.innerWidth / window.innerHeight;
        if (screenRatio > 1) {
            const preferredHeight = this.m_activeCam2
                ? this.m_horizontalCam2.contentSize.height
                : this.m_horizontalCam1.contentSize.height;
            orthoHeight = preferredHeight / 2;
        } else {
            const preferredWidth = this.m_activeCam2
                ? this.m_verticalCam2.contentSize.width
                : this.m_verticalCam1.contentSize.width;
            orthoHeight = preferredWidth / screenRatio / 2;
        }
        return orthoHeight;
    }
}


