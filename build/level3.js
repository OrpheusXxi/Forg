canvas.className = 'level3';
const flower1 = new Image();
flower1.src = "./assets/images/level3_flower1.png";
const flower2 = new Image();
flower2.src = "./assets/images/level3_flower2.png";
const flower3 = new Image();
flower3.src = "./assets/images/level3_flower3.png";
const flower4 = new Image();
flower4.src = "./assets/images/level3_flower4.png";
const flower5 = new Image();
flower5.src = "./assets/images/level3_flower5.png";
const flower6 = new Image();
flower6.src = "./assets/images/level3_flower6.png";
const flower7 = new Image();
flower7.src = "./assets/images/level3_flower7.png";
const flower8 = new Image();
flower8.src = "./assets/images/level3_flower8.png";
const flower9 = new Image();
flower9.src = "./assets/images/level3_flower9.png";
const flower10 = new Image();
flower10.src = "./assets/images/level3_flower10.png";
const flower11 = new Image();
flower11.src = "./assets/images/level3_flower11.png";
const flower12 = new Image();
flower12.src = "./assets/images/level3_flower12.png";
const flower13 = new Image();
flower13.src = "./assets/images/level3_flower13.png";
const flower14 = new Image();
flower14.src = "./assets/images/level3_flower14.png";
const flower15 = new Image();
flower15.src = "./assets/images/level3_flower15.png";
const flower16 = new Image();
flower16.src = "./assets/images/level3_flower16.png";
const flower17 = new Image();
flower17.src = "./assets/images/level3_flower17.png";
const flower18 = new Image();
flower18.src = "./assets/images/level3_flower18.png";
const plainbox = new Image();
plainbox.src = "./assets/images/level3_plainbox.png";
const acorn = new Image();
acorn.src = "./assets/images/level3_acorn.png";
const frog = new Image();
frog.src = "./assets/gifs/frogblink.gif";
const frogglitch = new Image();
frogglitch.src = "./assets/gifs/frogglitch.gif"; //glitching before the cutscene starts as well as two/three times during the plathrough of the level randomly
const trees = new Image();
trees.src = "./assets/gifs/level3-trees.gif"; //part of the bgr
const bgMusic = new Audio("./assets/sounds/Le Marigold - Aaraam.mp3");
bgMusic.loop = true;
if (!audioMuted)
    bgMusic.play();
export default function level3(ctx, showCutscene) {
    const cards = [];
    let firstCard = null;
    let secondCard = null;
    let matchedPairs = 0;
    let timer = 120; // Two minutes
    let interval;
    const frogGif = document.createElement('img');
    frogGif.src = frogImage.src;
    frogGif.style.position = 'absolute';
    frogGif.style.left = `${frog.x}px`;
    frogGif.style.top = `${frog.y}px`;
    frogGif.style.width = `${frog.width}px`;
    frogGif.style.height = `${frog.height}px`;
    document.body.appendChild(frogGif);
    const treesGif = document.createElement('img');
    treesGif.src = trees.src;
    treesGif.style.position = 'absolute';
    treesGif.style.left = '0px';
    treesGif.style.top = '0px';
    treesGif.style.width = 'auto';
    treesGif.style.height = 'auto';
    document.body.appendChild(treesGif);
    function cleanUp() {
        frogGif.remove();
        treesGif.remove();
    }
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