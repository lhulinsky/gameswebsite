//actually converts pawns to queens in the search algorithm what
class Version12{
	constructor(color){
		this.isWhite=true;
		if(color=="black"){
			this.isWhite=false;
		}
		this.bestMove=0;
		this.bestPiece=0;
		this.currentDepthBestMove=0;
		this.currentDepthBestPiece=0;
		this.isEndGame=false;
		this.firstMove=true;
		this.thinkTime=50;
		this.previousBoards=[];
		this.previousMoves=[];
		this.transpositionTable=new TranspositionTable12();
		this.transpositionsUsed=0;
	}
	doRandomDefense(){
		if(board[36]==1){
			var random=Math.floor(Math.random()*6);
			//kings pawn
			if(random==0){
				//ruy lopez
				this.bestPiece=11;
				this.bestMove=19;
			}
			else if(random==1){
				//italian
				this.bestPiece=12;
				this.bestMove=28;
			}
			else if(random==2){
				//sicilian
				this.bestPiece=10;
				this.bestMove=26;
			}
			else if(random==3){
				//french
				this.bestPiece=12;
				this.bestMove=20;
			}
			else if(random==4){
				//caro-kann ish
				this.bestPiece=10;
				this.bestMove=18;
			}
			else if(random==5){
				//scandanavian
				this.bestPiece=11;
				this.bestMove=27;
			}
		}
		else{
			var random=Math.floor(Math.random()*6);
			//queens pawn
			if(random<2){
				//queens gambit
				this.bestPiece=11;
				this.bestMove=27;
			}
			else if(random==2){
				//indian
				this.bestPiece=6;
				this.bestMove=21;
			}
			else if(random==3){
				//dutch
				this.bestPiece=13;
				this.bestMove=29;
			}
			else if(random==4){
				//other
				this.bestPiece=10;
				this.bestMove=18;
			}
			else{
				var allMoves=[];
				for(var i=0;i<board.length;i++){
					if(isBlack(i)){
						var pieceMoves=getValidMoves(i);
						for(var u=0;u<pieceMoves.length;u++){
							allMoves.push([i,pieceMoves[u]]);
						}
					}
				}
				random=Math.floor(Math.random()*allMoves.length);
				this.bestPiece=allMoves[random][0];
				this.bestMove=allMoves[random][1];
			}
		}
	}
	
	doRandomOpening(){
		var random=Math.floor(Math.random()*8);
		if(random==0){
			//english
			this.bestPiece=50;
			this.bestMove=34;
		}
		else if(random==1){
			//reti
			this.bestPiece=62;
			this.bestMove=45;
		}
		else if(random==2){
			//barcza
			this.bestPiece=54;
			this.bestMove=46;
		}
		else if(random==3){
			//bird
			this.bestPiece=53;
			this.bestMove=37;
		}
		else if(random<=5){
			//kings pawn
			this.bestPiece=52;
			this.bestMove=36;
		}
		else if(random<=7){
			//queens pawn
			this.bestPiece=51;
			this.bestMove=35;
		}
	}
	
	resetBot(){
		this.bestMove=0;
		this.bestPiece=0;
		this.currentDepthBestMove=0;
		this.currentDepthBestPiece=0;
		this.isEndGame=false;
		this.firstMove=true;
		this.previousBoards=[];
		this.previousMoves=[];
		this.transpositionTable.clearTable();
	}
	
