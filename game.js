//mines better
let debugMode = false;
let debugModeAct = 0;
let allowBulletsFromExplosions = true;
let allowShadows = true;

let scoreModifier = 1;

const gameState = {
    play: false,
    hardmode: false,
    nameInput: false,
    over: false,
    pause: false,
    menu: false,
    globalDiff: 1,
    unpausedCounter: 0,
}
//Iniclaizacjia elementów
const can = document.getElementById("canvas" , { alpha: false });
const ctx = can.getContext("2d");

//Iniclalizacja stylów dla canvasu
let cWidth = 720;
let cHeight = 480;


let scale = 3;
can.style.width = cWidth*1.5 + 'px';
can.style.height = cHeight*1.5 + 'px';
can.style.cursor = "none";
can.width = cWidth * scale;
can.height = cHeight * scale;
can.style.border = "1px black solid";
can.style.position = "absolute";
can.style.zIndex = "0";




//Sprawdzenie czy canvas się wczytał
if(can){
    console.log("Canvas wczytany")
}else{
    alert("Element Canvas nie jest wczytany.")
}

//Funkcja, która się wykona po wczytaniu JSa
function OnLoad(){
    requestAnimationFrame(update);
    gameState.play = false;
    debugMode = false;
    
    RestartGame();

}

var topFont = new FontFace('topFont', 'url(fonts/MinecraftTen-VGORe.ttf)');
document.fonts.add(topFont);
function DrawMenu(){
    ctx.textAlign = "center";
    
    let textTop = {t: "TZN", d: "DEFENDERS"};
    let textTopObj = {t: ctx.measureText(textTop.t), d: ctx.measureText(textTop.d)};
    let textTopHeight = 200 + 4*Math.sin(currFrame*0.05); 
    
    let textTopColor = Math.abs(Math.tan(currFrame*0.005)*50);
    
    ctx.fillStyle = "rgba("+textTopColor+", 80, 80, 1)";
    ctx.font = "240px topFont";
    ctx.fillText(textTop.t, can.width/2, textTopHeight);
    ctx.fillStyle = "rgba(0, 0, 120, 1)";
    ctx.font = "180px topFont";
    ctx.fillText(textTop.d, can.width/2, textTopHeight + 200);
    
    
    let textMid = "Graj";
    let textMidHeight = can.height/2;
    
    ctx.fillStyle = 'white';
    ctx.font = "80px topFont";
    ctx.fillText(textMid, can.width/2, textMidHeight);
    ctx.font = "30px topFont";
    ctx.fillText("( SPACE )", can.width/2, textMidHeight+70);
    
    ctx.font = "80px topFont";
    //▶▷
    let textPointer = {f:"▶", e:"▷"};
    let textPointerObj = {f: ctx.measureText(textPointer.f), e: ctx.measureText(textPointer.e)};
    let textPointerHeight = textMidHeight;
    
    
    //ctx.fillStyle = "rgba(80 10 0/"+Math.abs(Math.sin(currFrame*0.005))*100+"%)";
    ctx.fillStyle = "rgba(80, 80, 80,"+Math.abs(Math.sin(currFrame*0.05))+")";
    ctx.font = "60px topFont";
    ctx.fillText(textPointer.f, can.width/2 - 2*textPointerObj.f.width, textPointerHeight -5);


    ctx.fillStyle = "rgba(120, 120, 120, "+Math.abs(Math.cos(currFrame*0.05))+")";
    ctx.fillText(textPointer.e, can.width/2 - 2*textPointerObj.e.width, textPointerHeight -5);
    

    let textCred = {h: "Autor:", k: "", r: "Kacper Dyduch"};
    
    
    let textCredHeight = {h: can.height - 200, k: can.height - 40, r: can.height - 120};
    
    ctx.textAlign = "left";
    ctx.font = "50px Georgia";
    ctx.fillStyle = 'rgb(230, 230, 230)';
    
    ctx.letterSpacing = "4px";
    ctx.fillText(textCred.h, 20, textCredHeight.h);    
    ctx.fillText(textCred.r, 20, textCredHeight.r);
    ctx.fillText(textCred.k, 20, textCredHeight.k);
    
    ctx.letterSpacing = "0px";
    

    let TextTut = {w: "Poruszanie:   W↑   A←   S↓   D→", s: "Lewy przycisk myszy: strzal", m: "Spacja: mina"};
    let TextTutHeight = {w: 50, s: 100, m: 150};

    ctx.textAlign = "middle";
    ctx.font = "50px topFont";
    ctx.fillStyle = "gray";

    ctx.fillText(TextTut.w, 5, TextTutHeight.w);    
    ctx.fillText(TextTut.s, 5, TextTutHeight.s);
    ctx.fillText(TextTut.m, 5, TextTutHeight.m);



    
}

let inputText = ['_', '_', '_', '_'];
function InputName(){
    ctx.textAlign = "center";
    
    let textTop = {t: "GAME", d: "OVER"};
    let textTopObj = {t: ctx.measureText(textTop.t), d: ctx.measureText(textTop.d)};
    let textTopHeight = 200 + 4*Math.sin(currFrame*0.05); 
    
    let textTopColor = Math.abs(Math.sin(currFrame*0.01)*50);
    
    ctx.fillStyle = "rgba("+textTopColor+", 0, 80, 1)";
    ctx.font = "240px topFont";
    ctx.fillText(textTop.t, can.width/2, textTopHeight);
    ctx.fillStyle = "rgba("+textTopColor+", 0, 80, 1)";
    ctx.font = "180px topFont";
    ctx.fillText(textTop.d, can.width/2, textTopHeight + 200);


    let textMidHeight = 600;
    let textMid  = "SCORE: " + ship.score;
    ctx.fillStyle = "rgba(40, 0, 160, 1)";
    ctx.font = "70px topFont";

    ctx.fillText(textMid, can.width/2, textMidHeight);

    let inputTextHeight = 900;
    
    ctx.fillStyle = "rgba(200, 200, 200, 1)";
    ctx.font = "100px topFont";

    for(i = 0; i < inputText.length; i++){        
        ctx.fillText(inputText[i], can.width/2 - 300 + i*200, inputTextHeight);
    }


    let textTipsHeight = {t: can.height - 200, m: can.height - 150, d: can.height - 100};
    let textTips  = {t: "Zapisz wynik na leaderboardzie!", m: "ENTER - zapisz", d: "ESC - nie zapisuj"};
    ctx.fillStyle = "rgba(250, 250, 250, 1)";
    ctx.font = "50px topFont";

    ctx.fillText(textTips.t, can.width/2, textTipsHeight.t);
    ctx.fillText(textTips.m, can.width/2, textTipsHeight.m);


    ctx.textAlign = "left";
}

