export class Collider {
    constructor(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.enabled = false;
        this.visible = false;
        this.color = 'red';
        this.x = 0;
        this.y = 0;
    }
    update(entityX, entityY) {
        this.x = entityX + this.offsetX;
        this.y = entityY + this.offsetY;
    }
    draw(ctx) {
    }
}