	getMove(){
		if(this.thinkTime>0){
			if(this.firstMove){
				this.firstMove=false;
				if(this.isWhite){
					this.doRandomOpening();
				}
				else{
					this.doRandomDefense();
				}
			}
			else{
				var searchStartTime=new Date().getTime();
				var score=0;
				this.transpositionsUsed=0;
				this.whiteTranspositionsUsed=0;
				for(var i=1;i<100;i++){
					if(this.isWhite){
						score=this.alphaBetaMin(-1000000,1000000,i,searchStartTime,0,true);
					}
					else{
						score=this.alphaBetaMax(-1000000,1000000,i,searchStartTime,0,true);
					}
					//only set it as the best move if the search finishes because I don't know how to make iterative deepening actually work
					if(new Date().getTime()-searchStartTime>this.thinkTime){
						break
					}
					else{
						this.bestMove=this.currentDepthBestMove;
						this.bestPiece=this.currentDepthBestPiece;
					}
				}
				//console.log([this.bestPiece,this.bestMove]);
				//console.log("time: "+(new Date().getTime()-searchStartTime));
				//console.log(this.isWhite);
				//console.log("depth: "+i);
				//console.log("score: "+score)
			}
		}
		else{
			this.randomMove()
		}
		var whiteNonPawnPieces=0;
		var blackNonPawnPieces=0;
		for(var i=0;i<board.length;i++){
			if(isWhite(i)){
				if(board[i]!=1){
					whiteNonPawnPieces+=1;
				}
			}
			else if(isBlack(i)){
				if(board[i]!=11){
					blackNonPawnPieces+=1;
				}
			}
		}
		if(whiteNonPawnPieces<4){
			this.isEndGame=true;
		}
		if(blackNonPawnPieces<4){
			this.isEndGame=true;
		}
		this.previousBoards.push(board);
		this.previousMoves.push([this.bestPiece,this.bestMove]);
		if(this.previousBoards.length>10){
			this.previousBoards=this.previousBoards.slice(1);
			this.previousMoves=this.previousMoves.slice(1);
		}
		return [this.bestPiece,this.bestMove]
	}
	
	randomMove(){
		var allMoves=[];
		for(var i=0;i<board.length;i++){
			if((isBlack(i) && !this.isWhite) || (isWhite(i) && this.isWhite)){
				var pieceMoves=getValidMoves(i);
				pieceMoves=removeIllegalMoves(i,pieceMoves);
				for(var u=0;u<pieceMoves.length;u++){
					allMoves.push([i,pieceMoves[u]]);
				}
			}
		}
		var random=Math.floor(Math.random()*allMoves.length);
		if(allMoves.length>0){
			this.bestPiece=allMoves[random][0];
			this.bestMove=allMoves[random][1];
		}
	}
	
	getValue(pieceNumber){
		if(pieceNumber==1){
			return 100;
		}
		if(pieceNumber==2){
			return 300;
		}
		if(pieceNumber==3){
			return 300;
		}
		if(pieceNumber==4){
			return 500;
		}
		if(pieceNumber==5){
			return 900;
		}
		if(pieceNumber==6){
			return 100000;
		}
		if(pieceNumber==11){
			return 100;
		}
		if(pieceNumber==12){
			return 300;
		}
		if(pieceNumber==13){
			return 300;
		}
		if(pieceNumber==14){
			return 500;
		}
		if(pieceNumber==15){
			return 900;
		}
		if(pieceNumber==16){
			return 100000;
		}
		return 0;
	}
	
	kingPositionScore(isWhiteScore){
		var evaluation=0;
		var opponentKingFile=0;
		var opponentKingRank=0;
		if(isWhiteScore){
			opponentKingFile=blackKingPosition%8;
			opponentKingRank=Math.floor(blackKingPosition/8);
		}
		else{
			opponentKingFile=whiteKingPosition%8;
			opponentKingRank=Math.floor(whiteKingPosition/8);
		}
		var opponentKingDistToCenterFile=Math.abs(Math.floor(3.5-opponentKingFile));
		var opponentKingDistToCenterRank=Math.abs(Math.floor(3.5-opponentKingRank));
		var opponentKingDistFromCenter=opponentKingDistToCenterFile+opponentKingDistToCenterRank;
		evaluation+=opponentKingDistFromCenter;
		
		var selfKingFile=0;
		var selfKingRank=0;
		if(isWhiteScore){
			selfKingFile=whiteKingPosition%8;
			selfKingRank=Math.floor(whiteKingPosition/8);
		}
		else{
			selfKingFile=blackKingPosition%8;
			selfKingRank=Math.floor(blackKingPosition/8);
		}
		var kingsFileDist=Math.abs(selfKingFile-opponentKingFile);
		var kingsRankDist=Math.abs(selfKingRank-opponentKingRank);
		var distBetweenKings=kingsFileDist+kingsRankDist;
		//because 14 is max distance
		evaluation+=14-distBetweenKings;
		return evaluation*10
	}
	
