<?php

    // header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");

    require("functions.php");

    if (isset($_POST['full'])) {
        $fname = 'data/data_'.strval(get_num_existing_subs($dir="data")+1).'.txt';
        $handle = fopen($fname, "w");
        fwrite($handle, serialize($_POST));
        fclose($handle);
    };

?>