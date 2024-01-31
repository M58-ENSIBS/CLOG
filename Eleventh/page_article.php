<?php
// Vérifier si le cookie "TEST123" est présent
if (!empty($_COOKIE['TEST123'])) {
}
else {
    header('Location: page_non_autorisee.php');
    exit;
}
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
            <a href="index.php" >Accueil</a>
            <a href="page_article.php" class="active" >Explorer les voitures</a>
            <a href="page_login.php" >Login - Intranet</a>
        </nav>

        <div class="social-media">
        </div>
    </header>
    

    <section class="home">
        <div class="home-content">
        <div class="car-info">
            <h3 class="car-title"><a href="?page=car1">Modèle A</a></h3>
            <p class="car-details">Caractéristiques : Puissance, consommation, etc.</p>
            <p class="car-details">Prix : 25 000 €</p>
        </div>

            <div class="car-info">
            <h3 class="car-title"><a href="?page=car2">Modèle B</a></h3>
            <p class="car-details">Caractéristiques : Puissance, consommation, etc.</p>
            <p class="car-details">Prix : 30 000 €</p>
        </div>
        


        </div>

        <div class="rhombus2"></div>
    </section>
    

</body>

</html>


<?php
if (isset($_GET['page'])) {
  $page = $_GET['page'];
  $file = $page . ".php";
  
  // Read the file content into a string
  $content = file_get_contents($file);

  // Check the length of the content
  if(strlen($content) > 200){
    echo substr($content, 0, 200) . "... Pas de spoil";
  } else {
    include($file);
  }
}
?>

