import { _decorator, CCInteger, CCString, Component, EventTouch, Node, Vec2, Vec3 } from 'cc';
import { Draggable } from './Core/Draggable';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('CattleMenuItem')
export class CattleMenuItem extends Draggable {
    @property(CCString) public id: string = '';

    public onDragEnd: (id: string, uiWorldPos: Vec3) => void = null;
    public onDragMove: (id: string, uiWorldPos: Vec3) => void = null;

    protected onTouchMove(event: EventTouch): void {
        super.onTouchMove(event);
        this.onDragMove && this.onDragMove(this.id, this.m_displayItem.worldPosition);
        Manager.instance.onDragMoveCattleMenuItem(this.id, this.m_displayItem.worldPosition);
    }

    protected onTouchEnd(event: EventTouch): void {
        this.onDragEnd && this.onDragEnd(this.id, this.m_displayItem.worldPosition);
        Manager.instance.onDragEndCattleMenuItem(this.id, this.m_displayItem.worldPosition);

        super.onTouchEnd(event);
    }
}


