<?php

    
    require_once ("DBIOQueryCreator.php");


    class PageSignAPIBuildQueries {
        
        public static function go() {
            $queries = self::current_file();
            $queries .= self::defaults();
            $queries .= self::files();
            $queries .= self::playlist();
            $queries .= self::rows();
            $queries .= self::screens();
            $queries .= self::segments();
            $queries .= self::dimensions();
            $queries .= self::time();
            $queries .= self::brightness();
            return $queries;
        }

        private static function current_file() {
            $query = DBIOQueryCreator::read_all_rows("adp", "current_file");
            return $query;
        }

        private static function defaults() {
            $query = DBIOQueryCreator::read_one_row("adp", "defaults", "id", "1");
            return $query;
        }

        private static function files() {
            $query = DBIOQueryCreator::read_all_rows("adp", "files");
            return $query;
        }

        private static function playlist() {
            $query = DBIOQueryCreator::read_all_rows("adp", "playlist");
            return $query;
        }

        private static function rows() {
            $query = DBIOQueryCreator::read_all_rows("adp", "row_formatting");
            return $query;
        }

        private static function screens() {
            $query = DBIOQueryCreator::read_all_rows("adp", "screen_formatting");
            return $query;
        }

        private static function segments() {
            $query = DBIOQueryCreator::read_all_rows("adp", "segment_formatting");
            return $query;
        }

        private static function dimensions() {
            $query = DBIOQueryCreator::read_one_row("settings", "dimensions", "name", "current");
            return $query;
        }

        private static function time() {
            $query = DBIOQueryCreator::read_one_row("settings", "time", "name", "user");
            return $query;
        }

        private static function brightness() {
            $query = "select * from settings.brightness where id=1;";
            return $query;
        }

    }

?>