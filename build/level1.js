export function start(gameState, startNextLevel) {
    const level1 = Object.assign(Object.assign({}, gameState), { frog: new Frog(800, 600), score: 0, bugs: [], trash: [], startNextLevel: startNextLevel, keydown: undefined, keyup: undefined, treeGif: document.createElement('img'), waterfallGif: document.createElement('img'), plantsGif: document.createElement('img') });
    level1.canvas.className = 'level1';
    if (!gameState.audioMuted)
        bgMusic.play();
    // Add GIF elements dynamically
    //  const frogGif = document.createElement('img');
    //  frogGif.src = frogImage.src;
    //  frogGif.style.position = 'absolute';
    //  frogGif.style.left = `${frog.x}px`;
    //  frogGif.style.top = `${frog.y}px`;
    //  frogGif.style.width = `${frog.width}px`;
    //  frogGif.style.height = `${frog.height}px`;
    //  frogGif.style.zIndex = "4";
    //  document.body.appendChild(frogGif);
    const waterfall = new Image();
    waterfall.src = "assets/gifs/level1-river.gif"; //part of the bgr
    const plants = new Image();
    plants.src = "assets/gifs/level1-plants.gif"; //part of the bgr
    const tree = new Image();
    tree.src = "assets/gifs/level1-tree.gif"; //part of the bgr
    level1.treeGif.src = tree.src;
    level1.treeGif.style.position = 'absolute';
    level1.treeGif.style.left = '0px';
    level1.treeGif.style.top = '0px';
    level1.treeGif.style.width = 'auto';
    level1.treeGif.style.height = 'auto';
    document.body.appendChild(level1.treeGif);
    level1.waterfallGif.src = waterfall.src;
    level1.waterfallGif.style.position = 'absolute';
    level1.waterfallGif.style.left = '6px';
    level1.waterfallGif.style.top = '0px';
    level1.waterfallGif.style.width = 'auto';
    level1.waterfallGif.style.height = 'auto';
    document.body.appendChild(level1.waterfallGif);
    level1.plantsGif.src = plants.src;
    level1.plantsGif.style.position = 'absolute';
    level1.plantsGif.style.left = '0px';
    level1.plantsGif.style.top = '8px';
    level1.plantsGif.style.width = 'auto';
    level1.plantsGif.style.height = 'auto';
    document.body.appendChild(level1.plantsGif);
    level1.keydown = (e) => {
        if (e.key === 'ArrowLeft') {
            level1.frog.turn('left');
            level1.frog.x = Math.max(0, level1.frog.x - 10);
            //level1.frogGif.src = level1.frogLeft.src;
        }
        if (e.key === 'ArrowRight') {
            level1.frog.turn('right');
            level1.frog.x = Math.min(1820, level1.frog.x + 10);
            //frogGif.src = frogRight.src;
        }
        // console.log(`GIF Source: ${frogGif.src}`);
        //frogGif.style.left = `${frog.x}px`;
    };
    level1.keyup = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            level1.frog.turn('static');
        }
    };
    document.addEventListener('keydown', level1.keydown);
    document.addEventListener('keyup', level1.keyup);
    setInterval(() => spawnItem(level1), 1000);
    // start game loop
    loop(level1);
}
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}
const bgMusic = new Audio("assets/sounds/Joca Perpignan - No mundo da percussão.mp3");
bgMusic.loop = true;
class Entity {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }
    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}
