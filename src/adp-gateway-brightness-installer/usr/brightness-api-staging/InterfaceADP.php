<?php

    
    require_once("DataclassParent.php");
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


    /**
     * @property ? InterfaceADPCurrentFile $current_file;
     * @property ? InterfaceADPDefaults $defaults;
     * @property ? InterfaceADPFiles[] $files;
     * @property ? InterfaceADPPlaylist[] $playlist;
     * @property ? InterfaceADPRowFormatting[] $row_formatting;
     * @property ? InterfaceScreenFormatting[] $screen_formatting;
     * @property ? InterfaceSegmentFormatting[] $segment_formatting;
     * @property ? InterfaceSettingsDimensions $dimensions;
     * @property ? InterfaceSettingsBrightness $brightness;
     * @property ? InterfaceSettingsTime $time;
     */    
    class InterfaceADP extends DataclassParent {

        public ? InterfaceADPCurrentFile $current_file;
        public ? InterfaceADPDefaults $defaults;
        public ? array $files;
        public ? array  $playlist;
        public ? array $row_formatting;
        public ? array $screen_formatting;
        public ? array $segment_formatting;
        public ? InterfaceSettingsDimensions $dimensions;
        public ? InterfaceSettingsBrightness $brightness;
        public ? InterfaceSettingsTime $time;
        public ? array $library;

        public function __construct($data = null) {
            if (is_null($data)) {
                $this->null_constructor();
                return;
            }
            $this->data_constructor($data);
            return;
        }

    }

?>