import { Entity } from './core/entity.js';
import { BoxCollider } from './impl/boxCollider.js';
import { CircleCollider } from './impl/circleCollider.js';
import { CollisionManager } from './core/collisionManager.js';
import { Camera } from './core/camera.js';
import { Sprite } from './core/sprite.js';
import { Player } from './impl/player.js';

let animateId = 0;
const canv = document.getElementById('canvas');
const worldWidth = window.innerWidth * 3;
const worldHeight = window.innerHeight * 3;

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

const mouse = new Player(worldWidth / 2, worldHeight / 2, 30, 40, './mouse.png', canv);
mouse.addCollider(new BoxCollider(0, 0, mouse.width, mouse.height));
mouse.colliders[0].enabled = true;
// mouse.colliders[0].visible = true;

let terrains = [];
let trees = [];
let sprites = [];

for (let i = 0; i < worldWidth / 250; i++) {
    for (let j = 0; j < worldHeight / 250; j++) {
        terrains.push(new Entity(i * 250, j * 250, 250, 250, './grass.png', canv));
    }
}
for (let i = 0; i < 300; i++) {
    let img = './tree.png';
    let width = 192;
    let height = 192;
    let x = getRandomInRange(0, worldWidth - width);
    let y = getRandomInRange(0, worldHeight - height);
    const tree = new Entity(x, y, width, height, img, canv);
    tree.sprite = new Sprite(img, width, height, 4, 0.15, width, height);
    tree.dx = 0;
    tree.dy = 0;
    tree.addCollider(new BoxCollider(0 + tree.width * 0.4, 0 + tree.height * 0.5, tree.width * 0.2, tree.height * 0.4));
    tree.colliders[0].enabled = true;
    // tree.colliders[0].visible = true;
    trees.push(tree);
}

for (let i = 0; i < 200; i++) {
    addEnemy();
}

function addEnemy() {
    let width = 64;
    let height = 64;
    let imageSrc = './monster.png';
    let x = getRandomInRange(0, worldWidth - 100);
    let y = getRandomInRange(0, worldHeight - 100);
    let entity = new Entity(x, y, width, height, imageSrc, canv);
    entity.sprite = new Sprite(imageSrc, width, height, 6, 0.1, width, height);
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 2));
    entity.addCollider(new BoxCollider(0, 0, entity.width, entity.height));
    entity.colliders[0].enabled = true;
    // entity.colliders[0].visible = true;
    entity.dx = 20;
    entity.dy = 20;
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
            if (sprites[i].x + sprites[i].width > worldWidth || sprites[i].x < 0 || sprites[i].y + sprites[i].height > worldHeight || sprites[i].y < 0) sprites[i].dx *= -1;
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
                }
            }


        }
    }

    mouse.update(delta);
    mouse.draw(ctx);
    if (mouse.x > worldWidth - mouse.width) mouse.dx = worldWidth - mouse.width;
    if (mouse.x < 0) mouse.x = 0;
    if (mouse.y < 0) mouse.y = 0;
    if (mouse.x + mouse.width > worldWidth) mouse.x = worldWidth - mouse.width;
    if (mouse.y + mouse.height > worldHeight) mouse.y = worldHeight - mouse.height;
    if (mouse.y > worldHeight - mouse.height) mouse.dy = worldHeight - mouse.height;


    for (let i = 0; i < trees.length; i++) {
        if (camera.isInView(trees[i])) {
            trees[i].update(delta);
            trees[i].draw(ctx);

            if (CollisionManager.checkCollision(mouse.colliders[0], trees[i].colliders[0])) {
                // mouse.draw(ctx);
                const mouseCollider = mouse.colliders[0];
                const treeCollider = trees[i].colliders[0];

                const overlapX = Math.min(
                    mouseCollider.x + mouseCollider.width - treeCollider.x,
                    treeCollider.x + treeCollider.width - mouseCollider.x
                );

                const overlapY = Math.min(
                    mouseCollider.y + mouseCollider.height - treeCollider.y,
                    treeCollider.y + treeCollider.height - mouseCollider.y
                );

                if (overlapX < overlapY) {
                    if (mouseCollider.x < treeCollider.x) {
                        mouse.x = treeCollider.x - mouseCollider.width - mouseCollider.offsetX;
                    } else {
                        mouse.x = treeCollider.x + treeCollider.width - mouseCollider.offsetX;
                    }
                } else {
                    if (mouseCollider.y < treeCollider.y) {
                        mouse.y = treeCollider.y - mouseCollider.height - mouseCollider.offsetY;
                    } else {
                        mouse.y = treeCollider.y + treeCollider.height - mouseCollider.offsetY;
                    }
                }


                // const dx = mouse.colliders[0].x - trees[i].colliders[0].x;
                // const dy = mouse.colliders[0].y - trees[i].colliders[0].y;

                // let horizontalRadius = trees[i].colliders[0].width;
                // const verticalRadius = trees[i].colliders[0].height;

                // if (dx > 0) {
                //     horizontalRadius *= 1;
                // }

                // const normalizedDistance = Math.pow(dx / horizontalRadius, 2) + Math.pow(dy / verticalRadius, 2);

                // if (normalizedDistance < 1) {
                //     const angle = Math.atan2(dy / verticalRadius, dx / horizontalRadius);
                //     const pushX = horizontalRadius * Math.cos(angle);
                //     const pushY = verticalRadius * Math.sin(angle);

                //     mouse.x = trees[i].colliders[0].x + pushX;
                //     mouse.y = trees[i].colliders[0].y + pushY;
                // }



                // const mouseCollider = mouse.colliders[0];
                // const treeCollider = trees[i].colliders[0];

                // const dx = (mouseCollider.x + mouseCollider.width / 2) - (treeCollider.x + treeCollider.width / 2);
                // const dy = (mouseCollider.y + mouseCollider.height / 2) - (treeCollider.y + treeCollider.height / 2);

                // const absDx = Math.abs(dx);
                // const absDy = Math.abs(dy);

                // if (absDx > absDy) {
                //     if (dx > 0) {
                //         mouse.x = treeCollider.x + treeCollider.width - mouseCollider.offsetX;
                //     } else {
                //         mouse.x = treeCollider.x - mouseCollider.width - mouseCollider.offsetX;
                //     }
                // } else {
                //     if (dy > 0) {
                //         mouse.y = treeCollider.y + treeCollider.height - mouseCollider.offsetY;
                //     } else {
                //         mouse.y = treeCollider.y - mouseCollider.height - mouseCollider.offsetY;
                //     }
                // }
            }
        }
    }
    // camera.reset(ctx);
    animateId = window.requestAnimationFrame(animate);
}
animate();
