//初始地圖
let mapsize = 15;//地圖大小 (15*15)
let blockLength = 600/mapsize;//單格邊長
let snacklength = 3;//蛇長
let speed = 1100;//移動速度(更新間隔時間)
let modecode = 1;//遊戲模式
let nowmove = "ArrowRight";//現在移動方向
let nextmove = "ArrowRight";//接下來移動方向
let testmove = 1;
let timer;
let running = false;//遊戲開始沒
let badappale = false;
let mapArray = [
    //大概先15*15
    //空白 == 0   //障礙 == -1 //食物 == -2 //蘑菇 == -3
    
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 2, 1, 0, 0, -2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

//按鈕觸發
$("#lowerSpeed").on("click", downSpeed);
$("#higherSpeed").on("click", upSpeed);

$("#mode1").on("click", mode1);
$("#mode2").on("click", mode2);
$("#mode3").on("click", mode3);

$("#run").on("click",run);

//移動速度調整
function downSpeed(){
    console.log("downSpeed");
    if(speed>=3000){
        speed=3000;
    }else{
        speed+=100;
    }

    if(running){
        clearInterval(timer);
        timer = setInterval(move, speed);
    }

    let speedDisplay = document.getElementById('speedDisplay');
    speedDisplay.innerHTML = (3.1 - speed / 1000).toFixed(1);

    console.log(speed);
}

function upSpeed(){
    console.log("upSpeed");
    if(speed<=100){
        speed=100;
    }else{
        speed-=100;
    }

    if(running){
        clearInterval(timer);
        timer = setInterval(move, speed);
    }

    let speedDisplay = document.getElementById('speedDisplay');
    speedDisplay.innerHTML = (3.1 - speed / 1000).toFixed(1);

    console.log(speed);
}

//遊戲模式
function mode1(){
    console.log("mode1");
    modecode = 1;
    let modeDisplay = document.getElementById('modeDisplay');
    modeDisplay.innerHTML = "一般";

    console.log(modecode);
}

function mode2(){
    console.log("mode2");
    modecode = 2;
    let modeDisplay = document.getElementById('modeDisplay');
    modeDisplay.innerHTML = "障礙";

    console.log(modecode);
}

function mode3(){
    console.log("mode3");
    modecode = 3;
    let modeDisplay = document.getElementById('modeDisplay');
    modeDisplay.innerHTML = "蘑菇";

    console.log(modecode);
}

//開始遊戲
function run(){
    console.log("button");
    loadmap();
    snacklength = 3;
    var runbutton = document.getElementById('run');
    runbutton.style.display = 'none';
    running = true;
    timer = setInterval(move, speed);
}

window.addEventListener('load', loadmap);

//載入地圖
function loadmap() {
    const canvas = document.getElementById('myCanvas');
        let ctx = canvas.getContext('2d');

        for(let i = 0;i < mapsize;i++){
            for(let j = 0;j < mapsize;j++){
                if(mapArray[i][j] == 1){//蛇頭
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(j*blockLength + blockLength / 3, i*blockLength + blockLength / 3, blockLength / 3, blockLength / 3);
                }else if(mapArray[i][j] > 1){//蛇身
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                }else if(mapArray[i][j] == -2){//蘋果 或 蘑菇
                    if((i+j)%2==0){
                        ctx.fillStyle = '#2894FF';
                        ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                    }else{
                        ctx.fillStyle = '#82D900';
                        ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                    }
                    if(modecode == 1 || modecode == 2){
                        console.log("good apple");
                        ctx.fillStyle = '#ff0000';
                        ctx.beginPath();
                        ctx.arc(j*blockLength + blockLength/2, i*blockLength+blockLength/2, blockLength/3, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.closePath();
                    }else{
                        console.log("bad apple");
                        ctx.fillStyle = '#9F35FF';
                        ctx.beginPath();
                        ctx.arc(j*blockLength + blockLength/2, i*blockLength+blockLength/2, blockLength/3, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.closePath();
                    }
                    
                }else if(mapArray[i][j] == 0){//地圖背景
                    if((i+j)%2==0){
                        ctx.fillStyle = '#2894FF';
                        ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                    }else{
                        ctx.fillStyle = '#82D900';
                        ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                    }
                }else if(mapArray[i][j] == -1){
                    ctx.fillStyle = '#7B7B7B';
                    ctx.fillRect(j*blockLength, i*blockLength, blockLength, blockLength);
                }
            }
        }
    console.log('地圖已加载完成');
}

//繪製食物
function writeapple(){
    console.log("write apple")
    var randomX = Math.floor(Math.random()*mapsize);
    var randomY = Math.floor(Math.random()*mapsize);

    while(mapArray[randomY][randomX] != 0){
        randomX = Math.floor(Math.random()*mapsize);
        randomY = Math.floor(Math.random()*mapsize);
    }
    mapArray[randomY][randomX]=-2;  
}

//繪製石頭
function writeStone(){
    console.log("write stone")
    var randomX = Math.floor(Math.random()*mapsize);
    var randomY = Math.floor(Math.random()*mapsize);

    while(mapArray[randomY][randomX] != 0){
        randomX = Math.floor(Math.random()*mapsize);
        randomY = Math.floor(Math.random()*mapsize);
    }
    mapArray[randomY][randomX]=-1;  
}

//移動
function move(){
    //console.log("move function");
    // //Click Event
    $(document).on("keydown", function(event){
        //console.log(event.code);
        event.preventDefault();

        //移動 
        if(testmove == 1 && nowmove != event.code){
            if(badappale == false){
                switch(event.code){
                    case "ArrowLeft":
                        if(nowmove != "ArrowRight"){
                            nextmove = "ArrowLeft";
                            testmove = 0;
                            console.log("turn left");
                        }
                        break;
                    case "ArrowUp":
                        if(nowmove != "ArrowDown"){
                            nextmove = "ArrowUp";
                            testmove = 0;
                            console.log("turn up");
                        }
                        break;
                    case "ArrowRight":
                        if(nowmove != "ArrowLeft"){
                            nextmove = "ArrowRight";
                            testmove = 0;
                            console.log("turn right");
                        }
                        break;
                    case "ArrowDown":
                        if(nowmove != "ArrowUp"){
                            nextmove = "ArrowDown";
                            testmove = 0;
                            console.log("turn down");
                        }
                        break;
                    default:
                        return;
                }
            }else{
                switch(event.code){
                    case "ArrowLeft":
                        if(nowmove != "ArrowRight"){
                            nextmove = "ArrowRight";
                            testmove = 0;
                            console.log("turn left");
                        }
                        break;
                    case "ArrowUp":
                        if(nowmove != "ArrowDown"){
                            nextmove = "ArrowDown";
                            testmove = 0;
                            console.log("turn up");
                        }
                        break;
                    case "ArrowRight":
                        if(nowmove != "ArrowLeft"){
                            nextmove = "ArrowLeft";
                            testmove = 0;
                            console.log("turn right");
                        }
                        break;
                    case "ArrowDown":
                        if(nowmove != "ArrowUp"){
                            nextmove = "ArrowUp";
                            testmove = 0;
                            console.log("turn down");
                        }
                        break;
                    default:
                        return;
                }
            }
            
        }
    });

    if(canmove()){
        console.log("canmove");
        let next = moveto();
        let testmove = 0;
        if(next==0){
            for(let i = 0;i < mapsize;i++){
                for(let j = 0;j < mapsize;j++){
                    if(mapArray[i][j] == 1 && testmove == 0){
                        if(nextmove=="ArrowLeft"){
                            mapArray[i][j - 1]=1;
                            mapArray[i][j]=2;
                            testmove = 1;
                            //console.log(i,j);
                        }else if(nextmove=="ArrowUp"){
                            mapArray[i-1][j]=1;
                            mapArray[i][j]=2;
                            testmove = 1;
                            console.log(i,j);
                        }else if(nextmove=="ArrowRight"){
                            mapArray[i][j + 1] = 1;
                            mapArray[i][j] = 2;
                            testmove = 1;
                            console.log(i,j);
                        }else if(nextmove=="ArrowDown"){
                            mapArray[i + 1][j] = 1;
                            mapArray[i][j] = 2;
                            testmove = 1;
                            console.log(i,j);
                        }
                    }else if(mapArray[i][j] > 1 && mapArray[i][j] != snacklength){
                        mapArray[i][j]++;
                        //console.log(i,j);
                    }else if(mapArray[i][j]==snacklength){
                        mapArray[i][j]=0;
                        console.log(i,j);
                    }
                }
            }
        }else if(next==-2){
            for(let i = 0;i<mapsize;i++){
                for(let j=0;j<mapsize;j++){
                    if(mapArray[i][j]==1 && testmove == 0){
                        if(nextmove=="ArrowLeft"){
                            mapArray[i][j-1]=1;
                            mapArray[i][j]=2;
                            testmove = 1;
                            snacklength++;
                        }else if(nextmove=="ArrowUp"){
                            mapArray[i-1][j]=1;
                            mapArray[i][j]=2;
                            testmove = 1;
                            snacklength++;
                        }else if(nextmove=="ArrowRight"){
                            mapArray[i][j+1]=1;
                            mapArray[i][j]=2;
                            testmove = 1;
                            snacklength++;
                        }else if(nextmove=="ArrowDown"){
                            mapArray[i+1][j]=1;
                            mapArray[i][j]=2;
                            testmove = 1;
                            snacklength++;
                    }
                    }else if(mapArray[i][j]>1){
                        mapArray[i][j]++;
                    }
                }
            }
            if(snacklength+1<mapsize*mapsize){
                writeapple();
                if(modecode == 2){
                    writeStone();
                }
            }
            if(modecode == 3){
                if(badappale){
                    badappale = false;
                }else{
                    badappale = true;
                }
            }
            
        }
        loadmap();
    }else{
        clearInterval(timer);
        if(snacklength==mapsize*mapsize){
        youwin();
        }else{
        losegame();
        }
        reset();
    }
    nowmove = nextmove;
    testmove = 1;
}

function canmove(){
    //console.log("canmove function")
    for(let i = 0;i < mapsize;i++){
        for(let j = 0;j < mapsize;j++){
            if(mapArray[i][j] == 1){
                //console.log("map == 2");
                if(nextmove=="ArrowLeft"){
                    j--;
                }else if(nextmove=="ArrowUp"){
                    i--
                }else if(nextmove=="ArrowRight"){
                    j++;
                }else if(nextmove=="ArrowDown"){
                    i++;
                };
                
                if(i < 0 || i >= mapsize || j < 0 || j >= mapsize){
                    console.log("false");
                    return false;
                }else if(mapArray[i][j] == 0 || mapArray[i][j] == -2){
                    console.log("true");
                    return true;
                }else{
                    console.log("false");
                    return false;
                };
            }
        }
    }
}

function moveto(){
    for(let i = 0;i < mapsize;i++){
        for(let j = 0;j < mapsize;j++){
            if(mapArray[i][j] == 1){
                //console.log("map == 2");
                if(nextmove=="ArrowLeft"){
                    j--;
                }else if(nextmove=="ArrowUp"){
                    i--
                }else if(nextmove=="ArrowRight"){
                    j++;
                }else if(nextmove=="ArrowDown"){
                    i++;
                };
                console.log(mapArray[i][j]);
                return mapArray[i][j];
            }
        }
    }
}

function losegame(){
    console.log("you lose!!");
    //畫出LOSE
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    ctx.font = '300px Arial'; // 设置字体样式和大小
    ctx.fillStyle = '#6C6C6C'; // 设置字体颜色
    ctx.fillText("LOSE !", 52, 550); // 绘制填充文本
    console.log("write lose!!");
    //顯示開始按鈕

}

function youwin(){
    console.log("you win!!");
    //畫出WIN

    //顯示開始按鈕
}

function reset(){
    console.log("reset")
    var runbutton = document.getElementById('run');
        runbutton.style.display = 'flex';
        mapArray=[
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 3, 2, 1, 0, 0, -2, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        nowmove = "ArrowRight";
        nextmove = "ArrowRight";
        testmove = 1;
        running = false;
        badappale = false;

}

