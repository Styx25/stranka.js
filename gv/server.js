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
