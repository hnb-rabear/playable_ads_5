import { _decorator, AudioSource, Button, Camera, Component, Node, Sprite, Toggle, Vec3 } from 'cc';
import { CattleMenu, MenuState } from './CattleMenu';
import { PointerDragging } from './Core/PointerDragging';
import { Manager } from './Manager';
import { PointerFocusing } from './Core/PointerFocusing';
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
    @property(Toggle) protected m_togSound: Toggle;
    @property(Button) protected m_btnOpenStore: Button;
    @property(AudioSource) protected m_audioSource: AudioSource;
    @property(PointerFocusing) public pointerFocusing: PointerFocusing;

    protected m_horizontalScreen: boolean;

    public get menu() {
        return this.m_menu;
    }

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
        this.m_btnOpenStore.node.on(Button.EventType.CLICK, this.onBtnOpenStorePressed, this);
        this.m_btnOpenStore.node.active = false;
        this.m_togSound.node.on(Toggle.EventType.TOGGLE, () => {
            if (!this.m_togSound.isChecked) {
                this.m_audioSource.play();
            } else {
                this.m_audioSource.pause();
            }
        }, this);
        this.m_togSound.isChecked = false;
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
        let finished = true;
        animals.forEach(animal => {
            if (!animal.hasAnimal()) {
                const animalNode = animal.spotAnimal;
                const screenPos = Manager.instance.camera.worldToScreen(animalNode.worldPosition);
                const worldPos = this.camera.screenToWorld(screenPos);
                pointerPath.push(worldPos);
                finished = false;
            }
        });
        if (!finished) {
            this.m_pointerDragging.node.active = true;
            this.m_pointerDragging.setSptDisplay(this.m_menu.cow.node.getComponent(Sprite).spriteFrame);
            this.m_pointerDragging.initPathWorldPos(0, pointerPath, true);
            this.m_pointerDragging.moveTo();
        }
    }

    protected refreshCowFarmAddingGuide() {
        if (this.m_menu.state !== MenuState.Animal || !this.m_pointerDragging.node.active)
            return;
        const pointerPath: Vec3[] = [this.m_menu.cow.node.worldPosition];
        const animals = Manager.instance.getCowFarm().getAnimals();
        let finished = true;
        animals.forEach(animal => {
            if (!animal.hasAnimal()) {
                const animalNode = animal.spotAnimal;
                const screenPosition = Manager.instance.camera.worldToScreen(animalNode.worldPosition);
                const worldPosition = this.camera.screenToWorld(screenPosition);
                pointerPath.push(worldPosition);
                finished = false;
            }
        });
        this.m_pointerDragging.setPathWorldPos(pointerPath);
        if (finished)
            this.m_pointerDragging.node.active = false;
    }

    //==================================================

    public async showCowFarmFodderMenu() {
        this.m_menu.setState(MenuState.Feed);

        await new Promise(resolve => setTimeout(resolve, 500));

        this.showCowFarmFeedingGuide();
    }

    public showCowFarmFeedingGuide() {
        const pointerPath: Vec3[] = [this.m_menu.fodder.node.worldPosition];
        const animals = Manager.instance.getCowFarm().getAnimals();
        let finished = true;
        animals.forEach(animal => {
            if (!animal.isFeed()) {
                const screenPos = Manager.instance.camera.worldToScreen(animal.spotFodder.worldPosition);
                const worldPos = this.camera.screenToWorld(screenPos);
                pointerPath.push(worldPos);
                finished = false;
            }
        });
        if (!finished) {
            this.m_pointerDragging.node.active = true;
            this.m_pointerDragging.setSptDisplay(this.m_menu.fodder.node.getComponent(Sprite).spriteFrame);
            this.m_pointerDragging.initPathWorldPos(0, pointerPath, true);
            this.m_pointerDragging.moveTo();
        }
    }

    protected refreshCowFarmFeedingGuide() {
        if (this.m_menu.state !== MenuState.Feed || !this.m_pointerDragging.node.active)
            return;
        const pointerPath: Vec3[] = [this.m_menu.fodder.node.worldPosition];
        const animals = Manager.instance.getCowFarm().getAnimals();
        let finished = true;
        animals.forEach(animal => {
            if (!animal.isFeed()) {
                const screenPosition = Manager.instance.camera.worldToScreen(animal.spotFodder.worldPosition);
                const worldPosition = this.camera.screenToWorld(screenPosition);
                pointerPath.push(worldPosition);
                finished = false;
            }
        });
        this.m_pointerDragging.setPathWorldPos(pointerPath);
        if (finished)
            this.m_pointerDragging.node.active = false;
    }

    //==================================================

    public async showCowFarmHarvestMenu() {
        this.m_menu.setState(MenuState.Harvest);

        await new Promise(resolve => setTimeout(resolve, 500));

        this.showCowFarmHarvestingGuide();
    }

    public showCowFarmHarvestingGuide() {
        const pointerPath: Vec3[] = [this.m_menu.basket.node.worldPosition];
        const animals = Manager.instance.getCowFarm().getAnimals();
        let finished = true;
        animals.forEach(animal => {
            if (animal.hasCollectableProducts()) {
                const screenPos = Manager.instance.camera.worldToScreen(animal.spotProducts.worldPosition);
                const worldPos = this.camera.screenToWorld(screenPos);
                pointerPath.push(worldPos);
                finished = false;
            }
        });
        if (!finished) {
            this.m_pointerDragging.node.active = true;
            this.m_pointerDragging.setSptDisplay(this.m_menu.basket.node.getComponent(Sprite).spriteFrame);
            this.m_pointerDragging.initPathWorldPos(0, pointerPath, true);
            this.m_pointerDragging.moveTo();
        }
    }

    protected refreshCowFarmHarvestingGuide() {
        if (this.m_menu.state !== MenuState.Harvest || !this.m_pointerDragging.node.active)
            return;
        const pointerPath: Vec3[] = [this.m_menu.basket.node.worldPosition];
        const animals = Manager.instance.getCowFarm().getAnimals();
        let finished = true;
        animals.forEach(animal => {
            if (animal.hasCollectableProducts()) {
                const screenPosition = Manager.instance.camera.worldToScreen(animal.spotProducts.worldPosition);
                const worldPosition = this.camera.screenToWorld(screenPosition);
                pointerPath.push(worldPosition);
                finished = false;
            }
        });
        this.m_pointerDragging.setPathWorldPos(pointerPath);
        if (finished)
            this.m_pointerDragging.node.active = false;
    }

    //==================================================

    public hidePointer() {
        this.m_pointerDragging.node.active = false;
    }

    public hideMenu() {
        this.m_menu.node.active = false;
    }

    public async showFarmChickenMenu() {
        this.m_menu.node.active = true;
        this.m_menu.showFarmChickenMenu();
    }

    protected isHorizontalScreen() {
        return window.innerWidth >= window.innerHeight;
    }

    public activeButtonStore() {
        this.m_btnOpenStore.node.active = true;
    }

    protected onBtnOpenStorePressed() {
        Manager.instance.openStore();
    }

    public convertToUIPosition(worldNode: Node) {
        const screenPos = this.camera.worldToScreen(worldNode.worldPosition);
        const uiPos = this.camera.screenToWorld(screenPos);
        return uiPos;
    }
}


