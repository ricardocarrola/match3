
var config={
	"pieces":[	
		{"color":"red","image":"img/red.png","specials":[
			{"color":"red","image":"img/redspecial.png","linked":"red","powers":function(i,j,table){table.clearLine(i);}}
		]},
		{"color":"blue","image":"img/blue.png"},
		{"color":"yellow","image":"img/yellow.png"},
		{"color":"purple","image":"img/purple.png"},
		{"color":"green","image":"img/green.png"},		
		{"color":"red1","image":"img/red1.png"},
		{"color":"red2","image":"img/red2.png"},
		{"color":"red3","image":"img/red3.png"}
	]
}

var settingsLevels={
	"levels":[{
		"name":"Level 1",
		"id":1,
		"background":"img/back_1.png",
		"board":"img/background.png"
	}],
	"startOnLevel":1
};


  
  var boards=[];
  var views=[];
  
  
  function Game(){
	  //Is there an open game on the server?
	  //else create a new one
	  var table=this;
	  this.newServer=true;
	  this.code="0";
	  $.ajax(
			{
				"url":'api/new_game.php',
				"async":false,
				"success":function(key) {table.code=key;}
			});
			
	  
		  console.log("I've found one peer connecting to it : "+this.code);
		  this.peer = new Peer({key: 'lwjd5qra8257b9'});		 
		  this.conn = this.peer.connect(this.code);
		  this.pendingPeer = "";
		  this.mypeerid = "";
		  this.peer.on('open',function(id) {	
				this.mypeerid = id;
				console.log("Connected to peer id "+id);
		  });
		  this.peer.on('connection', function(conn) { 
		  	alert("opened!");
			table.conn = conn;
			
				console.log("Connected to actual peer id "+table.conn.peer);
				table.conn.on("data", function(data) {						
					console.log("RECEIVED 1");
					dispatcher(data);
				});
		  });
		  this.conn.on('open', function() {	//just calls if i connect to a pear
				
				alert("opened!");
				console.log("Connected to actual peer id "+table.conn.peer);
				table.conn.on("data", function(data) {						
					console.log("RECEIVED 1");
					dispatcher(data);
				});
		  });
		  
		  
		  
		  this.peer.on('error', function(con) {
			   console.log("Error on peer!");
			   table.peer = new Peer(this.mypeerid,{key: 'lwjd5qra8257b9'});	
			   register_peer(this.mypeerid);	
		   });
		   
		   this.conn.on('error', function(con) {
			   console.log("Error on connection!");
			   
		   });
		   this.peer.on("data", function(data) {						
					console.log("RECEIVED 2");
					dispatcher(data);
			});
		   this.conn.on('close', function(con) {
			   
		   });
		
		
		  
	  
		 	
  }
  
  

  var g;
  function init_connect(){
	  //can i play before a partner connect
	  g= new Game(); 
	  createMyGame(facebookUser,true);
  }
  
  function sendMove(view,p1,p2){
	console.log(view);
	console.log({"game":"1","user":view.player.id,"p1":p1,"p2":p2});
	
 }
  function dispatcher(data){
	  try{
			data = JSON.parse(data);
		  //create board message 
		  //if a receive c
		  //{"verb":"connect","data":{},"player":{}}
		  if (data.verb=="connect"){
			  //i received their board i should send mine :)
			  createMyGame(data.player,false,data.board);
			  g.conn.send(JSON.stringify({"verb":"connect","data":boards[0].getBoard(),"player":facebookUser}));
		  }  
		  if (data.verb=="move"){
			  //send(JSON.stringify({"game":"1","user":view.player.id,"p1":p1,"p2":p2,"tablename":view.name}));
		  }
	  }catch(e){console.log(data);}
	  console.log(data);
	  
  }
  
  function register_peer(peer){
	  console.log("[Ready for gaming] Broadcasting my peer id "+peer);
	  $.ajax(
			{
				"url":'api/api.php?f=registerkey&key='+peer				
			});
  }
  function createMyGame(playerInfo,localPlayer,boardConfiguration){
	  boards.push(new Board(
			{},
			new Settings(config),
			settingsLevels	,
			boardConfiguration
		)) ;
		if (boards.length>1)
				$("#game").append("<div class='vs'>VS</div>");
			
		views.push(new View(String.fromCharCode(64+boards.length),localPlayer,boards[boards.length-1],playerInfo));	
		boards[boards.length-1].checkPattern();
  }
  