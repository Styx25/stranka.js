
<?php
include "ostatne/settings.php";
?>
<!doctype html>
<html>
<head>
<title>PixelMaze.io - Priatelia</title>
<meta charset="utf-8">
<!-- <meta name="theme-color" content="#141414"> -->
<link rel="stylesheet" href="css/menu.css">
<link rel="stylesheet" href="css/friends.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">
<script src="https://code.jquery.com/jquery-latest.min.js"></script>
</head>
<body>
<div id='background'></div>
<?php
$select = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno, skin, coins FROM uzivatelia WHERE id='$_SESSION[id]'"));
$activeSkin = mysqli_fetch_assoc(mysqli_query($conn, "SELECT background FROM shop WHERE idSkinu='$select[skin]'"));

$selectCount = mysqli_fetch_assoc(mysqli_query($conn, "SELECT request FROM uzivatelia WHERE id='$_SESSION[id]'"));
$count = explode("_", $selectCount['request']);

$text = count($count) - 1;

echo "
<div id='menu'>
	<div class='header'><b>$select[meno]</b><coin><a class='number'>$select[coins]</a><i class='fab fa-bitcoin'></i></coin></div>
	<div class='activeSkin'></div>

	<div class='footer'>
		<div class='profile'>
			<a href='#' class='accordion active'>Profil</a>
			<div class='more'>
				<a href='#'>inventar</a>
				<a href='friends.php' class='friends'>Priatelia";
				if($text > 0){
				echo "<span class='count' title='Žiadosti o priateľstvo'>". $text ."</span>";
				}
				echo "
				</a>
				<a href='oznamenia.php'>Oznamenia</a>
			</div>
		</div>
		<a href='lobby.php'>Lobby</a>
		<a href='shop.php'>Obchod</a>
		<a href='settings.php'>nastavenia</a>
		<a href='ostatne/logout.php' class='logout'>Odhlásiť sa</a>
	</div>
</div>

<script>$('.activeSkin').css('background', '$activeSkin[background]');</script>
";
?>

<div class='verification-background'></div>
<div class='content'>
	<table cellpadding="0" cellspacing="0" border="0" style='background-color: rgba(255,255,255,0.3);'>
		<tr>
			<th class='nameHeader'>Meno</th>
			<th class='coinHeader'>Coiny</th>
			<th>Achievementy</th>
			<th>Dokončené levely</th>
		</tr>
	</table>

	<div class='tbody'>
		<table cellpadding="0" cellspacing="0" border="0">		

		<?php
		$friendList = mysqli_fetch_assoc(mysqli_query($conn, "SELECT friendList FROM uzivatelia WHERE id='$_SESSION[id]'"));
		$explode = explode("_", $friendList['friendList']);

		$friends = array();
		$abeceda = "";
		for($i = 1; $i < count($explode); $i++){
			$result = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno FROM uzivatelia WHERE id='$explode[$i]'"));
			$zoradenie = strtoupper($result['meno']);
			$friends[$zoradenie] = $result['meno'];
		}
		ksort($friends);

		foreach($friends as $friendsName => $friends_value){
			$info = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, meno, coins FROM uzivatelia WHERE meno='$friends_value'"));
			$abeceda .= "<tr class=$info[id]><td>$friends_value</td><td>$info[coins]</td><td>...</td><td>...<i class='fas fa-times delete' onclick='friend($info[id])'></i></td></tr>";
			$abeceda .= "<div class='potvrdenie$info[id] verification'>
							<p>Ste si istý, že chcete odstrániť priateľa <b>$info[meno]</b> zo zoznamu priateľov?</p>
							<div class='buttons'>
								<button class='yes' onclick='deleteFriend($info[id])'>Áno</button>
								<button class='no' onclick='player($info[id])'>Nie</button>
							</div>
						</div>";
		}
		$count = count($explode) - 1;
		if($count == 0){
			echo "<div class='notFriend'>Je nám to ľúto, ale nemáte žiadných priateľov.</div>";
		}
		else{
			echo $abeceda;
		}
		?>
		</table>
	</div>

