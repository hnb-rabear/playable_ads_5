import { _decorator, Component, Node, Vec3, Animation, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PointerFocusing')
export class PointerFocusing extends Component {
    @property(Animation) private m_pointerAnim: Animation;

    private m_target: Node;
    private m_targetInitScale: Vec3;

    public setTarget(target: Node, yOffset: number = 0) {
        if (this.m_target == target)
            return;
        if (this.m_target) {
            this.m_target.scale.set(this.m_targetInitScale);
        }
        this.m_target = target;
        this.m_targetInitScale = target.scale;
        this.node.setWorldPosition(target.worldPosition);
        this.node.setWorldPosition(this.node.worldPosition.add(new Vec3(0, yOffset, 0)));
        this.m_pointerAnim.play();
    }

    public stop() {
        this.m_pointerAnim.stop();
        if (this.m_target) {
            this.m_target.scale.set(this.m_targetInitScale);
            this.m_target = null;
        }
    }

    /**
     * callback for animation
     */
    public eventCallback(eventValue: string) {
        if (this.m_target)
            tween(this.m_target)
                .to(0.1, { scale: new Vec3(0.9 * this.m_targetInitScale.x, 0.9 * this.m_targetInitScale.y, 0.9 * this.m_targetInitScale.z) })
                .to(0.15, { scale: new Vec3(1 * this.m_targetInitScale.x, this.m_targetInitScale.y, this.m_targetInitScale.z) })
                .start();
    }
}


