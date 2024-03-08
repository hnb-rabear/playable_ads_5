import { _decorator, CCInteger, Color, Component, Node, sp, tween, Vec3 } from 'cc';
import { AnimalProduct } from './AnimalProduct';
const { ccclass, property } = _decorator;

export enum AnimalState {
    None,
    Small,
    Big,
}

@ccclass('Animal')
export class Animal extends Component {

    private readonly ANIM_COW_S_APPEAR = 'cow_s_appear';
    private readonly ANIM_COW_S_IDLE = 'cow_s_idle';
    private readonly ANIM_COW_S_GROW = 'cow_s_grow';
    private readonly ANIM_COW_B_EAT = 'cow_b_eat';
    private readonly ANIM_PIG_S_APPEAR = 'pig_s_appear';
    private readonly ANIM_PIG_S_IDLE = 'pig_s_idle';
    private readonly ANIM_PIG_S_DISAPPEAR = 'pig_s_disappear';
    private readonly ANIM_FOOD_APPEAR = 'food_appear';

    private readonly ANIM_COW_S_APPEAR_IDX = 0;
    private readonly ANIM_COW_S_IDLE_IDX = 1;
    private readonly ANIM_COW_S_GROW_IDX = 2;
    private readonly ANIM_COW_B_EAT_IDX = 3;
    private readonly ANIM_PIG_S_APPEAR_IDX = 4;
    private readonly ANIM_PIG_S_IDLE_IDX = 5;
    private readonly ANIM_PIG_S_DISAPPEAR_IDX = 6;
    private readonly ANIM_FOOD_APPEAR_IDX = 7;

    @property(CCInteger) protected m_id: number = 0;
    @property(sp.Skeleton) protected m_anim: sp.Skeleton = null;
    @property(Node) protected m_fodder: Node = null;
    @property([AnimalProduct]) protected m_animalProducts: AnimalProduct[] = [];
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
        this.m_animalProducts.forEach(product => {
            product.init();
        });
        this.m_fodder.active = false;
        this.m_anim.node.active = false;
    }

    public setState(state: AnimalState) {
        this.m_state = state;
    }

    public addAnimal() {
        if (this.m_anim.node.active)
            return;
        this.m_anim.node.active = true;

        let trackEntry = this.m_anim.setAnimation(this.ANIM_COW_S_APPEAR_IDX, this.ANIM_COW_S_APPEAR, false);
        // this.m_anim.setEndListener((entry) => {
        //     console.log(entry.animation.name);
        //     console.log(JSON.stringify(entry));
        // });
        setTimeout(() => {
            this.m_anim.setAnimation(this.ANIM_COW_S_IDLE_IDX, this.ANIM_COW_S_IDLE, true);
        }, 1000);
    }

    public hasAnimal() {
        return this.m_anim.node.active;
    }

    public isFeed() {
        return this.m_fodder.active;
    }

    public hasCollectableProducts() {
        return this.m_animalProducts.some(product => product.available());
    }

    public feed() {
        if (this.m_fodder.active)
            return;
        this.m_fodder.active = true;
        this.m_anim.setAnimation(this.ANIM_COW_S_GROW_IDX, this.ANIM_COW_S_GROW, false);
        setTimeout(() => {
            this.m_anim.setAnimation(this.ANIM_COW_B_EAT_IDX, this.ANIM_COW_B_EAT, true);
        }, 2000);
    }

    public createProducts() {
        this.m_animalProducts.forEach((product, index) => {
            product.create(index);
        });
    }

    public touchProduct(touchWorldPos: Vec3, customerToWorldPos: Vec3, onCollected: () => void) {
        this.m_animalProducts.forEach(product => {
            if (product.available()) {
                const worldPos = product.node.worldPosition;
                const distance = Vec3.distance(worldPos, touchWorldPos);
                if (distance < 50) {
                    product.collect(customerToWorldPos, () => {
                        onCollected();
                    });
                }
            }
        });
    }
}