import { Entity } from './core/entity.js';
import { BoxCollider } from './impl/boxCollider.js';
import { CircleCollider } from './impl/circleCollider.js';
import { CollisionManager } from './core/collision.js';
let animateId;
const canv = document.getElementById('canvas');
canv.height = window.innerHeight;
canv.width = window.innerWidth;
const ctx = canv.getContext('2d');
const imageCache = {};
function getImage(src) {
    if (!imageCache[src]) {
        const img = new Image();
        img.src = src;
        imageCache[src] = img;
    }
    return imageCache[src];
}
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let sprites = [];
for (let i = 0; i < 1000; i++) {
    let width = 60;
    let height = 50;
    let x = getRandomInRange(0, canv.width - 100);
    let y = getRandomInRange(0, canv.height - 100);
    let entity = new Entity(x, y, width, height, 'cat.png');
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.width / 2));
    sprites.push(entity);
}
const mouse = new Entity(0, 0, 50, 50, 'mouse.png');
mouse.addCollider(new CircleCollider(mouse.width / 2, mouse.height / 2, mouse.width / 2))
mouse.colliders[0].enabled = true;
// mouse.colliders[0].visible = true;
let time = Date.now();
for (let i = 0; i < sprites.length; i++) {
    sprites[i].colliders[0].enabled = true;
    // sprites[i].colliders[0].visible = true;
}
function animate() {
    const currentTime = Date.now();
    const delta = currentTime - time;
    time = currentTime;
    ctx.clearRect(0, 0, canv.offsetWidth, canv.offsetHeight);
    mouse.update(delta);
    mouse.draw(ctx);
    for (let i = 0; i < sprites.length; i++) {
        sprites[i].update(delta);
        sprites[i].draw(ctx);
        if (sprites[i].colliders[0].enabled && mouse.colliders[0].enabled) {
            if (CollisionManager.checkCollision(sprites[i].colliders[0], mouse.colliders[0])) {
                sprites[i].dx *= 0;
                sprites[i].dy *= 0;
                mouse.dx *= 0;
                mouse.dy *= 0;
            }
        }
        for (let j = i + 1; j < sprites.length; j++) {
            if (CollisionManager.checkCollision(sprites[i].colliders[0], sprites[j].colliders[0])) {
                sprites[i].dx *= -1;
                sprites[i].dy *= -1;
                sprites[j].dx *= -1;
                sprites[j].dy *= -1;
            }
        }
    }
    animateId = window.requestAnimationFrame(animate);
}
animate()            