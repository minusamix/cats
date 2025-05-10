import { Sprite } from './sprite.js';
export class Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc;
        this.sprite = new Sprite(this.imageSrc, width, height);
        this.colliders = [];
        this.dx = 5;
        this.dy = 5;
        this.visible = true;
        this.canvas = canvas;
    }

    addCollider(collider) {
        this.colliders.push(collider);
    }

    update(delta) {
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        this.sprite.update(delta);
        this.colliders.forEach(collider => collider.update(this.x, this.y));
    }

    draw(ctx) {
        this.sprite.draw(ctx, this.x, this.y);
        this.colliders.forEach(collider => collider.draw(ctx));
    }
}