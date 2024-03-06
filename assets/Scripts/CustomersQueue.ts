import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomersQueue')
export class CustomersQueue extends Component {
    @property([Node]) protected m_stops: Node[] = [];
}


