'use strict';
var canvas=document.getElementById("boardCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var width=canvas.width;
var height=canvas.height;
var boardMargin=Math.floor((width-480)/2);
var ctx=canvas.getContext("2d");
var chessbot=new Version12("black");

function loadImage(url){
    return new Promise(function(myResolve){
        var image = new Image();
    	image.onload = function () {
            myResolve(image);
    	};
    	image.src = url;
    });
}

var whitePawnImage=null;
var whiteKnightImage=null;
var whiteBishopImage=null;
var whiteRookImage=null;
var whiteQueenImage=null;
var whiteKingImage=null;
var blackPawnImage=null;
var blackKnightImage=null;
var blackBishopImage=null;
var blackRookImage=null;
var blackQueenImage=null;
var blackKingImage=null;

async function loadImages(){
    blackPawnImage=await loadImage("./chess pieces/black pawn.png");
    blackKnightImage=await loadImage("./chess pieces/black knight.png");
    blackBishopImage=await loadImage("./chess pieces/black bishop.png");
    blackRookImage=await loadImage("./chess pieces/black rook.png");
    blackQueenImage=await loadImage("./chess pieces/black queen.png");
    blackKingImage=await loadImage("./chess pieces/black king.png");

    whitePawnImage=await loadImage("./chess pieces/white pawn.png");
    whiteKnightImage=await loadImage("./chess pieces/white knight.png");
    whiteBishopImage=await loadImage("./chess pieces/white bishop.png");
    whiteRookImage=await loadImage("./chess pieces/white rook.png");
    whiteQueenImage=await loadImage("./chess pieces/white queen.png");
    whiteKingImage=await loadImage("./chess pieces/white king.png");
    update();
}
var board=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
board[0]=14;
board[1]=12;
board[2]=13;
board[3]=15;
board[4]=16;
board[5]=13;
board[6]=12;
board[7]=14;

for(var i=0;i<8;i++){
    board[8+i]=11;
}
board[56]=4;
board[57]=2;
board[58]=3;
board[59]=5;
board[60]=6;
board[61]=3;
board[62]=2;
board[63]=4;
for(var i=0;i<8;i++){
    board[48+i]=1;
}

function displayBoard(board){
    var pieceNumbers=[1,2,3,4,5,6,11,12,13,14,15,16];
    var pieceImages=[whitePawnImage,whiteKnightImage,whiteBishopImage,whiteRookImage,whiteQueenImage,whiteKingImage,
                    blackPawnImage,blackKnightImage,blackBishopImage,blackRookImage,blackQueenImage,blackKingImage]; 
    for(var i=0;i<board.length;i++){
        var pieceNumber=board[i];
        if(pieceNumber!=0){
            var piecePos=[boardMargin+i%8*60,Math.floor(i/8)*60];
            var pieceImage=pieceImages[pieceNumbers.indexOf(pieceNumber)];
            ctx.drawImage(pieceImage,piecePos[0],piecePos[1]);
        }
    }
}

function onBoard(start_index,x,y){
    if(start_index+y*8+x<0 || start_index+y*8+x>63){
        return false;
    }
    if(Math.floor((start_index+x)/8)!=Math.floor(start_index/8)){
        return false;
    }
    return true;
}

function isBlack(pieceIndex){
    if(board[pieceIndex]>10){
        return true;
    }
    return false;
}
function isWhite(pieceIndex){
    if(board[pieceIndex]>0 && board[pieceIndex]<10){
        return true;
    }
    return false;
}
function isEmpty(pieceIndex){
    if(board[pieceIndex]==0){
        return true;
    }
    return false;
}
function whiteInCheck(){
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,-i,i)){
            var piece=board[whiteKingPosition+i*7];
            if(piece==13 || piece==15){
                return true;
            }
            else if(i==1){
                if(piece==16){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition+i*7)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,i,i)){
            var piece=board[whiteKingPosition+i*9];
            if(piece==13 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition+i*9)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,-i,-i)){
            var piece=board[whiteKingPosition+i*-9];
            if(piece==13 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16 || piece==11){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition+i*-9)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,i,-i)){
            var piece=board[whiteKingPosition+i*-7];
            if(piece==13 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16 || piece==11){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition+i*-7)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,i,0)){
            var piece=board[whiteKingPosition+i];
            if(piece==14 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition+i)){
                break;
            }
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,-i,0)){
            var piece=board[whiteKingPosition-i];
            if(piece==14 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition-i)){
                break;
            }
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,0,i)){
            var piece=board[whiteKingPosition+i*8];
            if(piece==14 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition+i*8)){
                break;
            }
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(whiteKingPosition,0,-i)){
            var piece=board[whiteKingPosition-i*8];
            if(piece==14 || piece==15){
                return true;
            }
            if(i==1){
                if(piece==16){
                    return true;
                }
            }
            if(!isEmpty(whiteKingPosition-i*8)){
                break;
            }
        }
    }
    //knight
    if(onBoard(whiteKingPosition,2,1) && board[whiteKingPosition+10]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,2,-1) && board[whiteKingPosition-6]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,1,-2) && board[whiteKingPosition-15]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,1,2) && board[whiteKingPosition+17]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,-2,1) && board[whiteKingPosition+6]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,-2,-1) && board[whiteKingPosition-10]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,-1,-2) && board[whiteKingPosition-17]==12){
        return true;
    }
    if(onBoard(whiteKingPosition,-1,2) && board[whiteKingPosition+15]==12){
        return true;
    }
    return false;
}