<div style='display: none';>
	<div class='request'>
		<?php 
		$selectCount = mysqli_fetch_assoc(mysqli_query($conn, "SELECT request FROM uzivatelia WHERE id='$_SESSION[id]'"));
		$count = explode("_", $selectCount['request']);
		$text = count($count) - 1;
		if($text > 0){
			echo "<div class='request'>Žiadosti o priateľstvo (<span class='countText'>$text</span>)</div>";
		}

		$friends = array();
		$abeceda = "";
		for($i = 1; $i < count($count); $i++){
			$selectMeno = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno FROM uzivatelia WHERE id='$count[$i]'"));
			$zoradenie = strtoupper($selectMeno['meno']);

			$friends[$zoradenie] = $selectMeno['meno'];
		}
		ksort($friends);

		foreach($friends as $friendsName => $friends_value){
			$id = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id FROM uzivatelia WHERE meno='$friends_value'"));
			$abeceda .= "<div class='$id[id]'>". $friends_value ." <i class='fas fa-check' onclick='accept($id[id])'></i> | <i class='fas fa-times' onclick='notAccept($id[id])'></i></div>";
		}
		echo $abeceda;
		?>

		<?php
		$request = mysqli_query($conn, "SELECT id, meno, request FROM uzivatelia");
		while($data = mysqli_fetch_assoc($request)){
			$explode = explode("_", $data['request']);
			if(in_array($_SESSION['id'], $explode)){
				echo "<div class='requestDelete$data[id]'>". $data['meno'] ." <i class='fas fa-times' onclick='deleteRequest($data[id])'></i></div>";
			}
		}
		?>
	</div>

	<div class='sendRequest'>
		<?php 
		if(isset($_POST['sendButton'])){
			$player = mysqli_real_escape_string($conn, $_POST['playerName']);
			$playerInfo = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, friendList, request FROM uzivatelia WHERE meno='$player'"));
			$explodeFriendList = explode("_", $playerInfo['friendList']);
			$explodeRequest = explode("_", $playerInfo['request']);

			$selectMeno = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno FROM uzivatelia WHERE id='$_SESSION[id]'"));

			if($playerInfo['id'] === $_SESSION['id']){
				echo "Nemôžeš si poslať žiadosť.";
			}
			else if(in_array($_SESSION['id'], $explodeFriendList)){
				echo "Hráč <b>$player</b> je váš priateľ.";
			}
			else if(in_array($_SESSION['id'], $explodeRequest)){
				echo "Hračovi <b>$player</b> ste už žiadosť poslali.";
			}
			else{
				mysqli_query($conn, "UPDATE uzivatelia SET request='$playerInfo[request]_$_SESSION[id]' WHERE id='$playerInfo[id]'");
				mysqli_query($conn, "INSERT INTO oznamenia (idHraca, info) VALUES ('$playerInfo[id]', 'Hráč $selectMeno[meno] vám poslal žiadosť.')");
			}
		}
		?>
		<form action='' method='POST'>
			<input type='text' name='playerName' required autocomplete='off' placeholder='Meno hráča'>
			<input type='submit' name='sendButton' value='Poslať žiadosť'>
		</form>
	</div>
</div>
</div>

<script src='js/friends.js'></script>
<script src="js/menu.js"></script>
</body>
</html>

menu.css
*{
	padding: 0;
	margin: 0;
	font-family: "Open Sans", sans-serif;
}

