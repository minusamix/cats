export class Sprite {
    constructor(imageSrc, frameWidth, frameHeight, frameCount = 1, frameSpeed = 0, drawWidth = null, drawHeight = null) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.drawWidth = drawWidth || frameWidth;
        this.drawHeight = drawHeight || frameHeight;
        this.direction = 1;
        this.frameY = 0;
    }

    update(delta) {

        if (this.frameCount > 1) {
            this.frameTimer += delta;
            if (this.frameTimer > this.frameSpeed) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.frameTimer = 0;
            }
        }
    }

    draw(ctx, x, y) {
        ctx.save();

        if (this.direction === -1) {

            ctx.translate(x + this.drawWidth, 0);
            ctx.scale(-1, 1);
            x = 0;
        }

        if (this.frameCount > 1) {
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth, this.frameY, this.frameWidth, this.frameHeight,
                x, y, this.drawWidth, this.drawHeight
            );
        } else {
            ctx.drawImage(
                this.image,
                this.frameWidth * this.currentFrame, this.frameY, this.frameWidth, this.frameHeight,
                x, y, this.drawWidth, this.drawHeight
            );
        }

        ctx.restore();
    }
}