	scoreBoard(){
		var blackPoints=0;
		var whitePoints=0;
		for(var i=0;i<board.length;i++){
			if(board[i]!=0){
				if(isWhite(i)){
					whitePoints+=parseInt(this.getValue(board[i])+this.getPositionValue(i)*10);
					if(this.isEndGame){
						whitePoints+=this.kingPositionScore(true);
					}
				}
				else{
					blackPoints+=parseInt(this.getValue(board[i])+this.getPositionValue(i)*10);
					if(this.isEndGame){
						blackPoints+=this.kingPositionScore(false);
					}
				}
			}
		}
		return blackPoints-whitePoints;
	}

	getPositionValue(pieceIndex){
		var pieceType=board[pieceIndex];
		if(pieceType==1){
			if(this.isEndGame){
				return pawnEndgamePositions[pieceIndex]*3;
			}
			else{
				return pawnPositions[pieceIndex];
			}
		}
		else if(pieceType==2){
			return knightPositions[pieceIndex];
		}
		else if(pieceType==3){
			return bishopPositions[pieceIndex];
		}
		else if(pieceType==4){
			return rookPositions[pieceIndex];
		}
		else if(pieceType==5){
			return queenPositions[pieceIndex];
		}
		else if(pieceType==6){
			if(this.isEndGame){
				return kingEndgamePositions[pieceIndex]*3;
			}
			else{
				return kingPositions[pieceIndex];
			}
		}
		else if(pieceType==11){
			if(this.isEndGame){
				return pawnEndgamePositions[63-pieceIndex];
			}
			else{
				return pawnPositions[63-pieceIndex];
			}
		}
		else if(pieceType==12){
			return knightPositions[63-pieceIndex];
		}
		else if(pieceType==13){
			return bishopPositions[63-pieceIndex];
		}
		else if(pieceType==14){
			return rookPositions[63-pieceIndex];
		}
		else if(pieceType==15){
			return queenPositions[63-pieceIndex];
		}
		else if(pieceType==16){
			if(this.isEndGame){
				return kingEndgamePositions[63-pieceIndex];
			}
			else{
				return kingPositions[63-pieceIndex];
			}
		}
	}

