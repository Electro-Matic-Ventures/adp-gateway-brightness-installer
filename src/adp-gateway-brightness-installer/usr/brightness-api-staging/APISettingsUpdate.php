<?php


    require_once("DBIOParent.php");
    
    
    class APISettingsUpdate {	
        
        public static function go($data) {
            if (isset($data["brightness"]->value)) {
            APISettingsUpdate::update_brightness($data["brightness"]);
            }
            if (isset($data["dimensions"]->width) && isset($data["dimensions"]->height)) {
            APISettingsUpdate::update_dimensions($data["dimensions"]);
            }
            return;
        }

        private static function update_brightness(InterfaceSettingsBrightness $data) {
            $db = new DBConnection();
            $query = "UPDATE settings.brightness SET value=? WHERE id=1;";
            $prepared = $db->mysqli->prepare($query);
            $prepared->bind_param("s", $data->value);
            $prepared->execute();
            $prepared->close();
            $db->mysqli->close();
            return;
        }

        private static function update_dimensions(InterfaceSettingsDimensions $data) {
            $db = new DBConnection();
            $query = "UPDATE settings.dimensions SET width=?, height=? WHERE id=1;";
            $prepared = $db->mysqli->prepare($query);
            $prepared->bind_param("ss", $data->width, $data->height);
            $prepared->execute();
            $prepared->close();
            $db->mysqli->close();
            return;
        }

    }

    
?>