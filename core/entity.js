export class Entity {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.colliders = [];
        this.dx = 0.02;
        this.dy = 0.02;
        this.canv = document.querySelector('#canvas');
    }

    addCollider(collider) {
        this.colliders.push(collider);
    }

    update(delta) {
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        if (this.x < 0) {
            this.x = 0;
            this.dx = -this.dx;
        } else if (this.x + this.width > this.canv.width) {
            this.x = this.canv.width - this.width;
            this.dx = -this.dx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dy = -this.dy;
        } else if (this.y + this.height > this.canv.height) {
            this.y = this.canv.height - this.height;
            this.dy = -this.dy;
        }
        this.colliders.forEach(collider => collider.update(this.x, this.y));
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        this.colliders.forEach(collider => collider.draw(ctx));
    }
}