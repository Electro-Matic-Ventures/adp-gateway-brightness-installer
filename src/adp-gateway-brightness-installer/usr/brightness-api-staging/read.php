<?php


    $r = "../php/";
    require_once("{$r}APISettingsRead.php");
    
    
    header('Content-Type: application/json');
    $response = APISettingsRead::go();
    echo json_encode($response);

    
?> 