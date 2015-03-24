<style>
body{	
		  background-size: cover !important;
}
	.highscore{
		  position: absolute;
	  width: 100%;
	  bottom: 20%;	  
	  color: orange;
	  font-size: 300px;
	  text-align: center;
	}
	.highscoreBoard{
		
		float:left;
		border-radius:20px;
		padding:10px;
		margin-left:10%;
	
		margin-right: 10px;
		margin-top: 5%;
		width:10%;
		height:1320px;
		color:#ffffff;
		font-size:100px;
	}
	.actual{
	    margin: 0 auto;
  width: 368px;
  text-align: center;
  }
	.space{	
		
		float: left;
		margin-right: 10px;
		margin-top: 5%;
		max-height:1000px;
	}
		
	
	.board{
		float:left;
		position:relative;		
		background-size:cover !important;
		border-radius:20px;
		padding:30px;
			background:url("img/background.png");
	}
	 .row{
		float:left;
		clear:left;
		
	 }
	 .column{
		float:left;
		width:160px;		
		height:160px;	
	 }
	img{
		width: 99%;
		height: 99%;
		margin: auto;
		cursor: pointer;
		margin-top: 3px;
	}
</style>
<div class='highscoreBoard'>
	<div class='actual'><span id='scoreme'></span></div>
</div>
<div class='space'>
	<div class='board'>
		{{#.}}
		<div class='row'>
			{{#.}}			
			<div class='column' id='p_{{id}}' >
				<img src='{{piece.image}}' id='{{id}}' >
			</div>
			{{/.}}
		</div>
		{{/.}}
	</div>
</div>