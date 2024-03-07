import { _decorator, Camera, Component, Node, Sprite, Vec3 } from 'cc';
import { CattleMenu, MenuState } from './CattleMenu';
import { PointerDragging } from './Core/PointerDragging';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('ManagerUI')
export class ManagerUI extends Component {
    private static m_instance: ManagerUI;
    public static get instance() {
        return ManagerUI.m_instance;
    }

    @property(Camera) public camera: Camera;
    @property(CattleMenu) protected m_menu: CattleMenu;
    @property(PointerDragging) protected m_pointerDragging: PointerDragging = null;

    protected m_horizontalScreen: boolean;

    protected onLoad(): void {
        ManagerUI.m_instance = this;
    }

    protected start(): void {
        this.m_menu.node.active = false;

        window.addEventListener('resize', () => {
            // The window width has changed
            if (this.m_menu.state === MenuState.Animal)
                this.refreshCowFarmAddingGuide();
            else if (this.m_menu.state === MenuState.Feed)
                this.refreshCowFarmFeedingGuide();
            else if (this.m_menu.state === MenuState.Harvest)
                this.refreshCowFarmHarvestingGuide();
        });
        this.m_pointerDragging.node.active = false;
    }

    //==================================================

    public async showCowFarmMenu() {
        await new Promise(resolve => setTimeout(resolve, 500));

        this.m_menu.node.active = true;
        this.m_menu.showCowFarmMenu();

        await new Promise(resolve => setTimeout(resolve, 500));

        this.showCowFarmAddingGuide();
    }

    public showCowFarmAddingGuide() {
        const pointerPath: Vec3[] = [this.m_menu.cow.node.worldPosition];
        // Convert animals nodes to screen point and to world position of ui camera
        const animals = Manager.instance.getCowFarm().getAnimals();
        let hasAnimal = false;
        animals.forEach(animal => {
            if (!animal.hasAnimal()) {
                const animalNode = animal.pointerTarget;
                const screenPos = Manager.instance.camera.worldToScreen(animalNode.worldPosition);
                const worldPos = this.camera.screenToWorld(screenPos);
                pointerPath.push(worldPos);
                hasAnimal = true;
            }
        });
        if (hasAnimal) {
            this.m_pointerDragging.node.active = true;
            this.m_pointerDragging.setSptDisplay(this.m_menu.cow.node.getComponent(Sprite).spriteFrame);
            this.m_pointerDragging.initPathWorldPos(0, pointerPath, true);
            this.m_pointerDragging.moveTo();
        }
    }

    protected refreshCowFarmAddingGuide() {
        if (!this.m_pointerDragging.node.active)
            return;
        const pointerPath: Vec3[] = [this.m_menu.cow.node.worldPosition];
        const animals = Manager.instance.getCowFarm().getAnimals();
        let hasAnimal = false;
        animals.forEach(animal => {
            if (!animal.hasAnimal()) {
                const animalNode = animal.pointerTarget;
                const screenPosition = Manager.instance.camera.worldToScreen(animalNode.worldPosition);
                const worldPosition = this.camera.screenToWorld(screenPosition);
                pointerPath.push(worldPosition);
                hasAnimal = true;
            }
        });
        this.m_pointerDragging.setPathWorldPos(pointerPath);
        if (!hasAnimal)
            this.m_pointerDragging.node.active = false;
    }

    //==================================================

    public async showCowFarmFodderMenu() {
        this.m_menu.setState(MenuState.Feed);

        await new Promise(resolve => setTimeout(resolve, 500));

        this.showCowFarmFeedingGuide();
    }

    protected showCowFarmFeedingGuide() {
    }

    protected refreshCowFarmFeedingGuide() {
    }

    //==================================================

    public async showCowFarmHarvestMenu() {
        this.m_menu.setState(MenuState.Harvest);

        await new Promise(resolve => setTimeout(resolve, 500));

        this.showCowFarmHarvestingGuide();
    }

    protected showCowFarmHarvestingGuide() {

    }

    protected refreshCowFarmHarvestingGuide() {
    }

    //==================================================

    public hidePointer() {
        this.m_pointerDragging.node.active = false;
    }

    public async showFarmChickenMenu() {
        this.m_menu.node.active = true;
        this.m_menu.showFarmChickenMenu();
    }

    protected isHorizontalScreen() {
        return window.innerWidth >= window.innerHeight;
    }
}