	orderMoves(moves,pieceIsBlack){
		var isTransposedPosition=false;
		var savedBestMove=[0,0]
		if(!pieceIsBlack){
			var savedStuff=this.transpositionTable.getScore(board,0);
			if(savedStuff[1]>0){
				isTransposedPosition=true;
				savedBestMove[0]=savedStuff[3]
				savedBestMove[1]=savedStuff[4]
			}
		}
		else{
			var savedStuff=this.transpositionTable.getScore(board,0);
			if(savedStuff[1]>0){
				isTransposedPosition=true;
				savedBestMove[0]=savedStuff[3]
				savedBestMove[1]=savedStuff[4]
			}
		}
		var moveScores=[];
		for(var i=0;i<moves.length;i++){
			var moveScore=0;
			if(board[moves[i][1]]!=0){
				if(pieceIsBlack){
					moveScore+=10*this.getValue(board[moves[i][1]])-2*this.getValue(board[moves[i][0]]);;
				}
				else{
					moveScore+=10*this.getValue(board[moves[i][1]])-2*this.getValue(board[moves[i][0]]);
				}
			}
			if(board[moves[i][0]]==11 && moves[i][1]>55){
				moveScore+=800;
			}
			else if(board[moves[i][0]]==1 && moves[i][1]<8){
				moveScore+=800;
			}
			else{
				if(pieceIsBlack && board[i]!=11){
					if(board[moves[i][1]+7]==1 || board[moves[i][1]+9]==1){
						moveScore-=10*this.getValue(board[moves[i][0]]);
					}
					//get away from pawn
					if(board[moves[i][0]+7]==1 || board[moves[i][0]+9]==1){
						moveScore+=10*this.getValue(board[moves[i][0]]);
					}
					if(whiteInCheck()){
						moveScore+=50;
					}
				}
				else if(board[i]!=1){
					if(board[moves[i][1]-7]==11 || board[moves[i][1]-9]==11){
						moveScore-=10*this.getValue(board[moves[i][0]]);
					}
					//get away from pawn
					if(board[moves[i][0]-7]==11 || board[moves[i][0]-9]==11){
						moveScore+=10*this.getValue(board[moves[i][0]]);
					}
					if(blackInCheck()){
						moveScore+=50;
					}
				}
			}
			if(moves[i][0]==savedBestMove[0] && moves[i][1]==savedBestMove[1]){
				moveScore+=10000;
			}
			moveScores.push(moveScore);
		}
		var i=0;
		while(i<moveScores.length-1){
			if(moveScores[i+1]>moveScores[i]){
				var old_a=moveScores[i+1];
				moveScores[i+1]=moveScores[i];
				moveScores[i]=old_a;
				var old_move=moves[i+1];
				moves[i+1]=moves[i];
				moves[i]=old_move;
				i=0;
			}
			else{
				i++;
			}
		}
		return moves;
	}

	searchAllBlackCaptures(alpha,beta){
		var score=this.scoreBoard();
		if(score>=beta){
			return beta;
		}
		alpha=Math.max(score,alpha);
		var captureMoves=[];
		for(var i=0;i<board.length;i++){
			if(isBlack(i)){
				var pieceMoves=getValidMoves(i);
				pieceMoves=removeIllegalMoves(i,pieceMoves);
				for(var u=0;u<pieceMoves.length;u++){
					if(isWhite(pieceMoves[u])){
						captureMoves.push([i,pieceMoves[u]]);
					}
				}
			}
		}
		captureMoves=this.orderMoves(captureMoves,true);
		for(var i=0;i<captureMoves.length;i++){
			var move=captureMoves[i];
			var deletedValue=board[move[1]];
			board[move[1]]=board[move[0]];
			board[move[0]]=0;
			var promoted=false;
			if(board[move[1]]==16){
				blackKingPosition=move[1];
			}
			else if(move[1]>55 && board[move[1]]==11){
				board[move[1]]=15;
				promoted=true;
			}
			var score = this.searchAllWhiteCaptures(alpha,beta);
			board[move[0]]=board[move[1]];
			board[move[1]]=deletedValue;
			if(board[move[0]]==16){
				blackKingPosition=move[0];
			}
			else if(promoted){
				board[move[0]]=11
			}
			if(score>=beta){
				return beta;
			}
			alpha=Math.max(alpha,score);
		}
		return alpha;
	}
	searchAllWhiteCaptures(alpha,beta){
		var score=this.scoreBoard();
		if(score<=alpha){
			return alpha;
		}
		beta=Math.min(score,beta);
		var captureMoves=[];
		for(var i=0;i<board.length;i++){
			if(isWhite(i)){
				var pieceMoves=getValidMoves(i);
				pieceMoves=removeIllegalMoves(i,pieceMoves);
				for(var u=0;u<pieceMoves.length;u++){
					if(isBlack(pieceMoves[u])){
						captureMoves.push([i,pieceMoves[u]]);
					}
				}
			}
		}
		captureMoves=this.orderMoves(captureMoves,false);
		for(var i=0;i<captureMoves.length;i++){
			var move=captureMoves[i];
			var deletedValue=board[move[1]];
			board[move[1]]=board[move[0]];
			board[move[0]]=0;
			var promoted=false;
			if(board[move[1]]==6){
				whiteKingPosition=move[1];
			}
			else if(move[1]<8 && board[move[1]]==1){
				board[move[1]]=5;
				promoted=true;
			}
			var score = this.searchAllBlackCaptures(alpha,beta);
			board[move[0]]=board[move[1]];
			board[move[1]]=deletedValue;
			if(board[move[0]]==6){
				whiteKingPosition=move[0];
			}
			else if(promoted){
				board[move[0]]=1
			}
			if(score<=alpha){
				return alpha;
			}
			beta=Math.min(beta,score);
		}
		return beta;
	}
	
