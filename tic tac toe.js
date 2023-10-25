var canvas=document.getElementById("gameCanvas");
canvas.width=600;
canvas.height=600;
var tileSize=canvas.width/3;
var ctx=canvas.getContext("2d");
var board=[1,2,0,
           0,0,0,
           0,0,0];
var iAmPlayerOne=true;
var myNumber=2;
var computerNumber=1;
if(iAmPlayerOne){
    myNumber=1;
    computerNumber=2;
}
function update(){
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
            var tilePos=[(i%3)*200,Math.floor(i/3)*200];
            var xMargin=[10,10];
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
            var tilePos=[(i%3)*200,Math.floor(i/3)*200];
            var circleCenter=[tilePos[0]+Math.floor(tileSize/2),tilePos[1]+Math.floor(tileSize/2)];
            var circleMargin=10;
            var circleRadius=Math.floor(tileSize/2)-circleMargin;
            ctx.beginPath();
            ctx.arc(circleCenter[0], circleCenter[1], circleRadius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    requestAnimationFrame(update);
}
document.onmousedown = (event) => {
    var x = event.clientX;
    var y = event.clientY;
    if(x<canvas.width && y<canvas.height){
        var squareIndex=Math.floor(y/200)*3+Math.floor(x/200);
        board[squareIndex]=myNumber;
    }
}
requestAnimationFrame(update);