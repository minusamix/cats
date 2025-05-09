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

const player = new Player(worldWidth / 2, worldHeight / 2, 192, 192, './src/img/Warrior_Blue.png', canv);
player.sprite = new Sprite('./src/img/Warrior_Blue.png', player.width, player.height, 6, 0.1, player.width * 0.75, player.height * 0.75);
player.addCollider(new BoxCollider(0 + player.width * 0.25, 0 + player.height * 0.25, player.width * 0.25, player.height * 0.25));
player.colliders[0].enabled = true;
// player.colliders[0].visible = true;

let terrains = [];
let trees = [];
let sprites = [];

for (let i = 0; i < worldWidth / 64; i++) {
    for (let j = 0; j < worldHeight / 64; j++) {
        const imgSrc = './src/img/Tilemap_Flat.png';
        const width = 64;
        const height = 64;
        const terrain = new Entity(i * width, j * height, width, height, imgSrc)
        terrain.sprite = new Sprite(imgSrc, 64, 64, 1, 0.1, 64, 64);
        terrain.sprite.frameY = 64;
        terrains.push(terrain);
    }
}
for (let i = 0; i < 300; i++) {
    let img = './src/img/tree.png';
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
    let width = 192;
    let height = 192;
    let imageSrc = './src/img/Torch_Yellow.png';
    let x = getRandomInRange(0 + width, worldWidth - width);
    let y = getRandomInRange(0 + height, worldHeight - height);
    let entity = new Entity(x, y, width, height, imageSrc, canv);
    entity.sprite = new Sprite(imageSrc, width, height, 6, 0.1, width, height);
    entity.sprite.frameY = height;
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 6));
    entity.addCollider(new BoxCollider(0, 0, entity.width, entity.height));
    entity.colliders[0].enabled = true;
    // entity.colliders[0].visible = true;
    entity.dx = 20;
    entity.dy = 20;
    sprites.push(entity);
}

const camera = new Camera(player, canv, worldWidth, worldHeight);

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
            if (CollisionManager.checkCollision(player.colliders[0], sprites[i].colliders[0])) {
                if (player.attack && player.sprite.currentFrame > 4) sprites.splice([i], 1);
            };
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

    player.update(delta);
    player.draw(ctx);
    if (player.x > worldWidth - player.width) player.dx = worldWidth - player.width;
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;
    if (player.y + player.height > worldHeight) player.y = worldHeight - player.height;
    if (player.y > worldHeight - player.height) player.dy = worldHeight - player.height;


    for (let i = 0; i < trees.length; i++) {
        if (camera.isInView(trees[i])) {
            trees[i].update(delta);
            trees[i].draw(ctx);

            if (CollisionManager.checkCollision(player.colliders[0], trees[i].colliders[0])) {
                // player.draw(ctx);
                const playerCollider = player.colliders[0];
                const treeCollider = trees[i].colliders[0];

                const overlapX = Math.min(
                    playerCollider.x + playerCollider.width - treeCollider.x,
                    treeCollider.x + treeCollider.width - playerCollider.x
                );

                const overlapY = Math.min(
                    playerCollider.y + playerCollider.height - treeCollider.y,
                    treeCollider.y + treeCollider.height - playerCollider.y
                );

                if (overlapX < overlapY) {
                    if (playerCollider.x < treeCollider.x) {
                        player.x = treeCollider.x - playerCollider.width - playerCollider.offsetX;
                    } else {
                        player.x = treeCollider.x + treeCollider.width - playerCollider.offsetX;
                    }
                } else {
                    if (playerCollider.y < treeCollider.y) {
                        player.y = treeCollider.y - playerCollider.height - playerCollider.offsetY;
                    } else {
                        player.y = treeCollider.y + treeCollider.height - playerCollider.offsetY;
                    }
                }


                // const dx = player.colliders[0].x - trees[i].colliders[0].x;
                // const dy = player.colliders[0].y - trees[i].colliders[0].y;

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

                //     player.x = trees[i].colliders[0].x + pushX;
                //     player.y = trees[i].colliders[0].y + pushY;
                // }



                // const playerCollider = player.colliders[0];
                // const treeCollider = trees[i].colliders[0];

                // const dx = (playerCollider.x + playerCollider.width / 2) - (treeCollider.x + treeCollider.width / 2);
                // const dy = (playerCollider.y + playerCollider.height / 2) - (treeCollider.y + treeCollider.height / 2);

                // const absDx = Math.abs(dx);
                // const absDy = Math.abs(dy);

                // if (absDx > absDy) {
                //     if (dx > 0) {
                //         player.x = treeCollider.x + treeCollider.width - playerCollider.offsetX;
                //     } else {
                //         player.x = treeCollider.x - playerCollider.width - playerCollider.offsetX;
                //     }
                // } else {
                //     if (dy > 0) {
                //         player.y = treeCollider.y + treeCollider.height - playerCollider.offsetY;
                //     } else {
                //         player.y = treeCollider.y - playerCollider.height - playerCollider.offsetY;
                //     }
                // }
            }
        }
    }
    // camera.reset(ctx);
    animateId = window.requestAnimationFrame(animate);
}
animate();
