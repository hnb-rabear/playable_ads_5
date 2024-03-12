import { _decorator, Component, Layout, Node, UITransform, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuBar')
export class MenuBar extends Component {

    protected start(): void {
        const layout = this.getComponent(Layout);
        layout.padding = 50;
        layout.paddingLeft = 50;
        layout.paddingRight = 50;
        layout.paddingTop = 50;
        layout.paddingBottom = 50;
        layout.spacingX = 50;
        layout.spacingY = 50;

        this.refreshScreenRatio();
        window.addEventListener('resize', () => {
            // The window width has changed
            this.refreshScreenRatio();
        });
        this.refreshScreenRatio();
    }

    protected refreshScreenRatio() {
        const screenRatio = window.innerWidth / window.innerHeight;
        const layout = this.getComponent(Layout);
        const uiTransform = this.getComponent(UITransform);
        const widget = this.getComponent(Widget);
        if (screenRatio > 1) {
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


