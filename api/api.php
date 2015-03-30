<?php 
$function=$_GET['f'];

if ($function=="userregister"){
	//register this user into db
	$content = $_POST['data'];
	print_r($content); //add or update user data on db
}
if ($function=="trackgame"){
	
}
if ($function=="registerkey"){
	file_put_contents ("new_game.php",$_GET["key"]);
}
?>