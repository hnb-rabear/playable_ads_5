import { _decorator, Camera, Color, Component, instantiate, Node, Prefab, Sprite, tween, Vec2, Vec3, Widget, Animation, math } from 'cc';
import { CustomerController } from './CustomerController';
import { IsometricZOrderUpdater } from './Core/IsometricZOrderUpdater';
import { ManagerUI } from './ManagerUI';
import { AnimalFarm } from './AnimalFarm';
import { MenuState } from './CattleMenu';
import { CameraController } from './CameraController';
import { AnimationPlayer } from './Core/AnimationPlayer';
import super_html_playable from './super_html_playable';
import { PathFollowing } from './Core/PathFollowing';
import { makeSmoothCurve } from './Core/RUtil';
const { ccclass, property } = _decorator;

@ccclass('Manager')
export class Manager extends Component {

    private static m_instance: Manager = null;
    public static get instance(): Manager {
        return Manager.m_instance;
    }

    public static readonly urlPlayStore = "https://play.google.com/store/apps/details?id=com.citybay.farming.citybuilding";
    public static readonly urlAppStore = "https://apps.apple.com/us/app/farming-diary/id6459451380";

    @property(Camera) public camera: Camera;
    @property(CameraController) public cameraController: CameraController;
    @property([Node]) protected m_customerNodes: Node[] = []; // This is CustomerController
    @property([Node]) protected m_stops: Node[] = [];
    @property(Node) protected m_firstStop: Node;
    @property(Node) protected m_secondStop: Node;
    @property(Node) protected m_thirdStop: Node;
    @property(AnimalFarm) protected m_cowFarm: AnimalFarm;
    @property(IsometricZOrderUpdater) protected m_isometricZOrderUpdater: IsometricZOrderUpdater;
    // Phase 2: Chicken farm
    @property(Prefab) protected m_vfxCoinPrefab: Prefab;
    @property(Node) protected m_chickenFarmCoinMoveTo: Node;
    @property(Animation) protected m_chickenFarm: Animation;

    protected m_customers: CustomerController[] = [];
    protected m_curCustomer: CustomerController;
    protected m_animalFarm: AnimalFarm;

    protected onLoad(): void {
        Manager.m_instance = this;

        this.m_stops.forEach(stop => {
            stop.active = false;
        });

        this.getComponent(Widget).enabled = true;

        super_html_playable.set_google_play_url(Manager.urlPlayStore);
        super_html_playable.set_app_store_url(Manager.urlAppStore);
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

    public openStore() {
        super_html_playable.download();
        super_html_playable.game_end();
    }

    //=====================================================================

    protected async showFarmCowMenu() {
        this.cameraController.activeCam1();
        //Move car to destination 1
        await this.moveToStopNode(this.m_firstStop);
        this.m_animalFarm = this.m_cowFarm;
        this.m_curCustomer = this.m_customers[0];
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
                    if (animal.hasAnimal() || this.m_animalFarm.id !== id)
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
            this.moveToChickenFarm();
        }
    }

    public getCowFarm() {
        return this.m_cowFarm;
    }

    //=====================================================================

    protected async moveToChickenFarm() {
        this.cameraController.activeCam2();
        // Move car to destination 2
        await this.moveToStopNode(this.m_secondStop);

        // Spawn coins and throw it to the old chicken farm
        const fromPos = this.m_curCustomer.getContainer().worldPosition.clone();
        const toPos = this.m_chickenFarmCoinMoveTo.worldPosition.clone();
        this.createCoinsVFX(fromPos, toPos, 26, 600, null);
        this.createCoinsVFX(fromPos, toPos, 28, 500, null);
        await this.createCoinsVFX(fromPos, toPos, 30, 400, () => {
            this.m_chickenFarm.play("chicken_farm_bubble");
        });

        // Upgrade chicken
        this.m_chickenFarm.play("chicken_farm_upgrade");

        await new Promise(resolve => setTimeout(resolve, 500));

        // Display chicken menu
        ManagerUI.instance.showFarmChickenMenu();

        await new Promise(resolve => setTimeout(resolve, 200));

        // Show focusing pointer
        ManagerUI.instance.pointerFocusing.node.active = true;
        ManagerUI.instance.pointerFocusing.setTarget(ManagerUI.instance.menu.chicken.node);

        // Move car to destination 3
        await this.moveToStopNode(this.m_thirdStop);

        // End game
        ManagerUI.instance.activeButtonStore();
    }

    protected async createCoinsOnFarmChicken() {
        const coins: Node[] = [];
        for (let i = 0; i < 30; i++) {
            let newNode = coins.find(node => !node.active);
            const fromPos = this.m_curCustomer.getContainer().worldPosition.clone();
            if (!newNode) {
                newNode = instantiate(this.m_vfxCoinPrefab);
                coins.push(newNode);
            }
            newNode.active = true;
            newNode.setParent(this.node);
            newNode.setWorldPosition(fromPos);
            tween(newNode)
                .to(0.2, { worldPosition: this.m_chickenFarmCoinMoveTo.worldPosition })
                .call(() => {
                    newNode.active = false;
                    this.m_chickenFarm.play("chicken_farm_bubble");
                })
                .start();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    protected async createCoinsVFX(fromPos: Vec3, toPos: Vec3, totalCoins: number, curveFactor: number, onCoinReached: () => void) {
        const coins: PathFollowing[] = [];
        let reached = false;
        for (let i = 0; i < totalCoins; i++) {
            const index = i;
            let item = coins.find(item => !item.node.active);
            if (!item) {
                const newNode = instantiate(this.m_vfxCoinPrefab);
                item = newNode.getComponent(PathFollowing);
                coins.push(item);
            }
            item.node.active = true;
            item.node.setParent(this.node);
            item.node.setWorldPosition(fromPos);
            let path = [
                fromPos,
                new Vec3(math.lerp(fromPos.x, toPos.x, 0.25) - curveFactor, toPos.y + curveFactor, toPos.z),
                new Vec3(math.lerp(fromPos.x, toPos.x, 0.5), toPos.y + curveFactor * 2, toPos.z),
                new Vec3(math.lerp(fromPos.x, toPos.x, 0.75) + curveFactor, toPos.y + curveFactor, toPos.z),
                toPos
            ];
            path = makeSmoothCurve(path, 5);
            item.initPathWorldPos(0, path, true);
            item.setMoveSpeed(1200);
            item.moveTo();
            item.onReached = () => {
                item.node.active = false;
                onCoinReached && onCoinReached();
                if (index == totalCoins - 1) {
                    reached = true;
                }
            };
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        while (!reached) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }


    protected async moveToStopNode(stopNode: Node) {
        // Move car to destination 2
        const destinationIdx = this.m_stops.indexOf(stopNode);
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

        while (!reached) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}