const frogStaticImage = loadImage("assets/gifs/frogblink.gif");
const frogLeftImage = loadImage("assets/gifs/frogLeft.gif");
const frogRightImage = loadImage("assets/gifs/frogRight.gif");
class Frog extends Entity {
    constructor(x, y) {
        super(x, y, 100, 100, frogStaticImage);
    }
    turn(direction) {
        switch (direction) {
            case "static":
                this.sprite = frogStaticImage;
                break;
            case "left":
                this.sprite = frogLeftImage;
                break;
            case "right":
                this.sprite = frogRightImage;
                break;
        }
    }
}
const bug_types = {
    bug1: loadImage("assets/images/level1-bug1.png"),
    bug2: loadImage("assets/images/level1-bug2.png"),
    bug3: loadImage("assets/images/level1-bug3.png"),
};
class Bug extends Entity {
    constructor(type, x, y) {
        super(x, y, 75, 75, bug_types[type]);
        this.type = type;
    }
}
const trashImage = loadImage("assets/images/shit-main.png");
class Trash extends Entity {
    constructor(x, y) {
        super(x, y, 75, 75, trashImage);
    }
}
function cleanUp(level) {
    //frogGif.remove();
    level.treeGif.remove();
    level.waterfallGif.remove();
    level.plantsGif.remove();
    document.removeEventListener('keydown', level.keydown);
    document.removeEventListener('keyup', level.keyup);
}
function draw(level) {
    level.ctx.clearRect(0, 0, 1920, 1080);
    // Background layers
    level.ctx.drawImage(level.waterfallGif, 0, 0, 1920, 1080);
    level.ctx.drawImage(level.plantsGif, 0, 0, 1920, 1080);
    level.ctx.drawImage(level.treeGif, 0, 0, 1920, 1080);
    level.bugs.forEach(b => b.render(level.ctx));
    level.trash.forEach(t => t.render(level.ctx));
    // Score
    level.ctx.fillStyle = "black";
    level.ctx.font = "30px lores-12";
    level.ctx.fillText(`Score: ${level.score}`, 20, 50);
}
function spawnItem(level) {
    const itemX = Math.random() * 1720 + 50;
    if (Math.random() > 0.5) {
        const type = Object.entries(bug_types)[Math.floor(Math.random() * 3)][0];
        level.bugs.push(new Bug(type, itemX, 0));
    }
    else {
        level.trash.push(new Trash(itemX, 0));
    }
}
function checkCollision(level, item) {
    return (level.frog.x < item.x + 75 &&
        level.frog.x + level.frog.width > item.x &&
        level.frog.y < item.y + 75 &&
        level.frog.y + level.frog.height > item.y);
}
function update(level) {
    level.bugs.forEach(bug => bug.y += 3);
    level.bugs.forEach((bug, index) => {
        if (checkCollision(level, bug)) {
            level.score += 1;
            level.bugs.splice(index, 1);
        }
    });
    level.trash.forEach((trash, index) => {
        if (checkCollision(level, trash)) {
            level.score -= 1;
            level.trash.splice(index, 1);
        }
    });
    // Remove items that fall off-screen
    level.bugs = level.bugs.filter(bug => bug.y < 1080);
    level.trash = level.trash.filter(item => item.y < 1080);
}
function loop(level) {
    if (!level.paused) {
        update(level);
        draw(level);
    }
    if (level.score >= 30) {
        level.showPopup("Thanks for the help, human. I am full and I would like to dip my feet in some water.");
        cleanUp(level);
        level.startNextLevel();
        return;
    }
    if (level.score >= 5) {
        level.showPopup("Yum! The insects I just ate are mostly very toxic, that’s where I got my coloring from a long, long time ago. Oh and also many species of frogs from my family, Dendrobatidae, are highly toxic themselves because of their diet.");
    }
    else if (level.score >= 10) {
        level.showPopup("The chemicals that me and my fellow frogs produce are called alkaloids and they are secreted from my skin. These alkaloids can be used as muscle relaxants, heart stimulants, appetite suppressants and they can also kill people!");
    }
    else if (level.score >= 15) {
        level.showPopup("I am called a Poison dart frog because the aboriginal South Americans used my toxins to poison the tips of their darts. It made hunting prey a lot easier.");
    }
    else if (level.score >= 20) {
        level.showPopup("I look cute and welcoming, however I am quite the beast. Both males and females in our family fight for the attention of the other sex. And even after mating, the females try to scare away other females from their mate, as they want him to only look after their own children.");
    }
    else if (level.score >= 25) {
        level.showPopup("But I was a beast as a small tadpole as well. In order to grow big and live longer than the usual one to three years, I had to eat my siblings. Well, not all of them… But they tasted pretty good!");
    }
    requestAnimationFrame(() => loop(level));
}
//# sourceMappingURL=level1.js.map