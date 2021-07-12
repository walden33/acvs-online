<?php

    // header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");

    // Prolific
    if (isset($_GET['PROLIFIC_PID'])) {
        $dir = 'data/'.$_GET['PROLIFIC_PID'];
        if (!is_dir($dir)) {
            mkdir($dir, 0755);
        }
        if (isset($_POST['stimuli'])) {
            $hash = bin2hex(random_bytes(16));
            $fname = $dir.'/stimuli_'.$hash.'.txt';
            $handle = fopen($fname, "w");
            fwrite($handle, serialize($_POST));
            fclose($handle);
        };
    
        if (isset($_POST['data'])) {
            $hash = bin2hex(random_bytes(16));
            $fname = $dir.'/data_'.$hash.'.txt';
            $handle = fopen($fname, "w");
            fwrite($handle, serialize($_POST));
            fclose($handle);
        };
    } else {
        if (isset($_POST['stimuli'])) {
            $hash = bin2hex(random_bytes(16));
            $fname = 'data/stimuli_'.$hash.'.txt';
            $handle = fopen($fname, "w");
            fwrite($handle, serialize($_POST));
            fclose($handle);
        };
    
        if (isset($_POST['data'])) {
            $hash = bin2hex(random_bytes(16));
            $fname = 'data/data_'.$hash.'.txt';
            $handle = fopen($fname, "w");
            fwrite($handle, serialize($_POST));
            fclose($handle);
        };
    }

?>