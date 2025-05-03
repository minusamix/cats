import { Collider } from '../core/collider.js';
export class CircleCollider extends Collider {
    constructor(offsetX, offsetY, radius) {
        super(offsetX, offsetY);
        this.radius = radius;
        this.type = 'circle';
    }
    draw(ctx) {
        if (this.visible) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}