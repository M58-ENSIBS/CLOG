<?php
// Vérifier si le cookie "TEST123" est présent
if (!empty($_COOKIE['TEST123'])) {
    // Le cookie est présent, afficher la page
    ?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COUTAND - MARCHAND - Accueil</title>
    <link rel="stylesheet" href="style/index.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>

<body>

    <header class="header">
        <a href="#" class="logo">C-M <span>Automobile</span></a>

        <nav class="navbar">
            <a href="index.php" style="--i:1" class="active">Accueil</a>
            <a href="page_article.php" style="--i:4">Explorer les voitures</a>
            <a href="page_login.php" style="--i:5">Login - Intranet</a>
        </nav>

        <div class="social-media">
        </div>
    </header>
    

    <section class="home">
        <div class="home-content">
            <center><h1 style="color: green; font-weight: bold; border: 2px solid black;">Site en BETA</h1></center>            <br>
            <h1>Expérience de l'achat automobile.</h1>
            <h3>Réinventée !</h3>
            <p>Etudiants à l'ENSIBS, nous avons décidé de changer de voie et de nous lancer dans la vente de voitures.</p>
            <p>Nous avons donc créé notre entreprise COUTAND - MARCHAND.</p>
            <a href="page_article.php" class="btn">Explorer les voitures</a>
        </div>

        <div class="home-img">
            <div class="rhombus">
                <img src="images/car.png" alt="">
            </div>
        </div>

        <div class="rhombus2"></div>
    </section>
    

</body>

</html>
    <?php
} else {
    header('Location: page_non_autorisee.php');
    exit;
}
?>
