import { _decorator, CCInteger, Component, Node, Sprite, SpriteFrame, Animation } from 'cc';
import { PathFollowing } from './PathFollowing';
const { ccclass, property } = _decorator;

@ccclass('PointerDragging')
export class PointerDragging extends PathFollowing {
    @property(Animation) protected m_animPointer: Animation = null;
    @property(Sprite) protected m_renderPointer: Sprite = null;

    protected m_sptDisplay: SpriteFrame = null;

    public setSptDisplay(spt: SpriteFrame) {
        this.m_sptDisplay = spt;
        this.m_renderPointer.spriteFrame = spt;
    }

    protected reachDestination(): void {
        super.reachDestination();
        // loop
        this.restart();
        this.moveTo();
    }
}


