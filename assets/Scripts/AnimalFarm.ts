import { _decorator, Component, Node, sp } from 'cc';
import { Animal } from './Animal';
const { ccclass, property } = _decorator;

@ccclass('AnimalFarm')
export class AnimalFarm extends Component {
    @property([Animal]) protected m_animalsSmall: Animal[] = [];
}


