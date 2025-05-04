import { Entity } from './core/entity.js';
import { BoxCollider } from './impl/boxCollider.js';
import { CircleCollider } from './impl/circleCollider.js';
import { CollisionManager } from './core/collisionManager.js';


let animateId = 0;
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

for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        terrains.push(new Entity(i * 360, j * 360, 360, 360, './grass.png', canv))
    }
}

let sprites = [];

for (let i = 0; i < 700; i++) {

    let width = 80;
    let height = 70;
    let x = getRandomInRange(0, canv.width - 100);
    let y = getRandomInRange(0, canv.height - 100);

    let entity = new Entity(x, y, width, height, 'cat.png', canv);
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 2));
    entity.addCollider(new BoxCollider(0, 0, entity.width, entity.height));

    sprites.push(entity);
}
let time = Date.now();
for (let i = 0; i < sprites.length; i++) {
    sprites[i].colliders[0].enabled = true;
    // sprites[i].colliders[0].visible = true;
}
console.log(sprites.length);
function animate() {

    const currentTime = Date.now();
    const delta = currentTime - time;
    time = currentTime;

    ctx.clearRect(0, 0, canv.offsetWidth, canv.offsetHeight);

    for (let i = 0; i < terrains.length; i++) {
        if (terrains[i].visible) {
            terrains[i].draw(ctx);
        }
    }

    for (let i = 0; i < sprites.length; i++) {
        if (sprites[i].visible) {
            sprites[i].update(delta);
            sprites[i].draw(ctx);
            for (let j = i + 1; j < sprites.length; j++) {
                if (CollisionManager.checkCollision(sprites[i].colliders[0], sprites[j].colliders[0])) {
                    sprites[i].dx *= -1;
                    sprites[j].dx *= -1;
                    sprites[i].dy *= -1;
                    sprites[j].dy *= -1;
                }
            }
        }

    }
    animateId = window.requestAnimationFrame(animate);
}
animate()            
