export class Camera {
    constructor(target, canvas, worldWidth, worldHeight) {
        this.target = target;
        this.canvas = canvas;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.x = 0;
        this.y = 0;
    }
    changeTarget(target) {
        this.target = target;
    }
    update() {
        this.x = this.target.x + this.target.width / 2 - this.canvas.width / 2;
        this.y = this.target.y + this.target.height / 2 - this.canvas.height / 2;

        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.canvas.width));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.canvas.height));
    }

    apply(ctx) {
        ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
    }

    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    isInView(entity) {
        return !(
            entity.x + entity.width < this.x ||
            entity.x > this.x + this.canvas.width ||
            entity.y + entity.height < this.y ||
            entity.y > this.y + this.canvas.height
        );
    }
}