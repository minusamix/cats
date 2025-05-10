import { Entity } from "../core/entity.js";

export class Goblin extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas)
        this.dx = 20;
        this.dy = 20;
        this.attack = false;
        this.moved = true;
    }
    update(delta) {
        if (this.attack) {
            this.dx = 0;
            this.dy = 0;
            this.sprite.frameY = this.height * 2;
        } else {
            this.dx = 20;
            this.dy = 20;
            this.sprite.frameY = this.height;
        }
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        this.sprite.update(delta);
        this.colliders.forEach(collider => collider.update(this.x, this.y));
        this.attack = false;
    }

}