export function start(gameState, startNextLevel) {
    const level2 = Object.assign(Object.assign({}, gameState), 
    { frog: new Frog (800, 600), score: 0, trash: [], startNextLevel: startNextLevel, keydown: undefined, keyup: undefined, islands: document.createElement("img"),
    });

    level2.canvas.className = "level2";
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

    const border = new Image();
    border.src = "assets/images/level2-border.png";
    const border2 = new Image();
    border2.src = "assets/images/level2-border2.png";
    const islands = new Image();
    islands.src = "assets/images/level2-islandsMain.png";
    const islands2 = new Image();
    islands2.src = "assets/images/level2-islands1.png";
    const bgr = new Image();
    bgr.src = "assets/images/level2-bgr.png";

    level2.keydown = (e) => {
        if (e.key === 'ArrowUp')
            frog.y -= 50;
        if (e.key === 'ArrowDown')
            frog.y += 50;
        if (e.key === 'ArrowLeft')
            frog.x -= 10;
        if (e.key === 'ArrowRight')
            frog.x += 10;
    };
    document.addEventListener('keydown', level2.keydown);
    loop(level2);
}

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const bgMusic = new Audio("assets/sounds/Wesly Thomas - Afternoon in Rio.mp3");
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

const frogImage = loadImage("assets/gifs/frogblink.gif")

class Frog extends Entity {
    constructor(x, y) {
        super(x, y, 300, 300, frogImage);
    }
}

const trash_types = {
    trash1: loadImage("assets/images/level2-trash1.png"),
    trash2: loadImage("assets/images/level2-trash2.png"),
    trash3: loadImage("assets/images/level2-trash3.png"),
    trash4: loadImage("assets/images/level2-trash4.png"),
    trash5: loadImage("assets/images/level2-trash5.png"),
    trash6: loadImage("assets/images/level2-trash6.png"),
};

class Trash extends Entity {
    constructor(type, x, y) {
        super(x, y, 75, 75, bug_types[type]);
        this.type = type;
    }
}

function cleanUp(level) {
    //frogGif.remove();
    document.removeEventListener('keydown', level.keydown);
    document.removeEventListener('keyup', level.keyup);
}

function draw(level) {
    level.ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(bgr, 0, 0, 1920, 1080);
    ctx.drawImage(border, 0, 0, 1920, 1080);
    ctx.drawImage(border2, 0, 0, 1920, 1080);
    islands.forEach(island => ctx.fillRect(island.x, island.y, island.width, island.height));
    trash.forEach(item => {
        if (!item.collected) {
            ctx.drawImage(item.img, item.x, item.y, 60, 60);
        }
    });
    ctx.drawImage(frog, frog.x, frog.y, frog.width, frog.height);
    ctx.fillStyle = "black";
    ctx.font = "30px lores-12";
    ctx.fillText(`Trash Collected: ${trashCollected}/13`, 20, 50);
}

function checkCollision(level, item) {
}

function update(level) {
    // Move islands
    islands.forEach(island => {
        island.x += island.dx;
        if (island.x <= 0 || island.x + island.width >= 1920) {
            island.dx *= -1; // Reverse direction
        }
    });
    // Check if frog is on an island
    const onIsland = islands.some(island => {
        return (frog.y + frog.height === island.y &&
            frog.x + frog.width > island.x &&
            frog.x < island.x + island.width);
    });
    if (!onIsland && frog.y < 580) {
        resetFrog(); // Frog fell into water
    }
    // Check for trash collection
    trash.forEach(item => {
        if (!item.collected &&
            frog.x < item.x + 60 &&
            frog.x + frog.width > item.x &&
            frog.y < item.y + 60 &&
            frog.y + frog.height > item.y) {
            item.collected = true;
            trashCollected++;
        }
    });
}

function loop(level) {
    if (!level.paused) {
        update(level);
        draw(level);
    }

    // Check level completion
    if (trashCollected >= 13) {
        level.showPopup("You have helped me so much! Thank you. Now this part of the river is clean. Now come with me, I'll show you another part of the forest.");
        level.startNextLevel();
        return;
    }

    if (trashCollected >= 1) {
        level.showPopup("Nice job! But really be careful about the river. Due to climate change, amphibian chytrid fungus, a kind of parasitic mushroom, is causing many of the species from my family to go extinct.");
    }
    
    else if (trashCollected >= 4) {
        level.showPopup("Also, the river is poisoned by mercury in many places as it is leaked from gold mines around Amazon that are using mercury for gold purification.");
    }

    else if (trashCollected >= 9) {
        level.showPopup("People’s trash is not helping the situation at all, as you can see. Many South American countries, like Brazil, where I live, suffer from inequality. Therefore many people don’t have access to a proper sewage or trash system and the river is the only place where their trash goes.");
    }
    requestAnimationFrame(() => loop(level));
}




/*const frog = {
    x: 800, y: 950, width: 100, height: 100
};
const islands = [];
const trash = [];
let trashCollected = 0;
let paused = false;
// Create islands and trash
for (let i = 0; i < 13; i++) {
    islands.push({
            x: i * 150 + Math.random() * 100,
            y: 200 + Math.random() * 600,
            width: 150,
            height: 30,
            dx: Math.random() > 0.5 ? 1 : -1,
        });
    trash.push({
            x: islands[i].x + 30,
            y: islands[i].y - 30,
            collected: false,
            img: trashImages[i % trashImages.length]
        });
} */
//# sourceMappingURL=level2.js.map