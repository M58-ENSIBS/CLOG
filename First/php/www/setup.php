<?php

include 'inc/db.php';

$author = getenv("ADMIN_MAIL");
$db->prepare('UPDATE tickets SET author = ?')->execute([$author]);