	isNewBoard(newBoard){
		//now needs two repeats to stop
		var repetitions=0;
		var stringBoard=JSON.stringify(newBoard);
		for(var i=0;i<this.previousBoards.length;i++){
			if(JSON.stringify(this.previousBoards[i])==stringBoard){
				repetitions+=1;
			}
			if(repetitions>1){
				return false;
			}
		}
		return true;
	}
	
	isNewMove(newMove){
		//now needs two repeats to stop
		var repetitions=0;
		var stringMove=JSON.stringify(newMove);
		for(var i=0;i<this.previousMoves.length;i++){
			if(JSON.stringify(this.previousMoves[i])==stringMove){
				repetitions+=1;
			}
			if(repetitions>1){
				return false;
			}
		}
		return true;
	}
	
	alphaBetaMax(alpha,beta,depthleft,searchStartTime,numExtensions,firstSearch=false){
		if(depthleft==0){
			return this.searchAllBlackCaptures(alpha,beta);
		}
		if(new Date().getTime()-searchStartTime>this.thinkTime){
			return this.searchAllBlackCaptures(alpha,beta);
		}
		var savedStuff=this.transpositionTable.getScore(board,0);
		var savedDepth=savedStuff[1];
		if(savedDepth>=depthleft){
			//if we have at least that depth in the transposition table, we return that score
			var scoreType=savedStuff[2];
			if(scoreType==0 && savedStuff[0]<=alpha){
				this.transpositionsUsed+=1;
				return savedStuff[0]
			}
			else if(scoreType==1 && savedStuff[0]>=beta){
				this.transpositionsUsed+=1;
				return savedStuff[0];
			}
		}
		var allMoves=[];
		for(var i=0;i<board.length;i++){
			if(isBlack(i)){
				var pieceMoves=getValidMoves(i);
				pieceMoves=removeIllegalMoves(i,pieceMoves);
				for(var u=0;u<pieceMoves.length;u++){
					allMoves.push([i,pieceMoves[u]]);
				}
			}
		}
		allMoves=this.orderMoves(allMoves,true);
		//put best move from previous search first
		if(firstSearch && depthleft!=1){
			allMoves.splice(allMoves.indexOf([this.bestPiece,this.bestMove]),1)
			allMoves=[[this.bestPiece,this.bestMove]].concat(allMoves)
		}
		if(allMoves.length==0){
			if(blackInCheck()){
				return -100000-depthleft*100;
			}
			else{
				return 0;
			}
		}
		var bestPieceThisSearch=allMoves[0][0];
		var bestMoveThisSearch=allMoves[0][1];
		for(var i=0;i<allMoves.length;i++){
			var move=allMoves[i];
			var deletedValue=board[move[1]];
			board[move[1]]=board[move[0]];
			board[move[0]]=0;
			var promoted=false;
			if(board[move[1]]==16){
				blackKingPosition=move[1];
			}
			else if(move[1]>55 && board[move[1]]==11){
				board[move[1]]=15;
				promoted=true;
			}
			var extension=0;
			if((whiteInCheck() || blackInCheck()) && numExtensions<5){
				extension=1;
			}
			var score = this.alphaBetaMin(alpha,beta,depthleft - 1+extension,searchStartTime,numExtensions+extension);
			board[move[0]]=board[move[1]];
			board[move[1]]=deletedValue;
			if(board[move[0]]==16){
				blackKingPosition=move[0];
			}
			else if(promoted){
				board[move[0]]=11;
			}
			if(score>=beta){
				this.transpositionTable.storeScore(board,beta,0,depthleft,1,move[0],move[1]);
				return beta;
			}
			if(score>alpha){
				var bestPieceThisSearch=move[0];
				var bestMoveThisSearch=move[1];
				if(firstSearch){
					if(allMoves.length==1){
						this.currentDepthBestPiece=move[0];
						this.currentDepthBestMove=move[1];
						alpha=score;
					}
					else{
						if(score<0){
							this.currentDepthBestPiece=move[0];
							this.currentDepthBestMove=move[1];
							alpha=score;
						}
						else{
							//only avoid repetition if winning
							if(this.isNewBoard(board) || this.isNewMove(move)){
								this.currentDepthBestPiece=move[0];
								this.currentDepthBestMove=move[1];
								alpha=score;
							}
						}
					}
				}
				else{
					alpha=score
				}
			}
		}
		this.transpositionTable.storeScore(board,alpha,0,depthleft,0,bestPieceThisSearch,bestMoveThisSearch);
		return alpha;
	}
	
