//w sali 3 hp
let debugMode = true;

let scoreModifier = 1;

const gameState = {
    play: false,
    hardmode: false,
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

    atestAudio = new Audio('testAudio.mp3');
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
    maxHp: 100,
    bulletFireSpeed: 20,
    mineFireSpeed: 20,
    bulletDelay: 0,
    mineDelay: 0,
    bullets: [],
    mines: [],
    recentlyHit: false
};

const base = {
    x: canvas.width/2 -50,
    y: canvas.height/2 -50,
    width: 100,
    height: 100,
    maxHp: 200,
    hp: 200,
    alive: true,
    recentlyHit: false
}





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

    if(e.key == "v" &&debugMode){
        atestAudio.play();
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

let maxShooter = 3;
let spawnrateShooter = 400;
let shooterDiffi = 2;

function update(timestamp) {
    //obliczanie czasu od ostatniej klatki. Jeżeli gra będzie wolniej/szybciej updatować to "silnik" nie będzie działał szybciej/wolniej
    currFrame++;
    deltaTime = (timestamp - lastTimestamp) / fps;
    lastTimestamp = timestamp;
    
    
    MoveShip();
    if(gameState.play == true){
        if(ship.bulletDelay != 0){
            ship.bulletDelay--;
        }
        if(ship.mineDelay != 0){
            ship.mineDelay--;
        }
        DrawBase();
        DrawShip();
        DrawBullets();
        DrawShooter();
        DrawMines();
        DrawRocks();
        DrawCrosshair();
        DrawScore(0);
        DrawHearts();


        checkLives();

        if(!gameState.pause){
            if(currFrame%spawnrateRocks == 0 && rocks.length < maxRocks){
                SpawnWave(getRandomInt(rocksDiffi), "rock");
            }
            if(currFrame%spawnrateShooter == 0 && shooters.length < maxShooter){
                SpawnWave(getRandomInt(shooterDiffi), "shooter");
            }
        }

    }

    
    if(debugMode){
        DrawDebugInfo();
    }

    setTimeout(() => {
        ctx.clearRect(0, 0, can.width, can.height);
        if(gameState.hardmode){
            ctx.fillStyle = "rgb(50, 10, 10)";
        }else{
            ctx.fillStyle = "rgb(10, 10, 10)";
        }
        ctx.fillRect(0, 0, can.width, can.height);
        requestAnimationFrame(update);
    }, fps);

}

let heartOffset = 120
function DrawHearts(){
    ctx.fillStyle = 'white';
    ctx.font = "80px Sans";

    for(let i = 1; i < ship.lives + 1; ++i){
        ctx.fillText("❤️",can.width - heartOffset *i,80);
    }
}

function DrawScore(delta){
    
    if(gameState.hardmode){
        scoreModifier = 0.5;
    }
    
    
    if(delta > 0){
        ship.score += (delta * scoreModifier);
    }else{
        ship.score += delta;
    }

    if(ship.score < 0){
        ship.score = 0;    
    }
    
    
    
    ctx.fillStyle = 'white';
    ctx.font = "80px Sans";
    ctx.fillText("SCORE: " + parseInt(ship.score),20,80);
}

function RestartGame(){
    ship.x = can.width/2;
    ship.y = can.height/2;
    ship.bullets = [];
    ship.mines = [];
    rocks = [];
    shooters = [];
    base.hp = 200;
    base.alive = true;
    ship.hp = 100;
    ship.lives = 3;
    ship.score = 0;
    gameState.play = true;
    gameState.over = false;
    gameState.pause = false;
    gameState.hardmode = false;
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
let shipStatusDamageStart = 0;
function DrawShip(){
    DrawHp(ship);
    

    //Pokazywanie efektu po trafieniu w statek
    //to jest absolutie głupio napisane, ale działa
    if(ship.recentlyHit == true){
        shipStatusDamageStart = 10;
        
        ship.recentlyHit = false;
    }

    if(shipStatusDamageStart != 0){
        if(currFrame%20 == 0){
            ctx.fillText("HIT!",ship.x,ship.y);
            shipStatusDamageStart--;
        }
    }


    //deklaracja zdjęcia użytego do pokazywania statku
    const shipImage = new Image();
    shipImage.src = 'ship.png';
    
    //kontrola rotacjii statku
   
    /*najpierw zmieniamy punk 0:0 canvasu na koordynaty statku, obracamy o tyle ile jest obrotu statku, 
    rysujemy statek a później odwracamy tak jak było na początku
    Bez tego to statek obracał się według punktu 0:0 więc duże kółka robił wokół lewego górnego rogu
    */
    
    ctx.translate(ship.x, ship.y)
    ctx.rotate(ToRads(ship.rotation))
    ctx.drawImage(shipImage, -ship.width/2, -ship.height/2, ship.width, ship.height);
    ctx.rotate(ToRads(-ship.rotation))
    ctx.translate(-ship.x, -ship.y)
}

function DrawDebugInfo(){
    //Wyświetl info do debugowania
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
    ctx.fillText("bHp: " + base.hp, 10, 500)
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
    ctx.fillText("hard: " + gameState.hardmode, 1600, 200)
    ctx.fillText("Rdiffi: " + rocksDiffi, 1900, 50)
    ctx.fillText("RspawnRate: " + spawnrateRocks, 1901, 100)
    
    ctx.fillText("DEBUG MODE ON| press: e = spawnRock, r = restart, q = spawnWave, x = toggleDebug", 10, 1400)
    ctx.fillText("f = spawnShooter, z = damageBase, v = audioTest", 10, 1450)
}

function MoveShip(){
    if(!gameState.pause){ //Obracaj statek za pomocą matematyki której ledwo rozumiem i obsługuj poruszanie się statku
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
            FireBullet("ship");
        }
        if(mouse.rightClick){
            FireMine();
        }
    }


    //Dałem to tutaj, ponieważ funkcja MoveShip jest wykonywana w update i mogę przytrzymać klawisz jak chce
    if(debugMode && keys["e"] && currFrame%10 == 0){
        SpawnEnemy(500, 500, "rock")
    }
    if(debugMode && keys["f"] && currFrame%10 == 0){
        SpawnEnemy(500, 500, "shooter")
    }
    if(debugMode && keys["z"] && currFrame%10 == 0){
        base.hp -= 10;
    }
    if(debugMode && keys["q"] && currFrame%10 == 0){
        SpawnWave(1)
    }
    if(debugMode && keys["r"]){
        RestartGame();
    }

    

    //obsługa akceleracjii. Jest mnożona przez 0.9, żeby spadała z czasem
    ship.xAcc *= 0.9;
    ship.yAcc *= 0.9;
    ship.x += ship.xAcc;
    ship.y += ship.yAcc;


    //jeżeli statek jest poza canvasem, to teleportuj na drugą stronę tak jak w asteoridach
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


function FireBullet(type, obj, directionOverrideX, directionOverrideY) { //funkcja od tworzenia pocisków
    if(type=="ship" && ship.bulletDelay == 0){
        const bullet = {
            x: ship.x ,
            y: ship.y ,
            speed: 10,
            width: 20,
            height: 20,
            rotation: ship.rotation,
            decayTime: 100, //czas w klatkach po którym zniknie
            maxDecay: 100, //czas w klatkach po którym zniknie(stała)
            firstFrame: true,
            alive: true,
            dx: 0,
            dy: 0,
            distance: 0,
            speedX: 0,
            speedY: 0,
            dmg: 25,
            spawnedFromMine: false
        };
        ship.bullets.push(bullet);
        ship.bulletDelay = ship.bulletFireSpeed; //dodanie opóźnienia, żeby statek nie strzelał co klatkę
    }else if(type == "shooter" && obj.bulletDelay == 0){
        const bullet = {
            x: obj.x + obj.width/2,
            y: obj.y + obj.height/2,
            speed: 5,
            width: 25,
            height: 25,
            decayTime: 100,
            maxDecay: 0,
            firstFrame: true,
            alive: true,
            dx: 0,
            dy: 0,
            distance: 0,
            speedX: 0,
            speedY: 0,
            dmg: 10
        };
        obj.bullets.push(bullet);
        obj.bulletDelay = obj.bulletFireSpeed;
    }else if(type == "mine"){
        const bullet = {
            x: obj.x + obj.width/2,
            y: obj.y + obj.height/2,
            speed: 10,
            width: 15,
            height: 15,
            decayTime: 150,
            maxDecay: 150,
            firstFrame: true,
            alive: true,
            dx: directionOverrideX,
            dy: directionOverrideY,
            distance: 0,
            speedX: 0,
            speedY: 0,
            dmg: 10,
            spawnedFromMine: true
        };
        ship.bullets.push(bullet);
    }
}

function FireMine() {
    if(ship.mineDelay == 0 && ship.mines.length < 5){
        const mine = {
            x: ship.x ,
            y: ship.y ,
            width: 40,
            height: 40,
            decayTime: 500,
            maxDecay: 500,
            firstFrame: true,
            alive: true,
            exploded: false,
            dmg: 100
        };
        ship.mines.push(mine);
        ship.mineDelay = ship.mineFireSpeed;
    }
}

//tutaj zadeklaorwane są koordynaty rogów ekranu. Stąd pojawiają się asteoridy i inne
const tL = {x:0, y: 0};
const tR = {x:can.width, y:0};
const bL = {x: 0, y: can.height};
const bR = {x:can.width, y:can.height};
function SpawnWave(numEnemy, type){    
    if(type == "rock"){
        for(let i = 0; i < numEnemy; ++i){ //losuje się z jakiego miejsca mają się pojawić rzeczy
            let random = getRandomInt(4)
        
            if(random == 0){
                SpawnEnemy(tL.x, tL.y, type)
            }else if(random == 1){
                SpawnEnemy(tR.x, tR.y, type)
            }else if(random == 2){
                SpawnEnemy(bL.x, bL.y, type)
            }else if(random == 3){
                SpawnEnemy(bR.x, bR.y, type)
            }
        }
    }

    if(type == "shooter"){
        for(let i = 0; i < numEnemy; ++i){
            let random = getRandomInt(4)
        
            if(random == 0){
                SpawnEnemy(tL.x, tL.y, type)
            }else if(random == 1){
                SpawnEnemy(tR.x, tR.y, type)
            }else if(random == 2){
                SpawnEnemy(bL.x, bL.y, type)
            }else if(random == 3){
                SpawnEnemy(bR.x, bR.y, type)
            }
        }
    }
}

let rocks = [];
let shooters = [];
function SpawnEnemy(xPos, yPos, type, xVel, yVel){
    if(type == "rock"){
        const rock = {
            x: xPos,
            y: yPos,
            speed: 1,
            width: 90,
            height: 90,
            sprite: 0,
            maxHp: 100, //stała ilości zdrowia
            hp: 100, //zmienna ilości zdrowia
            firstFrame: true,
            alive: true,
            dx: 0, //różnica dystansu od bazy w osi x
            dy: 0, //różnica dystansu od bazy w osi y
            distance: 0, //dystans od bazy w pierwszej klatce życia asteoridy
            speedX: 0, 
            speedY: 0,
        }
        rocks.push(rock)
    }else if(type == "shooter"){
        const shooter = {
            x: xPos,
            y: yPos,
            speed: 0.4,
            width: 120,
            height: 120,
            sprite: 0,
            maxHp: 200,
            hp: 200,
            firstFrame: true,
            alive: true,
            dx: 0,
            dy: 0,
            distance: 0,
            speedX: 0,
            speedY: 0,
            followDistance: 500 * scale, //maxymalny dystans podążania za graczem
            bullets: [], 
            bulletDmg: 10,
            bulletFireSpeed: 100,
            bulletDelay: 0,
            tag: "enemy",
            bulletSprite: 0, //czego użyć do pokazania pocisku
        }
        shooters.push(shooter)
    }
}

function DrawShooter(){
    shooters.forEach(shooter =>{
        if(shooter.alive){
            if(shooter.firstFrame){
                
                shooter.firstFrame = false;
            }

            shooter.dx = ship.x - shooter.x; //kalkulacje związanie z obliczaniem położenia shootera względem statku
            shooter.dy = ship.y - shooter.y;
            shooter.distance = Math.sqrt(shooter.dx * shooter.dx + shooter.dy * shooter.dy);
           
            if(shooter.distance > shooter.followDistance){
                shooter.speedX = (shooter.dx / shooter.distance) * shooter.speed; 
                shooter.speedY = (shooter.dy / shooter.distance) * shooter.speed; //dodaj prędkość w kierunku gracza
            }else{
                shooter.speedX = 0;
                shooter.speedY = 0;
                FireBullet("shooter", shooter); //stań w miejscu i strzelaj do gracza
                
            }
            DrawEnemyBullets(shooter);
            

            if(!gameState.pause){
                shooter.x += shooter.speedX *deltaTime;
                shooter.y += shooter.speedY *deltaTime;

                if(shooter.bulletDelay != 0){
                    shooter.bulletDelay--;
                }
                //zmień położenie jeżeli nie ma pauzy i przeładuj
            }
            
            shooter.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, ship)) {
                    ship.hp -= bullet.dmg;
                    shooter.bullets.splice(bulletIndex, 1); //usuń kulę, która trafiła
                    ship.recentlyHit = true;
                }
            })
        
            ship.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, shooter)) {
                    shooter.hp -= bullet.dmg;
                    ship.bullets.splice(bulletIndex, 1); //usuń kulę, która trafiła
                }
            })

            ship.mines.forEach((mine) => {
                if (Collision(mine, shooter)) {
                    shooter.hp -= mine.dmg;
                    mine.alive = false;
                }
            })
            
            if (Collision(ship, shooter)) {
                shooter.hp = 0;
                ship.hp -= 35;
                DrawScore(-10);
                ship.recentlyHit = true;
            }
            

            ctx.fillStyle = "rgb(230, 10, 10)";
            ctx.fillRect(shooter.x-2, shooter.y-2, shooter.width+4, shooter.height+4);
        
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(shooter.x, shooter.y, shooter.width, shooter.height);
        
            ctx.fillStyle = "rgb(230, 10, 10, "+shooter.hp/shooter.maxHp+")";
            ctx.fillRect(shooter.x, shooter.y, shooter.width, shooter.height);
        
            if(shooter.hp <= 0){
                shooter.alive = false;
            } 
        }
        else{
            DrawScore(50);
            shooters.splice(shooters.indexOf(shooter), 1);
        }
    })
}

