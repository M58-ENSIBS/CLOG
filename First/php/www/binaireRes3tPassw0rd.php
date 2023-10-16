<?php


header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="binaire"');
readfile('../main');
