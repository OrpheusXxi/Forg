canvas.className = 'level2';

const border = new Image ();
border.src = "./assets/images/level2-border.png";

const border2 = new Image ();
border2.src = "./assets/images/level2-border2.png";

const islands = new Image ();
islands.src = "./assets/images/level2-islandsMain.png";

const islands2 = new Image ();
islands2.src = "./assets/images/level2-islands1.png";

const bgr = new Image ();
bgr.src = "./assets/images/level2-bgr.png";

const frog = new Image();
frog.src = "./assets/gifs/frogblink.gif";

const trashImages = [
    "./assets/images/level2-trash1.png",
    "./assets/images/level2-trash2.png",
    "./assets/images/level2-trash3.png",
    "./assets/images/level2-trash4.png",
    "./assets/images/level2-trash5.png",
    "./assets/images/level2-trash6.png"
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const bgMusic = new Audio("./assets/sounds/Wesly Thomas - Afternoon in Rio.mp3");
bgMusic.loop = true;
if (!audioMuted) bgMusic.play(); 


export default function level2(ctx, nextLevel) {
    const frog = {
        x: 800, y: 950, width: 100, height: 100
     };
    const islands = [];
    const trash = [];
    let trashCollected = 0;
    let paused = false;

    const frogGif = document.createElement('img');
     frogGif.src = frogImage.src;
     frogGif.style.position = 'absolute';
     frogGif.style.left = `${frog.x}px`;
     frogGif.style.top = `${frog.y}px`;
     frogGif.style.width = `${frog.width}px`;
     frogGif.style.height = `${frog.height}px`;
     document.body.appendChild(frogGif);

    function cleanUp() {
        frogGif.remove();
    }

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
    }

    function draw() {
        ctx.clearRect(0, 0, 1920, 1080);

        // Draw background and borders
        ctx.drawImage(bgr, 0, 0, 1920, 1080);
        ctx.drawImage(border, 0, 0, 1920, 1080);
        ctx.drawImage(border2, 0, 0, 1920, 1080);

        // Draw islands
        islands.forEach(island => ctx.fillRect(island.x, island.y, island.width, island.height));

        // Draw trash
        trash.forEach(item => {
            if (!item.collected) {
                ctx.drawImage(item.img, item.x, item.y, 60, 60);
            }
        });

        // Draw frog
        ctx.drawImage(frog, frog.x, frog.y, frog.width, frog.height);

        // Score
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(`Trash Collected: ${trashCollected}/13`, 20, 50);
    }

    function update() {
        // Move islands
        islands.forEach(island => {
            island.x += island.dx;
            if (island.x <= 0 || island.x + island.width >= 1920) {
                island.dx *= -1; // Reverse direction
            }
        });

        // Check if frog is on an island
        const onIsland = islands.some(island => {
            return (
                frog.y + frog.height === island.y &&
                frog.x + frog.width > island.x &&
                frog.x < island.x + island.width
            );
        });

        if (!onIsland && frog.y < 580) {
            resetFrog(); // Frog fell into water
        }

        // Check for trash collection
        trash.forEach(item => {
            if (
                !item.collected &&
                frog.x < item.x + 60 &&
                frog.x + frog.width > item.x &&
                frog.y < item.y + 60 &&
                frog.y + frog.height > item.y
            ) {
                item.collected = true;
                trashCollected++;
                if ([1, 4, 9, 13].includes(trashCollected)) {
                    paused = true;
                    alert(`Educational message for trash piece #${trashCollected}`);
                    paused = false;
                }
            }
        });

        // Check level completion
        if (trashCollected >= 13) nextLevel();
    }

    function loop() {
        if (!paused) {
            update();
            draw();
        }
        requestAnimationFrame(loop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') frog.y -= 50;
        if (e.key === 'ArrowDown') frog.y += 50;
        if (e.key === 'ArrowLeft') frog.x -= 10;
        if (e.key === 'ArrowRight') frog.x += 10;
    });

    loop();
}
