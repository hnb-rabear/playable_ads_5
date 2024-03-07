import { _decorator, CCBoolean, Component, EventTouch, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draggable')
export class Draggable extends Component {

    @property(Node) protected m_displayItem: Node;

    protected m_dragging: boolean = false;
    protected m_initWorldPos: Vec3 = new Vec3();


    protected start(): void {

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onTouchStart(event: EventTouch) {
        this.m_initWorldPos.set(this.node.worldPosition);
        this.m_dragging = true;
        if (this.m_displayItem) {
            this.m_displayItem.active = true;
            this.m_displayItem.setPosition(0, 0, 0);
        }
    }

    protected onTouchMove(event: EventTouch) {
        if (this.m_dragging) {
            const position = event.getUILocation();
            if (this.m_displayItem) {
                this.m_displayItem.setWorldPosition(new Vec3(position.x, position.y, 0));
            } else {
                this.node.setWorldPosition(new Vec3(position.x, position.y, 0));
            }
        }
    }

    protected onTouchEnd(event: EventTouch) {
        this.m_dragging = false;
        if (this.m_displayItem) {
            this.m_displayItem.active = false;
            this.m_displayItem.setPosition(0, 0, 0);
        } else {
            this.node.setWorldPosition(this.m_initWorldPos);
        }
    }
}


