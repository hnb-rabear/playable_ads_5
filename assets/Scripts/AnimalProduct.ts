import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('AnimalProduct')
export class AnimalProduct extends Component {
    @property(Node) protected m_display: Node = null;
    public setDisplay(active: boolean) {
        this.m_display.active = active;
    }
    public isDisplayed() {
        return this.m_display.active;
    }
}


