import { Entity } from "../core/entity.js";
import { InputManager } from '../core/inputManager.js';

export class Player extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas);
        this.speed = 100;
        this.inputManager = new InputManager();
    }
    update(delta) {
        if (this.inputManager.isKeyPressed('KeyW')) {
            this.y -= this.speed * delta;
        }
        if (this.inputManager.isKeyPressed('KeyD')) {
            this.x += this.speed * delta;
        }
        if (this.inputManager.isKeyPressed('KeyS')) {
            this.y += this.speed * delta;
        }
        if (this.inputManager.isKeyPressed('KeyA')) {
            this.x -= this.speed * delta;
        }
        this.sprite.update(delta);
        this.colliders.forEach(collider => collider.update(this.x, this.y));
    }

}