let baseStatusDamageStart = 0;
function DrawBase(){
    const baseImage = new Image();
    const baseImageHit = new Image();
    baseImage.src = 'school.png';
    baseImageHit.src = "schoolHit.png";
    if(base.alive){
        DrawHp(base);
        ctx.drawImage(baseImage, base.x, base.y, base.width, base.height);
        if(base.hp <= 0){
            base.alive = false;
            aElectroErrorHeavy = new Audio('aElectroErrorHeavy.wav');
            aElectroErrorHeavy.play();
        }

        if(base.recentlyHit){
            baseStatusDamageStart = 10;
            
            base.recentlyHit = false;
        }
    
        if(baseStatusDamageStart != 0){
            if(currFrame%20 == 0){
                ctx.drawImage(baseImageHit, base.x, base.y, base.width, base.height);
                ctx.fillText("⚡‼",base.x,base.y);
                baseStatusDamageStart--;
            }
        }

    }else{
        gameState.hardmode = true;
        
    }


}

function DrawHp(obj){
    if(obj == base){
        
        //nie wiem dlaczego baza jakoś inaczej pokazuje zdrowie ale działa w taki sposób

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(obj.x -2, obj.y + 120 -2, 100 +4, 20 +4);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(obj.x -1, obj.y + 120 -1, 100 +2, 20 +2);
        
        ctx.fillStyle = "rgb(255, 10, 10)";
        ctx.fillRect(obj.x, obj.y + 120, 100* obj.hp/obj.maxHp, 20)
    }else{

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(obj.x -50 -2, obj.y + obj.height - 10 -2, 100 +4, 20 +4);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(obj.x -50 -1, obj.y + obj.height - 10 -1, 100 +2, 20 +2);

        ctx.fillStyle = "rgb(255, 10, 10)";
        ctx.fillRect(obj.x -50, obj.y + obj.height - 10, 100* obj.hp/obj.maxHp, 20);
    }
}


