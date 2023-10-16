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

}

if (!isset($_SESSION['user']) || !$_SESSION['user']->isAdmin) {
    header('Location: login.php');
    exit;
}

$title = 'Administrateur';
include 'inc/header.php';
?>

<h1>Bien joué.</h1>
<h2><?php echo getenv("FLAG"); ?></h2>

<?php include 'inc/footer.php'; ?>