import { Entity } from './core/entity.js';
import { BoxCollider } from './impl/boxCollider.js';
import { CircleCollider } from './impl/circleCollider.js';
import { CollisionManager } from './core/collisionManager.js';
import { Camera } from './core/camera.js';
import { Sprite } from './core/sprite.js';
import { Player } from './impl/player.js';

let animateId = 0;
const canv = document.getElementById('canvas');
const worldWidth = window.innerWidth * 5;
const worldHeight = window.innerHeight * 5;

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

const mouse = new Player(worldWidth / 2, worldHeight / 2, 100, 80, './cat.png', canv);
mouse.addCollider(new BoxCollider(0, 0, mouse.width, mouse.height));
mouse.colliders[0].enabled = true
// mouse.colliders[0].visible = true;

let terrains = [];
let trees = [];
let sprites = [];

for (let i = 0; i < worldWidth / 360; i++) {
    for (let j = 0; j < worldHeight / 360; j++) {
        terrains.push(new Entity(i * 360, j * 360, 360, 360, './grass.png', canv));
    }
}
for (let i = 0; i < worldWidth / 360; i++) {
    let x = getRandomInRange(0, worldWidth - 360);
    let y = getRandomInRange(0, worldHeight - 360);
    const tree = new Entity(x, y, 360, 360, './tree.png', canv);
    tree.dx = 0;
    tree.dy = 0;
    tree.addCollider(new BoxCollider(0 + tree.width * 0.4, 0 + tree.height * 0.5, tree.width * 0.2, tree.height * 0.5));
    tree.colliders[0].enabled = true;
    trees.push(tree);
}

for (let i = 0; i < 1000; i++) {
    addEnemy();
}

function addEnemy() {
    let width = 40;
    let height = 50;
    let x = getRandomInRange(0, worldWidth - 100);
    let y = getRandomInRange(0, worldHeight - 100);
    let entity = new Entity(x, y, width, height, './mouse.png', canv);
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 2));
    entity.addCollider(new BoxCollider(0, 0, entity.width, entity.height));
    entity.colliders[0].enabled = true;
    entity.dx = 10;
    entity.dy = 10;
    sprites.push(entity);
}

const camera = new Camera(mouse, canv, worldWidth, worldHeight);

let time = Date.now();

setInterval(addEnemy, 5000);

function animate() {
    let currentTime = Date.now();
    let delta = currentTime - time;
    delta = delta / 1000;
    time = currentTime;
    ctx.clearRect(0, 0, canv.offsetWidth, canv.offsetHeight);
    camera.update();
    camera.apply(ctx);

    for (let i = 0; i < terrains.length; i++) {
        if (camera.isInView(terrains[i])) terrains[i].draw(ctx);
    }

    for (let i = 0; i < sprites.length; i++) {
        if (camera.isInView(sprites[i])) {
            sprites[i].update(delta);
            sprites[i].draw(ctx);
            if (CollisionManager.checkCollision(mouse.colliders[0], sprites[i].colliders[0])) sprites.splice([i], 1);
            if (sprites[i].x > worldWidth - sprites[i].width || sprites[i].x < 0 || sprites[i].y > worldHeight - sprites[i].height || sprites[i].y < 0) sprites[i].dx *= -1;
            if (sprites[i].y > worldHeight - sprites[i].height || sprites[i].y < 0) sprites[i].dy *= -1;
            for (let j = i + 1; j < sprites.length; j++) {
                if (CollisionManager.checkCollision(sprites[i].colliders[0], sprites[j].colliders[0])) {
                    sprites[i].dx *= -1;
                    sprites[j].dx *= -1;
                    sprites[i].dy *= -1;
                    sprites[j].dy *= -1;
                }
            }
            for (let j = 0; j < trees.length; j++) {
                if (CollisionManager.checkCollision(sprites[i].colliders[0], trees[j].colliders[0])) {
                    sprites[i].dx *= -1;
                    sprites[i].dy *= -1;
                }
            }

        }
    }

    if (mouse.x > worldWidth - mouse.width) mouse.dx = worldWidth - mouse.width;
    if (mouse.x < 0) mouse.dx = 0;
    if (mouse.y < 0) mouse.dy = 0;
    if (mouse.y > worldHeight - mouse.height) mouse.dy = worldHeight - mouse.height;

    mouse.update(delta);
    mouse.draw(ctx);
    for (let i = 0; i < trees.length; i++) {
        if (camera.isInView(trees[i])) {
            trees[i].update(delta);
            trees[i].draw(ctx);
        }
    }
    // camera.reset(ctx);
    animateId = window.requestAnimationFrame(animate);
}
animate()            
