<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accès non autorisé</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #ff0000;
            color: #fff;
            text-align: center;
            padding: 50px;
        }

        h1 {
            color: #fff;
        }
    </style>
</head>
<body>
    <h1>Accès non autorisé. Veuillez vous connecter.</h1>
</body>
</html>

<?php
header("refresh:2;url=index.php");
?>