#background{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: -webkit-linear-gradient(90deg, #16222A 10%, #3A6073 90%); /* Chrome 10+, Saf5.1+ */
	background:    -moz-linear-gradient(90deg, #16222A 10%, #3A6073 90%); /* FF3.6+ */
	background:     -ms-linear-gradient(90deg, #16222A 10%, #3A6073 90%); /* IE10 */
	background:      -o-linear-gradient(90deg, #16222A 10%, #3A6073 90%); /* Opera 11.10+ */
	background:         linear-gradient(90deg, #16222A 10%, #3A6073 90%); /* W3C */
	z-index: -1;
}

body{
	color: #fff;
}

/*________Info hráča_______*/

#menu{
	position: fixed;
	height: 100%;
	width: 260px;
	background-color: #222;
	color: white;
	box-shadow: -3px 0px 10px -3px #0099ff inset;
}

.header{
	padding-bottom: 5px;
	border-bottom: 1px solid gray;
}

.header b{
	letter-spacing: 1px;
	font-family: Calibri;
	font-size: 30px;
	padding-left: 10px; /* ak bude meno príliš dlhe, tak bude mať menší font-size */
}

coin{
	float: right;
	padding: 10px 10px 0 0;
}

.activeSkin{
	height: 130px;
	width: 130px;
	border-radius: 10px;
	margin: 20px 0 0 65px;
}

.footer a{
	padding: 5px 0;
	text-decoration: none;
	color: #fff;
	display: block;
	transition: 0.5s;
	font-size: 20px;
}

a.active{
	color: #0099ff;
}

.footer a:hover{
	color: #0099ff;
}

.accordion{
	padding-top: 10px;
	margin-top: 20px;
	border-top: 1px solid gray;
	display: inline-block;
	width: 100%;
}

.accordion:first-child:after{
	content: "\002B";
	color: #fff;
	float: right;
	display: inline-block;
	padding-right: 10px;
}

.more{
	display: none;
	padding-left: 20px;
}

.more a{
	color: #fff;
}

.more a:hover{
	color: #09f;
}

.activePanel:after{
	content: "\2212" !important;
}

a.friends, .count{
	display: inline-block;
}

#menu .count{
	position: absolute;
	background-color: red;
	border-radius: 50%;
	color: white;
	font-size: 10px;
	min-width: 10px;
	padding: 3px;
	margin: -5px 0 0 -5px;
	text-align: center;
	z-index: 2;
	line-height: 13px;
}

.footer a.logout{
	position: absolute;
	bottom: 0;
	width: 100%;
	border-top: 1px solid gray;
	padding: 10px 0;
}
                                      
                                      
                                      
friends.css
.content{
	position: absolute;
	margin: 100px 100px 0 300px;
}

.friendList-header, .waitList-header{
	display: inline-block;
}

table{
	width: 100%;
	table-layout: fixed;
	border-radius: 10px 10px 0 0;
}

.tbody{
	height: 288px;
	/*min-height: 288px;*/
	overflow-x: auto;
	margin-top: 0px;
	border: 1px solid rgba(255,255,255,0.3);
	border-radius: 0 0 10px 10px;
}

th{
  padding: 20px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-transform: uppercase;
}

td{
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  font-weight: 300;
  font-size: 12px;
  color: #fff;
  border-bottom: solid 1px rgba(255,255,255,0.1);
}

.tbody tr:hover .delete{
	display: inline-block !important;
}

.delete{
	position: absolute;
	right: 25px;
	margin-top: 0px;
	font-size: 20px;
	color: #ff4d4d;
	cursor: pointer;
	display: none !important;
}

.verification-background{
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
	display: none;
	z-index: 1;
}
.verification{
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    padding: 15px;
    color: #fff;
    background-color: rgba(51, 153, 255, 0.5);
    border-radius: 10px;
    text-align: center;
	display: none;
	z-index: 2;
}

AJAX

friend-delete.php
<?php
include "../ostatne/settings.php";
$delete = mysqli_real_escape_string($conn, $_POST['friend']);

$data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno, friendList FROM uzivatelia WHERE id='$_SESSION[id]'"));
$data2 = mysqli_fetch_assoc(mysqli_query($conn, "SELECT friendList FROM uzivatelia WHERE id='$delete'"));
$explode = explode("_", $data['friendList']);

$deleteFriend = str_replace("_$delete", "", $data['friendList']);
$deleteFriend2 = str_replace("_$_SESSION[id]", "", $data2['friendList']);

if(in_array($delete, $explode)){
	mysqli_query($conn, "UPDATE uzivatelia SET friendList='$deleteFriend' WHERE id='$_SESSION[id]'");
	mysqli_query($conn, "UPDATE uzivatelia SET friendList='$deleteFriend2' WHERE id='$delete'");
	mysqli_query($conn, "INSERT INTO oznamenia (idHraca, info) VALUES ('$delete', 'Hráč $data[meno] si vás odstránil zo zoznamu priateľov.')");
	// $count = count($explode) - 1;
	// if($count == 0){
	// 	echo "<div class='notFriend'>Je nám to ľúto, ale nemáte žiadných priateľov.</div>";
	// }
}
?>
  
 my-request-delete.php
 <?php
include "../ostatne/settings.php";
$player = mysqli_real_escape_string($conn, $_POST['id']);

$data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT request FROM uzivatelia WHERE id='$player'"));
$selectMeno = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno FROM uzivatelia WHERE id='$_SESSION[id]'"));
$result = str_replace("_$_SESSION[id]", "", $data['request']);

mysqli_query($conn, "UPDATE uzivatelia SET request='$result' WHERE id='$player'");
mysqli_query($conn, "INSERT INTO oznamenia (idHraca, info) VALUES ('$player', 'Hráč $selectMeno[meno] zrušil žiadosť o priateľstvo.')");
?>
  
 request-accept.php
<?php
include "../ostatne/settings.php";
$friend = mysqli_real_escape_string($conn, $_POST['id']);

$databaza = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno, friendList, request FROM uzivatelia WHERE id='$_SESSION[id]'"));
$databaza2 = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno, coins, friendList FROM uzivatelia WHERE id='$friend'"));
$deleteRequest = str_replace("_$friend", "", $databaza['request']);

$explode = explode("_", $databaza2['friendList']);
$count = count($explode);

if($count < 2){
	mysqli_query($conn, "UPDATE uzivatelia SET friendList='$databaza[friendList]_$friend' WHERE id='$_SESSION[id]'");
	mysqli_query($conn, "UPDATE uzivatelia SET friendList='$databaza2[friendList]_$_SESSION[id]' WHERE id='$friend'");
	mysqli_query($conn, "UPDATE uzivatelia SET request='$deleteRequest' WHERE id='$_SESSION[id]'");
	mysqli_query($conn, "INSERT INTO oznamenia (idHraca, info) VALUES ('$friend', 'Hráč $databaza[meno] prijal vašu žiadosť.')");
	echo "<tr class=$friend><td>$databaza2[meno]</td><td>$databaza2[coins]</td><td>...</td><td>...<i class='fas fa-times delete' onclick='friend($friend)'></i></td></tr>";
	// echo "<div class='potvrdenie$friend verification'>
	// 		<p>Ste si istý, že chcete odstrániť priateľa <b>$databaza2[meno]</b> zo zoznamu priateľov?</p>
	// 		<div class='buttons'>
	// 			<button class='yes' onclick='deleteFriend($friend)'>Áno</button>
	// 			<button class='no' onclick='player($friend)'>Nie</button>
	// 		</div>
	// 	</div>";
}
else{
	echo "<script>alert('Dosiahol si maximálny počet priateľov')";
}
?>
  
  request-delete.php
  <?php
include "../ostatne/settings.php";
$friend = mysqli_real_escape_string($conn, $_POST['id']);

$select = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno, request FROM uzivatelia WHERE id='$_SESSION[id]'"));
$result = str_replace("_$friend", "", $select['request']);

mysqli_query($conn, "UPDATE uzivatelia SET request='$result' WHERE id='$_SESSION[id]'");
mysqli_query($conn, "INSERT INTO oznamenia (idHraca, info) VALUES ('$friend', 'Hráč $select[meno] neprijal vašu žiadosť.')");
?>
  
  sort-coins.php
<?php
include "../ostatne/settings.php";

$selectFriends = mysqli_fetch_assoc(mysqli_query($conn, "SELECT friendList FROM uzivatelia WHERE id='$_SESSION[id]'"));
$explode = explode("_", $selectFriends['friendList']);
$coins = array();
$sort = "";

for($i = 1; $i < count($explode); $i++){
	$data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, coins FROM uzivatelia WHERE id='$explode[$i]'"));

	$coins[$data['id']] = $data['coins'];
}
arsort($coins);

foreach ($coins as $coinsKey => $coins_value){
	$result = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno FROM uzivatelia WHERE id='$coinsKey'"));
  	$sort .= "<tr class=$coinsKey><td>$result[meno]</td><td>$coins_value</td><td>...</td><td>...<i class='fas fa-times delete' onclick='friend($coinsKey)'></i></td></tr>";
}
echo $sort;
?>
  
  sort-name.php
<?php
include "../ostatne/settings.php";

$selectFriends = mysqli_fetch_assoc(mysqli_query($conn, "SELECT friendList FROM uzivatelia WHERE id='$_SESSION[id]'"));
$explode = explode("_", $selectFriends['friendList']);
$friend = array();
$abeceda = "";

for($i = 1; $i < count($explode); $i++){
	$data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno FROM uzivatelia WHERE id='$explode[$i]'"));
	$sort = strtoupper($data['meno']);
	$friend[$sort] = $data['meno'];
}
ksort($friend);

foreach($friend as $friendKey => $friend_value){
	$result = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, coins FROM uzivatelia WHERE meno='$friend_value'"));
	$abeceda .= "<tr class=$result[id]><td>$friend_value</td><td>$result[coins]</td><td>...</td><td>...<i class='fas fa-times delete' onclick='friend($result[id])'></i></td></tr>";
}
echo $abeceda;
?>
  
  js
function friend(friend){
	$(".verification-background").css("display", "block");
	$(".potvrdenie"+ friend).css("display", "block");
}

function deleteFriend(player){
	$.ajax({
		type: "POST",
		url: "ajax/friend-delete.php",
		cache: false,
		data: {
			friend: player
		},
		success: function(data){
			$(".verification-background").css("display", "none");
			$("."+ player).remove();
			$(".potvrdenie"+ player).remove();
		}
	});
}

function player(player){
	$(".verification-background").css("display", "none");
	$(".potvrdenie"+ player).css("display", "none");
}

$(".verification-background").click(function(){
	$(".verification").css("display", "none");
	$(".verification-background").css("display", "none");
});

$(".nameHeader").click(function(){
	$.ajax({
		type: "POST",
		url: "ajax/sort-name.php",
		cache: false,
		success: function(data){
			$(".tbody table").html(data);
		}
	});
});

$(".coinHeader").click(function(){
	$.ajax({
		type: "POST",
		url: "ajax/sort-coins.php",
		cache: false,
		success: function(data){
			$(".tbody table").html(data);
		}
	});
});

function accept(accept){
var x = $(".count").text();
	$.ajax({
		type: 'POST',
		url: 'ajax/request-accept.php',
		cache: false,
		data: {
			id: accept
		},
		success: function(data){
			$('.'+ accept).remove();
			$('.tbody table').append(data);
			$(".count").text(x - 1)
			$('.countText').text(x - 1);
			if(x == 1){
				$(".count").remove();
				$(".request").remove();
			}
		}
	});
}

function notAccept(notAccept){
var x = $(".count").text();
	$.ajax({
		type: "POST",
		url: "ajax/request-delete.php",
		cache: false,
		data: {
			id: notAccept
		},
		success: function(){
			$(".count").text(x - 1);
			$(".countText").text(x - 1);
			$("."+ notAccept).remove();
			if(x == 1){
				$(".count").remove();
				$(".request").remove();
			}
		}
	});
}

function deleteRequest(odstranenie){
	$.ajax({
		type: "POST",
		url: "ajax/my-request-delete.php",
		cache: false,
		data: {
			id: odstranenie
		},
		success: $(".requestDelete"+ odstranenie).remove()
	});
}
