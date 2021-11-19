<?php

    function getStdDev($array) {
        $n = count($array);
        $variance = 0.0;
        $mean = array_sum($array)/$n;
        foreach($array as $i) {
            $variance += pow(($i - $mean), 2);
        }
        return (float)sqrt($variance/$n);
    }


 ?>
