<div id='{{name}}' style='  float: left;position:relative;
  max-width: 491px;
  border: 5px solid #FFFFFF;
  border-radius: 10px;
  padding: 16px;
  margin-right: 7px;'>		
	<div class='levelname'  id='{{name}}_levelname'>{{level}}</div>
	<div class='player' id='{{name}}_player'><img class='profilepic' src='http://graph.facebook.com/{{player.fbid}}/picture?type=square'>{{player.name}}</div>	
	<div class='actual' id='{{name}}_scoreme'>SCORE:0</div>			
	<div class='space'>
		<div class='board'>
			{{#board}}
			<div class='row'>
				{{#.}}			
				<div class='column' id='p_{{name}}_{{id}}' >
					<img src='{{piece.image}}' id='{{name}}_{{id}}' >
				</div>
				{{/.}}
			</div>
			{{/board}}
		</div>
	</div>
	<div class='moves'  id='{{name}}_moves'>x 0</div>	
</div>