function blackInCheck(){
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,-i,i)){
            var piece=board[blackKingPosition+i*7];
            if(piece==3 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6 || piece==1){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition+i*7)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,i,i)){
            var piece=board[blackKingPosition+i*9];
            if(piece==3 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6 || piece==1){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition+i*9)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,-i,-i)){
            var piece=board[blackKingPosition+i*-9];
            if(piece==3 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition+i*-9)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,i,-i)){
            var piece=board[blackKingPosition+i*-7];
            if(piece==3 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition+i*-7)){
                break;
            }
        }
        else{
            break;
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,i,0)){
            var piece=board[blackKingPosition+i];
            if(piece==4 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition+i)){
                break;
            }
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,-i,0)){
            var piece=board[blackKingPosition-i];
            if(piece==4 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition-i)){
                break;
            }
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,0,i)){
            var piece=board[blackKingPosition+i*8];
            if(piece==4 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition+i*8)){
                break;
            }
        }
    }
    for(var i=1;i<8;i++){
        if(onBoard(blackKingPosition,0,-i)){
            var piece=board[blackKingPosition-i*8];
            if(piece==4 || piece==5){
                return true;
            }
            if(i==1){
                if(piece==6){
                    return true;
                }
            }
            if(!isEmpty(blackKingPosition-i*8)){
                break;
            }
        }
    }
    //knight
    if(onBoard(blackKingPosition,2,1) && board[blackKingPosition+10]==2){
        return true;
    }
    if(onBoard(blackKingPosition,2,-1) && board[blackKingPosition-6]==2){
        return true;
    }
    if(onBoard(blackKingPosition,1,-2) && board[blackKingPosition-15]==2){
        return true;
    }
    if(onBoard(blackKingPosition,1,2) && board[blackKingPosition+17]==2){
        return true;
    }
    if(onBoard(blackKingPosition,-2,1) && board[blackKingPosition+6]==2){
        return true;
    }
    if(onBoard(blackKingPosition,-2,-1) && board[blackKingPosition-10]==2){
        return true;
    }
    if(onBoard(blackKingPosition,-1,-2) && board[blackKingPosition-17]==2){
        return true;
    }
    if(onBoard(blackKingPosition,-1,2) && board[blackKingPosition+15]==2){
        return true;
    }
    return false;
}


function removeIllegalMoves(pieceIndex,moves){
    var pieceIsBlack=isBlack(pieceIndex);
    var legalMoves=[];
    for(var i=0;i<moves.length;i++){
        var move=moves[i];
        var removedValue=board[move];
        board[move]=board[pieceIndex];
        board[pieceIndex]=0;
        if(board[move]==6){
            whiteKingPosition=move;
        }
        else if(board[move]==16){
            blackKingPosition=move;
        }
        if(pieceIsBlack && !blackInCheck()){
            legalMoves.push(move);
        }
        else if(!pieceIsBlack && !whiteInCheck()){
            legalMoves.push(move);
        }
        board[pieceIndex]=board[move];
        board[move]=removedValue;
        if(board[pieceIndex]==6){
            whiteKingPosition=pieceIndex;
        }
        else if(board[pieceIndex]==16){
            blackKingPosition=pieceIndex;
        }
    }
    return legalMoves;
}

