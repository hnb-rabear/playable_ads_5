import { _decorator, Camera, Component, Node, tween, Vec2, Vec3 } from 'cc';
import { CustomerController } from './CustomerController';
import { PathFollowing } from './Core/PathFollowing';
import { IsometricZOrderUpdater } from './Core/IsometricZOrderUpdater';
import { ManagerUI } from './ManagerUI';
import { AnimalFarm } from './AnimalFarm';
import { AnimalState } from './Animal';
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
            const animals = this.m_cowFarm.getAnimals();
            for (let i = 0; i < animals.length; i++) {
                const animal = animals[i];
                if (animal.hasAnimal())
                    continue;

                const pointerTarget = animal.pointerTarget;
                const distance = Vec3.distance(pointerTarget.worldPosition, worldPos);
                if (distance < 70) {
                    animal.setState(AnimalState.Small);
                    ManagerUI.instance.hidePointer();
                }
            }
        }
    }

    public async onDragEndCattleMenuItem(id: string, uiWorldPos: Vec3) {
        if (id === 'cow') {
            const hasEmptySlot = this.m_cowFarm.hasEmptySlot();
            if (hasEmptySlot) {
                ManagerUI.instance.showCowFarmAddingGuide();
                return;
            }

            // Show food menu of cow farm
            ManagerUI.instance.showCowFarmFodderMenu();
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