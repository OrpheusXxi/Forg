canvas.className = 'level1';

const frogImage = new Image();
frogImage.src = "./assets/gifs/frogblink.gif";

const frogLeft = new Image();
frogLeft.src = "./assets/gifs/frogLeft.gif";

const frogRight = new Image();
frogRight.src = "./assets/gifs/frogRight.gif";

const bug1Image = new Image();
bug1Image.src = "./assets/images/level1-bug1.png";

const bug2Image = new Image();
bug2Image.src = "./assets/images/level1-bug2.png";

const bug3Image = new Image();
bug3Image.src = "./assets/images/level1-bug3.png";

const trashImage = new Image();
trashImage.src = "./assets/images/shit-main.png";

const waterfall = new Image();
waterfall.src = "./assets/gifs/level1-river.gif"; //part of the bgr

const plants = new Image();
plants.src = "./assets/gifs/level1-plants.gif"; //part of the bgr

const tree = new Image();
tree.src = "./assets/gifs/level1-tree.gif"; //part of the bgr

const bgMusic = new Audio("./assets/sounds/Joca Perpignan - No mundo da percussão.mp3");
bgMusic.loop = true;
if (!audioMuted) bgMusic.play(); 

export default function level1(ctx, nextLevel) {
    const frog = { x: 800, y: 950, width: 100, height: 100, direction: "static" };
    let score = 0;
    const bugs = [];
    const trash = [];
    let paused = false;

     // Add GIF elements dynamically
 
     const treeGif = document.createElement('img');
     treeGif.src = tree.src;
     treeGif.style.position = 'absolute';
     treeGif.style.left = '0px';
     treeGif.style.top = '0px';
     treeGif.style.width = 'auto';
     treeGif.style.height = 'auto';
     document.body.appendChild(treeGif);

     const waterfallGif = document.createElement('img');
     waterfallGif.src = waterfall.src;
     waterfallGif.style.position = 'absolute';
     waterfallGif.style.left = '6px';
     waterfallGif.style.top = '0px';
     waterfallGif.style.width = 'auto';
     waterfallGif.style.height = 'auto';
     document.body.appendChild(waterfallGif);

     const plantsGif = document.createElement('img');
     plantsGif.src = plants.src;
     plantsGif.style.position = 'absolute';
     plantsGif.style.left = '0px';
     plantsGif.style.top = '8px';
     plantsGif.style.width = 'auto';
     plantsGif.style.height = 'auto';
     document.body.appendChild(plantsGif);

     const frogGif = document.createElement('img');
     frogGif.src = frogImage.src;
     frogGif.style.position = 'absolute';
     frogGif.style.left = `${frog.x}px`;
     frogGif.style.top = `${frog.y}px`;
     frogGif.style.width = `${frog.width}px`;
     frogGif.style.height = `${frog.height}px`;
     frogGif.style.zIndex = "4";
     document.body.appendChild(frogGif);
 
     function cleanUp() {
         frogGif.remove();
         treeGif.remove();
         waterfallGif.remove();
         plantsGif.remove();
     }

    function spawnItem() {
        const itemX = Math.random() * 1720 + 50;
        if (Math.random() > 0.5) {
            bugs.push({ x: itemX, y: 0, type: Math.floor(Math.random() * 3) });
        } else {
            trash.push({ x: itemX, y: 0 });
        }
    }

    function checkCollision(item) {
        return (
            frog.x < item.x + 75 &&
            frog.x + frog.width > item.x &&
            frog.y < item.y + 75 &&
            frog.y + frog.height > item.y
        );
    }


    function draw() {
        ctx.clearRect(0, 0, 1920, 1080);

        // Background layers
        if (waterfall.complete) ctx.drawImage(waterfall, 0, 0, 1920, 1080);
        if (plants.complete) ctx.drawImage(plants, 0, 0, 1920, 1080);
        if (tree.complete)ctx.drawImage(tree, 1200, 100, 600, 800);

        // Frog rendering
        if (frog.direction === 'left') {
            ctx.drawImage(frogLeft, frog.x, frog.y, frog.width, frog.height);
        } else if (frog.direction === 'right') {
            ctx.drawImage(frogRight, frog.x, frog.y, frog.width, frog.height);
        } else {
            ctx.drawImage(frogImage, frog.x, frog.y, frog.width, frog.height);
        }

        // Bugs and trash rendering
        bugs.forEach(bug => {
            const bugImage = bug.type === 0 ? bug1Image : bug.type === 1 ? bug2Image : bug3Image;
            ctx.drawImage(bugImage, bug.x, bug.y, 75, 75);
        });

        trash.forEach(item => {
            ctx.drawImage(trashImage, item.x, item.y, 75, 75);
        });

        // Score
        ctx.fillStyle = "black";
        ctx.font = "30px lores-12";
        ctx.fillText(`Score: ${score}`, 20, 50);
    }

    function update() {
        bugs.forEach(bug => bug.y += 3);
        if (checkCollision(bugs)) {
            score += 1;
            bugs = bugs.filter(b => b !== bugs);
        }

        trash.forEach(item => item.y += 3);
        if (checkCollision(item)) {
            score -= 1;
            trash = trash.filter(t => t !== item);
        }

         // Remove items that fall off-screen
         bugs = bugs.filter(bug => bug.y < 1080);
         trash = trash.filter(item => item.y < 1080);

    }

    function loop() {
        if (!paused) {
            update();
            draw();
        }
        requestAnimationFrame(loop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            frog.direction = 'left';
            frog.x = Math.max(0, frog.x - 10);
            frogGif.src = frogLeft.src;
        }
        if (e.key === 'ArrowRight') {
            frog.direction = 'right';
            frog.x = Math.min(1820, frog.x + 10);
            frogGif.src = frogRight.src;
        }

            console.log(`GIF Source: ${frogGif.src}`);
            frogGif.style.left = `${frog.x}px`;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            frog.direction = 'static';
            frogGif.src = frogImage.src;
        }
        console.log(`GIF Source after KeyUp: ${frogGif.src}`);
    });

    setInterval(spawnItem, 1000);
    loop();

    if (score >= 5) {
        text = "Yum! The insects I just ate are mostly very toxic, that’s where I got my coloring from a long, long time ago. Oh and also many species of frogs from my family, Dendrobatidae, are highly toxic themselves because of their diet."; 
    } else if (score >= 10) {
        text = "The chemicals that me and my fellow frogs produce are called alkaloids and they are secreted from my skin. These alkaloids can be used as muscle relaxants, heart stimulants, appetite suppressants and they can also kill people!";
    } else if (score >= 15) {
        text = "I am called a Poison dart frog because the aboriginal South Americans used my toxins to poison the tips of their darts. It made hunting prey a lot easier.";
    } else if (score >= 20) {
        text = "I look cute and welcoming, however I am quite the beast. Both males and females in our family fight for the attention of the other sex. And even after mating, the females try to scare away other females from their mate, as they want him to only look after their own children.";
    } else if (score >= 25) {
        text = "But I was a beast as a small tadpole as well. In order to grow big and live longer than the usual one to three years, I had to eat my siblings. Well, not all of them… But they tasted pretty good!";
    } else if (score >= 30) {
        text = "Thanks for the help, human. I am full and I would like to dip my feet in some water.";
        cleanUp();
        nextLevel();
    }
}
 