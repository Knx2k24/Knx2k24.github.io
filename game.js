let debugMode = true;

const gameState = {
    play: false,
    over: false,
    pause: false
}
//Iniclaizacjia elementów
const can = document.getElementById("canvas");
const ctx = can.getContext("2d");

//Iniclalizacja stylów dla canvasu
let cWidth = 1200;
let cHeight = 800;

let scale = 2;
can.style.width = cWidth + 'px';
can.style.height = cHeight + 'px';
can.style.cursor = "none";
can.width = cWidth * scale;
can.height = cHeight * scale;
can.style.border = "1px black solid";

//Sprawdzenie czy canvas się wczytał
if(can){
    console.log("Canvas wczytany")
}else{
    alert("Element Canvas nie jest wczytany.")
}

//Funkcja, która się wykona po wczytaniu JSa
function OnLoad(){
    requestAnimationFrame(update);
    gameState.play = true;
}


//zdefiniowanie statku
const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    rotation: 0,
    xAcc: 0,
    yAcc: 0,
    speed: 1,
    width: 50,
    height: 50,
    sprite: 0,
    score: 0,
    lives: 3,
    hp: 100,
    bulletFireSpeed: 20,
    mineFireSpeed: 20,
    bulletDelay: 0,
    mineDelay: 0,
    bullets: [],
    mines: []
};




//iniclalizacja zmiennych odpowiedzialnych za kontrolę FPS i delty
const fps = 1000 / 120;
let currFrame = 0;
let deltaTime, lastTimestamp;

//nasłuch na klawisze + myszka
const keys = [];
window.addEventListener('keydown', e => {
    keys[e.key] = true;

    if(e.key == "Escape"){
        gameState.pause = !gameState.pause;
    }

    if(e.key == "x"){
        debugMode = !debugMode;
    }
});
window.addEventListener('keyup', e => {
    keys[e.key] = false;
});
const mouse = {
    x: 0,
    y: 0,
    rotation: 0,
    height: 50,
    width: 50,
    leftClick: false,
    rightClick: false
}
canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect(); 
    mouse.x = Math.round((e.clientX - cRect.left)*scale);  
    mouse.y = Math.round((e.clientY - cRect.top)*scale);   
});

canvas.addEventListener("mousedown", function(e){
    console.log(e)
    if(e.buttons == 1){
        mouse.leftClick = true;
    }
    if(e.buttons == 2){
        mouse.rightClick = true;
    }
});
canvas.addEventListener("mouseup", function(){
    mouse.leftClick = false;
    mouse.rightClick = false;
});


let maxRocks = 12;
let spawnrateRocks = 200;
let rocksDiffi = 5;
function update(timestamp) {
    //obliczanie czasu od ostatniej klatki. Jeżeli gra będzie wolniej/szybciej updatować to "silnik" nie będzie działał szybciej/wolniej
    currFrame++;
    deltaTime = (timestamp - lastTimestamp) / fps;
    lastTimestamp = timestamp;
    
    if(ship.bulletDelay != 0){
        ship.bulletDelay--;
    }
    if(ship.mineDelay != 0){
        ship.mineDelay--;
    }
    
    MoveShip();
    if(gameState.play == true){
        DrawShip();
        DrawBullets();
        DrawMines();
        DrawRocks();
        DrawCrosshair();
        
        if(currFrame%spawnrateRocks == 0 && rocks.length < maxRocks){
            SpawnWave(getRandomInt(rocksDiffi));
        }

    }

    
    if(debugMode){
        DrawDebugInfo();
    }

    setTimeout(() => {
        ctx.clearRect(0, 0, can.width, can.height);
        ctx.fillStyle = "rgb(10, 10, 10)";
        ctx.fillRect(0, 0, can.width, can.height);
        requestAnimationFrame(update);
    }, fps);

}

function RestartGame(){
    ship.x = can.width/2;
    ship.y = can.height/2;
    ship.bullets = [];
    ship.mines = [];
    rocks = [];
    gameState.play = true;
    gameState.over = false;
    gameState.pause = false;
    ship.hp = 100;
    ship.lives = 3;
    ship.score = 0;
}


function checkLives(){
    if(ship.hp <= 0){
        ship.lives--;
        ship.hp = 100;
    }

    if(ship.lives == 0){
        gameState.play = false;
        gameState.over = true;
    }
}

function DrawCrosshair(){
    const crosshairImage = new Image();
    crosshairImage.src = 'crosshair.png';
    ctx.drawImage(crosshairImage, mouse.x -(mouse.width/2), mouse.y -(mouse.height/2), 50, 50);
}

let XOffset, YOffset;
function DrawShip(){
    const shipImage = new Image();
    shipImage.src = 'ship.png';
    
    //kontrola rotacjii statku
   
    //najpierw zmieniamy punk 0:0 canvasu, obracamy o tyle ile jest obrotu statku, rysujemy statek a później odwracamy tak jak było
    
    ctx.translate(ship.x, ship.y)
    ctx.rotate(ToRads(ship.rotation))
    ctx.drawImage(shipImage, -ship.width/2, -ship.height/2, ship.width, ship.height);
    ctx.rotate(ToRads(-ship.rotation))
    ctx.translate(-ship.x, -ship.y)
}

