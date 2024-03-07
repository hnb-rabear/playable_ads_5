import { _decorator, CCBoolean, Component, Layout, Node, tween, UITransform, Vec3, Widget } from 'cc';
import { Draggable } from './Core/Draggable';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('CattleMenu')
export class CattleMenu extends Component {
    @property(Draggable) public pig: Draggable = null;
    @property(Draggable) public cow: Draggable = null;
    @property(Draggable) public chicken: Draggable = null;
    @property(Draggable) public sheep: Draggable = null;
    @property(CCBoolean) protected m_horizontalScreen: boolean = false;

    protected onEnable(): void {
        this.node.setScale(0, 0, 0);
        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' })
            .start();
    }

    protected start(): void {
        const widget = this.getComponent(Widget);
        widget.alignMode = Widget.AlignMode.ALWAYS;

        this.refreshScreenRatio();
        window.addEventListener('resize', () => {
            // The window width has changed
            this.refreshScreenRatio();
        });
        this.refreshScreenRatio();
    }

    public showFarmCowMenu() {
        this.pig.node.active = true;
        this.cow.node.active = true;
        this.chicken.node.active = false;
        this.sheep.node.active = false;
    }

    public showFarmChickenMenu() {
        this.pig.node.active = true;
        this.cow.node.active = false;
        this.chicken.node.active = true;
        this.sheep.node.active = true;
    }

    protected refreshScreenRatio() {
        const isHorizontal = window.innerWidth >= window.innerHeight;

        const layout = this.getComponent(Layout);
        layout.padding = 50;
        layout.paddingLeft = 50;
        layout.paddingRight = 50;
        layout.paddingTop = 50;
        layout.paddingBottom = 50;
        layout.spacingX = 50;
        layout.spacingY = 50;
        const uiTransform = this.getComponent(UITransform);
        const widget = this.getComponent(Widget);
        if (isHorizontal) {
            uiTransform.contentSize.set(300, 300);
            layout.type = Layout.Type.VERTICAL;
            // Left Center Right Horizontal_Stretch
            widget.isAbsoluteRight = false;
            widget.isAlignRight = true;
            widget.right = 0.1;
            // Top Middle Bottom Vertical_Stretch
            widget.isAbsoluteVerticalCenter = false;
            widget.isAlignVerticalCenter = true;
            widget.verticalCenter = 0;
        }
        else {
            uiTransform.contentSize.set(280, 280);
            layout.type = Layout.Type.HORIZONTAL;
            // Left Center Right Horizontal_Stretch
            widget.isAbsoluteHorizontalCenter = false;
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 0;
            // Top Middle Bottom Vertical_Stretch
            widget.isAbsoluteBottom = false;
            widget.isAlignBottom = true;
            widget.bottom = 0.1;
        }
    }
}


