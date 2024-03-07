import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ManagerUI')
export class ManagerUI extends Component {
    private static m_instance: ManagerUI;
    public static get instance() {
        return ManagerUI.m_instance;
    }

    @property(Node) protected m_horizontalScreenMenu: Node;
    @property(Node) protected m_verticalScreenMenu: Node;

    protected onLoad(): void {
        ManagerUI.m_instance = this;
    }

    protected start(): void {
        window.addEventListener('resize', () => {
            // The window width has changed
            this.checkScreenRatio();
        });
        this.checkScreenRatio();
    }

    protected checkScreenRatio(): void {
        const isHorizontal = window.innerWidth >= window.innerHeight;
        this.m_horizontalScreenMenu.active = isHorizontal;
        this.m_verticalScreenMenu.active = !isHorizontal;
    }
}


