import { Collider } from '../core/collider.js';
export class BoxCollider extends Collider {
    constructor(offsetX, offsetY, width, height) {
        super(offsetX, offsetY);
        this.width = width;
        this.height = height;
        this.type = 'box';
    }
    draw(ctx) {
        if (this.visible) {
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}