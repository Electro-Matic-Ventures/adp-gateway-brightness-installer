<?php

    
    $r = "../php/";
    require_once("{$r}InterfaceSettingsBrightness.php");
    require_once("{$r}InterfaceSettingsDimensions.php");
    require_once("{$r}APISettingsUpdate.php");
    
    
    header('Content-Type: application/json');
    $data = file_get_contents(("php://input"));
    if ($data != "") {
        $decoded = json_decode($data);
        if (isset($decoded->brightness)) {
            $packed["brightness"] = new InterfaceSettingsBrightness($decoded->brightness);
        } else {
            $packed["brightness"] = new InterfaceSettingsBrightness();
        }
        if (isset($decoded->dimensions)) {
            $packed["dimensions"] = new InterfaceSettingsDimensions($decoded->dimensions);
        } else {
            $packed["dimensions"] = new InterfaceSettingsDimensions();
        }
        APISettingsUpdate::go($packed);
        echo json_encode($data);
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    
?>
