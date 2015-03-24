
	function Level(Settings){
			var level={};
			for(var i=0;i<Settings.levels.length;i++){
				if (Settings.levels[i].id==Settings.startOnLevel){
					level = Settings.levels[i];
				}
			}
			setTimeout(function(){
				$(document).trigger("newScore",[level.name]);				
				try{
							var u = new SpeechSynthesisUtterance();
							 u.text = level.name
							 u.lang = 'en-US';
							 u.rate = 1;
							 u.onend = function(event) {  }
							 speechSynthesis.speak(u); 
			}catch(e){}
			},1000)
			
			$("body").css("background","url('"+(level.background ? level.background : 'img/back_1.png')+"')");
			$(".board").css("background","url('"+(level.board ? level.board : 'img/background.png')+"')");
	}
	function Board(Config,Settings,LevelSettings){
		this.level = new Level(LevelSettings);
		//two dimensional board
		this.boardPieces= [[]];
		this.width			 	 = (!Config.size) ?  '10' : Config.size;
		this.height			 = (!Config.height) ?  '10' : Config.height;
		this.blockedPos   = (!Config.blockedPositions) ?  [] : Config.blockedPositions;
		this.score		= 0;
		this.highScore	= 0;
		this.set 			= Settings;
		
		if (this.blockedPos)
			for(var i=0;i<this.blockedPos.length;i++)
				this.boardPieces[this.blockedPos[i][j]] = {"disabled":true};
												
		//Start with empty board
		for(var i=0;i<this.width;i++)
			for(var j=0;j<this.height;j++){
					if (!this.boardPieces[i])
							 this.boardPieces[i]=[];
					if (!this.boardPieces[i][j])
						this.boardPieces[i][j] = {"disabled":false,"piece":new Piece(Settings.pieces),"i":i,"j":j,"id":i+"_"+j};
			}			
		
		
		this.getBoard=function(){
				return this.boardPieces;
		}
		this.swapPieces=function(p1,p2){
			var move=false;
			if (p1[0]==p2[0] && ( p1[1]+1==p2[1]  || p1[1]-1==p2[1] || p2[1]+1==p1[1]  || p2[1]-1==p1[1])){
					move=true
			}else if (p1[1]==p2[1] && ( p1[0]+1==p2[0]  || p1[0]-1==p2[0] || p2[0]+1==p1[0]  || p2[0]-1==p1[0])){
							move=true;
					}else	
						move=false;
			if (move){					
						var tmp = this.boardPieces[p1[0]][p1[1]].piece;						
						this.boardPieces[p1[0]][p1[1]].piece = this.boardPieces[p2[0]][p2[1]].piece;
						this.boardPieces[p2[0]][p2[1]].piece = tmp;												
						$(document).trigger("transferPiece",[{"from":this.boardPieces[p1[0]][p1[1]],"to":this.boardPieces[p2[0]][p2[1]]}]);
						this.checkPattern(p1,p2);
						return move;
			}								
			return move;
		}
		
		this.checkPattern=function(p1,p2){			
			var howMany=[];
			var perType=[];
			var clean=0;
			var what=[];
			var was="-";
							for(var i=0;i<this.width;i++){
								clean=1;
								what=[];
								was="-";
								for(var j=0;j<this.height;j++){
									if (this.boardPieces[i][j]){
										if (this.boardPieces[i][j].piece.color!=was){
											
											if (clean>=3){ //need to clean?
													for(var k=0;k<what.length;k++){															
															this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
															$(document).trigger("removePiece",[what[k]]);
															howMany.push(clean);
															perType.push(was);
													}
													
											}
											was= this.boardPieces[i][j].piece.color;
											what = [];
											what.push(this.boardPieces[i][j]);
											clean=1;											
										}else{
											what.push(this.boardPieces[i][j]);
											clean++;																						
										}
									}
																										
								}
								if (clean>=3){ //need to clean?
										for(var k=0;k<what.length;k++){															
												this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
												$(document).trigger("removePiece",[what[k]]);
												howMany.push(clean);
												perType.push(was);
										}
										what = [];
								}								
							}								
		var clean=0;
			var what=[];
			var was="-";
							for(var i=0;i<this.width;i++){
								clean=1;
								what=[];
								was="-";
								for(var j=0;j<this.height;j++){
										if (this.boardPieces[i][j].piece){
											if (this.boardPieces[j][i].piece.color!=was){
											
											if (clean>=3){ //need to clean?
													for(var k=0;k<what.length;k++){															
															this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
															$(document).trigger("removePiece",[what[k]]);
															howMany.push(clean);
															perType.push(was);
													}
													
											}
											was= this.boardPieces[j][i].piece.color;
											what = [];
											what.push(this.boardPieces[j][i]);
											clean=1;											
										}else{
											what.push(this.boardPieces[j][i]);
											clean++;																						
										}
										}
																						
								}
								if (clean>=3){ //need to clean?
										for(var k=0;k<what.length;k++){															
												this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
												$(document).trigger("removePiece",[what[k]]);
												howMany.push(clean);
												perType.push(was);
										}
										what = [];
								}								
							}															
			//step 2
			
			this.doScore(howMany,perType);
			
			
			//for each column there can be some holes drop the ones on top (move them down)	
			for(var j=0;j<this.height;j++){
				for(var i=this.width-1;i>=0;i--){
						
						
						if (!this.boardPieces[i][j].piece.color){
							//fetch the first value on this column not empty
							for(var k=i;k>=0;k--){
								
								if (this.boardPieces[k][j].piece.color){
									//copy this one 																																										
									this.boardPieces[i][j].piece= this.boardPieces[k][j].piece;
									this.boardPieces[k][j].piece = {};
									$(document).trigger("movePiece",[{"from":this.boardPieces[k][j],"to":this.boardPieces[i][j]}]);
									break;
								}
							}
						}					
				}
			}
			
			if (howMany.length>0 && this.renderNewPieces())
					return this.checkPattern();
		}
		this.renderNewPieces=function(){
			var newpiece=false;
			for(var j=0;j<this.height;j++){
				for(var i=this.width-1;i>=0;i--){
					if (!this.boardPieces[i][j].piece.color){
							console.log("adding new piece to %d,%d",i,j);
							this.boardPieces[i][j] = {"disabled":false,"piece":new Piece(Settings.pieces),"i":i,"j":j,"id":i+"_"+j};
							$(document).trigger("addPiece",[this.boardPieces[i][j]]);
							newpiece=true;
					}
				}
			}
			return newpiece;
		}
		this.removePieces=function(piecesArray){
			
		}
		this.doScore=function(howMany,perType){
			this.moves++;
			sc = 0;
		
			
			for(var i=0;i<howMany.length;i++){
				if (howMany[i]==3)
						sc+=100;
				if (howMany[i]==4)
						sc+=200;
				if (howMany[i]>=4)
						sc+=howMany[i]*200;
			}
			//if (sc!=0)
					//$(document).trigger("newScore",[sc]);
			this.score+=sc;
			for(var i=0;i<perType.length;i++){
				if (!this.perTypeMoves[perType[i]])
						this.perTypeMoves[perType[i]]=0;
				//total combinations per type	
				this.perTypeMoves[perType[i]]+=1;
			}
			
			console.log(this.perTypeMoves);
				
			if ($.inArray(4,howMany)!=-1){
				document.getElementById("sweet").play();	
				$(document).trigger("newScore",["sweet"]);
			}
			if ($.inArray(3,howMany)!=-1){
				document.getElementById("square_removed2").play();	
				$(document).trigger("newScore",[sc]);
			}		
				
			/*else	
				if ($.inArray(3,howMany)!=-1)
					document.getElementById("delicious").play();				*/
		}
		this.moves=0;
		this.score=0;
		this.perTypeMoves={};
	}
	
	function Settings(Config){
		this.pieces = Config.pieces;
	}
	
	function Piece(Config){
		var types = Config;
		var randomType = Math.floor((Math.random() * types.length) + 0);
		//T1 if no configuration just give a sample one
		this.color   = types[randomType].color;
		this.image =  types[randomType].image;
		
	}
	