let currentInputIndex = 0;
let truncatedNick = "";
window.addEventListener('keydown', e=>{ //Dla inputu nazwy gracza
    if(gameState.nameInput){
    let possibleCharacters = "qwertyuiopasdfghjklzxcvbnm";
    let bannedCharacters = [';', '-', ':', "/", ".", ",", "\\", "\\\\", "'", '"', "=", "+"];
    let bannedNicks = ["chuj", "cipa", "cipe", "cipy", "dupa", "pizd", "2137", "hwdp", "sex", "nigg", "jeb", "kurw", "krwa", "qrwa", "gown", "gwno", "huj", "hui", "jpld", "zjeb", "cock", "shit", "piss", "crap", "fucc", "fuck", "damn", "cunt"];

    
    if(e.key == "Enter"){
        for(let i = 0; i < inputText.length; i++){
            truncatedNick += inputText[i];
        }

        for(let i = 0; i < bannedCharacters.length; i++){
            if(truncatedNick.includes[bannedCharacters[i]]){
                alert("Niedozwolony znak znaleziony w nicku, restartuje grę");
                
                truncatedNick = "NiedozwolonyZnak";
            }
        }
        
        for(let i = 0; i < bannedNicks.length; i++){
            if(truncatedNick == bannedNicks[i]){
                alert("Niedozwolona nazwa, restartuje grę");
                
                truncatedNick = "Niedozwolona nazwa"
            }
        }


        WriteToDb(truncatedNick, ship.score, "z event listenera")
        truncatedNick = "";

        RestartGame();
        
    }else if(e.key == "Backspace"){
        if(currentInputIndex > 0){
            inputText[currentInputIndex - 1] = "_";
            currentInputIndex--;
        }
    }else{
        if(currentInputIndex < 4 && possibleCharacters.indexOf(e.key) > -1){
            inputText[currentInputIndex] = e.key;
            currentInputIndex++;
        }
    }   
    }
})



//zdefiniowanie statku
const ship = {
    x: new Number(canvas.width / 2),
    y: new Number(canvas.height / 2),
    rotation: 0,
    xAcc: 0,
    yAcc: 0,
    speed: 1,
    width: new Number(50),
    height: new Number(50),
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
    recentlyHit: false,
    hasShield: false
};

const base = {
    x: canvas.width/2 -100,
    y: canvas.height/2 -75,
    width: 200,
    height: 150,
    maxHp: 200,
    hp: 200,
    alive: true,
    recentlyHit: false,
    pickups: [],
    hasShield: false,
    alarmCounter: 0
}


function WriteToDb(_nick, _score, _notes){
    console.log("attempt to write to DB: " + _nick + " " + _score + " " + _notes)
    let _date = new Date();
    _date = _date.toDateString() +" "+ _date.toTimeString();

    if(debugMode){
        _debug = 1;
    }else{
        _debug = 0;
    }

    $.post('DBhandler.php', { nick: _nick, score: _score, date: _date, debugOn: _debug, notes: _notes}, function(result) { 
        console.log(result); 

        if(result.includes("error") || result.includes("Error") || result.includes("errno")){
            alert("Bląd połączenia z bazą danych")
        }
    });
}


//iniclalizacja zmiennych odpowiedzialnych za kontrolę FPS i delty
const fps = 1000 / 120;
let currFrame = 0;
let deltaTime, lastTimestamp;

