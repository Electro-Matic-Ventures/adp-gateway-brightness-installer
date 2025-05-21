<?php


    require_once("DataclassParent.php");
	
    
    /**
     * data class for settings's brightness table
     * @property $id
     * @property $value
     */
    class InterfaceSettingsBrightness extends DataclassParent {

        public ? string $id;
        public ? string $value;
        
        public function __construct($data = null){
            if(is_null($data)) {
                $this->null_constructor();
                return;
            }
            $this->data_constructor($data);
            return;
        }
        
    }


?>