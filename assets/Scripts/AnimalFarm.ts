import { _decorator, Component, Node, sp } from 'cc';
import { Animal, AnimalState } from './Animal';
const { ccclass, property } = _decorator;

@ccclass('AnimalFarm')
export class AnimalFarm extends Component {
    @property([Animal]) protected m_animals: Animal[] = [];

    protected start(): void {
        this.m_animals.forEach(animal => {
            animal.setState(AnimalState.None);
        });
    }

    public getAnimals() {
        return this.m_animals;
    }

    public hasEmptySlot() {
        for (let i = 0; i < this.m_animals.length; i++) {
            if (!this.m_animals[i].hasAnimal())
                return true;
        }
    }
}


