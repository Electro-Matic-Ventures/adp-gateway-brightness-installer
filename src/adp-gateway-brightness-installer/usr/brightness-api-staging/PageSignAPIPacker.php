<?php


    require_once("RemoveNotInPlaylist.php");
    require_once("GetStrings.php");
    require_once("InterfaceADP.php");
    require_once("InterfaceADPCurrentFile.php");
    require_once("InterfaceADPDefaults.php");
    require_once("InterfaceADPFiles.php");
    require_once("InterfaceADPPlaylist.php");
    require_once("InterfaceADPRowFormatting.php");
    require_once("InterfaceADPScreenFormatting.php");
    require_once("InterfaceADPSegmentFormatting.php");
    require_once("InterfaceSettingsDimensions.php");
    require_once("InterfaceSettingsTime.php");
	require_once("InterfaceSettingsBrightness.php");
    require_once("AssembleCharacters.php");


    class PageSignAPIPacker {

        public static function go($original) {
            $cleaned = RemoveNotInPlaylist::go($original);
            $cleaned = GetStrings::go($original, $cleaned);
            $packaged = self::package($cleaned);
            return $packaged;
        }

        private static function package($cleaned) {
            $p = array();
            $p["current_file"] = self::current_file($cleaned["current_file"]);
            $p["defaults"] = self::defaults($cleaned["defaults"]);
            $p["files"] = self::files($cleaned["files"]);
            $p["playlist"] = self::playlist($cleaned["playlist"]);
            $p["row_formatting"] = self::row_formatting($cleaned["row_formatting"]);
            $p["screen_formatting"] = self::screen_formatting($cleaned["screen_formatting"]);
            $p["segment_formatting"] = self::segment_formatting($cleaned["segment_formatting"]);
            $p["dimensions"] = self::dimensions($cleaned["dimensions"]);
            $p["time"] = self::time($cleaned["time"]);
            $p["library"] = self::library($p);
            $p["brightness"] = self::brightness($cleaned["brightness"]);
            $r = new InterfaceADP($p);
            return $r;
        }

        private static function current_file($data) {
            if (is_null($data)) {
                return new InterfaceADPCurrentFile();
            }
            if (count($data) == 0) {
                return new InterfaceADPCurrentFile();
            }
            return DBIOParent::pack($data, new InterfaceADPCurrentFile())[0];
        }

        private static function defaults($data) {
            return DBIOParent::pack($data, new InterfaceADPDefaults())[0];
        }

        private static function files($data) {
            if (is_null($data)) {
                return [new InterfaceADPFiles()];
            }
            if (count($data) == 0) {
                return [new InterfaceADPFiles()];
            }
            return DBIOParent::pack($data, new InterfaceADPFiles());
        }

        private static function playlist($data) {
            if (is_null($data)) {
                return [new InterfaceADPPlaylist()];
            }
            if (count($data) == 0) {
                return [new InterfaceADPPlaylist()];
            }
            return DBIOParent::pack($data, new InterfaceADPPlaylist());
        }

        private static function row_formatting($data) {
            if (is_null($data)) {
                return [new InterfaceADPRowFormatting()];
            }
            if (count($data) == 0) {
                return [new InterfaceADPRowFormatting()];
            }
            return DBIOParent::pack($data, new InterfaceADPRowFormatting());
        }

        private static function screen_formatting($data) {
            if (is_null($data)) {
                return [new InterfaceADPScreenFormatting()];
            }
            if (count($data) == 0) {
                return [new InterfaceADPScreenFormatting()];
            }
            return DBIOParent::pack($data, new InterfaceADPScreenFormatting());
        }

        private static function segment_formatting($data) {
            if (is_null($data)) {
                return [new InterfaceADPSegmentFormatting()];
            }
            if (count($data) == 0) {
                return [new InterfaceADPSegmentFormatting()];
            }
            return DBIOParent::pack($data, new InterfaceADPSegmentFormatting());
        }

        private static function dimensions($data) {
            return DBIOParent::pack($data, new InterfaceSettingsDimensions())[0];
        }

        private static function time($data) {
            return DBIOParent::pack($data, new InterfaceSettingsTime())[0];
        }

        private static function library($data) {
            return AssembleCharacters::go($data);
        }

        private static function brightness($data) {
            return DBIOParent::pack($data, new InterfaceSettingsBrightness())[0];
        }
    }


?>