	alphaBetaMin(alpha,beta,depthleft,searchStartTime,numExtensions,firstSearch=false){
		if(depthleft==0){
			return this.searchAllWhiteCaptures(alpha,beta);
		}
		if(new Date().getTime()-searchStartTime>this.thinkTime){
			return this.searchAllWhiteCaptures(alpha,beta);
		}
		var savedStuff=this.transpositionTable.getScore(board,1);
		var savedDepth=savedStuff[1];
			
		if(savedDepth>=depthleft){
			var scoreType=savedStuff[2];
			if(scoreType==0 && savedStuff[0]>=beta){
				this.whiteTranspositionsUsed+=1;
				return savedStuff[0]
			}
			else if(scoreType==1 && savedStuff[0]<=alpha){
				this.whiteTranspositionsUsed+=1;
				return savedStuff[0];
			}
		}
		var allMoves=[];
		for(var i=0;i<board.length;i++){
			if(isWhite(i)){
				var pieceMoves=getValidMoves(i);
				pieceMoves=removeIllegalMoves(i,pieceMoves);
				for(var u=0;u<pieceMoves.length;u++){
					allMoves.push([i,pieceMoves[u]]);
				}
			}
		}
		allMoves=this.orderMoves(allMoves,false);
		//put best move from previous search first
		if(firstSearch && depthleft!=1){
			allMoves.splice(allMoves.indexOf([this.bestPiece,this.bestMove]),1)
			allMoves=[[this.bestPiece,this.bestMove]].concat(allMoves)
		}
		if(allMoves.length==0){
			if(whiteInCheck()){
				return 100000+depthleft*100;
			}
			else{
				return 0;
			}
		}
		var bestPieceThisSearch=allMoves[0][0];
		var bestMoveThisSearch=allMoves[0][1];
		for(var i=0;i<allMoves.length;i++){
			var move=allMoves[i];
			var deletedValue=board[move[1]];
			board[move[1]]=board[move[0]];
			board[move[0]]=0;
			var promoted=false;
			if(board[move[1]]==6){
				whiteKingPosition=move[1];
			}
			else if(move[1]<8 && board[move[1]]==1){
				board[move[1]]=5;
				promoted=true;
			}
			var extension=0;
			if((whiteInCheck() || blackInCheck()) && numExtensions<5){
				extension=1;
			}
			var score = this.alphaBetaMax(alpha,beta,depthleft - 1+extension,searchStartTime,numExtensions+extension);
			board[move[0]]=board[move[1]];
			board[move[1]]=deletedValue;
			if(board[move[0]]==6){
				whiteKingPosition=move[0];
			}
			else if(promoted){
				board[move[0]]=1
			}
			if(score<=alpha){
				this.transpositionTable.storeScore(board,alpha,1,depthleft,1,move[0],move[1]);
				return alpha;
			}
			if(score<beta){
				bestPieceThisSearch=move[0];
				bestMoveThisSearch=move[1];
				if(firstSearch){
					if(allMoves.length==1){
						this.currentDepthBestPiece=move[0];
						this.currentDepthBestMove=move[1];
						beta=score;
					}
					else{
						if(score>0){
							this.currentDepthBestPiece=move[0];
							this.currentDepthBestMove=move[1];
							beta=score;
						}
						else{
							//only avoid repetition if winning
							if(this.isNewBoard(board) || this.isNewMove(move)){
								this.currentDepthBestPiece=move[0];
								this.currentDepthBestMove=move[1];
								beta=score;
							}
						}
					}
				}
				else{
					beta=score
				}
			}
		}
		this.transpositionTable.storeScore(board,beta,1,depthleft,0,bestPieceThisSearch,bestMoveThisSearch);
		return beta;
	}
}
class TranspositionTable12{
	constructor(){
		this.tableSize=10000;
		this.numTableElements=6; //hash, score, scoretype, depth,moved piece, move
		this.zobrist = new Uint32Array(12 * 64 * 2) // types of pieces including both colors * positions * each player's turn
		for (var i=0; i<this.zobrist.length; i++){
			this.zobrist[i] = Math.random() * 4294967296; // each piece at each position gets a random number up to 2^32
		}
		this.table=new Uint32Array(this.tableSize * this.numTableElements);
	}

