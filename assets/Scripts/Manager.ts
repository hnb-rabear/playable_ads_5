import { _decorator, Camera, Component, Node, tween, Vec2, Vec3, Widget } from 'cc';
import { CustomerController } from './CustomerController';
import { PathFollowing } from './Core/PathFollowing';
import { IsometricZOrderUpdater } from './Core/IsometricZOrderUpdater';
import { ManagerUI } from './ManagerUI';
import { AnimalFarm } from './AnimalFarm';
import { AnimalState } from './Animal';
import { MenuState } from './CattleMenu';
import { CameraController } from './CameraController';
const { ccclass, property } = _decorator;

@ccclass('Manager')
export class Manager extends Component {

    private static m_instance: Manager = null;
    public static get instance(): Manager {
        return Manager.m_instance;
    }

    @property(Camera) public camera: Camera;
    @property(CameraController) public cameraController: CameraController;
    @property([Node]) protected m_customerNodes: Node[] = []; // This is CustomerController
    @property([Node]) protected m_stops: Node[] = [];
    @property(Node) protected m_firstStop: Node;
    @property(Node) protected m_secondStop: Node;
    @property(AnimalFarm) protected m_cowFarm: AnimalFarm;
    @property(IsometricZOrderUpdater) protected m_isometricZOrderUpdater: IsometricZOrderUpdater;

    protected m_customers: CustomerController[] = [];
    protected m_curCustomer: CustomerController;
    protected m_animalFarm: AnimalFarm;

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

    //=====================================================================

    protected async showFarmCowMenu() {
        this.cameraController.activeCam1();
        //Move car to destination 1
        const destinationIdx = this.m_stops.indexOf(this.m_firstStop);
        let reached = false;
        this.m_customers.forEach((customer, i) => {
            customer.moveTo(destinationIdx - i);
            customer.setDelay(0.5 * i);
            customer.onReached = () => {
                if (i === this.m_customers.length - 1) {
                    reached = true;
                }
            };
        });
        this.m_isometricZOrderUpdater.updateSortingOrder();
        this.m_animalFarm = this.m_cowFarm;
        this.m_curCustomer = this.m_customers[0];
        while (!reached) {
            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });
        }
        ManagerUI.instance.showCowFarmMenu();
    }

    public onDragMoveCattleMenuItem(id: string, uiWorldPos: Vec3) {

        const touchScreenPos = ManagerUI.instance.camera.worldToScreen(uiWorldPos);
        const touchWorldPos = this.camera.screenToWorld(touchScreenPos);

        const menuState = ManagerUI.instance.menu.state;
        const animals = this.m_animalFarm.getAnimals();
        for (const animal of animals) {
            let targetPosition: Vec3;
            switch (menuState) {
                case MenuState.Animal:
                    if (animal.hasAnimal())
                        continue;
                    targetPosition = animal.spotAnimal.worldPosition;
                    break;
                case MenuState.Feed:
                    if (animal.isFeed())
                        continue;
                    targetPosition = animal.spotFodder.worldPosition;
                    break;
                case MenuState.Harvest:
                    if (!animal.hasCollectableProducts())
                        continue;
                    targetPosition = animal.spotProducts.worldPosition;
                    break;
            }
            const distance = Vec3.distance(targetPosition, touchWorldPos);
            if (distance < 100) {
                switch (menuState) {
                    case MenuState.Animal:
                        animal.addAnimal();
                        break;
                    case MenuState.Feed:
                        animal.feed();
                        break;
                    case MenuState.Harvest:
                        animal.touchProduct(touchWorldPos, this.m_curCustomer.getContainer().worldPosition, () => {
                            this.m_curCustomer.addProduct();
                        });
                        break;
                }
                ManagerUI.instance.hidePointer();
            }
        }
    }

    public async onDragEndCattleMenuItem(id: string, uiWorldPos: Vec3) {
        const menuState = ManagerUI.instance.menu.state;
        if (menuState === MenuState.Animal) {
            const hasEmptySlot = this.m_animalFarm.hasEmptyAnimalSlot();
            if (hasEmptySlot) {
                ManagerUI.instance.showCowFarmAddingGuide();
                return;
            }

            // Show food menu of cow farm
            ManagerUI.instance.showCowFarmFodderMenu();
        }
        else if (menuState === MenuState.Feed) {
            const hasEmptyFodderSlot = this.m_animalFarm.hasEmptyFodderSlot();
            if (hasEmptyFodderSlot) {
                ManagerUI.instance.showCowFarmFeedingGuide();
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            // create farm products
            this.m_animalFarm.createProducts();

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show harvest menu of cow farm
            ManagerUI.instance.showCowFarmHarvestMenu();
        }
        else if (menuState === MenuState.Harvest) {
            const hasAvailableProduct = this.m_animalFarm.hasCollectableProducts();
            if (hasAvailableProduct) {
                ManagerUI.instance.showCowFarmHarvestingGuide();
                return;
            }

            ManagerUI.instance.hideMenu();

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Move to second destination
            this.moveToChickenCoop();
        }
    }

    public getCowFarm() {
        return this.m_cowFarm;
    }

    //=====================================================================

    protected async moveToChickenCoop() {
        this.cameraController.activeCam2();
        // Move car to destination 2
        const destinationIdx = this.m_stops.indexOf(this.m_secondStop);
        for (let i = 0; i < this.m_customers.length; i++) {
            const customer = this.m_customers[i];
            customer.moveTo(destinationIdx - i);
            customer.setDelay(0.5 * i);
        }
        this.m_isometricZOrderUpdater.updateSortingOrder();
    }
}