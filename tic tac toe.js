var canvas=document.getElementById("gameCanvas");
canvas.width=600;
canvas.height=600;
var tileSize=canvas.width/3;
var ctx=canvas.getContext("2d");
var board=[0,0,0,
           0,0,0,
           0,0,0];
var iAmPlayerOne=true;
if(Math.floor(Math.random()*2)==0){
    iAmPlayerOne=false;
}
var myTurn=false;
var myNumber=2;
var computerNumber=1;
if(iAmPlayerOne){
    myTurn=true;
    myNumber=1;
    computerNumber=2;
}
else{
    computerMove();
}
function update(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(tileSize,0);
    ctx.lineTo(tileSize,tileSize*3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tileSize*2,0);
    ctx.lineTo(tileSize*2,tileSize*3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,tileSize);
    ctx.lineTo(tileSize*3,tileSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,tileSize*2);
    ctx.lineTo(tileSize*3,tileSize*2);
    ctx.stroke();
    for(var i=0;i<board.length;i++){
        if(board[i]==1){
            //X
            ctx.lineWidth=3;
            var tilePos=[(i%3)*200,Math.floor(i/3)*200];
            var xMargin=[20,20];
            ctx.beginPath();
            ctx.moveTo(tilePos[0]+xMargin[0],tilePos[1]+xMargin[1]);
            ctx.lineTo(tilePos[0]+tileSize-xMargin[0],tilePos[1]+tileSize-xMargin[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tilePos[0]+tileSize-xMargin[0],tilePos[1]+xMargin[1]);
            ctx.lineTo(tilePos[0]+xMargin[0],tilePos[1]+tileSize-xMargin[1]);
            ctx.stroke();
        }
        else if(board[i]==2){
            //O
            ctx.lineWidth=3;
            var tilePos=[(i%3)*200,Math.floor(i/3)*200];
            var circleCenter=[tilePos[0]+Math.floor(tileSize/2),tilePos[1]+Math.floor(tileSize/2)];
            var circleMargin=20;
            var circleRadius=Math.floor(tileSize/2)-circleMargin;
            ctx.beginPath();
            ctx.arc(circleCenter[0], circleCenter[1], circleRadius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    requestAnimationFrame(update);
}
function computerMove(){
    var boardIsFull=true;
    for(var i=0;i<board.length;i++){
        if(board[i]==0){
            boardIsFull=false;
            break;
        }
    }
    if(!boardIsFull && !checkWin()){
        var placedTile=false;
        while(!placedTile){
            var index=Math.floor(Math.random()*10);
            if(board[index]==0){
                board[index]=computerNumber;
                placedTile=true;
            }
        }
        myTurn=true;
    }
}

function checkWin(){
    if(board[0]==1 && board[1]==1 && board[2]==1){
        return 1;
    }
    if(board[3]==1 && board[4]==1 && board[5]==1){
        return 1;
    }
    if(board[6]==1 && board[7]==1 && board[8]==1){
        return 1;
    }
    if(board[0]==1 && board[3]==1 && board[6]==1){
        return 1;
    }
    if(board[1]==1 && board[4]==1 && board[7]==1){
        return 1;
    }
    if(board[2]==1 && board[5]==1 && board[8]==1){
        return 1;
    }
    if(board[0]==1 && board[4]==1 && board[8]==1){
        return 1;
    }
    if(board[2]==1 && board[4]==1 && board[6]==1){
        return 1;
    }

    if(board[0]==2 && board[1]==2 && board[2]==2){
        return 2;
    }
    if(board[3]==2 && board[4]==2 && board[5]==2){
        return 2;
    }
    if(board[6]==2 && board[7]==2 && board[8]==2){
        return 2;
    }
    if(board[0]==2 && board[3]==2 && board[6]==2){
        return 2;
    }
    if(board[1]==2 && board[4]==2 && board[7]==2){
        return 2;
    }
    if(board[2]==2 && board[5]==2 && board[8]==2){
        return 2;
    }
    if(board[0]==2 && board[4]==2 && board[8]==2){
        return 2;
    }
    if(board[2]==2 && board[4]==2 && board[6]==2){
        return 2;
    }
    return 0;
}

document.onmousedown = (event) => {
    var x = event.clientX;
    var y = event.clientY;
    if(!checkWin()){
        if(x<canvas.width && y<canvas.height){
            var squareIndex=Math.floor(y/200)*3+Math.floor(x/200);
            if(board[squareIndex]==0 && myTurn){
                board[squareIndex]=myNumber;
                myTurn=false;
                setTimeout(computerMove,500);
            }
        }
    }
}
requestAnimationFrame(update);