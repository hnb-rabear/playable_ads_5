import { _decorator, CCFloat, CCInteger, Component, Node } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('IsometricZOrderUpdater')
@executeInEditMode(true)
export class IsometricZOrderUpdater extends Component {

    @property(Node) protected m_container: Node;
    @property(CCFloat) protected m_refreshInterval: number = 0;

    protected m_children: Node[] = [];
    protected m_tempInterval: number = 0;

    protected onLoad(): void {
        if (!this.m_container)
            this.m_container = this.node;
        this.m_container.children.forEach(node => {
            this.addChild(node);
        });
        this.updateSortingOrder();
    }

    protected lateUpdate(dt: number): void {
        if (this.m_refreshInterval <= 0)
            return;
        this.m_tempInterval += dt;
        if (this.m_tempInterval > this.m_refreshInterval) {
            this.updateSortingOrder();
        }
    }

    public updateSortingOrder() {
        // step 1, reorder list m_productStacksIn by y position
        // step 2, reorder child index of m_productStacksIn by index
        this.m_children.sort((a, b) => b.position.y - a.position.y);
        for (let i = 0; i < this.m_children.length; i++) {
            this.m_children[i].setSiblingIndex(i);
        }
        this.m_tempInterval = this.m_refreshInterval;
    }

    public addChild(node: Node) {
        if (!this.m_children.find(child => child.uuid == node.uuid)) {
            node.setParent(this.m_container);
            this.m_children.push(node);
        }
        this.m_tempInterval = this.m_refreshInterval;
    }
}