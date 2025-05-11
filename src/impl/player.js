import { Entity } from "../core/entity.js";
import { InputManager } from '../core/inputManager.js';
import { AudioManager } from '../core/audioManager.js';
export class Player extends Entity {
    constructor(x, y, width, height, imageSrc, canvas) {
        super(x, y, width, height, imageSrc, canvas);
        this.speed = 100;
        this.attack = false;
        this.inputManager = new InputManager();
        this.audioManager = new AudioManager();
        this.audioManager.loadSound('run', './src/audio/run.mp3', true);
        this.isRunningSoundPlaying = false;
    }
    update(delta) {
        let moved = false;

        if (this.inputManager.isKeyPressed('KeyW')) {
            this.y -= this.speed * delta;
            moved = true;
            this.audioManager.playSound('run', 1.0, true);
        }
        if (this.inputManager.isKeyPressed('KeyD')) {
            this.x += this.speed * delta;
            this.sprite.direction = 1;
            moved = true;
        }
        if (this.inputManager.isKeyPressed('KeyS')) {
            this.y += this.speed * delta;
            moved = true;
        }
        if (this.inputManager.isKeyPressed('KeyA')) {
            this.x -= this.speed * delta;
            this.sprite.direction = -1;
            moved = true;
        }
        if (this.inputManager.isKeyPressed('Space') || this.inputManager.mouse.left) {
            this.attack = true;
            this.speed = 0;
            this.sprite.frameSpeed = 0.05;
        } else {
            this.speed = 100;
            this.attack = false;
            this.sprite.frameSpeed = 0.1;
        }

        if (moved && !this.isRunningSoundPlaying) {
            this.audioManager.playSound('run', 1.0, true);
            this.isRunningSoundPlaying = true;
        } else if (!moved && this.isRunningSoundPlaying) {
            this.audioManager.pauseSound('run');
            this.isRunningSoundPlaying = false;
        }

        this.sprite.frameY = moved ? this.height : 0;
        this.sprite.frameY = this.attack ? this.height * 2 : this.sprite.frameY;
        this.sprite.update(delta);
        this.colliders.forEach(collider => collider.update(this.x, this.y));
    }
}