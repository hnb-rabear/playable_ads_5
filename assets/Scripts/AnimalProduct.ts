import { _decorator, CCInteger, Component, Node } from 'cc';
import { MoveJumping } from './Core/MoveJumping';
const { ccclass, property } = _decorator;


@ccclass('AnimalProduct')
export class AnimalProduct extends Component {
    @property(Node) protected m_product: Node = null;
    @property(Node) protected m_animal: Node = null;
    @property(MoveJumping) protected m_productMovement: MoveJumping = null;
    public init() {
        this.m_product.active = false;
    }
    public isDisplayed() {
        return this.m_product.active;
    }
    public create(idx: number) {
        this.m_product.active = true;
        this.m_product.getComponent(MoveJumping)
            .jumpFromTo(this.m_animal.worldPosition, this.m_product.worldPosition, idx * 0.1);
    }
}