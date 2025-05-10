
import { BoxCollider } from './impl/boxCollider.js';
import { CircleCollider } from './impl/circleCollider.js';
import { CollisionManager } from './core/collisionManager.js';
import { Camera } from './core/camera.js';
import { Sprite } from './core/sprite.js';
import { Player } from './impl/player.js';
import { Tree } from './impl/tree.js';
import { Goblin } from './impl/goblin.js';
import { Terrain } from './impl/terrain.js';

let animateId = 0;
const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');
canv.height = window.innerHeight;
canv.width = window.innerWidth;
let terrains = [];
let trees = [];
let sprites = [];
const world = {
    width: window.innerWidth * 3,
    height: window.innerHeight * 3,
}


function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const player = new Player(world.width / 2, world.height / 2, 192, 192, './src/img/Warrior_Blue.png', canv);
player.sprite = new Sprite('./src/img/Warrior_Blue.png', player.width, player.height, 6, 0.1, player.width * 0.75, player.height * 0.75);
player.addCollider(new BoxCollider(0 + player.width * 0.25, 0 + player.height * 0.25, player.width * 0.25, player.height * 0.25));
player.colliders[0].enabled = true;
// player.colliders[0].visible = true;
const camera = new Camera(player, canv, world.width, world.height);

for (let i = 0; i < world.width / 64; i++) {
    for (let j = 0; j < world.height / 64; j++) {
        const imgSrc = './src/img/Tilemap_Flat.png';
        const width = 64;
        const height = 64;
        const terrain = new Terrain(i * width, j * height, width, height, imgSrc)
        terrain.sprite = new Sprite(imgSrc, 64, 64, 1, 0.1, 64, 64);
        terrain.sprite.frameY = 64;
        terrains.push(terrain);
    }
}
for (let i = 0; i < 300; i++) {
    let img = './src/img/tree.png';
    let width = 192;
    let height = 192;
    let x = getRandomInRange(0, world.width - width);
    let y = getRandomInRange(0, world.height - height);
    const tree = new Tree(x, y, width, height, img, canv);
    tree.sprite = new Sprite(img, width, height, 4, 0.15, width, height);
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
    let x = getRandomInRange(0 + width, world.width - width);
    let y = getRandomInRange(0 + height, world.height - height);
    let entity = new Goblin(x, y, width, height, imageSrc, canv);
    entity.sprite = new Sprite(imageSrc, width, height, 6, 0.1, width, height);
    entity.sprite.frameY = height;
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 10));
    entity.addCollider(new BoxCollider(0, 0, entity.width, entity.height));
    entity.colliders[0].enabled = true;
    // entity.colliders[0].visible = true;
    sprites.push(entity);
}
let time = Date.now();

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
                sprites[i].attack = true;
                if (player.attack && player.sprite.currentFrame > 4) sprites.splice([i], 1);
            };
            if (sprites[i].x + sprites[i].width > world.width || sprites[i].x < 0 || sprites[i].y + sprites[i].height > world.height || sprites[i].y < 0) sprites[i].dx *= -1;
            if (sprites[i].y > world.height - sprites[i].height || sprites[i].y < 0) sprites[i].dy *= -1;
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
    if (player.x > world.width - player.width) player.dx = world.width - player.width;
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > world.width) player.x = world.width - player.width;
    if (player.y + player.height > world.height) player.y = world.height - player.height;
    if (player.y > world.height - player.height) player.dy = world.height - player.height;


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
