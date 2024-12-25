/* Úpravy zatím dělány jen do řádku 98. 
Vysvětlení levelu - jde o pexeso, při načtení levelu se karty s květinami náhodně seřadí do předem připraveného boxu. Navenek je vidět jen acorn, po kliknutí se zobrazí květina, která se nachází pod ním. Hráč má 2 minuty na splnění pexesa, jinak se mu level 3 restartuje. Po ukončení levelu se načte cutscéna. Ta když skončí, hráč se přesune do main menu. 
Ještě vysvětlení gifu frogGlitch. Až celá hra bude funkční, mým cýlem je do ní přidat záměrné glitche. V prvním levelu bude jeden krátký v pozadí, v druhém levelu bude třeba třikrát jeden a ten samý, opět v pozadí. Ve třetím levelu se pozadí bude glitchovat několikrát a před zobrazením cutscény se zaglitchuje i žába. Důvod je pak vysvětlen ve scéně. */

export function start(gameState, startNextLevel) {
    const level1 = Object.assign(Object.assign({}, gameState));
    level3.canvas.className = "level3"; 
    if (!gameState.audioMuted)
        bgMusic.play();

    //  const frogGif = document.createElement('img');
    //  frogGif.src = frogblink.gif;
    //  frogGif.style.position = 'absolute';
    //  frogGif.style.left = `${frog.x}px`;
    //  frogGif.style.top = `${frog.y}px`;
    //  frogGif.style.width = `${frog.width}px`;
    //  frogGif.style.height = `${frog.height}px`;
    //  frogGif.style.zIndex = "4";
    //  document.body.appendChild(frogGif);

const plainbox = new Image();
plainbox.src = "assets/images/level3_plainbox.png";
const acorn = new Image();
acorn.src = "assets/images/level3_acorn.png";
const frogglitch = new Image();
frogglitch.src = "assets/gifs/frogglitch.gif"; //glitching before the cutscene starts as well as two/three times during the plathrough of the level randomly
    level3.frogglitch.src = frogglitch.src;
    level3.frogglitch.style.position = 'absolute';
    level3.frogglitch.style.left = '0px';
    level3.frogglitch.style.top = '0px';
    level3.frogglitch.style.width = 'auto';
    level3.frogglitch.style.height = 'auto';
    document.body.appendChild(level3.frogglitch);
const trees = new Image();
trees.src = "assets/gifs/level3-trees.gif"; //part of the bgr
    level3.treesGif.src = trees.src;
    level3.treeGsif.style.position = 'absolute';
    level3.treesGif.style.left = '0px';
    level3.treesGif.style.top = '0px';
    level3.treesGif.style.width = 'auto';
    level3.treesGif.style.height = 'auto';
    document.body.appendChild(level3.treesGif);

    loop(level3);
}

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const bgMusic = new Audio("./assets/sounds/Le Marigold - Aaraam.mp3");
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

const flower_types = {
    flower1: loadImage("assets/images/level3_flower1.png"),
    flower2: loadImage("assets/images/level3_flower2.png"),
    flower3: loadImage("assets/images/level3_flower3.png"),
    flower4: loadImage("assets/images/level3_flower4.png"),
    flower5: loadImage("assets/images/level3_flower5.png"),
    flower6: loadImage("assets/images/level3_flower6.png"),
    flower7: loadImage("assets/images/level3_flower7.png"),
    flower8: loadImage("assets/images/level3_flower8.png"),
    flower9: loadImage("assets/images/level3_flower9.png"),
    flower10: loadImage("assets/images/level3_flower10.png"),
    flower11: loadImage("assets/images/level3_flower11.png"),
    flower12: loadImage("assets/images/level3_flower12.png"),
    flower13: loadImage("assets/images/level3_flower13.png"),
    flower14: loadImage("assets/images/level3_flower14.png"),
    flower15: loadImage("assets/images/level3_flower15.png"),
    flower16: loadImage("assets/images/level3_flower16.png"),
    flower17: loadImage("assets/images/level3_flower17.png"),
    flower18: loadImage("assets/images/level3_flower18.png"),
};

class Flower extends Entity {
    constructor(type, x, y) {
        super(x, y, 75, 75, bug_types[type]);
        this.type = type;
    }
}

function cleanup(level) {
    level.frogGif.remove();
    level.treesGif.remove();
}

export default function level3(ctx, showCutscene) {
    const cards = [];
    let firstCard = null;
    let secondCard = null;
    let matchedPairs = 0;
    let timer = 120; // Two minutes
    let interval;
    // Initialize cards
    const images = Array.from({ length: 18 }, (_, i) => `assets/images/level3_flower${i + 1}.png`);
    const allCards = [...images, ...images];
    allCards.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 36; i++) {
        cards.push({
            x: (i % 6) * 300 + 100,
            y: Math.floor(i / 6) * 300 + 50,
            width: 200,
            height: 200,
            image: allCards[i] || null,
            revealed: false,
            matched: false,
        });
    }
    function draw() {
        ctx.clearRect(0, 0, 1920, 1080);
        ctx.drawImage(trees, 0, 0, 1920, 1080);
        cards.forEach(card => {
            if (card.revealed || card.matched) {
                const img = new Image();
                img.src = card.image;
                ctx.drawImage(img, card.x, card.y, card.width, card.height);
            }
            else {
                ctx.drawImage(plainbox, card.x, card.y, card.width, card.height);
            }
        });
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(`Time: ${timer}s`, 20, 50);
        ctx.fillText(`Matches: ${matchedPairs}/13`, 20, 100);
    }
    function update() {
        if (timer <= 0) {
            clearInterval(interval);
            alert("Time's up! Restarting level.");
            level3(ctx, showCutscene); // Restart level
        }
    }
    function handleClick(x, y) {
        if (firstCard && secondCard)
            return;
        const clickedCard = cards.find(card => {
            return (x > card.x &&
                x < card.x + card.width &&
                y > card.y &&
                y < card.y + card.height);
        });
        if (!clickedCard || clickedCard.revealed || clickedCard.matched)
            return;
        clickedCard.revealed = true;
        if (!firstCard) {
            firstCard = clickedCard;
        }
        else {
            secondCard = clickedCard;
            checkMatch();
        }
    }
    function checkMatch() {
        if (firstCard.image === secondCard.image) {
            firstCard.matched = true;
            secondCard.matched = true;
            matchedPairs++;
            if (matchedPairs >= 18) {
                clearInterval(interval);
                alert("Level completed!");
                ctx.drawImage(frogglitch, 800, 400, 300, 300);
                showCutscene();
            }
        }
        else {
            setTimeout(() => {
                firstCard.revealed = false;
                secondCard.revealed = false;
            }, 1000);
        }
        firstCard = null;
        secondCard = null;
    }
    function startTimer() {
        interval = setInterval(() => {
            timer--;
            update();
        }, 1000);
    }
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleClick(e.clientX - rect.left, e.clientY - rect.top);
    });
    startTimer();
    draw();
    setInterval(draw, 100); // Refresh screen
}
//# sourceMappingURL=level3.js.map