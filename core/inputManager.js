export class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, left: false, right: false };

        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mousedown', e => {
            if (e.button === 0) this.mouse.left = true;
            if (e.button === 2) this.mouse.right = true;
        });
        window.addEventListener('mouseup', e => {
            if (e.button === 0) this.mouse.left = false;
            if (e.button === 2) this.mouse.right = false;
        });
    }

    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}