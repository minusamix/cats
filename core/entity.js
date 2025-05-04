export class Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.colliders = [];
        this.dx = 0.02;
        this.dy = 0.02;
        this.visible = true;
        this.canvas = canvas;
    }

    addCollider(collider) {
        this.colliders.push(collider);
    }

    update(delta) {
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        this.colliders.forEach(collider => collider.update(this.x, this.y));
    }

    draw(ctx) {
        if (this.x + this.width < 0 || this.x - this.width > this.canvas.width || this.y + this.height < 0 || this.y > this.canvas.height) {
            this.visible = false;
        }
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        this.colliders.forEach(collider => collider.draw(ctx));
    }
}