function DrawDebugInfo(){
    ctx.fillStyle = 'gray';
    ctx.font = "60px Arial";
    ctx.fillText("deltaTime: " + deltaTime.toFixed(4),10,50);
    ctx.fillText("currFrame: " + currFrame,10,100);
    ctx.fillText("setRefresh: " + fps.toFixed(4),10,150);
    ctx.fillText("shipRotation: " + ship.rotation.toFixed(4),10,250);
    ctx.fillText("sX: " + ship.x.toFixed(4),10,300);
    ctx.fillText("sY: " + ship.y.toFixed(4),10,350);
    ctx.fillText("sHP: " + ship.hp, 10, 400)
    ctx.fillText("sLiv: " + ship.lives, 10, 450)
    ctx.fillText("mX: " + mouse.x,800,50);
    ctx.fillText("mY: " + mouse.y,800,100);
    ctx.fillText("lClick: " + mouse.leftClick,1200,50);
    ctx.fillText("rClick: " + mouse.rightClick,1200,100);
    ctx.fillText("bCount: " + ship.bullets.length, 800, 200)
    ctx.fillText("mCount: " + ship.mines.length, 800, 250)
    ctx.fillText("rCount: " + rocks.length, 800, 300)
    ctx.fillText("play: " + gameState.play, 1600, 50)
    ctx.fillText("over: " + gameState.over, 1600, 100)
    ctx.fillText("pause: " + gameState.pause, 1600, 150)
    ctx.fillText("Rdiffi: " + rocksDiffi, 1900, 50)
    ctx.fillText("RspawnRate: " + spawnrateRocks, 1901, 100)
    
    ctx.fillText("DEBUG MODE ON| press: e = spawnRock, r = restart, q = spawnWave, x = toggleDebug", 10, 1400)
}

function MoveShip(){
    if(!gameState.pause){
        ship.rotation = ToDeg(Math.atan2(mouse.x - ship.x, - (mouse.y - ship.y)));
        if(keys["ArrowLeft"] || keys["a"]){
            ship.xAcc += -ship.speed * deltaTime;
        }
        if(keys["ArrowRight"] || keys["d"]){
            ship.xAcc += ship.speed * deltaTime;
        }
        if(keys["ArrowUp"]|| keys["w"]){
            ship.yAcc += -ship.speed * deltaTime;
        }
        if(keys["ArrowDown"]|| keys["s"]){
            ship.yAcc += ship.speed * deltaTime;
        }

        if(mouse.leftClick){
            FireBullet();
        }
        if(mouse.rightClick){
            FireMine();
        }
    }

    if(debugMode && keys["e"] && currFrame%10 == 0){
        SpawnEnemy(500, 500, "rock")
    }
    if(debugMode && keys["q"] && currFrame%10 == 0){
        SpawnWave(1)
    }
    if(debugMode && keys["r"]){
        RestartGame();
    }

    


    ship.xAcc *= 0.9;
    ship.yAcc *= 0.9;
    ship.x += ship.xAcc;
    ship.y += ship.yAcc;

    if(ship.x > can.width){
        ship.x = 0
    }
    if(ship.y > can.height){
        ship.y = 0
    }
    if(ship.x < 0){
        ship.x = can.width;
    }
    if(ship.y < 0){
        ship.y = can.height;
    }
}

function FireBullet() {
    if(ship.bulletDelay == 0){
        const bullet = {
            x: ship.x ,
            y: ship.y ,
            speed: 10,
            width: 20,
            height: 20,
            rotation: ship.rotation,
            decayTime: 100,
            maxDecay: 0,
            firstFrame: true,
            alive: true,
            dx: 0,
            dy: 0,
            distance: 0,
            speedX: 0,
            speedY: 0,
            dmg: 25
        };
        ship.bullets.push(bullet);
        ship.bulletDelay = ship.bulletFireSpeed;
    }
}

function FireMine() {
    if(ship.mineDelay == 0){
        const mine = {
            x: ship.x ,
            y: ship.y ,
            width: 40,
            height: 40,
            decayTime: 500,
            maxDecay: 0,
            firstFrame: true,
            alive: true,
            dmg: 100
        };
        ship.mines.push(mine);
        ship.mineDelay = ship.mineFireSpeed;
    }
}


const tL = {x:0, y: 0};
const tR = {x:can.width, y:0};
const bL = {x: 0, y: can.height};
const bR = {x:can.width, y:can.height};
function SpawnWave(numEnemy){
    
    for(let i = 0; i < numEnemy; ++i){
        let random = getRandomInt(4)
        console.log(random)
        if(random == 0){
            SpawnEnemy(tL.x, tL.y, "rock")
        }else if(random == 1){
            SpawnEnemy(tR.x, tR.y, "rock")
        }else if(random == 2){
            SpawnEnemy(bL.x, bL.y, "rock")
        }else if(random == 3){
            SpawnEnemy(bR.x, bR.y, "rock")
        }
    }
}

