import { Entity } from "../core/entity.js";

export class Goblin extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas)
        this.speed = 20;
        this.dx = this.speed;
        this.dy = this.speed;
        this.attack = false;
        this.moved = true;
    }
    update(delta) {
        if (this.attack) {
            this.dx = 0;
            this.dy = 0;
            this.sprite.frameY = this.height * 2;
        } else {
            if (this.dx === 0) this.dx = this.speed;
            if (this.dy === 0) this.dy = this.speed;
            this.sprite.frameY = this.height;
        }
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        this.sprite.update(delta);
        this.colliders.forEach(collider => collider.update(this.x, this.y));

    }

}