import { _decorator, Component, EventTouch, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draggable')
export class Draggable extends Component {

    private m_dragging: boolean = false;
    private m_initWorldPos: Vec3 = new Vec3();

    protected start(): void {
        this.m_initWorldPos.set(this.node.worldPosition);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onTouchStart(event: EventTouch) {
        this.m_dragging = true;
    }

    protected onTouchMove(event: EventTouch) {
        if (this.m_dragging) {
            const position = event.getUILocation();
            this.node.setWorldPosition(new Vec3(position.x, position.y, 0));
        }
    }

    protected onTouchEnd(event: EventTouch) {
        this.m_dragging = false;
        this.node.setWorldPosition(this.m_initWorldPos);
    }
}