let rocks = [];
function SpawnEnemy(xPos, yPos, type, xVel, yVel){
    if(type == "rock"){
        const rock = {
            x: xPos,
            y: yPos,
            speed: 1,
            width: 90,
            height: 90,
            sprite: 0,
            maxHp: 100,
            hp: 100,
            firstFrame: true,
            alive: true,
            dx: 0,
            dy: 0,
            distance: 0,
            speedX: 0,
            speedY: 0,
        }
        rocks.push(rock)
    }
}

function DrawRocks(){
    rocks.forEach(rock => {
        if(rock.alive){
            if(rock.firstFrame){
                rock.dx = can.width/2 - rock.x + getRandomArbitrary(-400, 400);
                rock.dy = can.height/2 - rock.y + getRandomArbitrary(-400, 400);
                rock.distance = Math.sqrt(rock.dx * rock.dx + rock.dy * rock.dy);
                rock.speedX = (rock.dx / rock.distance) * rock.speed * getRandomArbitrary(-1.5, -1.5);
                rock.speedY = (rock.dy / rock.distance) * rock.speed * getRandomArbitrary(-1.5, -1.5);
                rock.firstFrame = false;
            }

            if(!gameState.pause){
                rock.x += rock.speedX *deltaTime;
                rock.y += rock.speedY *deltaTime;
            }


            ship.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, rock)) {
                    rock.hp -= bullet.dmg;
                    ship.bullets.splice(bulletIndex, 1);
                    console.log(rock.hp)
                }
            })
            ship.mines.forEach((mine, mineIndex) => {
                if (Collision(mine, rock)) {
                    rock.hp -= mine.dmg;
                    ship.mines.splice(mineIndex, 1);
                    console.log(rock.hp)
                }
            })

            if (Collision(ship, rock)) {
                rock.hp = 0;
                ship.hp -= 20;
                checkLives();
                console.log(rock.hp)
            }

            if(rock.x > can.width){
                rock.x = 0
            }
            if(rock.y > can.height){
                rock.y = 0
            }
            if(rock.x < 0){
                rock.x = can.width;
            }
            if(rock.y < 0){
                rock.y = can.height;
            }


            ctx.fillStyle = "rgb(134, 121, 121)";
            ctx.fillRect(rock.x-2, rock.y-2, rock.width+4, rock.height+4);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(rock.x, rock.y, rock.width, rock.height);

            ctx.fillStyle = "rgb(134, 121, 121, "+rock.hp/rock.maxHp+")";
            ctx.fillRect(rock.x, rock.y, rock.width, rock.height);
            if(rock.hp <= 0){
                rock.alive = false;
            }
        }else{
            rocks.splice(rocks.indexOf(rock), 1);
        }
    })
}

function DrawBullets(){
    ship.bullets.forEach(bullet => {
        if(bullet.alive){
            if(bullet.firstFrame){
                bullet.maxDecay = bullet.decayTime;

                bullet.dx = mouse.x - bullet.x;
                bullet.dy = mouse.y - bullet.y;
                bullet.distance = Math.sqrt(bullet.dx * bullet.dx + bullet.dy * bullet.dy);
                bullet.speedX = (bullet.dx / bullet.distance) * bullet.speed;
                bullet.speedY = (bullet.dy / bullet.distance) * bullet.speed;
                bullet.firstFrame = false;
            }

            if(!gameState.pause){
                bullet.decayTime--;
                bullet.x += bullet.speedX *deltaTime;
                bullet.y += bullet.speedY *deltaTime;
            }

            if(bullet.x > can.width){
                bullet.x = 0
            }
            if(bullet.y > can.height){
                bullet.y = 0
            }
            if(bullet.x < 0){
                bullet.x = can.width;
            }
            if(bullet.y < 0){
                bullet.y = can.height;
            }

            ctx.fillStyle = "rgb(255, 255, 10, "+bullet.decayTime/bullet.maxDecay+")";
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            if(bullet.decayTime < 0){
                bullet.alive = false;
                ship.bullets.shift(); //żeby usuwało zabite kule
            }
        }
    });
}

function DrawMines(){
    ship.mines.forEach(mine => {
        if(mine.alive){
            if(mine.firstFrame){
                mine.maxDecay = mine.decayTime;
                mine.firstFrame = false;
            }
            ctx.fillStyle = "rgb(10, 255, 10, "+mine.decayTime/mine.maxDecay+")";
            ctx.fillRect(mine.x, mine.y, mine.width, mine.height);
            
            
            if(!gameState.pause){
                mine.decayTime--;
            }
            
            if(mine.decayTime < 0){
                mine.alive = false;
                ship.mines.shift(); //żeby usuwało zabite kule
            }
        }
    });
}

function Collision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function ToRads(degrees){
    return degrees * Math.PI*2.0/360.0;
}
function ToDeg(radians){
    return radians * (180/Math.PI);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
  


//Dodanie nasłuchu na wczytanie JSa 
window.addEventListener("load", OnLoad)