import { _decorator, Camera, Component, Node, tween, Vec2, Vec3, Widget } from 'cc';
import { CustomerController } from './CustomerController';
import { PathFollowing } from './Core/PathFollowing';
import { IsometricZOrderUpdater } from './Core/IsometricZOrderUpdater';
import { ManagerUI } from './ManagerUI';
import { AnimalFarm } from './AnimalFarm';
import { AnimalState } from './Animal';
import { MenuState } from './CattleMenu';
const { ccclass, property } = _decorator;

@ccclass('Manager')
export class Manager extends Component {

    private static m_instance: Manager = null;
    public static get instance(): Manager {
        return Manager.m_instance;
    }

    @property(Camera) public camera: Camera;
    @property([Node]) protected m_customerNodes: Node[] = []; // This is CustomerController
    @property([Node]) protected m_stops: Node[] = [];
    @property(Node) protected m_firstStop: Node;
    @property(Node) protected m_secondStop: Node;
    @property(AnimalFarm) protected m_cowFarm: AnimalFarm;
    @property(IsometricZOrderUpdater) protected m_isometricZOrderUpdater: IsometricZOrderUpdater;

    private m_customers: CustomerController[] = [];

    protected onLoad(): void {
        Manager.m_instance = this;

        this.m_stops.forEach(stop => {
            stop.active = false;
        });

        this.getComponent(Widget).enabled = true;
    }

    protected start(): void {
        for (let i = 0; i < this.m_customerNodes.length; i++) {
            const ctrl = this.m_customerNodes[i].getComponent(CustomerController);
            ctrl.initPathNode(i, this.m_stops, false);
            this.m_customers.push(ctrl);
        }

        this.showFarmCowMenu();
    }

    protected update(deltaTime: number): void {
        for (let i = 0; i < this.m_customers.length; i++)
            this.m_customers[i].moveControl(deltaTime);
    }

    protected async showFarmCowMenu() {
        //Move car to destination 1
        const destinationIdx = this.m_stops.indexOf(this.m_firstStop);
        let reached = false;
        for (let i = 0; i < this.m_customers.length; i++) {
            const index = i;
            const customer = this.m_customers[i];
            customer.moveTo(destinationIdx - i);
            customer.setDelay(0.5 * i);
            customer.onReached = () => {
                if (i === this.m_customers.length - 1) {
                    reached = true;
                    ManagerUI.instance.showCowFarmMenu();
                }
            };
        }
        this.m_isometricZOrderUpdater.updateSortingOrder();
    }

    public onDragMoveCattleMenuItem(id: string, uiWorldPos: Vec3) {

        const screenPos = ManagerUI.instance.camera.worldToScreen(uiWorldPos);
        const worldPos = this.camera.screenToWorld(screenPos);

        if (id === 'cow') {
            const menuState = ManagerUI.instance.menu.state;
            const animals = this.m_cowFarm.getAnimals();
            for (const animal of animals) {
                let targetPosition: Vec3;
                switch (menuState) {
                    case MenuState.Animal:
                        targetPosition = animal.spotAnimal.worldPosition;
                        break;
                    case MenuState.Feed:
                        targetPosition = animal.spotFodder.worldPosition;
                        break;
                    case MenuState.Harvest:
                        targetPosition = animal.spotProducts.worldPosition;
                        break;
                }
                const distance = Vec3.distance(targetPosition, worldPos);
                if (distance < 100) {
                    switch (menuState) {
                        case MenuState.Animal:
                            animal.addAnimal();
                            break;
                        case MenuState.Feed:
                            animal.feed();
                            break;
                        case MenuState.Harvest:
                            animal.collectProducts();
                            break;
                    }
                    ManagerUI.instance.hidePointer();
                }
            }
        }
    }

    public async onDragEndCattleMenuItem(id: string, uiWorldPos: Vec3) {
        if (id === 'cow') {
            const menuState = ManagerUI.instance.menu.state;
            if (menuState === MenuState.Animal) {
                const hasEmptySlot = this.m_cowFarm.hasEmptyAnimalSlot();
                if (hasEmptySlot) {
                    ManagerUI.instance.showCowFarmAddingGuide();
                    return;
                }

                // Show food menu of cow farm
                ManagerUI.instance.showCowFarmFodderMenu();
            }
            else if (menuState === MenuState.Feed) {
                const hasEmptyFodderSlot = this.m_cowFarm.hasEmptyFodderSlot();
                if (hasEmptyFodderSlot) {
                    ManagerUI.instance.showCowFarmFeedingGuide();
                }

                // Show harvest menu of cow farm
                ManagerUI.instance.showCowFarmHarvestMenu();
            }
            else if (menuState === MenuState.Harvest) {
                const hasAvailableProduct = this.m_cowFarm.hasProducts();
                if (hasAvailableProduct) {
                    ManagerUI.instance.showCowFarmHarvestingGuide();
                }
            }
        }
    }

    protected moveToSecondStop() {
        const destinationIdx = this.m_stops.indexOf(this.m_secondStop);
        for (let i = 0; i < this.m_customers.length; i++) {
            const customer = this.m_customers[i];
            customer.moveTo(destinationIdx - i);
            customer.setDelay(0.5 * i);
            this.m_isometricZOrderUpdater.updateSortingOrder();
        }
    }

    public getCowFarm() {
        return this.m_cowFarm;
    }
}