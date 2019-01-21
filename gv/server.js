<?php
include "ine/settings.php";
?>
<!doctype html>
<html>
<head>
<title>Nastavenia</title>
<meta charset="utf-8">
<!-- <meta name="theme-color" content="#141414"> -->
<link rel="stylesheet" href="css/menu.css">
<link rel="stylesheet" href="css/settings.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.7/css/all.css">
<script src="https://code.jquery.com/jquery-latest.min.js"></script>
</head>
<body>
<?php include "ine/menu.php"; ?>

<div class='background'>
	<form class='nameForm' action='' method='POST'>
		<input type='text' name='changeName' value='$sql[meno]' autocomplete='off' required>
		<input type='password' name='confirm' required>
		<input type='submit' name='nameButton' value='Zmeniť meno'>
	</form>
</div>

<div id='body'>

	<div class='menu'>
		<a onclick="changePage('account')" class='account active'>Nastavenia účtu</a>
		<a onclick="changePage('gaming')" class='gaming'>Herné nastavenia</a>
		<a onclick="changePage('block')" class='block'>Blokovaní uživatelia</a>
	</div>

	<div class='content'>

	<div class='tab' id='account' style='display: block;'>
		<div class='header'>Nastavenia účtu</div>
		<?php
		$sql = mysqli_fetch_assoc(mysqli_query($conn, "SELECT meno, email FROM uzivatelia WHERE id='$_SESSION[id]'"));

		echo "
		<table>
			<tr class='name'>
				<td>Meno</td>
				<td class='settings'>$sql[meno]</td>
				<td class='change'>Zmeniť</td>
			</tr>
			<tr>
				<td>Heslo</td>
				<td class='settings'>********</td>
				<td class='change'>Zmeniť</td>
			</tr>
			<tr>
				<td>E-mail</td>
				<td class='settings'>$sql[email]</td>
				<td class='change'>Zmeniť</td>
			</tr>
		</table>
		";
		?>
	</div>

	<div class='tab' id='gaming'>
		<div class='header'>Herné nastavenia</div>
		<table>
			<tr>
				<td>Klávesové skratky</td>
				<td><input type='checkbox'> Zapnúť</td>
			</tr>
		</table>

	<footer>
		<input type='button' class='newSettings' value='Nastaviť pôvodné nastavenia'>
		<input type='button' class='defaultSettings' value='Uložiť zmeny'>
	</footer>
	</div>

	<div class='tab' id='block'>
		<div class='header'>Blokovaní uživatelia</div>
		<table>
			<tr>
				<td>Momentálne nemáš žiadného hráča v blok liste.</td>
			</tr>
			<tr>
				<td>Pridať hráča: <input type='text' name='playerName' required><input type='submit' name='blokButton' value='Zablokovať'></td>
			</tr>
		</table>
	</div>
	</div>
</div>

<script>
function changePage(change){
	if(!$("."+ change).hasClass("active")){

		$(".active").removeClass("active");
		$("."+ change).addClass("active");

		$(".tab").fadeOut();
		$("#"+ change).fadeIn();

	}
}


$(".name .change").click(function(){
	$(".background").show();
	$(".nameForm").show();
});

$(".background").click(function(){
	$(".background").hide();
});
</script>

</body>
</html>

css
#body{
	position: relative;
	top: 130px;
	margin: 0 0 0 150px;
	width: 950px;
	height: 525px;
	background-color: rgba(33, 33, 33, 0.65);
}

.menu{
	position: relative;
	height: 100%;
	width: 200px;
	background-color: rgba(44, 44, 53, 0.60);
	color: #999;
}

.menu a{
	display: block;
	font-family: "Open Sans", sans-serif;
	margin: 5px 10px ;
	font-size: 17px;
	cursor: pointer;
	margin-bottom: 2px;
	transition: 0.5s;
}

.menu a:hover{color: #fff;}

.content{
	position: relative;
	width: 600px; 
	min-height: 400px;
	background-color: rgba(44, 44, 53, 0.60);
	margin: 40px 0 0 50px;
	padding: 15px 20px 20px 20px;
}

.menu, .content{
	display: inline-block;
	vertical-align: top;
}

.content .header{
	font-size: 25px;
	font-weight: bold;
	margin-bottom: 20px;
	letter-spacing: 1px;
	font-family: "calibri", sans-serif;
}

.tab{
	position: absolute;
	display: none;
	width: 100%;
	height: 100%;
}

table{
	width: 100%;
}

td{
	padding: 10px 0;
}

#account td:nth-child(1){
	width: 20%;
	padding-right: 70px;
}

#account td:nth-child(2){
	width: 60%;
	margin: 0 100px 0 30px;
}

#account td:nth-child(3){
	width: 30%;
	margin-left: 10px;
}

.settings{
	color: #aaa;
}

.change{
	position: absolute;
	cursor: pointer;
}

.background{
	display: none;
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1;
}

.nameForm{
	position: absolute;
}


/*________gaming__________*/

footer{
	position: absolute;
	font-family: "Open Sans", sans-serif;
	bottom: 35px;
	width: 100%;
}

footer input{
	padding: 7px 14px;
	border: none;
	border-radius: 25px;
	font-family: Arial, Helvetica, sans-serif;
	outline: none;
	cursor: pointer;
	color: #fff;
	transition: 0.3s;
}

footer input.newSettings{
	/*background-color: #1061EE;*/
	background: none;
	border: 1px solid #1061EE;
	/*opacity: 0.7;*/
}

/*footer input.newSettings:hover{
	background-color: #0c45a7;
	box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
}
*/
footer input.defaultSettings{
	/*margin-left: 300px;*/
	float: right;
	margin-right: 40px;
	/*background-color: #4CAF50;*/
	/*background-color: #01c10a;*/
	background: none;
	border: 1px solid #01c10a;
}

/*footer input.defaultSettings:hover{
	background-color: #0b8e11;
}
*/

/*____________Blok________________*/

input[type='text']{
	margin-left: 10px;
}

input[type='submit']{
	margin-left: 5px;
}
