<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

?><!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><?php echo $title; ?> | Challenge Cyberlog</title>
    <link rel="stylesheet" href="css/style.css" />
</head>
<body>