function getValidMoves(pieceIndex){
    var pieceNumber=board[pieceIndex];
    //black pawn
    if(pieceNumber==11){
        var moves=[];
        if(onBoard(pieceIndex,0,1) && isEmpty(pieceIndex+8)){
            moves.push(pieceIndex+8);
        }
        if(onBoard(pieceIndex,-1,1) && isWhite(pieceIndex+7)){
            moves.push(pieceIndex+7);
        }
        if(onBoard(pieceIndex,1,1) && isWhite(pieceIndex+9)){
            moves.push(pieceIndex+9);
        }
        if(pieceIndex>=8 && pieceIndex<=15){
            if(isEmpty(pieceIndex+8) && isEmpty(pieceIndex+16)){
                moves.push(pieceIndex+16);
            }
        }
        return moves;
    }
    //white pawn
    else if(pieceNumber==1){
        var moves=[];
        if(onBoard(pieceIndex,0,-1) && isEmpty(pieceIndex-8)){
            moves.push(pieceIndex-8);
        }
        if(onBoard(pieceIndex,-1,-1) && isBlack(pieceIndex-9)){
            moves.push(pieceIndex-9);
        }
        if(onBoard(pieceIndex,1,-1) && isBlack(pieceIndex-7)){
            moves.push(pieceIndex-7);
        }
        if(pieceIndex>=48 && pieceIndex<=55){
            if(isEmpty(pieceIndex-8) && isEmpty(pieceIndex-16)){
                moves.push(pieceIndex-16);
            }
        }
        return moves;
    }
    //black knight
    else if(pieceNumber==12){
        var moves=[];
        if(onBoard(pieceIndex,2,1) && !isBlack(pieceIndex+10)){
            moves.push(pieceIndex+10);
        }
        if(onBoard(pieceIndex,2,-1) && !isBlack(pieceIndex-6)){
            moves.push(pieceIndex-6);
        }
        if(onBoard(pieceIndex,-2,1) && !isBlack(pieceIndex+6)){
            moves.push(pieceIndex+6);
        }
        if(onBoard(pieceIndex,-2,-1) && !isBlack(pieceIndex-10)){
            moves.push(pieceIndex-10);
        }
        if(onBoard(pieceIndex,1,2) && !isBlack(pieceIndex+17)){
            moves.push(pieceIndex+17);
        }
        if(onBoard(pieceIndex,1,-2) && !isBlack(pieceIndex-15)){
            moves.push(pieceIndex-15);
        }
        if(onBoard(pieceIndex,-1,2) && !isBlack(pieceIndex+15)){
            moves.push(pieceIndex+15);
        }
        if(onBoard(pieceIndex,-1,-2) && !isBlack(pieceIndex-17)){
            moves.push(pieceIndex-17);
        }
        return moves;
    }
    //white knight
    else if(pieceNumber==2){
        var moves=[];
        if(onBoard(pieceIndex,2,1) && !isWhite(pieceIndex+10)){
            moves.push(pieceIndex+10);
        }
        if(onBoard(pieceIndex,2,-1) && !isWhite(pieceIndex-6)){
            moves.push(pieceIndex-6);
        }
        if(onBoard(pieceIndex,-2,1) && !isWhite(pieceIndex+6)){
            moves.push(pieceIndex+6);
        }
        if(onBoard(pieceIndex,-2,-1) && !isWhite(pieceIndex-10)){
            moves.push(pieceIndex-10);
        }
        if(onBoard(pieceIndex,1,2) && !isWhite(pieceIndex+17)){
            moves.push(pieceIndex+17);
        }
        if(onBoard(pieceIndex,1,-2) && !isWhite(pieceIndex-15)){
            moves.push(pieceIndex-15);
        }
        if(onBoard(pieceIndex,-1,2) && !isWhite(pieceIndex+15)){
            moves.push(pieceIndex+15);
        }
        if(onBoard(pieceIndex,-1,-2) && !isWhite(pieceIndex-17)){
            moves.push(pieceIndex-17);
        }
        return moves;
    }
    //black bishop
    else if(pieceNumber==13){
        var moves=[];
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,i)){
                if(isBlack(pieceIndex+i*9)){
                    break;
                }
                moves.push(pieceIndex+i*9);
                if(isWhite(pieceIndex+i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,i)){
                if(isBlack(pieceIndex+i*7)){
                    break;
                }
                moves.push(pieceIndex+i*7);
                if(isWhite(pieceIndex+i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,-i)){
                if(isBlack(pieceIndex-i*9)){
                    break;
                }
                moves.push(pieceIndex-i*9);
                if(isWhite(pieceIndex-i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,-i)){
                if(isBlack(pieceIndex-i*7)){
                    break;
                }
                moves.push(pieceIndex-i*7);
                if(isWhite(pieceIndex-i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        return moves;
    }
    //white bishop
    else if(pieceNumber==3){
        var moves=[];
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,i)){
                if(isWhite(pieceIndex+i*9)){
                    break;
                }
                moves.push(pieceIndex+i*9);
                if(isBlack(pieceIndex+i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,i)){
                if(isWhite(pieceIndex+i*7)){
                    break;
                }
                moves.push(pieceIndex+i*7);
                if(isBlack(pieceIndex+i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,-i)){
                if(isWhite(pieceIndex-i*9)){
                    break;
                }
                moves.push(pieceIndex-i*9);
                if(isBlack(pieceIndex-i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,-i)){
                if(isWhite(pieceIndex-i*7)){
                    break;
                }
                moves.push(pieceIndex-i*7);
                if(isBlack(pieceIndex-i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        return moves;
    }
    //black rook
    else if(pieceNumber==14){
        var moves=[];
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,0)){
                if(isBlack(pieceIndex+i)){
                    break;
                }
                moves.push(pieceIndex+i);
                if(isWhite(pieceIndex+i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,0)){
                if(isBlack(pieceIndex-i)){
                    break;
                }
                moves.push(pieceIndex-i);
                if(isWhite(pieceIndex-i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,i)){
                if(isBlack(pieceIndex+i*8)){
                    break;
                }
                moves.push(pieceIndex+i*8);
                if(isWhite(pieceIndex+i*8)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,-i)){
                if(isBlack(pieceIndex-i*8)){
                    break;
                }
                moves.push(pieceIndex-i*8);
                if(isWhite(pieceIndex-i*8)){
                    break;
                }
            }
        }
        return moves;
    }
    //white rook
    else if(pieceNumber==4){
        var moves=[];
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,0)){
                if(isWhite(pieceIndex+i)){
                    break;
                }
                moves.push(pieceIndex+i);
                if(isBlack(pieceIndex+i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,0)){
                if(isWhite(pieceIndex-i)){
                    break;
                }
                moves.push(pieceIndex-i);
                if(isBlack(pieceIndex-i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,i)){
                if(isWhite(pieceIndex+i*8)){
                    break;
                }
                moves.push(pieceIndex+i*8);
                if(isBlack(pieceIndex+i*8)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,-i)){
                if(isWhite(pieceIndex-i*8)){
                    break;
                }
                moves.push(pieceIndex-i*8);
                if(isBlack(pieceIndex-i*8)){
                    break;
                }
            }
        }
        return moves;
    }
    //black queen
    else if(pieceNumber==15){
        var moves=[];
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,0)){
                if(isBlack(pieceIndex+i)){
                    break;
                }
                moves.push(pieceIndex+i);
                if(isWhite(pieceIndex+i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,0)){
                if(isBlack(pieceIndex-i)){
                    break;
                }
                moves.push(pieceIndex-i);
                if(isWhite(pieceIndex-i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,i)){
                if(isBlack(pieceIndex+i*8)){
                    break;
                }
                moves.push(pieceIndex+i*8);
                if(isWhite(pieceIndex+i*8)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,-i)){
                if(isBlack(pieceIndex-i*8)){
                    break;
                }
                moves.push(pieceIndex-i*8);
                if(isWhite(pieceIndex-i*8)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,i)){
                if(isBlack(pieceIndex+i*9)){
                    break;
                }
                moves.push(pieceIndex+i*9);
                if(isWhite(pieceIndex+i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,i)){
                if(isBlack(pieceIndex+i*7)){
                    break;
                }
                moves.push(pieceIndex+i*7);
                if(isWhite(pieceIndex+i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,-i)){
                if(isBlack(pieceIndex-i*9)){
                    break;
                }
                moves.push(pieceIndex-i*9);
                if(isWhite(pieceIndex-i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,-i)){
                if(isBlack(pieceIndex-i*7)){
                    break;
                }
                moves.push(pieceIndex-i*7);
                if(isWhite(pieceIndex-i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        return moves;
    }
    //white queen
    else if(pieceNumber==5){
        var moves=[];
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,0)){
                if(isWhite(pieceIndex+i)){
                    break;
                }
                moves.push(pieceIndex+i);
                if(isBlack(pieceIndex+i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,0)){
                if(isWhite(pieceIndex-i)){
                    break;
                }
                moves.push(pieceIndex-i);
                if(isBlack(pieceIndex-i)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,i)){
                if(isWhite(pieceIndex+i*8)){
                    break;
                }
                moves.push(pieceIndex+i*8);
                if(isBlack(pieceIndex+i*8)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,0,-i)){
                if(isWhite(pieceIndex-i*8)){
                    break;
                }
                moves.push(pieceIndex-i*8);
                if(isBlack(pieceIndex-i*8)){
                    break;
                }
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,i)){
                if(isWhite(pieceIndex+i*9)){
                    break;
                }
                moves.push(pieceIndex+i*9);
                if(isBlack(pieceIndex+i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,i)){
                if(isWhite(pieceIndex+i*7)){
                    break;
                }
                moves.push(pieceIndex+i*7);
                if(isBlack(pieceIndex+i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,-i,-i)){
                if(isWhite(pieceIndex-i*9)){
                    break;
                }
                moves.push(pieceIndex-i*9);
                if(isBlack(pieceIndex-i*9)){
                    break;
                }
            }
            else{
                break;
            }
        }
        for(var i=1;i<8;i++){
            if(onBoard(pieceIndex,i,-i)){
                if(isWhite(pieceIndex-i*7)){
                    break;
                }
                moves.push(pieceIndex-i*7);
                if(isBlack(pieceIndex-i*7)){
                    break;
                }
            }
            else{
                break;
            }
        }
        return moves;
    }
    //black king
    else if(pieceNumber==16){
        moves=[];
        if(onBoard(pieceIndex,1,0) && !isBlack(pieceIndex+1)){
            moves.push(pieceIndex+1);
        }
        if(onBoard(pieceIndex,1,-1) && !isBlack(pieceIndex-7)){
            moves.push(pieceIndex-7);
        }
        if(onBoard(pieceIndex,0,-1) && !isBlack(pieceIndex-8)){
            moves.push(pieceIndex-8);
        }
        if(onBoard(pieceIndex,-1,-1) && !isBlack(pieceIndex-9)){
            moves.push(pieceIndex-9);
        }
        if(onBoard(pieceIndex,-1,0) && !isBlack(pieceIndex-1)){
            moves.push(pieceIndex-1);
        }
        if(onBoard(pieceIndex,-1,1) && !isBlack(pieceIndex+7)){
            moves.push(pieceIndex+7);
        }
        if(onBoard(pieceIndex,0,1) && !isBlack(pieceIndex+8)){
            moves.push(pieceIndex+8);
        }
        if(onBoard(pieceIndex,1,1) && !isBlack(pieceIndex+9)){
            moves.push(pieceIndex+9);
        }
        return moves;
    }
    //white king
    else if(pieceNumber==6){
        moves=[];
        if(onBoard(pieceIndex,1,0) && !isWhite(pieceIndex+1)){
            moves.push(pieceIndex+1);
        }
        if(onBoard(pieceIndex,1,-1) && !isWhite(pieceIndex-7)){
            moves.push(pieceIndex-7);
        }
        if(onBoard(pieceIndex,0,-1) && !isWhite(pieceIndex-8)){
            moves.push(pieceIndex-8);
        }
        if(onBoard(pieceIndex,-1,-1) && !isWhite(pieceIndex-9)){
            moves.push(pieceIndex-9);
        }
        if(onBoard(pieceIndex,-1,0) && !isWhite(pieceIndex-1)){
            moves.push(pieceIndex-1);
        }
        if(onBoard(pieceIndex,-1,1) && !isWhite(pieceIndex+7)){
            moves.push(pieceIndex+7);
        }
        if(onBoard(pieceIndex,0,1) && !isWhite(pieceIndex+8)){
            moves.push(pieceIndex+8);
        }
        if(onBoard(pieceIndex,1,1) && !isWhite(pieceIndex+9)){
            moves.push(pieceIndex+9);
        }
        if(canCastleRight && isEmpty(61) && isEmpty(62)){
            moves.push(62);
        }
        if(canCastleLeft && isEmpty(59) && isEmpty(58) && isEmpty(57)){
            moves.push(58);
        }
        return moves;
    }
    return [];
}

	
function botMove(){
	var move=chessbot.getMove();
	var bestPiece=move[0];
	var bestMove=move[1];
	board[bestMove]=board[bestPiece];
	board[bestPiece]=0;
	if(bestMove>55 && board[bestMove]==11){
		board[bestMove]=15;
	}
	else if(bestMove<8 && board[bestMove]==1){
		board[bestMove]=5;
	}
	if(board[bestMove]==16){
		blackKingPosition=bestMove;
	}
	botsTurn=false;
	botDisplayMove=bestMove;
    botDisplayPiece=bestPiece;
	update();
}

var pawnPositions=[2,2,2,2,2,2,2,2,
                   6,6,6,6,6,6,6,6,
                   3,3,4,5,5,4,3,3,
                   2,2,3,5,5,3,2,2,
                   2,3,3,5,5,3,3,2,
                   3,3,4,2,2,4,3,3,
                   2,3,3,0,0,3,3,2,
                   2,2,2,2,2,2,2,2];

var pawnEndgamePositions=[8,8,8,8,8,8,8,8,
                           7,7,7,7,7,7,7,7,
                           6,6,6,6,6,6,6,6,
                           5,5,5,5,5,5,5,5,
                           4,4,4,4,4,4,4,4,
                           3,3,3,3,3,3,3,3,
                           2,2,2,2,2,2,2,2,
                           2,2,2,2,2,2,2,2];

var knightPositions=[0,1,2,2,2,2,1,0,
                   1,3,4,4,4,4,3,1,
                   2,4,5,5,5,5,4,2,
                   2,4,5,6,6,5,4,2,
                   2,4,5,6,6,5,4,2,
                   2,4,5,5,5,5,4,2,
                   1,3,4,4,4,4,3,1,
                   0,1,2,2,2,2,1,0];

var bishopPositions=[0,2,2,2,2,2,2,0,
                   2,4,4,4,4,4,4,2,
                   2,4,4,5,5,4,4,2,
                   2,4,4,5,5,4,4,2,
                   2,4,6,5,5,6,4,2,
                   2,5,5,5,5,5,5,2,
                   2,3,4,4,4,4,3,2,
                   3,2,2,2,2,2,2,3];

var rookPositions=[3,3,3,3,3,3,3,3,
                   4,6,6,6,6,6,6,4,
                   0,3,3,3,3,3,3,0,
                   0,2,2,2,2,2,2,0,
                   0,2,2,2,2,2,2,0,
                   0,2,2,2,2,2,2,0,
                   0,2,2,2,2,2,2,0,
                   2,1,2,3,3,2,1,2];

var queenPositions=[0,2,2,3,3,2,2,0,
                   2,4,4,4,4,4,4,2,
                   2,4,5,5,5,5,4,2,
                   3,4,5,5,5,5,4,3,
                   4,4,5,5,5,5,4,3,
                   2,5,5,5,5,5,4,2,
                   2,4,5,5,5,4,4,2,
                   0,2,2,3,3,2,2,0];

var kingPositions=[1,1,1,0,0,1,1,1,
                   1,1,1,0,0,1,1,1,
                   2,1,1,0,0,1,1,2,
                   2,1,1,0,0,1,1,2,
                   3,2,2,0,0,2,2,3,
                   3,2,2,2,2,2,2,3,
                   4,4,3,3,3,3,4,4,
                   4,5,3,3,3,3,5,4];

var kingEndgamePositions=[ 0,1,1,1,1,1,1,0,
                           1,1,2,2,2,2,1,1,
                           1,2,3,4,4,3,2,1,
                           1,2,4,4,4,4,2,1,
                           1,2,4,5,5,4,2,1,
                           1,2,4,4,4,4,2,1,
                           1,1,2,2,2,2,1,1,
                           0,1,1,1,1,1,1,0];

var botsTurn=false;
var canCastleRight=true;
var canCastleLeft=true;
var whiteKingPosition=60;
var blackKingPosition=4;
var botDisplayMove=-1;
var botDisplayPiece=-1;
function update(){
    checkmate();
    ctx.fillStyle="rgb(46, 38, 22)";
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle="rgb(201, 166, 101)";
    ctx.fillRect(boardMargin,0,480,480);
    ctx.fillStyle="rgb(74, 61, 38)";
    for(var x=0;x<8;x++){
        for(var y=0;y<8;y++){
            if(y%2==1){
                if(x%2==0){
                    ctx.fillRect(boardMargin+x*60,y*60,60,60);
                }
            }
            else{
                if(x%2==1){
                    ctx.fillRect(boardMargin+x*60,y*60,60,60);
                }
            }
        }
    }
    ctx.fillStyle="rgba(255,255,0,.7)";
    if(selectedIndex>-1){
        ctx.fillRect(selectedIndex%8*60+boardMargin,Math.floor(selectedIndex/8)*60,60,60);
        var validMoves=getValidMoves(selectedIndex);
        validMoves=removeIllegalMoves(selectedIndex,validMoves);
        ctx.fillStyle="rgba(255,160,0,.7)";
        for(var i=0;i<validMoves.length;i++){
            ctx.fillRect(validMoves[i]%8*60+boardMargin,Math.floor(validMoves[i]/8)*60,60,60);
        }
    }
    if(botDisplayPiece!=-1){
        ctx.fillStyle="rgb(240, 200, 22,.7)";
        ctx.fillRect(botDisplayPiece%8*60+boardMargin,Math.floor(botDisplayPiece/8)*60,60,60);
        ctx.fillRect(botDisplayMove%8*60+boardMargin,Math.floor(botDisplayMove/8)*60,60,60);
    }
    displayBoard(board);
    if(botsTurn){
        botsTurn=false;
        setTimeout(botMove,100);
    }
}

function displayEndText(message){
    var textElement=document.getElementById("endgameText");
    if(message=="win"){
        textElement.style.color="rgb(30, 163, 3)";
        if(chessbot.thinkTime==0){
            textElement.innerHTML="Checkmate! You are SO good at chess";
        }
        else if(chessbot.thinkTime==20){
            textElement.innerHTML="Checkmate! I guess you're luckier than me...";
        }
        else if(chessbot.thinkTime==100){
            textElement.innerHTML="Checkmate! I'm getting a little aggravated...";
        }
        else if(chessbot.thinkTime==500){
            textElement.innerHTML="Checkmate! Somehow I didn't see that...";
        }
        else if(chessbot.thinkTime==1000){
            textElement.innerHTML="Checkmate! I need to study...";
        }
        else if(chessbot.thinkTime==3000){
            textElement.innerHTML="Checkmate! You're not supposed to win...";
        }
        else if(chessbot.thinkTime==5000){
            textElement.innerHTML="Checkmate! Impossible!";
        }
    }
    else if(message=="lose"){
        textElement.style.color="rgb(190, 30, 3)";
        if(chessbot.thinkTime==0){
            textElement.innerHTML="Checkmate! I guess chess isn't your thing...";
        }
        else if(chessbot.thinkTime==20){
            textElement.innerHTML="Checkmate! Not everyone is as lucky as me";
        }
        else if(chessbot.thinkTime==100){
            textElement.innerHTML="Checkmate! Are you feeling aggravated?";
        }
        else if(chessbot.thinkTime==500){
            textElement.innerHTML="Checkmate! I saw this possibility 14 moves ago";
        }
        else if(chessbot.thinkTime==1000){
            textElement.innerHTML="Checkmate! It seems like you need more education";
        }
        else if(chessbot.thinkTime==3000){
            textElement.innerHTML="Checkmate! How does it feel to be devoured?";
        }
        else if(chessbot.thinkTime==5000){
            textElement.innerHTML="Checkmate! Did you really think you could win?";
        }
    }
    else{
        textElement.style.color="rgb(190, 190, 3)";
        if(chessbot.thinkTime==0){
            textElement.innerHTML="Stalemate! You shouldn't have done that";
        }
        else if(chessbot.thinkTime==20){
            textElement.innerHTML="Stalemate! Thats unlucky";
        }
        else if(chessbot.thinkTime==100){
            textElement.innerHTML="Stalemate! This is so aggravating";
        }
        else if(chessbot.thinkTime==500){
            textElement.innerHTML="Stalemate! How did I not see that?";
        }
        else if(chessbot.thinkTime==1000){
            textElement.innerHTML="Stalemate! I see that you haven't ready Edward's guide to stalemates";
        }
        else if(chessbot.thinkTime==3000){
            textElement.innerHTML="Stalemate! You got away this time...";
        }
        else if(chessbot.thinkTime==5000){
            textElement.innerHTML="Stalemate! This is the closest you'll ever get to winning";
        }
    }
}

function checkmate(){
    //the name checkCheckmate was considered but deem too wordy
    var whiteCanMove=false;
    var blackCanMove=false;
    for(var i=0;i<board.length;i++){
        if(isWhite(i)){
            var pieceMoves=getValidMoves(i);
            pieceMoves=removeIllegalMoves(i,pieceMoves);
            if(pieceMoves.length>0){
                whiteCanMove=true;
                break;
            }
        }
    }
    for(var i=0;i<board.length;i++){
        if(isBlack(i)){
            var pieceMoves=getValidMoves(i);
            pieceMoves=removeIllegalMoves(i,pieceMoves);
            if(pieceMoves.length>0){
                blackCanMove=true;
                break;
            }
        }
    }
    if(!whiteCanMove){
        if(whiteInCheck()){
            displayEndText("lose");
        }
        else if(!botsTurn){
            displayEndText("stalemate");
        }
    }
    else if(!blackCanMove){
        if(blackInCheck()){
            displayEndText("win");
        }
        else if(botsTurn){
            displayEndText("stalemate");
        }
    }
}

var selectedIndex=-1;
function clickBoard(event){
    var xPos=event.clientX;
    var yPos=event.clientY;
    var x=Math.floor((xPos-boardMargin)/60);
    x=Math.max(0,x);
    x=Math.min(7,x);
    var y=Math.floor(yPos/60);
    y=Math.min(7,y);
    var newSelectedIndex=y*8+x;
    if(selectedIndex>-1){
        if(board[selectedIndex]!=0){
            if(removeIllegalMoves(selectedIndex,getValidMoves(selectedIndex)).includes(newSelectedIndex)){
                var deletedValue=board[newSelectedIndex];;
                board[newSelectedIndex]=board[selectedIndex];
                board[selectedIndex]=0;
                if(newSelectedIndex<8 && board[newSelectedIndex]==1){
                    board[newSelectedIndex]=5;
                }
                if(selectedIndex==56){
                    canCastleLeft=false
                }
                else if(selectedIndex==63){
                    canCastleRight=false;
                }
                else if(selectedIndex==60){
                    canCastleRight=false;
                    canCastleLeft=false
                    if(board[newSelectedIndex]==6){
                        if(newSelectedIndex==62){
                            board[61]=4;
                            board[63]=0;
                        }
                        else if(newSelectedIndex==58){
                            board[59]=4;
                            board[56]=0;
                        }
                    }
                }
                if(board[newSelectedIndex]==6){
                    whiteKingPosition=newSelectedIndex;
                }
                botsTurn=true;
                botDisplayMove=-1;
                botDisplayPiece=-1;
            }
            selectedIndex=-1;
        }
    }
    else{
        if(board[newSelectedIndex]<10 && board[newSelectedIndex]!=0){
            selectedIndex=newSelectedIndex;
        }
    }
}
function startGame(botNumber){
    document.getElementById("botSelect").style.display="none";
    canvas.onmousedown=function(e){
        clickBoard(e);
        update();

   }
   chessbot.thinkTime=botNumber;
}
