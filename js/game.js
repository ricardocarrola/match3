	function speak(what){
		try{
							var u = new SpeechSynthesisUtterance();
							
							 u.text = what
							 u.lang = 'en-US';
							 u.rate = 1;
							 u.onend = function(event) {  }
							 speechSynthesis.speak(u); 
			}catch(e){}
	}
	function Level(Settings){
			var level={};
			for(var i=0;i<Settings.levels.length;i++){
				if (Settings.levels[i].id==Settings.startOnLevel){
					level = Settings.levels[i];
				}
			}
			setTimeout(function(){
				$(document).trigger("newScore",[level.name]);				
			
			},1000)
			
			$("body").css("background","url('"+(level.background ? level.background : 'img/back_1.png')+"')");
			$(".board").css("background","url('"+(level.board ? level.board : 'img/background.png')+"')");
	}
	function Board(Config,Settings,LevelSettings){
		this.level = new Level(LevelSettings);
		//two dimensional board
		this.what =[];
		this.clearLine=function(line){
			for(var column=0;column<this.width;column++){
				this.boardPieces[line][column].piece={};
				console.log("exploding %d,%d",line,column);
				removePiece(this.boardPieces[line][column]);
				
				//$(document).trigger("removePiece",[]);
			}
		}
		this.bombAll=function(){
			var type= this.boardPieces[this.what[0][0]][this.what[0][1]].piece.color!='-' ? this.boardPieces[this.what[0][0]][this.what[0][1]].piece.color : this.boardPieces[this.what[1][0]][this.what[1][1]].piece.color;
			this.boardPieces[this.what[0][0]][this.what[0][1]].piece =  {};	
			this.boardPieces[this.what[1][0]][this.what[1][1]].piece =  {};	
			removePiece(this.boardPieces[this.what[0][0]][this.what[0][1]]);	
			removePiece(this.boardPieces[this.what[1][0]][this.what[1][1]]);	
			for(var i=0;i<this.width;i++){
				for(var j=0;j<this.height;j++){
						if (this.boardPieces[i][j].piece.color==type){
							this.boardPieces[i][j].piece =  {};	
							removePiece(this.boardPieces[i][j]);									
						}																											
				}
			}
			setTimeout(function(){
					for(var i=0;i<b.width;i++)
						for(var j=0;j<b.height;j++)
								if (!b.boardPieces[i][j].piece.color){
									b.boardPieces[i][j].piece =  new Piece(config.pieces);	
									addPiece(b.boardPieces[i][j]);	
								}									
						},100);			
		}
		this.clearColumn=function(column){
			for(var line=0;line<this.height;line++){
				this.boardPieces[line][column].piece={};
				
				removePiece(this.boardPieces[line][column]);
				
				//$(document).trigger("removePiece",[]);
			}
		}
		this.boardPieces= [[]];
		this.width			 	 = (!Config.size) ?  '7' : Config.size;
		this.height			 = (!Config.height) ?  '7' : Config.height;
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
		this.specialPowersInvoke=function(piece,i,j){
			
			if (piece.powers){
				piece.powers(i,j);
				document.getElementById("tasty").play();	
			}
				
			
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
						if (this.boardPieces[p1[0]][p1[1]].piece.color=="-")
							if (this.boardPieces[p1[0]][p1[1]].piece.powers)
								this.boardPieces[p1[0]][p1[1]].piece.powers();
						if (this.boardPieces[p2[0]][p2[1]].piece.color=="-")
							if (this.boardPieces[p2[0]][p2[1]].piece.powers)
								this.boardPieces[p2[0]][p2[1]].piece.powers();
						return move;
			}								
			return move;
		}
		this.shuffle=function(){
			for(var i=0;i<this.width;i++){
				for(var j=0;j<this.height;j++){
						this.boardPieces[i][j].piece =  new Piece(config.pieces);
						closePiece(this.boardPieces[i][j]);																									
				}
			}
			setTimeout(function(){
				for(var i=0;i<b.width;i++)
				for(var j=0;j<b.height;j++)
					addPiece(b.boardPieces[i][j]);																				
			},100);
			$(document).trigger("newScore",["Shuffleling"]);
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
															//removed all the pieces but if a specified pattern is met we need special pieces to be put here!
															this.specialPowersInvoke(this.boardPieces[what[k].i][what[k].j].piece,what[k].i,what[k].j);
															this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};																														
															removePiece(what[k]);
															howMany.push(clean);
															perType.push(was);
													}
													if (clean==4){														
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};														
														$(document).trigger("addPiece",[this.boardPieces[what[3].i][what[3].j]]);
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
												this.specialPowersInvoke(this.boardPieces[what[k].i][what[k].j].piece,what[k].i,what[k].j);										
												this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
												removePiece(what[k]);
												howMany.push(clean);
												perType.push(was);
										}
										if (clean==4){
														
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};
														$(document).trigger("addPiece",[this.boardPieces[what[3].i][what[3].j]]);
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
															this.specialPowersInvoke(this.boardPieces[what[k].i][what[k].j].piece,what[k].i,what[k].j);																							
															this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
															removePiece(what[k]);
															howMany.push(clean);
															perType.push(was);
													}
													
											}
											if (clean==4){
													
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};
														$(document).trigger("addPiece",[this.boardPieces[what[3].i][what[3].j]]);
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
												this.specialPowersInvoke(this.boardPieces[what[k].i][what[k].j].piece,what[k].i,what[k].j);																				
												this.boardPieces[what[k].i][what[k].j]={"disabled":false,"piece":{},"i":what[k].i,"j":what[k].j,"id":what[k].i+"_"+what[k].j};
												removePiece(what[k]);
												howMany.push(clean);
												perType.push(was);
										}
										if (clean==4){
													
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};
														$(document).trigger("addPiece",[this.boardPieces[what[3].i][what[3].j]]);
													}
										what = [];
								}								
							}															
			//step 2
			var t = this;
			setTimeout(function(){
				t.checkPattern2(howMany,perType);
			},20);
		}
		this.checkPattern2=function(howMany,perType){
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
		this.pieces    = Config.pieces;	
	
	}
	
	function Piece(Config,type){
		var types = Config;
		//random but with the right type
		var randomType = Math.floor((Math.random() * types.length) + 0);
		var randomType2 = "";
		if (type){
			for(var i=0;i<types.length;i++)
				if (types[i].color==type)
						randomType = i;
		}
		if (type && types[randomType].specials){
			randomType2= Math.floor((Math.random() * types[randomType].specials.length) + 0);	
			this.color   =  types[randomType].specials[randomType2].color;
			this.image =  types[randomType].specials[randomType2].image;	
			this.powers =  types[randomType].specials[randomType2].powers;
		}
		else{
			this.color   = types[randomType].color;
			this.image =  types[randomType].image;	
			this.powers = types[randomType].powers;
		}
		
		
		
	}
	