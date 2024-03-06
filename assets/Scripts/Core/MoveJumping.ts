import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveJumping')
export class MoveJumping extends Component {
    @property protected m_jumpDuration = 2;
    @property protected m_maxSpeed = 0;

    protected m_delay: number;
    protected m_jumping: boolean = false;
    protected m_startWorldPos: Vec3 = new Vec3();
    protected m_targetWorldPos: Vec3 = new Vec3();
    protected m_elapsedTime = 0;

    public onEnd: () => void;

    public jumpTo(targetWorldPos: Vec3) {
        this.m_targetWorldPos = targetWorldPos;
        this.m_startWorldPos = this.node.getWorldPosition();
        this.m_jumping = true;
        this.m_elapsedTime = 0;
        this.node.setScale(1, 1, 1);
    }

    public jumpFromTo(startWorldPos: Vec3, targetWorldPos: Vec3) {
        this.m_targetWorldPos.set(targetWorldPos);
        this.m_startWorldPos.set(startWorldPos);
        this.m_jumping = true;
        this.m_elapsedTime = 0;
        this.node.setScale(1, 1, 1);
        this.node.setWorldPosition(startWorldPos);
    }

    protected update(deltaTime: number) {
        if (this.m_jumping) {
            if (this.m_delay > 0) {
                this.m_delay -= deltaTime;
                return;
            }

            this.m_elapsedTime += deltaTime;
            if (this.m_elapsedTime > this.m_jumpDuration || !this.m_targetWorldPos) {
                this.reachTarget();
                return;
            }

            let t = this.m_elapsedTime / this.m_jumpDuration;
            let direction = new Vec3();
            Vec3.subtract(direction, this.m_targetWorldPos, this.m_startWorldPos);
            let offsetVec = new Vec3(0, direction.length() / 2, 0);
            direction = direction.multiplyScalar(t).add(offsetVec.multiplyScalar(Math.sin(t * Math.PI)));
            if (this.m_maxSpeed !== 0 && direction.length() > this.m_maxSpeed * this.m_elapsedTime)
                direction = direction.normalize().multiplyScalar(this.m_maxSpeed * this.m_elapsedTime);
            this.node.setWorldPosition(direction.add(this.m_startWorldPos));
        }
    }

    protected reachTarget() {
        this.m_jumping = false;
        this.node.active = false;
        this.onEnd && this.onEnd();
    }
}