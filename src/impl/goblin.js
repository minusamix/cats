import { Entity } from "../core/entity.js";

export class Goblin extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas)
        this.speed = 100;
        this.dx = 0;
        this.dy = 0;
        this.attack = false;
        this.moved = true;
        this.target = null;
    }
    setTarget(target) {
        this.target = target;
    }
    update(delta) {
        if (this.attack) {
            this.dx = 0;
            this.dy = 0;
            this.sprite.frameY = this.height * 2;
        } else if (this.target) {
            const tx = this.target.x + this.target.width / 2;
            const ty = this.target.y + this.target.height / 2;
            const gx = this.x + this.width / 2;
            const gy = this.y + this.height / 2;
            const dist = Math.hypot(tx - gx, ty - gy);
            if (dist > 10) {
                const dirX = (tx - gx) / dist;
                const dirY = (ty - gy) / dist;
                this.dx = dirX * this.speed;
                this.dy = dirY * this.speed;
                this.sprite.direction = (dirX < 0) * -1;
            } else {
                this.dx = 0;
                this.dy = 0;
            }
            this.sprite.frameY = this.height;
        } else {
            this.dx = 0;
            this.dy = 0;
            this.sprite.frameY = 0;
        }
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        this.sprite.update(delta);
        this.colliders.forEach(collider => collider.update(this.x, this.y));
    }
}