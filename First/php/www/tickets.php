<?php

session_start();

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$title = 'Tickets';

include 'inc/header.php';
include 'inc/db.php';

$id = $_GET['id'];

$ticket = $db->query('SELECT title, content FROM tickets WHERE id = ' . $id);
$ticket = $ticket->fetch();
?>

<h1><?php echo htmlentities($ticket['title']); ?></h1>
<h2><?php echo htmlentities($ticket['content']); ?></h2>

<div class="spacer-25"></div>
<h3> Vous êtes administrateur ? <a href="administrateur.php"> Cliquez ici </a> pour le panel d'aministration.</h3>

<?php include 'inc/footer.php'; ?>
