import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PathFollowingInTime')
export class PathFollowingInTime extends Component {
    @property(CCFloat) protected m_fixedDuration: number = 0;
    @property(CCBoolean) protected m_autoMove: boolean = false;
    @property([Node]) protected m_pathNode: Node[] = [];
    @property([Vec3]) protected m_pathWorldPos: Vec3[] = [];

    @property({ readonly: true }) protected m_reached: boolean = false;
    public get reached(): boolean {
        return this.m_reached;
    }

    @property({ readonly: true }) protected m_direction: Vec3;
    public get direction(): Vec3 {
        return this.m_direction;
    }

    @property({ readonly: true }) protected m_index: number = 0;
    public get index(): number {
        return this.m_index;
    }

    @property({ readonly: true }) protected m_init: boolean = false;
    @property({ readonly: true }) protected m_targetStopIndex: number = 0;
    @property({ readonly: true }) protected m_destinationIndex: number = 0;
    @property({ readonly: true }) protected m_delay: number = 0;
    @property({ readonly: true }) protected m_movingDuration: number = 0;

    public onReached: () => void;

    protected start(): void {
        if (!this.m_init)
            this.initPathNode(0, this.m_pathNode, this.m_autoMove);
    }

    protected update(deltaTime: number): void {
        if (!this.m_autoMove)
            return;
        const reached = this.move(deltaTime);
        if (reached && !this.m_reached) {
            this.reachDestination();
        }
    }

    protected reachDestination(): void {
        this.m_reached = true;
        this.onReached && this.onReached();
    }

    public initPathNode(idx: number, path: Node[], autoMove: boolean): void {
        this.m_index = idx;
        this.m_pathNode = path;
        this.m_pathWorldPos = [];
        this.m_autoMove = autoMove;
        this.m_init = true;
        this.m_reached = false;
        this.m_targetStopIndex = 0;
        this.m_movingDuration = 0;
        this.m_destinationIndex = 0;
        if (this.m_pathNode.length > 0)
            this.node.setWorldPosition(this.m_pathNode[this.m_targetStopIndex].worldPosition);
    }

    public initPathWorldPos(idx: number, path: Vec3[], autoMove: boolean): void {
        this.m_index = idx;
        this.m_pathNode = [];
        this.m_pathWorldPos = path;
        this.m_autoMove = autoMove;
        this.m_init = true;
        this.m_reached = false;
        this.m_targetStopIndex = 0;
        this.m_movingDuration = 0;
        this.m_destinationIndex = 0;
        if (this.m_pathWorldPos.length > 0)
            this.node.setWorldPosition(this.m_pathWorldPos[this.m_targetStopIndex]);
    }

    public restart() {
        if (this.m_pathNode.length > 0)
            this.initPathNode(this.m_index, this.m_pathNode, this.m_autoMove);
        if (this.m_pathWorldPos.length > 0)
            this.initPathWorldPos(this.m_index, this.m_pathWorldPos, this.m_autoMove);
    }

    public get totalStops(): number {
        return this.m_pathNode.length > 0 ? this.m_pathNode.length - 1 : this.m_pathWorldPos.length;
    }

    public moveTo(destinationIdx: number = 0) {
        const totalStops = this.totalStops;
        if (destinationIdx > 0) {
            destinationIdx = Math.min(destinationIdx, totalStops - 1);
        }
        else {
            destinationIdx = totalStops - 1;
        }
        if (this.m_destinationIndex >= destinationIdx)
            return;

        this.m_reached = false;
        this.m_movingDuration = 0;
        this.m_destinationIndex = destinationIdx;
    }

    public setDelay(delay: number): void {
        this.m_delay = delay;
    }

    protected move(deltaTime: number): boolean {
        if ((this.m_pathNode.length === 0 && this.m_pathWorldPos.length === 0) || this.m_fixedDuration <= 0)
            return false;

        if (this.m_targetStopIndex > this.m_destinationIndex) {
            return true;
        }

        if (this.m_delay > 0) {
            this.m_delay -= deltaTime;
            return false;
        }

        this.m_movingDuration += deltaTime;
        const index = this.m_targetStopIndex;

        let currentTargetPos: Vec3;
        if (this.m_pathWorldPos.length > 0) {
            currentTargetPos = this.m_pathWorldPos[index];
        }
        else if (this.m_pathNode.length > 0) {
            currentTargetPos = this.m_pathNode[index].worldPosition;
        }

        let direction = Vec3.subtract(new Vec3(), currentTargetPos, this.node.worldPosition).normalize();
        let displacement = Vec3.multiplyScalar(new Vec3(), direction, this.m_moveSpeed * deltaTime);
        this.node.worldPosition = this.node.worldPosition.add(displacement);
        this.setDirection(direction);
        if (Vec3.subtract(new Vec3(), currentTargetPos, this.node.worldPosition).length() < this.m_moveSpeed * deltaTime) {
            this.node.setWorldPosition(currentTargetPos);
            this.m_targetStopIndex = index + 1;
            if (this.m_targetStopIndex > this.m_destinationIndex) {
                // reach the end of the path
                return true;
            }
        }
        return false;
    }

    public moveControl(deltaTime: number) {
        if (this.m_autoMove)
            return;
        const reached = this.move(deltaTime);
        if (reached && !this.m_reached) {
            this.m_reached = true;
            reached && this.onReached && this.onReached();
        }
        return reached;
    }

    protected setDirection(direction: Vec3) {
        if (this.m_direction === direction)
            return;
        this.m_direction = direction;
    }

    public getDistanceFromStart() {
        return this.getDistanceFromTo(0, this.totalStops - 1);
    }

    public getDistanceFromTo(fromIdx: number, toIdx: number) {
        if (fromIdx === toIdx)
            return 0;

        let distance = 0;
        if (fromIdx > toIdx)
            [fromIdx, toIdx] = [toIdx, fromIdx];

        if (this.m_pathNode.length > 0) {
            for (let i = 0; i < this.m_pathNode.length - 1; i++)
                if (i >= fromIdx && i <= toIdx)
                    distance += Vec3.distance(this.m_pathNode[i].worldPosition, this.m_pathNode[i + 1].worldPosition);
        }

        if (this.m_pathWorldPos.length > 0) {
            for (let i = 0; i < this.m_pathWorldPos.length - 1; i++)
                if (i >= fromIdx && i <= toIdx)
                    distance += Vec3.distance(this.m_pathWorldPos[i], this.m_pathWorldPos[i + 1]);
        }

        return distance;
    }

    public setAutoMove(autoMove: boolean) {
        this.m_autoMove = autoMove;
    }

    public setPathWorldPos(pathWorldPos: Vec3[]) {
        this.m_pathWorldPos = pathWorldPos;
    }
}


