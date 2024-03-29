import { _decorator, CCInteger, Component, Node, tween, Vec3 } from 'cc';
import { MoveJumping } from './Core/MoveJumping';
const { ccclass, property } = _decorator;


@ccclass('AnimalProduct')
export class AnimalProduct extends Component {
    @property(Node) protected m_product: Node = null;
    @property(Node) protected m_animal: Node = null;
    @property(MoveJumping) protected m_productMovement: MoveJumping = null;

    @property({ readonly: true }) private m_collected;

    public init() {
        this.m_product.active = false;
        this.m_collected = false;
    }
    public create(idx: number) {
        this.m_product.active = true;
        this.m_productMovement
            .jumpFromTo(this.m_animal.worldPosition, this.m_product.worldPosition, idx * 0.1);
        this.m_product.setScale(new Vec3(0, 0, 0));
        tween(this.m_product)
            .to(this.m_productMovement.jumpDuration / 2, { scale: new Vec3(1, 1, 1) })
            .start();
    }
    public collect(collectPointWorldPos: Vec3, onReach: () => void) {
        if (this.m_collected)
            return;
        this.m_collected = true;
        this.m_productMovement
            .jumpTo(collectPointWorldPos)
            .onEnd = () => {
                onReach();
                this.m_product.active = false;
            };
        tween(this.m_product)
            .to(this.m_productMovement.jumpDuration, { scale: new Vec3(0.3, 0.3, 0.3) })
            .start();
    }

    public available() {
        return this.m_product.active && !this.m_collected;
    }
}