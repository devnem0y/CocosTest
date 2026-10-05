import { _decorator, Component, Input, input, EventKeyboard, EventMouse, KeyCode, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(RigidBody)
    private rb: RigidBody = null;

    @property
    private speed = 5;

    @property
    private turnSensitivity = 0.25;

    private yaw = 0;
    private forward = false;
    private back = false;
    private left = false;
    private right = false;
    private isLocked = false;

    private readonly worldDir = new Vec3();
    private readonly newVel = new Vec3();

    public onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    public onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    public update(dt: number) {
        if (!this.rb) return;

        const moveF = (this.forward ? 1 : 0) - (this.back ? 1 : 0);
        const moveS = (this.right ? 1 : 0) - (this.left ? 1 : 0);

        if (moveF === 0 && moveS === 0) return;

        const fwd = this.node.forward;
        const right = this.node.right;

        this.worldDir.set(
            fwd.x * moveF + right.x * moveS,
            0,
            fwd.z * moveF + right.z * moveS
        );

        if (this.worldDir.lengthSqr() > 0) {
            this.worldDir.normalize().multiplyScalar(this.speed);
        }

        const currentVel = this.rb.linearVelocity;
        const velY = currentVel ? currentVel.y : 0;

        this.newVel.set(this.worldDir.x, velY, this.worldDir.z);
        this.rb.setLinearVelocity(this.newVel);
    }

    private onMouseDown() {
        if (!this.isLocked) {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.requestPointerLock();
                this.isLocked = true;
            }
        }
    }

    private onMouseLeave() {
        this.isLocked = false;
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W: this.forward = true; break;
            case KeyCode.KEY_S: this.back = true; break;
            case KeyCode.KEY_A: this.left = true; break;
            case KeyCode.KEY_D: this.right = true; break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W: this.forward = false; break;
            case KeyCode.KEY_S: this.back = false; break;
            case KeyCode.KEY_A: this.left = false; break;
            case KeyCode.KEY_D: this.right = false; break;
        }
    }

    private onMouseMove(event: EventMouse) {
        const deltaX = event.getDeltaX();

        if (deltaX !== 0) {
            this.yaw -= deltaX * this.turnSensitivity;
            this.node.setRotationFromEuler(0, this.yaw, 0);
        }
    }
}
