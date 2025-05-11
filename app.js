
import { BoxCollider } from './src/impl/boxCollider.js';
import { CircleCollider } from './src/impl/circleCollider.js';
import { CollisionManager } from './src/core/collisionManager.js';
import { Camera } from './src/core/camera.js';
import { Sprite } from './src/core/sprite.js';
import { Player } from './src/impl/player.js';
import { Tree } from './src/impl/tree.js';
import { Goblin } from './src/impl/goblin.js';
import { Terrain } from './src/impl/terrain.js';
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let animateId = 0;
const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');
canv.height = window.innerHeight;
canv.width = window.innerWidth;
let terrains = [];
let trees = [];
let sprites = [];
let bushes = []
const world = {
    width: 5760,
    height: 2859,
}
let ui = document.querySelector('.ui');


const player = new Player(world.width / 2, world.height / 2, 192, 192, './src/img/Warrior_Blue.png', canv);
player.sprite = new Sprite('./src/img/Warrior_Blue.png', player.width, player.height, 6, 0.1, player.width * 0.75, player.height * 0.75);
player.addCollider(new BoxCollider(0 + player.width * 0.25, 0 + player.height * 0.2, player.width * 0.25, player.height * 0.3));
player.colliders[0].enabled = true;
// player.colliders[0].visible = true;
const camera = new Camera(player, canv, world.width, world.height);

ui.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (target.classList.contains('btn')) {
        if (target.dataset.btn) player.inputManager.keys[target.dataset.btn] = true;
    } else {
        player.inputManager.keys[target.dataset.btn] = false;
    }
})
ui.addEventListener('touchend', (e) => {
    const target = e.target;
    player.inputManager.keys[target.dataset.btn] = false;
})
for (let i = 0; i < world.width / 64; i++) {
    for (let j = 0; j < world.height / 64; j++) {
        const imgSrc = './src/img/Tilemap_Flat.png';
        const width = 64;
        const height = 64;
        const terrain = new Terrain(i * width, j * height, width, height, imgSrc)
        terrain.sprite = new Sprite(imgSrc, 64, 64, 1, 500, 64, 64);
        terrain.sprite.frameY = height;
        terrain.sprite.currentFrame = 1;
        terrains.push(terrain);
    }
}

for (let i = 0; i < 100; i++) {
    let img = './src/img/bush.png';
    let width = 64;
    let height = 64;
    let x = getRandomInRange(0, world.width - width);
    let y = getRandomInRange(0, world.height - height);
    const bush = new Terrain(x, y, width, height, img, canv);
    // bush.sprite.frameY = 64;
    bush.sprite = new Sprite(img, width, height, 1, 1, width, height);
    bush.addCollider(new BoxCollider(0 + bush.width / 4, 0 + bush.height / 4, bush.width / 2, bush.height / 2));
    bush.colliders[0].enabled = true;
    // bush.colliders[0].visible = true;
    bushes.push(bush);
}

for (let i = 0; i < 200; i++) {
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
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height / 6));
    entity.addCollider(new CircleCollider(entity.width / 2, entity.height / 2, entity.height));
    entity.colliders[0].enabled = true;
    // entity.colliders[0].visible = true;
    entity.colliders[1].enabled = true;
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
    for (let i = 0; i < bushes.length; i++) {
        if (camera.isInView(bushes[i])) {
            bushes[i].update(delta);
            bushes[i].draw(ctx);
            if (CollisionManager.checkCollision(player.colliders[0], bushes[i].colliders[0])) {
                // player.draw(ctx);
                const playerCollider = player.colliders[0];
                const treeCollider = bushes[i].colliders[0];

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
            }
        }
    }
    for (let i = 0; i < sprites.length; i++) {

        if (camera.isInView(sprites[i])) {
            for (let j = 0; j < trees.length; j++) {
                if (CollisionManager.checkCollision(sprites[i].colliders[0], trees[j].colliders[0])) {
                    sprites[i].dx *= -1;
                    // sprites[i].dy *= -1;
                }
            }
            if (sprites[i].x + sprites[i].width > world.width || sprites[i].x < 0 || sprites[i].y + sprites[i].height > world.height || sprites[i].y < 0) sprites[i].dx *= -1;
            if (sprites[i].y > world.height - sprites[i].height || sprites[i].y < 0) sprites[i].dy *= -1;
            sprites[i].update(delta);
            sprites[i].draw(ctx);
            if (CollisionManager.checkCollision(player.colliders[0], sprites[i].colliders[0])) {
                sprites[i].attack = true;
                if (player.attack && player.sprite.currentFrame > 4) sprites.splice(i, 1);
            } else {
                sprites[i].attack = false;
            }
            if (CollisionManager.checkCollision(player.colliders[0], sprites[i].colliders[1])) {
                sprites[i].setTarget(player);
            } else {
                sprites[i].setTarget(null);
            }
        }

        for (let j = i + 1; j < sprites.length; j++) {
            if (camera.isInView(sprites[i]) && camera.isInView(sprites[j])) {
                if (CollisionManager.checkCollision(sprites[i].colliders[0], sprites[j].colliders[0])) {
                    sprites[i].dx *= -1;
                    sprites[j].dx *= -1;
                    sprites[i].dy *= -1;
                    sprites[j].dy *= -1;
                }
            }

        }

    }

    player.update(delta);
    player.draw(ctx);
    player.x = Math.max(0, Math.min(player.x, world.width - player.width));
    player.y = Math.max(0, Math.min(player.y, world.height - player.height));

    for (let i = 0; i < trees.length; i++) {
        if (camera.isInView(trees[i])) {
            trees[i].update(delta);
            trees[i].draw(ctx);

            if (CollisionManager.checkCollision(player.colliders[0], trees[i].colliders[0])) {
                // player.draw(ctx);
                const playerCollider = player.colliders[0];
                const treeCollider = trees[i].colliders[0];

                const overlapX = Math.max(0, Math.min(
                    playerCollider.x + playerCollider.width - treeCollider.x,
                    treeCollider.x + treeCollider.width - playerCollider.x
                ));

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

            }
        }
    }


    // camera.reset(ctx);
    animateId = window.requestAnimationFrame(animate);
}
animate();
