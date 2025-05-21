<?php

    class RemoveNotInPlaylist {
        
        private const CURRENT = 0;
        private const DEFAULTS = 1;
        private const FILES = 2;
        private const PLAYLIST = 3;
        private const ROWS = 4;
        private const SCREENS = 5;
        private const SEGMENTS = 6;
        private const DIMENSTIONS = 7;
        private const TIME = 8;
        private const BRIGHTNESS = 9;

        public static function go($original) {
            $cleaned = array();
            $playlist_map = self::playlist_map($original);
            $cleaned["current_file"] = $original[self::CURRENT];
            $cleaned["defaults"] = $original[self::DEFAULTS];
            $cleaned["files"] = self::reduce($original[self::FILES], $playlist_map);
            $cleaned["playlist"] = $original[self::PLAYLIST];
            $cleaned["row_formatting"] = self::reduce($original[self::ROWS], $playlist_map);
            $cleaned["screen_formatting"] = self::reduce($original[self::SCREENS], $playlist_map);
            $cleaned["segment_formatting"] = self::reduce($original[self::SEGMENTS], $playlist_map);
            $cleaned["dimensions"] = $original[self::DIMENSTIONS];
            $cleaned["time"] = $original[self::TIME];
            $cleaned["brightness"] = $original[self::BRIGHTNESS];
            return $cleaned;            
        }

        private static function playlist_map($original) {
            $out = array();
            if (is_null($original)) {
                return $out;
            }
            foreach ($original[self::PLAYLIST] as $key => $value) {
                $out[$value["file_id"]] = null;
            };
            return $out;
        }

        private static function reduce($data, $playlist_map) {
            $out = array();
            if (is_null($data)) {
                return $out;
            }
            foreach ($data as $key => $value) {
                $id = $value["file_id"];
                if (array_key_exists($id, $playlist_map)) {
                    $out[] = $value;
                }
            }
            return $out;
        }

    }

?>