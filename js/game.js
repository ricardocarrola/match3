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
					this.level = Settings.levels[i];
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
		
		this.what =[];
		
		this.view = "";
		
		this.clearLine=function(line){
			
			for(var column=0;column<this.width;column++){
				this.boardPieces[line][column].piece={};				
				this.view.removePiece(this.boardPieces[line][column]);							
			}
		}
		this.clearColumn=function(column){
			for(var line=0;line<this.height;line++){
				this.boardPieces[line][column].piece={};				
				this.view.removePiece(this.boardPieces[line][column]);								
			}
		}
		this.bombAll=function(){
			var type= this.boardPieces[this.what[0][0]][this.what[0][1]].piece.color!='-' ? this.boardPieces[this.what[0][0]][this.what[0][1]].piece.color : this.boardPieces[this.what[1][0]][this.what[1][1]].piece.color;
			this.boardPieces[this.what[0][0]][this.what[0][1]].piece =  {};	
			this.boardPieces[this.what[1][0]][this.what[1][1]].piece =  {};	
			this.view.removePiece(this.boardPieces[this.what[0][0]][this.what[0][1]]);	
			this.view.removePiece(this.boardPieces[this.what[1][0]][this.what[1][1]]);	
			for(var i=0;i<this.width;i++){
				for(var j=0;j<this.height;j++){
						if (this.boardPieces[i][j].piece.color==type){
							this.boardPieces[i][j].piece =  {};	
							this.view.removePiece(this.boardPieces[i][j]);									
						}																											
				}
			}
			setTimeout(function(){
					for(var i=0;i<b.width;i++)
						for(var j=0;j<b.height;j++)
								if (!b.boardPieces[i][j].piece.color){
									b.boardPieces[i][j].piece =  new Piece(config.pieces);	
									this.view.addPiece(b.boardPieces[i][j]);	
								}									
						},100);			
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
				piece.powers(i,j,this);				
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
						this.view.transferPiece({"from":this.boardPieces[p1[0]][p1[1]],"to":this.boardPieces[p2[0]][p2[1]]})												
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
						this.view.closePiece(this.boardPieces[i][j]);																									
				}
			}
			setTimeout(function(){
				for(var i=0;i<b.width;i++)
				for(var j=0;j<b.height;j++)
					this.view.addPiece(b.boardPieces[i][j]);																				
			},100);
			this.view.newScore("Shuffleling");
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
															this.view.removePiece(what[k]);
															howMany.push(clean);
															perType.push(was);
													}
													if (clean==4){														
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};														
														this.view.addPiece(this.boardPieces[what[3].i][what[3].j]);
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
												this.view.removePiece(what[k]);
												howMany.push(clean);
												perType.push(was);
										}
										if (clean==4){
														
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};
														this.view.addPiece(this.boardPieces[what[3].i][what[3].j]);
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
															this.view.removePiece(what[k]);
															howMany.push(clean);
															perType.push(was);
													}
													
											}
											if (clean==4){
													
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};
														this.view.addPiece(this.boardPieces[what[3].i][what[3].j]);
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
												this.view.removePiece(what[k]);
												howMany.push(clean);
												perType.push(was);
										}
										if (clean==4){													
														this.boardPieces[what[3].i][what[3].j]={"disabled":false,"piece":new Piece(config.pieces,was),"i":what[3].i,"j":what[3].j,"id":what[3].i+"_"+what[3].j};
														this.view.addPiece(this.boardPieces[what[3].i][what[3].j]);
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
									this.view.movePiece({"from":this.boardPieces[k][j],"to":this.boardPieces[i][j]});
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
							this.view.addPiece(this.boardPieces[i][j]);
							newpiece=true;
					}
				}
			}
			return newpiece;
		}
	
		this.doScore=function(howMany,perType){
			//this.moves++;
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
				this.view.newScore("sweet");
			}
			if ($.inArray(3,howMany)!=-1){
				document.getElementById("square_removed2").play();	
				this.view.newScore(sc);
			}		
			this.view.scoreIt();
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
	
	/*
		Class responsible for showing things up
	*/
	function View(nameOfBoard,clickable,boardNew,playerObj){
	
	this.clicks = [];
	this.board = boardNew;
	this.name = nameOfBoard;
	this.player = playerObj;
	this.click   = clickable;
	this.pieceTemplate = "";
	boardNew.view = this;
	
	var table = this;
		$.ajax(
			{
				"url":'views/piece.tpl',
				"async":false,
				"success":function(template) {table.pieceTemplate=template;}
			});
		$.ajax(
		{
			"url":'views/board.tpl',
			"async"	:false,
			"success":function(template) {
			var rendered = Mustache.render(template, {"name":table.name,"board":table.board.getBoard(),"player":table.player,"level":table.board.level.level.name});    
			
			$('#game').append(rendered);
			
			if (table.click)
				$("#"+table.name+" .space .board").click(function(a){

					var c = a.target.id.replace(table.name+"_","").split("_");		


					if (table.clicks.length>0){
						if (table.clicks.length==2)
							if (a.target.id!=table.clicks[0].join("_") && a.target.id!=table.clicks[1].join("_"))
								table.clicks.push(c);	
						if (table.clicks.length==1)
							if (a.target.id!=table.clicks[0].join("_"))
								table.clicks.push(c);	
					}else
							table.clicks.push(c);	
					
					if (table.clicks.length==2){		
						var p1=table.clicks[0];
						var p2=table.clicks[1];			
						table.clicks=[];
						table.board.what=[p1,p2];					
						if(table.board.swapPieces(p1,p2))
							table.board.moves++;
						table.board.view.moveIt();		
						sendMove(table.board.view,p1,p2)	;					
					}
				});
		}}
		);
		
	this.moveIt=function(){
		$("#"+this.name+"_"+"moves").html("x "+this.board.moves);	
	}
	this.scoreIt=function(){
		$("#"+this.name+"_"+"scoreme").html("SCORE: "+this.board.score);	
	}
	this.removePiece=function(a){
			
			$("#"+this.name+"_"+a.i+"_"+a.j).hide( "explode", {direction: "down"},100,function(){$(this).remove();} )	
			$("#p_"+this.name+"_"+a.i+"_"+a.j).html("<img src='img/explosion.png'>");
			
	}
	
	this.addPiece=function(piece){
			piece.name = this.name;
			var html = Mustache.render(this.pieceTemplate, piece);		
			console.log("Adding new piece to board (%s) : html :(%s)",this.name,html);
			$("#p_"+this.name+"_"+piece.id).hide().html(html);
			$("#p_"+this.name+"_"+piece.id).show( "drop", {direction: "up"}, 300 )		
	}
	
	this.closePiece=function(a){		
			
			$("#"+this.name+"_"+a.i+"_"+a.j).hide( "explode", {direction: "down"},100,function(){$(this).remove();} )	
			$("#p_"+this.name+"_"+a.i+"_"+a.j).html("<img src='img/closed.png'>");		
	}
	
	this.movePiece=function(move){
		var html = $("#p_"+this.name+"_"+move.from.i+"_"+move.from.j).html();		
		console.log("moving from %d,%d => %d,%d html:(%s,%s)",move.from.i+1,move.from.j+1,move.to.i+1,move.to.j+1,html,"#p_"+this.name+"_"+move.from.i+"_"+move.from.j);				
		$("#p_"+this.name+"_"+move.from.i+"_"+move.from.j).html("");
		html=html.replace(move.from.i+'_'+move.from.j,move.to.i+'_'+move.to.j);				
		$("#p_"+this.name+"_"+move.to.i+"_"+move.to.j).html(html).show();	
	}
	
	this.transferPiece=function(move){
			var html = $("#p_"+this.name+"_"+move.from.i+"_"+move.from.j).html();				
			var html2 = $("#p_"+this.name+"_"+move.to.i+"_"+move.to.j).html();						
			html2=html2.replace(move.to.i+'_'+move.to.j,move.from.i+'_'+move.from.j);				
			$("#p_"+this.name+"_"+move.from.i+"_"+move.from.j).html(html2);							
			html=html.replace(move.from.i+'_'+move.from.j,move.to.i+'_'+move.to.j);				
			$("#p_"+this.name+"_"+move.to.i+"_"+move.to.j).html(html);	
			$("#"+this.name+"_"+move.to.i+"_"+move.to.j).show();				
	}
	this.newScore=function(score){
		$('<div/>', { class:"highscore", text:score }).appendTo('#'+this.name+'.board').hide("puff",{},1000,function(){$(this).remove();});;			
	}
	
	
}

function sendMove(view,p1,p2){
	console.log(view);
	console.log({"game":"1","user":view.player.id,"p1":p1,"p2":p2});
	send(JSON.stringify({"game":"1","user":view.player.id,"p1":p1,"p2":p2,"tablename":view.name}));
}