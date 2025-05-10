import { Entity } from "../core/entity.js";

export class Terrain extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas)
        this.dx = 0;
        this.dy = 0;
    }
}