//nasłuch na klawisze + myszka
const keys = [];
window.addEventListener('keydown', e => {
    keys[e.key] = true;

    if(e.key == " " && gameState.menu){
        BeginGame();
    }


    if(e.key == "Escape" && gameState.play){
        gameState.pause = !gameState.pause;
    }

    if(e.key == "x"){
        debugMode = !debugMode;
        debugModeAct++;
    }


    if(e.key == "`" && debugMode){
        gameState.globalDiff = 0
    }

    if(e.key == "t" && debugMode){
        DrawShield(100, 200, 20);
    }
    if(e.key == "n" && debugMode){
        WriteToDb();
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

let maxZoomer = 2;
let spawnrateZoomer = 500;
let zoomerDiffi = 2;

let maxTank = 2;
let spawnrateTank = 800;
let tankDiffi = 2;

difficultyRock = {
    max: 12,
    spawnRate: 200,
    waveSpawn: 5,
    type: "rock",
    scaling: 0.08
}

difficultyShooter = {
    max: 3,
    spawnRate: 400,
    waveSpawn: 2, 
    type: "shooter",
    scaling: 0.04
}

difficultyZoomer = {
    max: 2,
    spawnRate: 500,
    waveSpawn: 2,
    type: "zoomer",
    scaling: 0.05
}

difficultyTank = {
    max: 2,
    spawnRate: 800,
    waveSpawn: 2,
    type: "tank",
    scaling: 0.02
}



function changeDifficulty(){
   

    difficultyRock.max = difficultyRock.max > 25 ? 25 : 15 + Math.round(difficultyRock.scaling*ship.score/50);    
    difficultyRock.spawnrate = difficultyRock.spawnrate < 100 ?   100 : (200 - Math.round(difficultyRock.scaling*ship.score/50));  //max co 100 klatek   
    difficultyRock.waveSpawn = 5 + Math.round(ship.score/400);

    difficultyShooter.max = difficultyShooter.max > 8 ? 8 : 4 +  Math.round(difficultyShooter.scaling*ship.score/80);    
    difficultyShooter.spawnrate = difficultyShooter.spawnrate < 200 ?   200 : (400 - Math.round(difficultyShooter.scaling*ship.score/80));  //max co 200 klatek   
    difficultyShooter.waveSpawn = 2 + Math.round(ship.score/700);

    difficultyZoomer.max = difficultyZoomer.max > 5 ? 5:  2 + Math.round(difficultyZoomer.scaling*ship.score/60);    
    difficultyZoomer.spawnrate = difficultyShooter.spawnrate < 250 ?   250 : (500 - Math.round(difficultyZoomer.scaling*ship.score/70));  //max co 250 klatek   
    difficultyZoomer.waveSpawn = 2 + Math.round(ship.score/600);

    difficultyTank.max = difficultyTank.max > 5 ? 5 : 2 + Math.round(difficultyTank.scaling*ship.score/100);    
    difficultyTank.spawnrate = difficultyTank.spawnrate < 400 ?   400 : (800 - Math.round(difficultyTank.scaling*ship.score/90));  //max co 400 klatek   
    difficultyTank.waveSpawn = 2 + Math.round(ship.score/1000);
    
}

function update(timestamp) {

    if(gameState.play){
        $("#description").animate({
            opacity:"30%"
        }, 1000)
    }else{
        $("#description").css({
            opacity:"100%"
        })
    }




    if(gameState.hardmode){
        ctx.fillStyle = "rgb(50, 10, 10)";
    }else{
        ctx.fillStyle = "rgb(10, 10, 10)";
    }
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.fillRect(0, 0, can.width, can.height);

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

        if(base.hasShield){
            DrawShield(can.width/2+(90+Math.sin(gameState.unpausedCounter*0.05)), can.height/2, (45+Math.sin(gameState.unpausedCounter*0.05)));//ship
        }
        
        if(ship.hasShield){
            DrawShield(ship.x+(40+Math.sin(gameState.unpausedCounter*0.05)), ship.y, (20+Math.sin(gameState.unpausedCounter*0.05)));//base
        }

        DrawBase();
        DrawPickups();
        DrawShip();
        DrawBullets();
        DrawMines();
        DrawTanks();
        DrawShooter();
        DrawZoomer();
        DrawRocks();
        DrawExplosions();
        DrawCrosshair();
        DrawScore(0);
        DrawHearts();
        DrawMineAmmo();
        changeDifficulty();
        
        
        checkLives();
        
        if(!gameState.pause){
            gameState.unpausedCounter++;
            if(gameState.unpausedCounter%2000 == 0){
                gameState.globalDiff++;
            }

            
            if(gameState.unpausedCounter%difficultyRock.spawnRate == 0 && rocks.length < difficultyRock.max){
                SpawnWave(getRandomInt(difficultyRock.waveSpawn), "rock");
                console.log("attempt spawn rock" )
            }
            if(gameState.unpausedCounter%difficultyZoomer.spawnRate == 0 && zoomers.length < difficultyZoomer.max){
                SpawnWave(getRandomInt(difficultyZoomer.waveSpawn), "zoomer");
            }
            if(gameState.unpausedCounter%difficultyShooter.spawnRate == 0 && shooters.length < difficultyShooter.max){
                SpawnWave(getRandomInt(difficultyShooter.waveSpawn), "shooter");
            }
            if(gameState.unpausedCounter%difficultyTank.spawnRate == 0 && tanks.length < difficultyTank.max){
                SpawnWave(getRandomInt(difficultyTank.waveSpawn), "tank");
            }
            
        }

    }

    if(gameState.menu){
        DrawMenu();
    }
    if(gameState.nameInput){
        InputName();
    }
    
    if(debugMode){
        DrawDebugInfo();
    }

    
    requestAnimationFrame(update);
    
    
}

function DrawMineAmmo(){
    for(let i = 0; i < 5 - ship.mines.length; i++){
        ctx.fillStyle = "rgb(50, 100, 50)";
        ctx.fillRect(ship.x - ship.width + i *20 + 2.5, ship.y + ship.height -20, 15, 15);
    }
}

function DrawHearts(){
    let heartOffset = 220
    ctx.fillStyle = 'white';
    ctx.font = "200px Sans";
    
    for(let i = 1; i < ship.lives + 1; ++i){
        if(gameState.hardmode){
            ctx.font = "120px Sans";
            ctx.fillText("❗",can.width - 200,120);
        }else{
            ctx.font = "120px Sans";
            ctx.fillText("❤️",can.width - heartOffset *i,140);
        }
    }


}

let scoreFadeCounter = 0;
function DrawScore(delta){
    
    if(gameState.hardmode){
        scoreModifier = 0.5;
    }
    
    
    
    if(delta > 0){
        ship.score += (delta * scoreModifier);
        scoreFadeCounter+= 50;
    }else{
        
    }

    if(ship.score < 0){
        ship.score = 0;    
    }
    
    if(scoreFadeCounter > 0){
        ctx.fillStyle = 'rgb(90, '+220+scoreFadeCounter+', 90)';
        scoreFadeCounter--;
    }else{
        ctx.fillStyle = 'rgb(255, 255, 255)';
    }
    
    ctx.font = "80px topFont";
    ctx.fillText("SCORE: " + parseInt(ship.score),20,80);
}

function RestartGame(){
    ship.x = can.width/2;
    ship.y = can.height/2;
    ship.bullets = [];
    ship.mines = [];
    ship.hp = 100;
    ship.lives = 3;
    ship.score = 0;
    ship.hasShield = false;

    scoreModifier = 1;
    
    rocks = [];
    shooters = [];
    zoomers = [];
    tanks = [];

    base.hp = 200;
    base.alive = true;
    base.hasShield = false;
    base.pickups = [];
    
    gameState.menu = true;
    gameState.play = false;
    gameState.over = false;
    gameState.pause = false;
    gameState.hardmode = false;
    gameState.nameInput = false;
    gameState.globalDiff = 1;
    gameState.unpausedCounter = 1;

    inputText = ["_", "_", "_", "_"];
    currentInputIndex = 0;
    truncatedNick = "";

}
function BeginGame(){
    console.log("CALLLED BEGIN GAME")
    gameState.menu = false;
    gameState.play = true;
}


function checkLives(){
    if(ship.hp <= 0){
        ship.lives--;


        rocks.forEach(rock => {
            rock.hp = 0;
            ship.score -= 5;
        })
        zoomers.forEach(zoomer => {
            zoomer.hp = 0;
            ship.score -= 15;
        })
        shooters.forEach(shooter => {
            shooter.hp = 0;
            ship.score -= 20;
        })
        tanks.forEach(tank => {
            tank.hp = 0;
            ship.score -= 30;
        })
        
        SpawnExplosion(can.width/2 - 50,can.height/2 - 50 , 100 , 100, "white", 350, 15, "shipDestroyed")

        ship.x = base.x + base.width/2;
        ship.y = base.y + base.height/2;

        ship.hp = 100;
    }

    if(ship.lives == 0){
        gameState.play = false;
        gameState.nameInput = true;
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
    
    if(ship.hp == 69.69) {console.log("sus amogus")}

    //Pokazywanie efektu po trafieniu w statek
    //to jest absolutie głupio napisane, ale działa
    if(ship.recentlyHit == true){
        shipStatusDamageStart = 10;
        
        ship.recentlyHit = false;
    }

    if(shipStatusDamageStart != 0){
        if(currFrame%20 == 0){
            ctx.font = "40px topFont";
            ctx.fillText("!",ship.x+15,ship.y-15);
            shipStatusDamageStart--;
        }
    }


    //deklaracja zdjęcia użytego do pokazywania statku
    const shipImage = new Image();
    shipImage.src = 'ship.png';

    if(ship.hasShield == true){
    }
    
    //kontrola rotacjii statku
   
    /*najpierw zmieniamy punk 0:0 canvasu na koordynaty statku, obracamy o tyle ile jest obrotu statku, 
    rysujemy statek a później odwracamy tak jak było na początku
    Bez tego to statek obracał się według punktu 0:0 więc duże kółka robił wokół lewego górnego rogu
    */
    let randomSin = Math.sin(currFrame*0.001)
    ctx.translate(ship.x, ship.y)
    ctx.rotate(ToRads(ship.rotation))
    ctx.drawImage(shipImage, -ship.width/2, -ship.height/2, ship.width, ship.height);
    ctx.rotate(ToRads(-ship.rotation ))
    ctx.translate(-ship.x, -ship.y)
}

function DrawDebugInfo(){
    //Wyświetl info do debugowania
    ctx.fillStyle = 'gray';
    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    ctx.fillText("deltaTime: " + deltaTime.toFixed(4),10,50);
    ctx.fillText("currFrame: " + currFrame,10,700);
    ctx.fillText("unpausedCurrFrame: " + gameState.unpausedCounter,10,750);
    ctx.fillText("setRefresh: " + fps.toFixed(4),10,150);
    ctx.fillText("lastTime: " + lastTimestamp,10,200);
    ctx.fillText("shipRotation: " + ship.rotation.toFixed(4),10,250);
    ctx.fillText("sX: " + ship.x.toFixed(4),10,300);
    ctx.fillText("sY: " + ship.y.toFixed(4),10,350);
    ctx.fillText("sHP: " + ship.hp, 10, 400)
    ctx.fillText("sLiv: " + ship.lives, 10, 450)
    ctx.fillText("bHp: " + base.hp, 10, 500)
    ctx.fillText("sFS: " + ship.bulletFireSpeed, 10, 550)
    ctx.fillText("mX: " + mouse.x,800,50);
    ctx.fillText("mY: " + mouse.y,800,100);
    ctx.fillText("lClick: " + mouse.leftClick,1200,50);
    ctx.fillText("rClick: " + mouse.rightClick,1200,100);
    ctx.fillText("bCount: " + ship.bullets.length, 800, 200)
    ctx.fillText("mCount: " + ship.mines.length, 800, 250)
    ctx.fillText("rCount: " + rocks.length, 800, 300)
    ctx.fillText("gDiff: " + gameState.globalDiff, 800, 350)
    ctx.fillText("play: " + gameState.play, 1600, 50)
    ctx.fillText("over: " + gameState.over, 1600, 100)
    ctx.fillText("pause: " + gameState.pause, 1600, 150)
    ctx.fillText("hard: " + gameState.hardmode, 1600, 200)
    ctx.fillText("Rdiffi: " + rocksDiffi, 1900, 50)
    ctx.fillText("RspawnRate: " + spawnrateRocks, 1901, 100)
    
    ctx.fillText("DEBUG MODE ON| press: e = spawnRock,f = spawn shooter, m = spawn heavy, b = spawn zoomer, r = restart, q = spawnWave, x = toggleDebug", 10, 1200)
    ctx.fillText("z = damageBase, v = audioTest, g = toggle shadows", 10, 1250)
}

function MoveShip(){
    if(!gameState.pause){ //Obracaj statek za pomocą matematyki której ledwo rozumiem i obsługuj poruszanie się statku
        ship.rotation = ToDeg(Math.atan2(mouse.x - ship.x, - (mouse.y - ship.y)));
        if(keys["ArrowLeft"] || keys["a"] && gameState.play){
            ship.xAcc += -ship.speed * deltaTime;
        }
        if(keys["ArrowRight"] || keys["d"] && gameState.play){
            ship.xAcc += ship.speed * deltaTime;
        }
        if(keys["ArrowUp"]|| keys["w"] && gameState.play){
            ship.yAcc += -ship.speed * deltaTime;
        }
        if(keys["ArrowDown"]|| keys["s"] && gameState.play){
            ship.yAcc += ship.speed * deltaTime;
        }



        if(mouse.leftClick && gameState.play){
            FireBullet("ship");
        }
        if(mouse.rightClick || keys[" "] && gameState.play){ // spacja to jest dosłownie spacja a nie "Space" z jakiegoś powodu
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
    if(debugMode && keys["b"] && currFrame%10 == 0){
        SpawnEnemy(500, 500, "zoomer")
    }
    if(debugMode && keys["m"] && currFrame%10 == 0){
        SpawnEnemy(500, 500, "tank")
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
    if(debugMode && keys["g"] && currFrame%10 == 0){
        allowShadows = !allowShadows;
    }

    

    //obsługa akceleracjii. Jest mnożona przez 0.9, żeby spadała z czasem
    ship.xAcc *= 0.9;
    ship.yAcc *= 0.9;
    ship.x += Math.round(ship.xAcc);
    ship.y += Math.round(ship.yAcc);


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
            x: Math.round(ship.x),
            y: Math.round(ship.y),
            speed: 10,
            width: Math.round(20),
            height: Math.round(20),
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
            x: new Number(Math.round(obj.x + obj.width/2)),
            y: new Number(Math.round(obj.y + obj.height/2)),
            speed: 5,
            width: new Number(25),
            height: new Number(25),
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
            x: new Number(Math.round(obj.x + obj.width/2)),
            y: new Number(Math.round(obj.y + obj.height/2)),
            speed: 10,
            width: new Number(15),
            height: new Number(15),
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
            x: new Number(ship.x),
            y: new Number(ship.y),
            width: new Number(40),
            height: new Number(40),
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
    for(let i = 0; i < numEnemy; ++i){ //losuje się z jakiego miejsca mają się pojawić rzeczy
        let random = getRandomInt(4)
        let randomForShooter = getRandomInt(6)
        

        if(type != "shooter"){
            if(random == 0){
                SpawnEnemy(tL.x, tL.y, type)
            }else if(random == 1){
                SpawnEnemy(tR.x, tR.y, type)
            }else if(random == 2){
                SpawnEnemy(bL.x, bL.y, type)
            }else if(random == 3){
                SpawnEnemy(bR.x, bR.y, type)
            }
        }else{
            if(randomForShooter == 0){
                SpawnEnemy(tL.x, tL.y, type)
            }else if(randomForShooter == 1){
                SpawnEnemy(tR.x, tR.y, type)
            }else if(randomForShooter == 2){
                SpawnEnemy(bL.x, bL.y, type)
            }else if(randomForShooter == 3){
                SpawnEnemy(bR.x, bR.y, type)
            }else if (randomForShooter == 4){
                SpawnEnemy(bL.x, bL.y/2, type)
            }else if (randomForShooter == 4){
                SpawnEnemy(bR.x, bR.y/2, type)
            }
        }
    }
}

let zoomers = [];
let rocks = [];
let shooters = [];
let tanks = [];
function SpawnEnemy(xPos, yPos, type, xVel, yVel){
    if(type == "rock"){
        const rock = {
            x: new Number(xPos),
            y: new Number(yPos),
            speed: 1,
            width: new Number(90),
            height: new Number(90),
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
            x: new Number(xPos),
            y: new Number(yPos),
            speed: 0.4,
            width: new Number(120),
            height: new Number(120),
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
            followDistance: 1000, //maxymalny dystans podążania za graczem
            bullets: [], 
            bulletDmg: 10,
            bulletFireSpeed: 100,
            bulletDelay: 0,
            tag: "enemy",
            bulletSprite: 0, //czego użyć do pokazania pocisku
        }
        shooters.push(shooter)
    }else if(type == "zoomer"){
        const zoomer = {
            x: new Number(xPos),
            y: new Number(yPos),
            speed: 2,
            width: new Number(60),
            height: new Number(60),
            sprite: 0,
            maxHp: 50, //stała ilości zdrowia
            hp: 50, //zmienna ilości zdrowia
            firstFrame: true,
            alive: true,
            dx: 0, //różnica dystansu od bazy w osi x
            dy: 0, //różnica dystansu od bazy w osi y
            distance: 0, //dystans od bazy w pierwszej klatce życia asteoridy
            speedX: 0, 
            speedY: 0,
        }
        zoomers.push(zoomer)
    }else if(type == "tank"){
        const tank = {
            x: new Number(xPos),
            y: new Number(yPos),
            speed: 0.4,
            width: new Number(180),
            height: new Number(180),
            sprite: 0,
            maxHp: 300, //stała ilości zdrowia
            hp: 300, //zmienna ilości zdrowia
            firstFrame: true,
            alive: true,
            dx: 0, //różnica dystansu od bazy w osi x
            dy: 0, //różnica dystansu od bazy w osi y
            distance: 0, //dystans od bazy w pierwszej klatce życia asteoridy
            speedX: 0, 
            speedY: 0,
        }
        tanks.push(tank)
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
                shooter.speedX = (shooter.dx / shooter.distance) * shooter.speed * deltaTime; 
                shooter.speedY = (shooter.dy / shooter.distance) * shooter.speed * deltaTime; //dodaj prędkość w kierunku gracza
            }else{
                shooter.speedX = 0;
                shooter.speedY = 0;
                FireBullet("shooter", shooter); //stań w miejscu i strzelaj do gracza
                
            }
            DrawEnemyBullets(shooter);
            

            if(!gameState.pause){
                shooter.x += Math.round(shooter.speedX);
                shooter.y += Math.round(shooter.speedY);

                if(shooter.bulletDelay != 0){
                    shooter.bulletDelay--;
                }
                //zmień położenie jeżeli nie ma pauzy i przeładuj
            }
            
            shooter.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, ship)) {
                    if(ship.hasShield){
                        ship.hasShield = false;
                    }else{
                        ship.hp -= bullet.dmg;
                        ship.recentlyHit = true;
                    }
                    shooter.bullets.splice(bulletIndex, 1); //usuń kulę, która trafiła
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
                if(ship.hasShield){
                    ship.hasShield = false;
                }else{
                    ship.hp -= 35;
                    DrawScore(-10);
                    ship.recentlyHit = true;
                }
                shooter.hp = 0;
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

            if(getRandomInt(100) < 5){
                SpawnPickup(getRandomInt(3))
            } //5% na pojawienie pickupu

            SpawnExplosion(shooter.x+shooter.width/2, shooter.y+shooter.height/2, 20, 20, "red", 300, 15)
            DrawScore(50);
            shooters.splice(shooters.indexOf(shooter), 1);
        }
    })
}



function AddShadow(x, y, w, h, color, blur, offset, intensity, opacity, boxColorR, boxColorG, boxColorB){
    if(allowShadows){
        for(let i = 0; i<intensity; i++){
            ctx.shadowColor = color;
            ctx.shadowBlur = blur;
        
            if(boxColorB == undefined|| boxColorG == undefined|| boxColorR == undefined){
    
                ctx.fillStyle = "rgb("+0+", "+0+", "+0+", "+opacity+")";
            }else{
    
                ctx.fillStyle = "rgb("+boxColorR+", "+boxColorG+", "+boxColorB+", "+opacity+")";
            }
            ctx.fillRect(x-offset/2, y-offset/2, w+offset, h+offset);
        
            ctx.shadowColor = "rgb(0, 0, 0, 0)";
            ctx.shadowBlur = 0;
        }
    }

}

explosions = [];
function SpawnExplosion(x, y, w, h, clr, dur, intens, typ){
    const explosion = {
        x: x,
        y: y,
        width: w,
        height: h,
        color: clr,
        maxDuration: dur,
        durationScaling: 0,
        animationTimer: 0,
        intensity: intens,
        type: typ
    }
    if(allowShadows){
        explosions.push(explosion);
    }
}

function DrawExplosions(){
    explosions.forEach(exp => {
        for(let i = 0; i < exp.intensity; ++i){

            if(!gameState.pause){
                exp.animationTimer++;
            }
            
            ctx.shadowColor = exp.color;
            ctx.shadowBlur = exp.animationTimer;
            
    
            ctx.fillStyle = exp.color;
            //trzeba to poprawić
            ctx.fillRect(exp.x,exp.y,exp.width,exp.height);
            
            ctx.shadowColor = "rgb(0, 0, 0, 0)";
            if(exp.type = "shipDestroyed"){
                ctx.shadowColor = "rgb("+exp.animationTimer+","+exp.animationTimer+", "+exp.animationTimer+", "+exp.animationTimer+")";
            }
            ctx.shadowBlur = 0;
            
            if(exp.animationTimer == exp.maxDuration || exp.animationTimer == 210 && exp.type != "shipDestroyed"){
                explosions.splice(explosions.indexOf(exp), 1);
            }
        }
    })
}

function DrawShield(x, y, d){
    currX = x-5*d;
    currY = y+1*d;

    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.strokeStyle = "rgb(10, 10, 255)";
    ctx.moveTo(currX, currY);
    currX += 0;
    currY += -2*d;
    ctx.lineTo(currX,currY);
    currX += 2*d;
    currY += -2*d;
    ctx.lineTo(currX,currY);
    currX += 2*d;
    currY += 0;
    ctx.lineTo(currX,currY);
    currX += 2*d;
    currY += 2*d;
    ctx.lineTo(currX,currY);
    currX += 0;
    currY += 2*d;
    ctx.lineTo(currX,currY);
    currX += -2*d;
    currY += 2*d;
    ctx.lineTo(currX,currY);
    currX += -2*d;
    currY += 0;
    ctx.lineTo(currX,currY);
    currX += -2*d;
    currY += -2*d;
    ctx.lineTo(currX,currY);
    currX += 0;
    currY += -2*d;
    ctx.lineTo(currX,currY);


    
    
    ctx.moveTo(x, y);
    ctx.stroke();
}

function DrawBase(){

    const baseImage = new Image();
    const baseImageHit = new Image();
    baseImage.src = 'tzn-baza.png';
    baseImageHit.src = "tzn-explosion.png";

    
    
    if(base.alive){
        
        DrawHp(base);
        
        ctx.drawImage(baseImage, base.x, base.y, base.width, base.height);


        if(base.hp <= 0){
            base.alive = false;
        }

        if(base.recentlyHit){
            base.alarmCounter = 20;
            
            base.recentlyHit = false;
        }

        if(base.alarmCounter > 0){
            AddShadow(base.x, base.y, base.width, base.height, "red", 100, 0);
            ctx.drawImage(baseImageHit, base.x, base.y, base.width, base.height);
            base.alarmCounter--;
        }

        /*
        AddShadow(base.x, base.y, base.width, base.height, "red", 100, 0)
        ctx.drawImage(baseImageHit, base.x, base.y, base.width, base.height);
        ctx.fillText("⚡‼",base.x,base.y);
        */

        

        if(gameState.unpausedCounter%3000 == 0 || keys["h"] && currFrame%10 == 0){
            SpawnPickup(getRandomInt(4));
        }

    }else{
        gameState.globalDiff = 9;
        gameState.hardmode = true;
        ship.lives = 1;   
    }
}

function SpawnPickup(idPickup){
    if(idPickup == 0){
        const hpUp = {
            x: base.x + base.width/2,
            y: base.y + base.height/2,
            speed: 1,
            width: 70,
            height: 70,
            sprite: 0,
            firstFrame: true,
            picked: false,
            dx: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            dy: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            distance: 0, 
            speedX: 0, 
            speedY: 0,
            tag: "hpUp",
            duration: 0,
            maxDuration: 200,
            endFrame: 0,
            kill: false
        }    
        base.pickups.push(hpUp)
    }else if(idPickup == 1){
        const fireUp = {
            x: base.x + base.width/2,
            y: base.y + base.height/2,
            speed: 1,
            width: 70,
            height: 70,
            sprite: 0,
            firstFrame: true,
            firstPickup: true,
            picked: false,
            dx: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            dy: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            distance: 0, 
            speedX: 0, 
            speedY: 0,
            tag: "fireUp",
            duration: 0,
            maxDuration: 1000,
            endFrame: 0,
            kill: false
        }    
        base.pickups.push(fireUp)
    }else if(idPickup == 2){
        const fireUp = {
            x: base.x + base.width/2,
            y: base.y + base.height/2,
            speed: 1,
            width: 70,
            height: 70,
            sprite: 0,
            firstFrame: true,
            firstPickup: true,
            picked: false,
            dx: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            dy: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            distance: 0, 
            speedX: 0, 
            speedY: 0,
            tag: "baseShield",
            duration: 0,
            maxDuration: 200,
            endFrame: 0,
            kill: false
        }    
        base.pickups.push(fireUp)
    }else if(idPickup == 3){
        const fireUp = {
            x: base.x + base.width/2,
            y: base.y + base.height/2,
            speed: 1,
            width: 70,
            height: 70,
            sprite: 0,
            firstFrame: true,
            firstPickup: true,
            picked: false,
            dx: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            dy: getRandomInt(2) == 1 ? -getRandomInt(2) : getRandomInt(2), 
            distance: 0, 
            speedX: 0, 
            speedY: 0,
            tag: "shipShield",
            duration: 0,
            maxDuration: 200,
            endFrame: 0,
            kill: false
        }    
        base.pickups.push(fireUp)
    }
}

function DrawPickups(){
    base.pickups.forEach(pick => {
        if(!pick.picked && !gameState.hardmode){
            if(pick.firstFrame){
                
                pick.distance = Math.sqrt(pick.dx * pick.dx + pick.dy * pick.dy);
                pick.speedX = (pick.dx / pick.distance) * pick.speed * getRandomArbitrary(-1.2, 1.2);
                pick.speedY = (pick.dy / pick.distance) * pick.speed * getRandomArbitrary(-1.2, 1.2);

                pick.firstFrame = false;
            }
            
            if(!gameState.pause){
                pick.speedX *= 0.995;
                pick.speedY *= 0.995;
                pick.x += pick.speedX *deltaTime;
                pick.y += pick.speedY *deltaTime;
            }
            
            if (Collision(ship, pick)) {
                pick.picked = true;
            }
            
            const pickImg = new Image();
            if(pick.tag == "hpUp"){
                pickImg.src = 'hpUp.png';
            }else if(pick.tag == "fireUp"){
                pickImg.src = 'fireUp.png';
            }else if(pick.tag == "baseShield"){
                pickImg.src = 'baseShield.png';
            }else if(pick.tag == "shipShield"){
                pickImg.src = 'shipShield.png';
            }

            ctx.drawImage(pickImg, pick.x - pick.width/2, pick.y - pick.height/2, pick.width, pick.height);
        }else{
            if(pick.tag == "hpUp"){
                
                ship.hp = ship.maxHp;

                pick.kill = true;
            }else if(pick.tag =="fireUp"){
                
                
                if(pick.firstPickup){
                    pick.endFrame = gameState.unpausedCounter + pick.maxDuration;

                    if(ship.bulletFireSpeed > 0){
                        ship.bulletFireSpeed -= 5;
                    }
                    

                    pick.firstPickup = false;
                }

                if(gameState.unpausedCounter == pick.endFrame){

                    ship.bulletFireSpeed += 5;

                    pick.kill = true;
                }
            }else if(pick.tag == "baseShield"){
                base.hasShield = true;
                pick.kill = true;
            }else if(pick.tag == "shipShield"){
                ship.hasShield = true;
                pick.kill = true;
            }

            if(pick.kill){
                base.pickups.splice(base.pickups.indexOf(pick), 1);
            }
        }
    });
}

function DrawHp(obj){
    if(obj == base){
        
        //nie wiem dlaczego baza jakoś inaczej pokazuje zdrowie ale działa w taki sposób

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(obj.x +50 -2, obj.y + 160 -2, 100 +4, 20 +4);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(obj.x +50 -1, obj.y + 160 -1, 100 +2, 20 +2);
        
        ctx.fillStyle = "rgb(255, 10, 10)";
        ctx.fillRect(obj.x +50, obj.y + 160, 100* obj.hp/obj.maxHp, 20)
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
                rock.x += Math.round(rock.speedX *deltaTime);
                rock.y += Math.round(rock.speedY *deltaTime);
                
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
                if(ship.hasShield){
                    ship.hasShield = false;
                }else{
                    ship.hp -= 20;
                    DrawScore(-10);
                    ship.recentlyHit = true;
                }
                rock.hp = 0;
            }

            if (Collision(base, rock) && !(gameState.hardmode)) {
                if(base.hasShield){
                    base.hasShield = false;
                }else{
                    base.hp -= 20;
                    DrawScore(-20);
                    base.recentlyHit = true;
                    //aElectroError = new Audio('aElectroError.wav');
                    //aElectroError.play();
                }
                rock.hp = 0;
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

function DrawTanks(){
    tanks.forEach(tank => {
        if(tank.alive){
            if(tank.firstFrame){
                tank.dx = can.width/2 - tank.x + getRandomArbitrary(-400, 400);
                tank.dy = can.height/2 - tank.y + getRandomArbitrary(-400, 400);
                tank.distance = Math.sqrt(tank.dx * tank.dx + tank.dy * tank.dy);
                
                tank.speedX = (tank.dx / tank.distance) * tank.speed * getRandomArbitrary(-2.5, 2.5);
                tank.speedY = (tank.dy / tank.distance) * tank.speed * getRandomArbitrary(-2.5, 2.5);
                tank.firstFrame = false;

                //w pierwszej klatce, pojaw się i miej losowy offset kierunku żeby nie lecieć w pierwszej linii.
                //miej także losową prędkość
            }

            if(!gameState.pause){
                tank.x += Math.round(tank.speedX *deltaTime);
                tank.y += Math.round(tank.speedY *deltaTime);
            }

        

            ship.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, tank)) {
                    tank.hp -= bullet.dmg;
                    ship.bullets.splice(bulletIndex, 1);
                }
            })
            ship.mines.forEach((mine, mineIndex) => {
                if (Collision(mine, tank)) {
                    tank.hp -= mine.dmg;
                    mine.alive = false;
                }
            })
            
            if (Collision(ship, tank)) {
                if(ship.hasShield){
                    ship.hasShield = false;
                }else{
                    ship.hp -= 20;
                    DrawScore(-10);
                    ship.recentlyHit = true;
                }
                tank.hp = 0;
            }

            if (Collision(base, tank) && !(gameState.hardmode)) {
                if(base.hasShield){
                    base.hasShield = false;
                }else{
                    base.hp -= 20;
                    DrawScore(-20);
                    base.recentlyHit = true;
                    //aElectroError = new Audio('aElectroError.wav');
                    //aElectroError.play();
                }
                tank.hp = 0;
            }

            //teleportuj na drugą stronę jak wyjdziesz poza granice jak w mario
            if(tank.x > can.width){
                tank.x = 0
            }
            if(tank.y > can.height){
                tank.y = 0
            }
            if(tank.x < 0){
                tank.x = can.width;
            }
            if(tank.y < 0){
                tank.y = can.height;
            }


            ctx.fillStyle = "rgb(121, 134, 121)";
            ctx.fillRect(tank.x-2, tank.y-2, tank.width+4, tank.height+4);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(tank.x, tank.y, tank.width, tank.height);

            ctx.fillStyle = "rgb(121, 134, 121, "+tank.hp/tank.maxHp+")";
            ctx.fillRect(tank.x, tank.y, tank.width, tank.height);
            if(tank.hp <= 0){
                tank.alive = false;
            }
        }else{
            DrawScore(40);
            tanks.splice(tanks.indexOf(tank), 1);
        }
    })
}