function DrawRocks(){
    rocks.forEach(rock => {
        if(rock.alive){
            if(rock.firstFrame){
                rock.dx = can.width/2 - rock.x + getRandomArbitrary(-400, 400);
                rock.dy = can.height/2 - rock.y + getRandomArbitrary(-400, 400);
                rock.distance = Math.sqrt(rock.dx * rock.dx + rock.dy * rock.dy);
                rock.speedX = (rock.dx / rock.distance) * rock.speed * getRandomArbitrary(-2.5, 2.5);
                rock.speedY = (rock.dy / rock.distance) * rock.speed * getRandomArbitrary(-2.5, 2.5);
                rock.firstFrame = false;

                //w pierwszej klatce, pojaw się i miej losowy offset kierunku żeby nie lecieć w pierwszej linii.
                //miej także losową prędkość
            }

            if(!gameState.pause){
                rock.x += rock.speedX *deltaTime;
                rock.y += rock.speedY *deltaTime;
            }


            ship.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, rock)) {
                    rock.hp -= bullet.dmg;
                    ship.bullets.splice(bulletIndex, 1);
                }
            })
            ship.mines.forEach((mine, mineIndex) => {
                if (Collision(mine, rock)) {
                    rock.hp -= mine.dmg;
                    mine.alive = false;
                }
            })
            
            if (Collision(ship, rock)) {
                rock.hp = 0;
                ship.hp -= 20;
                DrawScore(-10);
                ship.recentlyHit = true;
            }

            if (Collision(base, rock) && !(gameState.hardmode)) {
                rock.hp = 0;
                base.hp -= 20;
                DrawScore(-20);
                base.recentlyHit = true;
                aElectroError = new Audio('aElectroError.wav');
                aElectroError.play();
            }

            //teleportuj na drugą stronę jak wyjdziesz poza granice jak w mario
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
            DrawScore(10);
            rocks.splice(rocks.indexOf(rock), 1);
        }
    })
}

