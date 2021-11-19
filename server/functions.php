<?php

    function get_num_existing_subs($dir) {
        $existingSubs = [];
        $files = scandir($dir);
        foreach ($files as $file) {
            if(strpos($file, "data")===0) {   // if data file is identified
                $fileExtension = strrchr($file, ".");   // strrchr — Find the last occurrence of a character in a string
                $subNo = intval(substr(rtrim($file, $fileExtension), strlen($fileExtension)+1));
                array_push($existingSubs, $subNo);
            }
        }
        if(count($existingSubs)===0) {
            return 0;
        } else {
            return max($existingSubs);
        }
    }

 ?>
