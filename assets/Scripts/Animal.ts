import { _decorator, CCInteger, Color, Component, Node, sp, tween } from 'cc';
const { ccclass, property } = _decorator;

export enum AnimalState {
    None,
    Small,
    Big,
}

@ccclass('Animal')
export class Animal extends Component {
    @property(CCInteger) protected m_id: number = 0;
    @property(sp.Skeleton) protected m_anim: sp.Skeleton = null;
    @property(Node) protected m_fodder: Node = null;
    @property([Node]) protected m_products: Node[] = [];
    @property(Node) public spotAnimal: Node;
    @property(Node) public spotProducts: Node;

    protected m_state: AnimalState;

    public get spotFodder() {
        return this.m_fodder;
    }

    public get id() {
        return this.m_id;
    }

    protected start(): void {
        this.m_products.forEach(product => {
            product.active = false;
        });
        this.m_fodder.active = false;
        this.m_anim.node.active = false;
    }

    // public setState(state: AnimalState) {
    //     this.m_animSmallForm.node.active = state === AnimalState.Small;
    //     this.m_animBigForm.node.active = state === AnimalState.Big;

    //     if (state === AnimalState.Small) {
    //         this.m_animSmallForm.setAnimation(0, 'dung', true);
    //     } else if (state === AnimalState.Big) {
    //         if (this.m_animSmallForm.node.active) {
    //             tween(this.m_animSmallForm)
    //                 .to(0.5, { color: Color.TRANSPARENT }).start();
    //             this.m_animBigForm.color.set(Color.TRANSPARENT);
    //             tween(this.m_animBigForm)
    //                 .to(0.5, { color: Color.WHITE }).start();
    //         } else {
    //             this.m_animSmallForm.node.active = false;
    //             this.m_animBigForm.node.active = true;
    //             this.m_animBigForm.setAnimation(0, 'an', true);
    //         }
    //     }
    // }

    public setState(state: AnimalState) {
        this.m_state = state;
    }

    public addAnimal() {
        if (this.m_anim.node.active)
            return;
        this.m_anim.node.active = true;
        this.m_anim.setAnimation(0, 'tha_bo_con', false);
        setTimeout(() => {
            this.m_anim.setAnimation(0, 'dung_bo_con', true);
        }, 1000);
        // this.m_anim.setEndListener(() => {
        //     this.m_anim.setAnimation(0, 'dung_bo_con', true);
        // });
    }

    public hasAnimal() {
        return this.m_anim.node.active;
    }

    public isFeed() {
        return this.m_fodder.active;
    }

    public hasProducts() {
        return this.m_products.every(product => product.active);
    }

    public feed() {
        // if (this.m_fodder.active)
        //     return;
        this.m_fodder.active = true;
        this.m_anim.setAnimation(0, 'tha_co', true);
        this.m_anim.setEndListener(() => {

        });
    }

    public collectProducts() {

    }
}


