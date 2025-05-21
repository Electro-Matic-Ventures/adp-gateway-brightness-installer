<?php


    class APISettingsReadProcessData {
        
        public static function go($data) {
            $output = array();
            $output["brightness"] = self::add_brightness($data["brightness"][0]);
            $output["dimensions"] = self::add_dimensions($data["dimensions"][0]);
            return $output;
        }

        private static function add_brightness(InterfaceSettingsBrightness $data) {
            $output = array();
            $output["value"] = $data->value;
            return $output;
        }

        private static function add_dimensions(InterfaceSettingsDimensions $data) {
            $output = array();
            $output["width"] = $data->width;
            $output["height"] = $data->height;
            return $output;
        }

}


?>