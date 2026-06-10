<?php 
session_start(); 
if(isset($_SESSION['email']))
    header('Location:pages/explorar.php');
else 
    header('Location:login.php'); 
exit;
