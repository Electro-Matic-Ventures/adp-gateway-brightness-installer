<?php


    $r = "../php/"; 
    require_once("{$r}APIScreensUpdate.php");


    header('Content-Type: application/json');
    $data = file_get_contents(("php://input"));
    if ($data != "") {
        $data = json_decode($data);
        APIScreensUpdate::go($data);
        echo json_encode($data);
        http_response_code(201);
    } else {
        http_response_code(400);
    }
    

?>