import { Entity } from "../core/entity.js";
import { InputManager } from '../core/inputManager.js';

export class Player extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas);
        this.dx = x;
        this.dy = y;
        this.speed = 100;
        this.inputManager = new InputManager();
    }
    update(delta) {

        if (this.inputManager.isKeyPressed('KeyW')) {
            this.dy -= this.speed * delta;
        }
        if (this.inputManager.isKeyPressed('KeyD')) {
            this.dx += this.speed * delta;
        }
        if (this.inputManager.isKeyPressed('KeyS')) {
            this.dy += this.speed * delta;
        }
        if (this.inputManager.isKeyPressed('KeyA')) {
            this.dx -= this.speed * delta;
        }
        this.sprite.update(delta);
        this.x = this.dx;
        this.y = this.dy;
        this.colliders.forEach(collider => collider.update(this.x, this.y));

    }
}