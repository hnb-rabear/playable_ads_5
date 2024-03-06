import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ManagerUI')
export class ManagerUI extends Component {
    private static m_instance: ManagerUI;
    public static get instance() {
        return ManagerUI.m_instance;
    }

    protected onLoad(): void {
        ManagerUI.m_instance = this;
    }
}


