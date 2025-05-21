<?php

    
    $r = "../php/";
    require_once("{$r}InterfaceSettingsBrightness.php");
    require_once("{$r}InterfaceSettingsDimensions.php");
    require_once("{$r}APISettingsUpdate.php");
    
    
    header('Content-Type: application/json');
    $data = file_get_contents(("php://input"));
    if ($data != "") {
        $decoded = json_decode($data);
        $packed["brightness"] = new InterfaceSettingsBrightness($decoded->brightness);
        $packed["dimensions"] = new InterfaceSettingsDimensions($decoded->dimensions);
        APISettingsUpdate::go($packed);
        echo $data;
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    
?>
