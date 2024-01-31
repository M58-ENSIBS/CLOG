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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style/login.css">
</head>
<body>
<div class="login-container">
<form class="login-form" action="page_login.php" method="POST">
  <h1>ENT</h1>
  <p>Merci de vous connecter</p>
    <div class="input-group">
    <input type="text" id="username" name="username" placeholder="Username" required autofocus autocomplete="off">
      <input type="password" id="password" name="password" placeholder="Password" required autocomplete="off">
    </div>
    <button type="submit" value="Login">Login</button>
    <div class="bottom-text">
    </div>
  </form>
</div>
</body>
</html>

<?php
if (isset($_POST["username"]) && isset($_POST["password"])) {
  if ($_POST["username"] == 'Designer' && hash("md5", $_POST["password"]) == $_POST["password"]) {
    // set c00kie:9ee7ee5fe298186d2156339a5a9dbdc3 in cookies
    setcookie("cookies", "9ee7ee5fe298186d2156339a5a9dbdc3", time() + 3600);
    header("Location: designer/index.php");
  } else {
    header("Location: page_non_autorisee.php");
  }
}
?>

