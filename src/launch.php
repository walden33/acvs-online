<?php

    $exp_link = "";
    if (isset($_GET['PROLIFIC_PID']) && isset($_GET['STUDY_ID']) &&
        isset($_GET['SESSION_ID'])) {
        // Making a record every time this landing page is visited.
        // This is done, if not involving a database, by simply creating a file
        // for every time page is visited.
        $fname = 'cb/placeholder_'.bin2hex(random_bytes(16)).'.cb';
        $handle = fopen($fname, "w");
        fwrite($handle, "");
        fclose($handle);
        // Create the experiment link
        $exp_link = "exp.php?PROLIFIC_PID=".$_GET['PROLIFIC_PID'].
            "&STUDY_ID=".$_GET['STUDY_ID']."&SESSION_ID=".$_GET['SESSION_ID'].
            "&CB_ID=".count(glob("cb/*"));
        // Create manual redirect link
        echo "<p>Redirecting you to the experiment page ...</p>";
        echo "<p>If page is not redirected after 3 seconds, you can click on ";
        echo "<a href=\"".$exp_link."\">this</a> to manually open the ";
        echo "experiment page.</p>";
    } else {
        echo "<p>One or more Prolific URL parameters are missing.</p>";
        echo "<p>For testing purposes, add this to :</p>";
        echo "<p>?PROLIFIC_PID=88888888&STUDY_ID=001AA&SESSION_ID=0000</p>";
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Launch</title>
</head>
<body>
    <script>
        setTimeout(()=>{
            window.location.replace("<?php echo $exp_link ?>");
        }, 3000);
    </script>
</body>
</html>