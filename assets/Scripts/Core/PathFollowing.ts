import { _decorator, CCBoolean, CCInteger, Component, Enum, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PathFollowing')
export class PathFollowing extends Component {

    @property(CCBoolean) protected m_autoMove: boolean = false;
    @property(CCInteger) protected m_moveSpeed: number = 0;
    @property([Node]) protected m_path: Node[] = [];

    protected m_reached: boolean = false;
    public get reached(): boolean {
        return this.m_reached;
    }

    protected m_direction: Vec3;
    public get direction(): Vec3 {
        return this.m_direction;
    }

    protected m_id: number = 0;
    public getValue(): number {
        return this.m_id;
    }

    protected m_init: boolean = false;
    protected m_curStopIndex: number = 0;

    protected start(): void {
        if (!this.m_init)
            this.init(0, this.m_path, this.m_autoMove);
    }

    protected update(deltaTime: number): void {
        if (!this.m_autoMove)
            return;
        if (this.reached || this.m_path.length === 0 || this.m_moveSpeed <= 0) {
            return;
        }
        const reached = this.move(deltaTime);
        if (reached) {
            this.m_reached = true;
        }
    }

    public init(id: number, path: Node[], autoMove: boolean): void {
        this.m_id = id;
        this.m_path = path;
        this.m_autoMove = autoMove;
        this.m_init = true;
    }

    protected move(deltaTime: number): boolean {
        const index = this.m_curStopIndex;
        let currentTarget = this.m_path[index];
        let direction = Vec3.subtract(new Vec3(), currentTarget.worldPosition, this.node.worldPosition).normalize();
        let displacement = Vec3.multiplyScalar(new Vec3(), direction, this.m_moveSpeed * deltaTime);
        this.node.worldPosition = this.node.worldPosition.add(displacement);
        this.setDirection(direction);
        if (Vec3.subtract(new Vec3(), currentTarget.worldPosition, this.node.worldPosition).length() < this.m_moveSpeed * deltaTime) {
            this.node.setWorldPosition(currentTarget.worldPosition);
            this.m_curStopIndex = index + 1;
            if (this.m_curStopIndex === this.m_path.length) {
                // reach the end of the path
                return true;
            }
        }
        return false;
    }

    public moveControl(deltaTime: number) {
        if (this.m_autoMove)
            return;
        return this.move(deltaTime);
    }

    protected setDirection(direction: Vec3) {
        if (this.m_direction === direction)
            return;
        this.m_direction = direction;
    }
}