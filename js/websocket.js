var socket;

function init(game) {
	
	var host = "ws://127.0.0.1:9000/"; // SET THIS TO YOUR SERVER
	try {
		socket = new WebSocket(host);
		console.log('WebSocket - status '+socket.readyState);
		socket.onopen    = function(msg) { 
							   
							   send(JSON.stringify({"game":"1","type":'init',"user":view1.player.id,"p1":0,"p2":0,"board":board.getBoard(),"tablename":view1.name}));
						   };
		socket.onmessage = function(msg) { 
							   console.log("Received: "+msg.data); 
						   };
		socket.onclose   = function(msg) { 
							   console.log("Disconnected - status "+this.readyState); 
						   };
	}
	catch(ex){ 
		console.log(ex); 
	}
	$("msg").focus();
}

function send(msg){
	var txt,msg;
	
	
	try { 
		socket.send(msg); 
		console.log('Sent: '+msg); 
	} catch(ex) { 
		console.log(ex); 
	}
}
function quit(){
	if (socket != null) {
		console.log("Goodbye!");
		socket.close();
		socket=null;
	}
}

function reconnect() {
	quit();
	init();
}

