import { _decorator, CCBoolean, Component, math, Node, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoResizeUI')
export class AutoResizeUI extends Component {
    @property(CCBoolean) public useScale: boolean = false;
    @property(Vec2) public standardRatio: Vec2 = new Vec2(1080, 1920);

    private m_standardSize: math.Size = new math.Size();
    private m_preferWidthRatio: number = 0;

    protected start(): void {
        this.m_standardSize.set(this.node.getComponent(UITransform).contentSize);
        // Fix the issue when screen is rotate from portrait to landscape
        if (this.standardRatio.y > this.standardRatio.x) {
            this.m_preferWidthRatio = this.standardRatio.x / this.standardRatio.y;
        }
        window.addEventListener('resize', () => {
            this.resize();
        });
        this.resize();
    }

    protected resize() {
        const curRatio = Math.round(window.innerWidth / window.innerHeight * 100) / 100;
        let standardRatio = Math.round(this.standardRatio.x / this.standardRatio.y * 100) / 100;
        let ratio = Math.round(standardRatio / curRatio * 100) / 100;

        if (this.m_preferWidthRatio > 0 && curRatio > 1) {
            const widthRatio = ratio * this.m_standardSize.x / window.innerWidth;
            if (widthRatio < this.m_preferWidthRatio) {
                ratio = this.m_preferWidthRatio;
            }
        }

        if (this.useScale)
            this.node.setScale(new Vec3(ratio, ratio, ratio));
        else {
            let newWith = Math.round(this.m_standardSize.x * ratio * 100) / 100;
            let newHeight = Math.round(this.m_standardSize.y * ratio * 100) / 100;
            this.node.getComponent(UITransform).contentSize.set(newWith, newHeight);
        }
    }
}


