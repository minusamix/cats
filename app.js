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
let terrains = [];
for (let i = 0; i < canv.width / 360; i++) {
    for (let j = 0; j < canv.height / 360; j++) {
        terrains.push(new Entity(i * 360, j * 360, 360, 360, './grass.png'))
    }
}
let sprites = [];
for (let i = 0; i < 500; i++) {
    let width = 80;
    let height = 70;
    let x = getRandomInRange(0, canv.width - 100);
    let y = getRandomInRange(0, canv.height - 100);
    let entity = new Entity(x, y, width, height, 'cat.png');
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 2));
    entity.addCollider(new BoxCollider(0, 0, entity.width, entity.height));
    entity.dx = 0;
    entity.dy = 0.05;
    sprites.push(entity);
}


const mouse = new Entity(0, 0, 50, 50, 'mouse.png');
mouse.addCollider(new CircleCollider(mouse.width / 2, mouse.height / 2, mouse.width / 2))
mouse.colliders[0].enabled = true;
// mouse.colliders[0].visible = true;




let time = Date.now();
for (let i = 0; i < sprites.length; i++) {
    sprites[i].colliders[0].enabled = true;
    sprites[i].colliders[0].visible = true;
}
function animate() {
    const currentTime = Date.now();
    const delta = currentTime - time;
    time = currentTime;
    ctx.clearRect(0, 0, canv.offsetWidth, canv.offsetHeight);


    for (let i = 0; i < terrains.length; i++) {
        terrains[i].draw(ctx);
    }

    mouse.update(delta);
    mouse.draw(ctx);
    for (let i = 0; i < sprites.length; i++) {
        sprites[i].update(delta);
        sprites[i].draw(ctx);
        if (sprites[i].colliders[0].enabled && mouse.colliders[0].enabled) {
            if (CollisionManager.checkCollision(sprites[i].colliders[0], mouse.colliders[0])) {
                mouse.dx *= -1;
                mouse.dy *= -1;
            }
        }
        for (let j = i + 1; j < sprites.length; j++) {
            if (CollisionManager.checkCollision(sprites[i].colliders[0], sprites[j].colliders[0])) {
                sprites[i].dy = 0;
                sprites[j].dy = 0;
            }
        }
    }
    animateId = window.requestAnimationFrame(animate);
}
animate()            