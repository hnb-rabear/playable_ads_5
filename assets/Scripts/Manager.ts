import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
import { CustomerController } from './CustomerController';
import { PathFollowing } from './Core/PathFollowing';
import { IsometricZOrderUpdater } from './Core/IsometricZOrderUpdater';
import { ManagerUI } from './ManagerUI';
const { ccclass, property } = _decorator;

@ccclass('Manager')
export class Manager extends Component {

    private static m_instance: Manager = null;
    public static get instance(): Manager {
        return Manager.m_instance;
    }

    @property([Node]) protected m_customerNodes: Node[] = []; // This is CustomerController
    @property([Node]) protected m_stops: Node[] = [];
    @property(Node) protected m_firstStop: Node;
    @property(Node) protected m_secondStop: Node;
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
            ctrl.init(i, this.m_stops, false);
            this.m_customers.push(ctrl);
        }

        this.moveToFirstStop();
    }

    protected update(deltaTime: number): void {
        for (let i = 0; i < this.m_customers.length; i++)
            this.m_customers[i].moveControl(deltaTime);
    }

    protected moveToFirstStop() {
        const destinationIdx = this.m_stops.indexOf(this.m_firstStop);
        for (let i = 0; i < this.m_customers.length; i++) {
            const index = i;
            const customer = this.m_customers[i];
            customer.moveTo(destinationIdx - i);
            customer.setDelay(0.5 * i);
            customer.onReached = () => {
                if (i === this.m_customers.length - 1) {
                    setTimeout(() => {
                        ManagerUI.instance.showFarmCowMenu();
                    }, 500);
                }
            };
            this.m_isometricZOrderUpdater.updateSortingOrder();
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

    protected endGame() {

    }
}