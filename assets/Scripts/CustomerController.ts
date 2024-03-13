import { _decorator, CCInteger, Component, math, Node, Sprite, tween, Vec3 } from 'cc';
import { PathFollowing } from './Core/PathFollowing';
const { ccclass, property } = _decorator;

@ccclass('CustomerController')
export class CustomerController extends PathFollowing {
  @property(Node) protected m_bodyFront: Node;
  @property(Node) protected m_bodyBack: Node;
  @property([Node]) protected m_backContainers: Node[] = [];
  @property([Node]) protected m_frontContainers: Node[] = [];
  @property(CCInteger) protected m_capacity = 12;
  @property(Node) protected m_bubbleWait: Node;
  @property(Node) protected m_bubbleRequest: Node;
  @property(Sprite) protected m_bubbleRequestFill: Sprite;

  protected m_value: number = 0;

  protected start(): void {
    this.m_frontContainers.forEach(container => {
      container.active = false;
    });
    this.m_backContainers.forEach(container => {
      container.active = false;
    });
  }

  protected setDirection(direction: math.Vec3): void {
    super.setDirection(direction);
    const front = this.m_direction.y < 0;
    this.m_bodyFront.active = front;
    this.m_bodyBack.active = !front;
    this.node.scale = new Vec3(this.m_direction.x > 0 ? 1 : -1, 1, 1);
  }

  public setBubble(active: boolean) {
    if (this.m_bubbleRequest) {
      if (active && !this.m_bubbleRequest.active) {
        this.m_bubbleRequest.setScale(new Vec3(0, 0, 0));
        tween(this.m_bubbleRequest)
          .to(0.2, { scale: new Vec3(1, 1, 1) }, {
            easing: 'quartOut',
          })
          .start();
      }
      this.m_bubbleRequest.active = active;
    }
    if (this.m_bubbleWait) {
      this.m_bubbleWait.active = !active;
    }
  }

  public addProduct() {
    this.m_value += 1;
    this.m_frontContainers.forEach((container, index) => {
      const active = index <= this.m_value / 2;
      if (this.m_bodyFront.active && active) {
        if (container.active != active) {
          container.setScale(new Vec3(0, 0, 0));
          tween(container)
            .delay(index * 0.1)
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
        }
      } else {
        container.setScale(new Vec3(1, 1, 1));
      }
      container.active = active;
    });
    this.m_backContainers.forEach((container, index) => {
      const active = index <= this.m_value / 2;
      if (this.m_bodyBack.active && active) {
        if (container.active != active) {
          container.setScale(new Vec3(0, 0, 0));
          tween(container)
            .delay(index * 0.1)
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
        }
      } else {
        container.setScale(new Vec3(1, 1, 1));
      }
      container.active = active;
    });
    if (this.m_bubbleRequestFill)
      this.m_bubbleRequestFill.fillRange = this.m_value / this.m_capacity;
  }

  public getContainer() {
    return this.m_bodyFront.active ? this.m_frontContainers[0].parent : this.m_backContainers[0].parent;
  }
}