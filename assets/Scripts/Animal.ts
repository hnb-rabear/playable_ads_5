import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Animal')
export class Animal extends Component {
    @property(sp.Skeleton) protected m_animSmallForm: sp.Skeleton = null;
    @property(sp.Skeleton) protected m_animBigForm: sp.Skeleton = null;
    @property(Node) protected m_food: Node = null;
    @property([Node]) protected m_products: Node[] = [];

    protected start(): void {
        this.m_products.forEach(product => {
            product.active = false;
        });
        this.m_food.active = false;
        this.m_animBigForm.node.active = false;
    }
}


