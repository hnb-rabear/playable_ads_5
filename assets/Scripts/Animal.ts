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

    @property(CCInteger) protected m_id: number = 0;
    @property(sp.Skeleton) protected m_anim: sp.Skeleton = null;
    @property(Node) protected m_fodder: Node = null;
    @property([AnimalProduct]) protected m_animalProducts: AnimalProduct[] = [];
    @property(Node) public spotAnimal: Node;
    @property(Node) public spotProducts: Node;

    protected m_state: AnimalState;
    protected m_valid: boolean = false;

    public get spotFodder() {
        return this.m_fodder;
    }

    public get id() {
        return this.m_id;
    }

    public get valid(): boolean {
        return this.m_valid;
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

    public async addAnimal(name: string) {
        if (this.m_anim.node.active)
            return;

        if (name === 'cow') {
            this.m_valid = true;
            this.m_anim.node.active = true;
            this.m_anim.setAnimation(0, this.ANIM_COW_S_APPEAR, false);
            this.m_anim.setCompleteListener(() => {
                this.m_anim.setAnimation(0, this.ANIM_COW_S_IDLE, true);
                this.m_anim.setCompleteListener(null);
            });
        } else if (name === "pig") {
            this.m_anim.node.active = true;
            this.m_anim.setAnimation(0, this.ANIM_PIG_S_APPEAR, false);
            this.m_anim.setCompleteListener(() => {
                this.m_anim.setAnimation(0, this.ANIM_PIG_S_IDLE, true);
                this.m_anim.setCompleteListener(null);
            });
        }
    }

    public async dispose() {
        if (this.m_valid)
            return;
        this.m_anim.setAnimation(0, this.ANIM_PIG_S_DISAPPEAR, false);
        this.m_anim.setCompleteListener(() => {
            this.m_anim.node.active = false;
            this.m_anim.setCompleteListener(null);
        });
    }

    public hasCorrectAnimal() {
        return this.m_anim.node.active && this.m_valid;
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
        this.m_anim.setAnimation(0, this.ANIM_COW_S_GROW, false);
        this.m_anim.setCompleteListener(() => {
            this.m_anim.setAnimation(0, this.ANIM_COW_B_EAT, true);
            this.m_anim.setCompleteListener(null);
        });
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