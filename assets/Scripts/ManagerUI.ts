import { _decorator, Camera, Component, Node, Sprite, Vec3 } from 'cc';
import { CattleMenu } from './CattleMenu';
import { PointerDragging } from './Core/PointerDragging';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('ManagerUI')
export class ManagerUI extends Component {
    private static m_instance: ManagerUI;
    public static get instance() {
        return ManagerUI.m_instance;
    }

    @property(Camera) protected m_camera: Camera;
    @property(CattleMenu) protected m_menu: CattleMenu;
    @property(PointerDragging) protected m_pointerDragging: PointerDragging = null;

    protected m_horizontalScreen: boolean;

    protected onLoad(): void {
        ManagerUI.m_instance = this;
    }

    protected start(): void {
        this.m_menu.node.active = false;
    }

    public async showFarmCowMenu() {
        await new Promise(resolve => setTimeout(resolve, 500));

        const pointerPath: Vec3[] = [this.m_menu.cow.node.worldPosition];
        // Convert animals nodes to screen point and to world position of ui camera
        const animals = Manager.instance.getCowFarm().getAnimals();
        animals.forEach(animal => {
            const animalNode = animal.node;
            const screenPosition = Manager.instance.camera.worldToScreen(animalNode.worldPosition);
            const worldPosition = this.m_camera.screenToWorld(screenPosition);
            pointerPath.push(worldPosition);
        });

        this.m_menu.node.active = true;
        this.m_menu.showFarmCowMenu();
        this.m_pointerDragging.setSptDisplay(this.m_menu.cow.node.getComponent(Sprite).spriteFrame);
        this.m_pointerDragging.initPathWorldPos(0, pointerPath, true);
        this.m_pointerDragging.moveTo();
    }

    public hideFarmMenu() {
        this.m_menu.node.active = false;
    }

    public async showFarmChickenMenu() {
        this.m_menu.node.active = true;
        this.m_menu.showFarmChickenMenu();
    }

    protected isHorizontalScreen() {
        return window.innerWidth >= window.innerHeight;
    }
}


