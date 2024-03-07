import { _decorator, Component, Node } from 'cc';
import { CattleMenu } from './CattleMenu';
const { ccclass, property } = _decorator;

@ccclass('ManagerUI')
export class ManagerUI extends Component {
    private static m_instance: ManagerUI;
    public static get instance() {
        return ManagerUI.m_instance;
    }

    @property(CattleMenu) protected m_menu: CattleMenu;

    protected m_horizontalScreen: boolean;

    protected onLoad(): void {
        ManagerUI.m_instance = this;
    }

    protected start(): void {
        this.m_menu.node.active = false;
    }

    public showFarmCowMenu() {
        this.m_menu.node.active = true;
        this.m_menu.showFarmCowMenu();
    }

    public hideFarmMenu() {
        this.m_menu.node.active = false;
    }

    public showFarmChickenMenu() {
        this.m_menu.node.active = true;
        this.m_menu.showFarmChickenMenu();
    }

    protected isHorizontalScreen() {
        return window.innerWidth >= window.innerHeight;
    }
}