function DrawZoomer(){
    zoomers.forEach(zoomer => {
        if(zoomer.alive){
            if(zoomer.firstFrame){
                
                zoomer.dx = can.width/2 - zoomer.x;
                zoomer.dy = can.height/2 - zoomer.y;
                if(zoomer.dx > 0){
                    zoomer.dx *= getRandomArbitrary(0.9, 1.5)
                }else{
                    zoomer.dx *= getRandomArbitrary(-0.9, -1.5)
                }

                if(zoomer.dy > 0){
                    zoomer.dy *= getRandomArbitrary(0.9, 1.5)
                }else{
                    zoomer.dy *= getRandomArbitrary(-0.9, -1.5)
                }

                zoomer.distance = Math.sqrt(zoomer.dx * zoomer.dx + zoomer.dy * zoomer.dy);
                zoomer.speedX = (zoomer.dx / zoomer.distance) * zoomer.speed * getRandomArbitrary(-2.5, 2.5);
                zoomer.speedY = (zoomer.dy / zoomer.distance) * zoomer.speed * getRandomArbitrary(-2.5, 2.5);
                zoomer.firstFrame = false;

                //w pierwszej klatce, pojaw się i miej losowy offset kierunku żeby nie lecieć w pierwszej linii.
                //miej także losową prędkość
            }

            if(!gameState.pause){
                zoomer.x += Math.round(zoomer.speedX *deltaTime);
                zoomer.y += Math.round(zoomer.speedY *deltaTime);
            }


            ship.bullets.forEach((bullet, bulletIndex) => {
                if (Collision(bullet, zoomer)) {
                    zoomer.hp -= bullet.dmg;
                    ship.bullets.splice(bulletIndex, 1);
                }
            })
            ship.mines.forEach((mine) => {
                if (Collision(mine, zoomer)) {
                    zoomer.hp -= mine.dmg;
                    mine.alive = false;
                }
            })
            
            if (Collision(ship, zoomer)) {
                if(ship.hasShield){
                    ship.hasShield = false;
                }else{
                    ship.hp -= 10;
                    DrawScore(-10);
                    ship.recentlyHit = true;
                }
                zoomer.hp = 0;
            }

            if (Collision(base, zoomer) && !(gameState.hardmode)) {
                if(base.hasShield){
                    base.hasShield = false;
                }else{
                    base.hp -= 10;
                    DrawScore(-20);
                    base.recentlyHit = true;
                }
                zoomer.hp = 0;
            }

            //teleportuj na drugą stronę jak wyjdziesz poza granice jak w mario
            if(zoomer.x > can.width){
                zoomer.x = 0
            }
            if(zoomer.y > can.height){
                zoomer.y = 0
            }
            if(zoomer.x < 0){
                zoomer.x = can.width;
            }
            if(zoomer.y < 0){
                zoomer.y = can.height;
            }


            ctx.fillStyle = "rgb(10, 121, 121)";
            ctx.fillRect(zoomer.x-2, zoomer.y-2, zoomer.width+4, zoomer.height+4);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(zoomer.x, zoomer.y, zoomer.width, zoomer.height);

            ctx.fillStyle = "rgb(10, 121, 121, "+zoomer.hp/zoomer.maxHp+")";
            ctx.fillRect(zoomer.x, zoomer.y, zoomer.width, zoomer.height);
            if(zoomer.hp <= 0){
                zoomer.alive = false;
            }
        }else{
            DrawScore(25);
            zoomers.splice(zoomers.indexOf(zoomer), 1);
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
                bullet.x += Math.round(bullet.speedX *deltaTime);
                bullet.y += Math.round(bullet.speedY *deltaTime);
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


            


            ctx.fillStyle = "red";
            if(gameState.unpausedCounter%40 == 0){
                obj.bulletSprite = obj.bulletSprite == 1 ? 0 : 1;
                //jeżeli sprite pocisku jest równy 1: ustaw na 0 i jeżeli 0: ustaw na 1
            }
            
            if(obj.bulletSprite == 0){
                AddShadow(bullet.x, bullet.y, bullet.width, bullet.height, "rgb(255, 10, 10)", 50, 10, 2);
                

                ctx.fillStyle = "rgb(255, 10, 10, "+bullet.decayTime/bullet.maxDecay+")";
                
            }else{
                AddShadow(bullet.x, bullet.y, bullet.width, bullet.height, "rgb(255, 255, 10)", 50, 10, 2);

                
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
                bullet.x += Math.round(bullet.speedX *deltaTime);
                bullet.y += Math.round(bullet.speedY *deltaTime);
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

            if(!bullet.spawnedFromMine){
                AddShadow(bullet.x, bullet.y, bullet.width, bullet.height, "yellow", 10, 1, 2, bullet.decayTime/bullet.maxDecay)
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
            ctx.fillStyle = "rgb(40, 110, 40, 1)";
            ctx.fillRect(mine.x - 2, mine.y - 2, mine.width + 4, mine.height + 4);
            ctx.fillStyle = "rgb(10, 70, 10, "+mine.decayTime/mine.maxDecay+")";
            ctx.fillRect(mine.x, mine.y, mine.width, mine.height);

            AddShadow(mine.x + mine.width/2 - mine.width/8, mine.y + mine.width/2 - mine.width/8, mine.width/4, mine.height/4, "orange", 100, 0, Math.cos(0.01*gameState.unpausedCounter * mine.maxDecay/mine.decayTime)*8, 1, 200, 10, 10)
            
            
            
            if(!gameState.pause){
                mine.decayTime--;
            }
            
            mine.alive = mine.decayTime < 0 ? false : true;
            
        }else{


            SpawnExplosion(mine.x+mine.width/2, mine.y+mine.height/2, 20, 20, "green", 300, 5)
            SpawnExplosion(mine.x+mine.width/2, mine.y+mine.height/2, 20, 20, "orange", 300, 5)
            
            if(allowBulletsFromExplosions){
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
                
                /*
                aBoom = new Audio('aBoom.wav');
                aBoom.play();
                */
            }

            ship.mines.splice(ship.mines.indexOf(mine), 1)
        }   
    });
}

function Collision(obj1, obj2) {
    if(currFrame %2 == 0){ //sprawdzamy co druga klatkę, żeby przyspieszyć obliczenia
        return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
    }else{
        return false;
    }
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
