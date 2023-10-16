<?php

session_start();

if(!isset($_SESSION['user'])) {
    header('Location: login.php');
}

$title = 'Informations';
include 'inc/header.php';
?>

<h1> En cas de perte de mot de passes :  </h1>
<h2> Veuillez reset votre mot de passe : <a href="binaireRes3tPassw0rd.php">binaire</a> </h2>

<?php include 'inc/footer.php'; ?>