function DrawEnemyBullets(obj){
    obj.bullets.forEach(bullet => {
        if(bullet.alive){
            if(bullet.firstFrame){
                bullet.maxDecay = bullet.decayTime;

                bullet.dx = ship.x - bullet.x - bullet.width/2;
                bullet.dy = ship.y - bullet.y - bullet.height/2;
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


            
            ctx.fillStyle = "rgb(134, 121, 121)";
            ctx.fillRect(bullet.x-2, bullet.y-2, bullet.width+4, bullet.height+4);



            if(currFrame%40 == 0){
                obj.bulletSprite = obj.bulletSprite == 1 ? 0 : 1;
                //jeżeli sprite pocisku jest równy 1: ustaw na 0 i jeżeli 0: ustaw na 1
            }
            
            if(obj.bulletSprite == 0){
                ctx.fillStyle = "rgb(255, 10, 10, "+bullet.decayTime/bullet.maxDecay+")";
                
            }else{
                ctx.fillStyle = "rgb(255, 255, 10, "+bullet.decayTime/bullet.maxDecay+")";
                
            }
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            if(bullet.decayTime < 0){
                bullet.alive = false;
                obj.bullets.shift(); //żeby usuwało zabite kule
            }
        }
    });
}

function DrawBullets(){
    ship.bullets.forEach(bullet => {
        if(bullet.alive){
            if(bullet.firstFrame){
                if(!bullet.spawnedFromMine){
                    bullet.x -= bullet.width/2;
                    bullet.y -= bullet.height/2 ;
    
                    bullet.dx = mouse.x - bullet.x  - bullet.width/2;
                    bullet.dy = mouse.y - bullet.y - bullet.height/2 ;
                    bullet.distance = Math.sqrt(bullet.dx * bullet.dx + bullet.dy * bullet.dy);
                    bullet.speedX = (bullet.dx / bullet.distance) * bullet.speed;
                    bullet.speedY = (bullet.dy / bullet.distance) * bullet.speed;
                    
                }else{
                    bullet.distance = Math.sqrt(bullet.dx * bullet.dx + bullet.dy * bullet.dy);
                    bullet.speedX = (bullet.dx / bullet.distance) * bullet.speed * getRandomArbitrary(-1.2, 1.2);
                    bullet.speedY = (bullet.dy / bullet.distance) * bullet.speed * getRandomArbitrary(-1.2, 1.2);
                }


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
            if(bullet.spawnedFromMine){
                ctx.fillStyle = "rgb(255, 150, 0, "+bullet.decayTime/bullet.maxDecay+")";
            }
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            if(bullet.decayTime < 0){
                bullet.alive = false;
                ship.bullets.shift(); //żeby usuwało kule które już umarły ze starości
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
            
            mine.alive = mine.decayTime < 0 ? false : true;
            
        }else{

            //to jest absolutne spaghetti, ale działa
            //pojaw pociski od "wybuchu" lewo, prawo, góra, dół
            FireBullet("mine", mine, 0, 1);
            FireBullet("mine", mine, 1, 0);
            FireBullet("mine", mine, 0, -1);
            FireBullet("mine", mine, -1, 0);
            
            //pojaw pociski od "wybuchu" na ukosy wszystkie
            FireBullet("mine", mine, 1, 1);
            FireBullet("mine", mine, -1, 1);
            FireBullet("mine", mine, 1, -1);
            FireBullet("mine", mine, -1, -1);
            
            aBoom = new Audio('aBoom.wav');
            aBoom.play();
            
            if(mine.decayTime < 0){
                ship.mines.shift(); 
            }

            ship.mines.splice(ship.mines.indexOf(mine), 1)
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
