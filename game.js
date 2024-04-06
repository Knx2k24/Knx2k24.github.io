let debugMode = true;
//Iniclaizacjia elementów
const can = document.getElementById("canvas");
const ctx = can.getContext("2d");

//Iniclalizacja stylów dla canvasu
let cWidth = 1200;
let cHeight = 800;

let scale = 2;
can.style.width = cWidth + 'px';
can.style.height = cHeight + 'px';
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
}


//zdefiniowanie statku
const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    rotation: 0,
    speed: 8,
    width: 50,
    height: 50,
    sprite: 0,
    score: 0,
    lives: 3,
    bullets: []
};


//iniclalizacja zmiennych odpowiedzialnych za kontrolę FPS i delty
const fps = 1000 / 60;
let currFrame = 0;
let deltaTime, lastTimestamp;

//nasłuch na klawisze + myszka
const keys = [];
window.addEventListener('keydown', e => {
    keys[e.key] = true;
});
window.addEventListener('keyup', e => {
    keys[e.key] = false;
});
const mouse = {
    x: 0,
    y: 0
}
canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect(); 
    mouse.x = Math.round((e.clientX - cRect.left)*scale);  
    mouse.y = Math.round((e.clientY - cRect.top)*scale);   
});
function update(timestamp) {
    //obliczanie czasu od ostatniej klatki. Jeżeli gra będzie wolniej/szybciej updatować to "silnik" nie będzie działał szybciej/wolniej
    currFrame++;
    deltaTime = (timestamp - lastTimestamp) / fps;
    lastTimestamp = timestamp;

    if(debugMode){
        DrawDebugInfo();
    }

    
    
    
    MoveShip();

    //clearowanie ekranu
    DrawShip();

    setTimeout(() => {
        requestAnimationFrame(update);
        ctx.clearRect(0, 0, can.width, can.height);
    }, fps);
}
let XOffset, YOffset;
function DrawShip(){
    const shipImage = new Image();
    shipImage.src = 'ship.png';
    

    
    
    
    //kontrola rotacjii statku
    XOffset = ship.x;
    YOffset = ship.y;

    ctx.translate(XOffset, YOffset)
    ctx.rotate(ToRads(ship.rotation))
    ctx.drawImage(shipImage, -ship.width/2, -ship.height/2, ship.width, ship.height);
    ctx.rotate(ToRads(-ship.rotation))
    ctx.translate(-XOffset, -YOffset)
}

function DrawDebugInfo(){
    ctx.font = "60px Arial";
    ctx.fillText("deltaTime: " + deltaTime.toFixed(4),10,50);
    ctx.fillText("currFrame: " + currFrame,10,100);
    ctx.fillText("setRefresh: " + fps.toFixed(4),10,150);
    ctx.fillText("shipRotation: " + ship.rotation.toFixed(4),10,250);
    ctx.fillText("sX: " + ship.x.toFixed(4),10,300);
    ctx.fillText("sY: " + ship.y.toFixed(4),10,350);
    ctx.fillText("mX: " + mouse.x,800,50);
    ctx.fillText("mY: " + mouse.y,800,100);
}

function MoveShip(){

    ship.rotation = Math.atan2(mouse.x - ship.x, - (mouse.y - ship.y) )*(180 / Math.PI);

    if(keys["ArrowLeft"] || keys["a"]){
        ship.x += -ship.speed * deltaTime;
    }
    if(keys["ArrowRight"] || keys["d"]){
        ship.x += ship.speed * deltaTime;
    }
    if(keys["ArrowUp"]|| keys["w"]){
        ship.y += -ship.speed * deltaTime;
    }
    if(keys["ArrowDown"]|| keys["s"]){
        ship.y += ship.speed * deltaTime;
    }
}


function ToRads(degrees){
    return degrees * Math.PI*2.0/360.0;
}
function ToDeg(radians){
    return radians * (180/Math.PI);
}

//Dodanie nasłuchu na wczytanie JSa 
window.addEventListener("load", OnLoad)