	clearTable(){
		this.table=new Uint32Array(this.tableSize * this.numTableElements);
	}
	
	getPieceTypeIndex(piece){
		if(piece<10){
			//white pieces are from 0 to 5
			return piece-1;
		}
		else{
			//black pieces are from 6-11
			return piece-5;
		}
	}
	
	boardToHash(board,whitesTurn){
		//we use a hash so we don't have to use the whole board as an index, even though there are annoying collision things
		var hash=0;
		for(var i=0;i<board.length;i++){
			var piece=board[i]
			//for every non empty square
			if(piece!=0){
				//apply an xor based on that specific piece and position
				hash^=this.zobrist[i*24+whitesTurn*2+this.getPieceTypeIndex(piece)]
			}
		}
		//it was returning negative numbers, maybe because of xor idk
		return Math.abs(hash);
	}
	
	storeScore(board,score,whitesTurn,depth,scoreType,piece,move){
		//modulus by the table size so it gets a random index in the array and hopefully it hasn't already been used
		var hash=this.boardToHash(board,whitesTurn);
		var index=(hash%this.tableSize)*this.numTableElements
		//we store the hash so we can check if it is actually the same board for when the modulus is the same and the hash isn't in a collision
		this.table[index]=hash;
		//Uint32Arrays can't have negatives
		this.table[index+1]=Math.abs(200000+score);
		this.table[index+2]=depth;
		this.table[index+3]=scoreType;
		this.table[index+4]=piece;
		this.table[index+5]=move;
	}
	
	getScore(board,whitesTurn){
		var hash=this.boardToHash(board,whitesTurn);
		//returns the score and the depth
		var index=(hash%this.tableSize)*this.numTableElements;
		if(this.table[index]==hash){
			return [this.table[index+1]-200000,this.table[index+2],this.table[index+3],this.table[index+4],this.table[index+5]];
		}
		else{
			//if it isn't the same board return nothing
			return [0,0,0,0,0]
		}
	}
}
