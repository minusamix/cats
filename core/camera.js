export class Camera {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.cameraX = 0;
        this.cameraY = 0;
        this.followTarget = null;
    }

    setFollowTarget(target) {
        this.followTarget = target;
    }

    update() {
        if (this.followTarget) {
            this.cameraX = this.followTarget.x - this.canvas.width / 2;
            this.cameraY = this.followTarget.y - this.canvas.height / 2;
        }
    }

    draw(objects) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(-this.cameraX, -this.cameraY);

        objects.forEach(object => {
            this.context.fillStyle = object.color;
            this.context.fillRect(object.x, object.y, object.width, object.height);
        });

        this.context.restore();
    }
}
