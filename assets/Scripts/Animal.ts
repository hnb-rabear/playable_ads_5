import { _decorator, CCInteger, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

export enum AnimalState {
    None,
    Small,
    Big,
}

@ccclass('Animal')
export class Animal extends Component {
    @property(CCInteger) protected m_id: number = 0;
    @property(sp.Skeleton) protected m_animSmallForm: sp.Skeleton = null;
    @property(sp.Skeleton) protected m_animBigForm: sp.Skeleton = null;
    @property(Node) protected m_food: Node = null;
    @property([Node]) protected m_products: Node[] = [];
    @property(Node) public pointerTarget: Node;

    public get id() {
        return this.m_id;
    }

    protected start(): void {
        this.m_products.forEach(product => {
            product.active = false;
        });
        this.m_food.active = false;
    }

    public setState(state: AnimalState) {
        switch (state) {
            case AnimalState.Small:
                this.m_animSmallForm.node.active = true;
                this.m_animBigForm.node.active = false;
                break;
            case AnimalState.Big:
                this.m_animSmallForm.node.active = false;
                this.m_animBigForm.node.active = true;
                break;
            default:
                this.m_animSmallForm.node.active = false;
                this.m_animBigForm.node.active = false;
                break;
        }
    }

    public hasAnimal() {
        return this.m_animSmallForm.node.active || this.m_animBigForm.node.active;
    }
}


