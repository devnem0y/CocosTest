import { _decorator, Component, Input, input, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoseController')
export class HoseController extends Component {

    @property(ParticleSystem)
    private stream: ParticleSystem = null;

    public onLoad() {
        input.on(Input.EventType.MOUSE_DOWN, this.onStartSpray, this);
        input.on(Input.EventType.MOUSE_UP, this.onStopSpray, this);
    }

    public onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.onStartSpray, this);
        input.off(Input.EventType.MOUSE_UP, this.onStopSpray, this);
    }

    private onStartSpray() {
        this.stream.play();
    }

    private onStopSpray() {
        this.stream.stop();
    }
}
