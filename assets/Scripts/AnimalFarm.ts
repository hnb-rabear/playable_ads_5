import { _decorator, CCString, Component, Node, sp } from 'cc';
import { Animal, AnimalState } from './Animal';
const { ccclass, property } = _decorator;

@ccclass('AnimalFarm')
export class AnimalFarm extends Component {
    @property(CCString) public id: string = "";
    @property([Animal]) protected m_animals: Animal[] = [];

    protected start(): void {
        this.m_animals.forEach(animal => {
            animal.setState(AnimalState.None);
        });
    }

    public getAnimals() {
        return this.m_animals;
    }

    public hasEmptyAnimalSlot() {
        for (let i = 0; i < this.m_animals.length; i++) {
            if (!this.m_animals[i].hasCorrectAnimal())
                return true;
        }
    }

    public async disposeAnimals() {
        await Promise.all(this.m_animals.map(animal => animal.dispose()));
    }

    public hasDisposableAnimal() {
        for (let i = 0; i < this.m_animals.length; i++) {
            if (this.m_animals[i].hasAnimal() && !this.m_animals[i].valid)
                return true;
        }
        return false;
    }

    public hasEmptyFodderSlot() {
        for (let i = 0; i < this.m_animals.length; i++) {
            if (!this.m_animals[i].isFeed())
                return true;
        }
    }

    public hasCollectableProducts() {
        for (let i = 0; i < this.m_animals.length; i++) {
            if (this.m_animals[i].hasCollectableProducts())
                return true;
        }
    }

    public createProducts() {
        this.m_animals.forEach(animal => {
            animal.createProducts();
        });
    }
}


