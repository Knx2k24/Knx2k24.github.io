const canDis = document.getElementById("canvasDistortionLayer");
const ctxDis = canDis.getContext("2d");


canDis.style.width = cWidth + 'px';
canDis.style.height = cHeight + 'px';
canDis.style.cursor = "none";
canDis.width = cWidth * scale;
canDis.height = cHeight * scale;
canDis.style.border = "1px orange solid";
canDis.style.position = "absolute";
canDis.style.zIndex = "1";

const screenRatio = canDis.width/canDis.height;
console.log(screenRatio)



function DrawHorizontalLiens(){
    ctxDis.lineWidth = 5;
    ctxDis.strokeStyle = "rgba(0, 0, 0, 0.2)";
    for(let i = 0; i < canDis.width; i += 10){
        ctxDis.moveTo(0, i);
        ctxDis.lineTo(canDis.width, i);
    }
    ctxDis.stroke()
}

function OnLoadDis(){
    console.log("Distortion Loaded");

    //DrawHorizontalLiens();
    //ForAllX();
    DrawHorizontalLiens();
    DrawShadowedCorners();
    
}

function DrawShadowedCorners(){
    ctxDis.fillStyle = "rgba(0, 0, 0, 0.005)";
    for(let i = 0; i < 20; i++){
        let widthOfShadow = 500 + i *50;
        ctxDis.lineWidth = 20;
        ctxDis.beginPath();
        ctxDis.moveTo(0, 0);
        ctxDis.lineTo(0, widthOfShadow);
        ctxDis.lineTo(widthOfShadow, 0);
        ctxDis.fill();

        ctxDis.beginPath();
        ctxDis.moveTo(canDis.width, canDis.height);
        ctxDis.lineTo(canDis.width, canDis.height - widthOfShadow);
        ctxDis.lineTo(canDis.width - widthOfShadow, canDis.height);
        ctxDis.fill();

        ctxDis.beginPath();
        ctxDis.moveTo(0, canDis.height);
        ctxDis.lineTo(0, canDis.height - widthOfShadow);
        ctxDis.lineTo(widthOfShadow, canDis.height);
        ctxDis.fill();

        ctxDis.beginPath();
        ctxDis.moveTo(canDis.width, 0);
        ctxDis.lineTo(canDis.width, widthOfShadow);
        ctxDis.lineTo(canDis.width - widthOfShadow, 0);
        ctxDis.fill();
    }
}


function ForAllX(){
    /*
    let x, y;
    ctxDis.fillRect(2000, 100, 10, 10);
    
    ctxDis.strokeStyle = "orange";
    ctxDis.lineWidth = 1;
    ctxDis.beginPath();
    
    console.log(canDis.width);
    
    ctxDis.fillStyle = "rgba(0, 0, 0, 0.2)";
    
    ctxDis.moveTo(0, 0);
    for(let i = 0; i < canDis.width; i += 1){
        x = i * screenRatio;
        y = (1/x*5)*10000;

        
        ctxDis.fillRect(x, y, 1, -y)

        ctxDis.lineTo(x, y);
        ctxDis.stroke()
    }
    ctxDis.moveTo(canDis.width, canDis.height);
    for(let i = canDis.width; i > 0; i += -1){
        x = i * screenRatio;
        y = (1/x*5)*10000;
        
        ctxDis.fillRect(x, y, 1, -y)

        ctxDis.lineTo(x, y);
        ctxDis.stroke()
    }

    */
}



function DrawCircle(x, y, r, res, lW){
    ctxDis.strokeStyle = "rgba(100, 0, 0, 1)";
    ctxDis.lineWidth = lW;
    ctxDis.beginPath()
    for(let i = 0; i <= res; i++){
        ctxDis.moveTo(x + Math.cos(i)*r,y + Math.sin(i)*r);
        ctxDis.lineTo(x + Math.cos(1+i)*r,y + Math.sin(1+i)*r);
    }
    ctxDis.stroke()
}



window.addEventListener("load", OnLoadDis);