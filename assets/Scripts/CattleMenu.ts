import { _decorator, CCBoolean, Component, Layout, Node, tween, UITransform, Vec3, Widget } from 'cc';
import { CattleMenuItem } from './CattleMenuItem';
import { MenuBar } from './MenuBar';
const { ccclass, property, executeInEditMode } = _decorator;

export enum MenuState {
    None,
    Animal,
    Feed,
    Harvest
}

@ccclass('CattleMenu')
export class CattleMenu extends MenuBar {
    @property(CattleMenuItem) public pig: CattleMenuItem = null;
    @property(CattleMenuItem) public cow: CattleMenuItem = null;
    @property(CattleMenuItem) public chicken: CattleMenuItem = null;
    @property(CattleMenuItem) public sheep: CattleMenuItem = null;
    @property(CattleMenuItem) public fodder: CattleMenuItem = null;
    @property(CattleMenuItem) public basket: CattleMenuItem = null;

    protected m_animalId: string = null;
    protected m_state: MenuState = MenuState.None;
    public get state() {
        return this.m_state;
    }

    protected onEnable(): void {
        this.node.setScale(0, 0, 0);
        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' })
            .start();
    }

    public showCowFarmMenu() {
        this.m_animalId = "cow";
        this.setState(MenuState.Animal);
    }

    public showFarmChickenMenu() {
        this.m_animalId = "chicken";
        this.setState(MenuState.Animal);
    }

    public setState(state: MenuState) {
        this.m_state = state;
        this.pig.node.active = state == MenuState.Animal && (this.m_animalId == "cow" || this.m_animalId == "chicken");
        this.cow.node.active = state == MenuState.Animal && (this.m_animalId == "cow" || this.m_animalId == "chicken");
        this.chicken.node.active = state == MenuState.Animal && this.m_animalId == "chicken";
        this.sheep.node.active = state == MenuState.Animal && this.m_animalId == "chicken";
        this.fodder.node.active = state == MenuState.Feed;
        this.basket.node.active = state == MenuState.Harvest;
    }
}


