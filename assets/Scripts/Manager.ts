import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Manager')
export class Manager extends Component {

    public static instance: Manager;

    protected onLoad(): void {
        Manager.instance = this;
    }
}


