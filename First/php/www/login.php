<?php

session_start();

class User {
    public $mail;
    public $password;
    public $isAdmin;

    public function __construct($mail, $password, $isAdmin) {
        $this->mail = $mail;
        $this->password = $password;
        $this->isAdmin = $isAdmin;
    }

    // autoloader
    public static function __autoload($class_name) {
        include $class_name . '.php';
    }
}

if (isset($_POST['mail']) && isset($_POST['password'])) {

    $administrateur = new User(getenv("ADMIN_MAIL"), getenv("ADMIN_PASS"), true);
    $moderateur = new User(getenv("USER_MAIL"), getenv("USER_PASS"), false);
    $users = [$administrateur, $moderateur];

    foreach ($users as $user) {
        if ($user->mail === $_POST['mail'] && $user->password === $_POST['password']) {
            $_SESSION['user'] = $user;
            header('Location: tickets.php?id=1');
            exit;
        }
    }
}

$title = "Connexion";
include 'inc/header.php';

?> 
<h1>Connectez-vous</h1>

<div class="spacer-25"></div>
<div class="form-container">
<form action="login.php" method="post">
    <label for="username">Nom d'utilisateur</label>
    <input type="text" name="mail" id="mail" />
    <label for="password">Mot de passe</label>
    <input type="password" name="password" id="password" />
    <input type="submit" value="Se connecter" />
</form>
</div>

<?php include 'inc/footer.php'; ?>