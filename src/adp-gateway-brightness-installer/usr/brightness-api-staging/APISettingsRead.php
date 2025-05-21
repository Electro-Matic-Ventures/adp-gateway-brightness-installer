<?php


    require_once("DBIOParent.php");
    require_once("InterfaceSettingsDimensions.php");
    require_once("InterfaceSettingsBrightness.php");
    require_once("APISettingsReadProcessData.php");
    
    
    class APISettingsRead {
        
        public static function go() {
            $queries = [
                "SELECT * FROM settings.dimensions",
                "SELECT * FROM settings.brightness"
            ];
            $queries = implode(";",$queries);
            $response = DBIOParent::multi_query($queries);
            $data["dimensions"] = DBIOParent::pack($response[0], new InterfaceSettingsDimensions());
            $data["brightness"] = DBIOParent::pack($response[1], new InterfaceSettingsBrightness());
            $processed = APISettingsReadProcessData::go($data);
            return $processed;
        }

    }

    
?>