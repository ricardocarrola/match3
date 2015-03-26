
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


var board = new Board(
	{},
	new Settings(config),
	settingsLevels	
);

var board2 = new Board(
	{},
	new Settings(config),
	settingsLevels	
);

var view1 = new View("a",true,board,{"name":"Carrola","fbid":"100000317972946","id":"1"});




board.checkPattern();

//init();

//is there a game in progress
//if it is get the board from the player


$("#game").append("<div class='vs'>VS</div>");
var view2  = new View("b",false,board2,{"name":"Player2"});
board2.checkPattern();
  