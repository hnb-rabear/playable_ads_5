import { _decorator, CCInteger, Component, math, Node, Vec3 } from 'cc';
import { PathFollowing } from './Core/PathFollowing';
const { ccclass, property } = _decorator;

@ccclass('CustomerController')
export class CustomerController extends PathFollowing {
  @property(Node) protected m_bodyFront: Node;
  @property(Node) protected m_bodyBack: Node;

  protected setDirection(direction: math.Vec3): void {
    super.setDirection(direction);
    const front = this.m_direction.y < 0;
    this.m_bodyFront.active = front;
    this.m_bodyBack.active = !front;
    this.node.scale = new Vec3(this.m_direction.x > 0 ? 1 : -1, 1, 1);
  }
}