import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveJumping')
export class MoveJumping extends Component {
    @property(CCBoolean) protected m_autoDeactivate = false;
    @property(CCFloat) protected m_jumpDuration = 1;
    @property(CCInteger) protected m_maxSpeed = 0;

    protected m_delay: number;
    protected m_reached: boolean = false;
    protected m_startWorldPos: Vec3 = new Vec3();
    protected m_targetWorldPos: Vec3 = new Vec3();
    protected m_elapsedTime = 0;
    protected m_initScale: Vec3 = new Vec3();

    public get jumpDuration(): number {
        return this.m_jumpDuration;
    }
    public get maxSpeed(): number {
        return this.m_maxSpeed;
    }

    public onEnd: () => void;
    public onStart: () => void;
    public onMove: (uiWorldPos: Vec3, lerp: number) => void;

    public jumpTo(targetWorldPos: Vec3, delay = 0) {
        return this.jumpFromTo(this.node.worldPosition, targetWorldPos, delay);
    }

    public jumpFromTo(startWorldPos: Vec3, targetWorldPos: Vec3, delay = 0) {
        this.m_startWorldPos.set(startWorldPos);
        this.m_targetWorldPos.set(targetWorldPos);
        this.m_reached = false;
        this.m_elapsedTime = 0;
        this.m_delay = delay;
        this.node.active = true;
        this.node.setWorldPosition(startWorldPos);
        if (!this.m_initScale || (this.m_initScale.x === 0 && this.m_initScale.y === 0 && this.m_initScale.z === 0)) {
            this.node.getScale(this.m_initScale);
        }

        if (delay <= 0) {
            this.onStart && this.onStart();
        }
        return this;
    }

    protected update(deltaTime: number) {
        if (this.m_reached)
            return;

        if (this.m_delay > 0) {
            this.m_delay -= deltaTime;
            if (this.m_delay <= 0)
                this.onStart && this.onStart();
            return;
        }

        this.m_elapsedTime += deltaTime;
        if (this.m_elapsedTime > this.m_jumpDuration) {
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

        this.onMove && this.onMove(this.node.getWorldPosition(), t);
    }

    protected reachTarget() {
        this.m_reached = true;
        if (this.m_autoDeactivate)
            this.node.active = false;
        this.onEnd && this.onEnd();
    }
}