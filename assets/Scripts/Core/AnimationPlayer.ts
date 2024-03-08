import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationPlayer')
export class AnimationPlayer extends Component {
    @property(Animation) private m_animation: Animation;

    public callback: (eventValue: string) => void;

    public eventCallback(eventValue: string) {
        this.node.emit('eventCallback', eventValue);
        this.callback && this.callback(eventValue);
    }

    public play(name?: string) {
        this.m_animation.play(name);
    }
}