import { _decorator, CCInteger, CCString, Component, EventTouch, Node, Vec2, Vec3 } from 'cc';
import { Draggable } from './Core/Draggable';
import { Manager } from './Manager';
import { ManagerUI } from './ManagerUI';
const { ccclass, property } = _decorator;

@ccclass('CattleMenuItem')
export class CattleMenuItem extends Draggable {
    @property(CCString) public id: string = '';
    @property(Node) public lock: Node = null;

    protected m_locked: boolean = false;

    public onDragEnd: (id: string, uiWorldPos: Vec3) => void = null;
    public onDragMove: (id: string, uiWorldPos: Vec3) => void = null;

    public setLocked(locked: boolean) {
        if (this.lock)
            this.lock.active = locked;
        this.m_locked = locked;
    }

    protected onTouchStart(event: EventTouch): void {
        if (this.m_locked) return;

        super.onTouchStart(event);
    }

    protected onTouchMove(event: EventTouch): void {
        if (this.m_locked) return;

        super.onTouchMove(event);
        const pos = this.m_displayItem ? this.m_displayItem.worldPosition : this.node.worldPosition;
        this.onDragMove && this.onDragMove(this.id, pos);

        Manager.instance.onDragMoveCattleMenuItem(this.id, pos);
    }

    protected onTouchEnd(event: EventTouch): void {
        if (this.m_locked) return;

        const pos = this.m_displayItem ? this.m_displayItem.worldPosition : this.node.worldPosition;
        this.onDragEnd && this.onDragEnd(this.id, pos);

        Manager.instance.onDragEndCattleMenuItem(this.id, pos);

        super.onTouchEnd(event);
    }
}


