var canvas=document.getElementById("gameCanvas");
var winText=document.getElementById("winText");
canvas.width=600;
canvas.height=600;
var tileSize=canvas.width/3;
var ctx=canvas.getContext("2d");

var board=[0,0,0,
           0,0,0,
           0,0,0];
var iAmPlayerOne=true;
var myTurn=true;
var myNumber=1;
var computerNumber=2;

function resetGame(){
    winText.innerHTML="";
    board=[0,0,0,
           0,0,0,
           0,0,0];
    iAmPlayerOne=true;
    myTurn=true;
    myNumber=1;
    computerNumber=2;
    if(Math.floor(Math.random()*2)==0){
        //computer is player one
        iAmPlayerOne=false;
        myTurn=false;
        myNumber=2;
        computerNumber=1;
        setTimeout(computerMove,500);
    }
}

resetGame();

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
var bestMove=0;
function computerMove(){
    if(!checkWin()){
        console.log(miniMax(9,computerNumber));
        board[bestMove]=computerNumber;
        myTurn=true;
        if(checkWin()){
            displayWin(checkWin());
        }
    }
}

function miniMax(depthLeft,player){
    if(depthLeft==0 || scoreBoard()!=0){
        if(player==1){
            return scoreBoard();
        }
        else{
            return -scoreBoard();
        }
    }
    var bestScore=-2;
    var boardIsFull=true;
    for(var i=0;i<board.length;i++){
        if(board[i]==0){
            board[i]=player;
            boardIsFull=false;
            var nextPlayer=1;
            if(player==1){
                nextPlayer=2;
            }
            var score=-miniMax(depthLeft-1,nextPlayer);
            console.log(score)
            if(score>bestScore){
                bestScore=score;
                if(depthLeft==9){
                    bestMove=i;
                }
            }
            board[i]=0;
        }
    }
    if(boardIsFull){
        return 0;
    }   
    return bestScore;
}

function scoreBoard(){
    for(var i=1;i<3;i++){
        if(board[0]==i && board[1]==i && board[2]==i){
            //converts 1 and 2 to -1 and 1
            return i*2-3;
        }
        if(board[3]==i && board[4]==i && board[5]==i){
            return i*2-3;
        }
        if(board[6]==i && board[7]==i && board[8]==i){
            return i*2-3;
        }
        if(board[0]==i && board[3]==i && board[6]==i){
            return i*2-3;
        }
        if(board[1]==i && board[4]==i && board[7]==i){
            return i*2-3;
        }
        if(board[2]==i && board[5]==i && board[8]==i){
            return i*2-3;
        }
        if(board[0]==i && board[4]==i && board[8]==i){
            return i*2-3;
        }
        if(board[2]==i && board[4]==i && board[6]==i){
            return i*2-3;
        }
    }
    return 0;
}

function checkWin(){
    for(var i=1;i<3;i++){
        if(board[0]==i && board[1]==i && board[2]==i){
            return i;
        }
        if(board[3]==i && board[4]==i && board[5]==i){
            return i;
        }
        if(board[6]==i && board[7]==i && board[8]==i){
            return i;
        }
        if(board[0]==i && board[3]==i && board[6]==i){
            return i;
        }
        if(board[1]==i && board[4]==i && board[7]==i){
            return i;
        }
        if(board[2]==i && board[5]==i && board[8]==i){
            return i;
        }
        if(board[0]==i && board[4]==i && board[8]==i){
            return i;
        }
        if(board[2]==i && board[4]==i && board[6]==i){
            return i;
        }
    }
    var boardIsFull=true;
    for(var i=0;i<board.length;i++){
        if(board[i]==0){
            boardIsFull=false;
            break;
        }
    }
    if(boardIsFull){
        return 3;
    }
    return 0;
}

function displayWin(player){
    if(player==myNumber){
        winText.innerHTML="You Win";
    }
    else if(player==computerNumber){
        winText.innerHTML="Computer Wins";
    }
    else{
        winText.innerHTML="Draw";
    }
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
                if(checkWin()){
                    displayWin(checkWin());
                }
                setTimeout(computerMove,500);
            }
        }
    }
    else{
        resetGame();
    }
}
requestAnimationFrame(update);