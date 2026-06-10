<?php

session_start();

session_unset();
session_destroy();

header('Location: /tcc/agendatech/frontend/login.php');
exit;
