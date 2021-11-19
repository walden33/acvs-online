<?php
    if (!isset($_GET['test'])) {    // if url parameter 'test' is undefined
        $fname = 'cb/placeholder_'.bin2hex(random_bytes(16)).'.cb';
        $handle = fopen($fname, "w");
        fwrite($handle, "");
        fclose($handle);
    }
?>

<!DOCTYPE html>
<html>
<head>
  <title>ACVS - Cognitive Control Lab</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <!--JAVASCRIPT_INCLUDES_BEGIN-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bowser/1.9.4/bowser.min.js"></script>
  <!--JAVASCRIPT_INCLUDES_END-->

  <!--CSS_INCLUDES_BEGIN-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fira+Mono:400,500,700|Open+Sans:400,400i,700,700i">
  <!--CSS_INCLUDES_END-->

  <style>
    // CSS_INSERTED_HERE
  </style>
</head>


<body>
  <!-- This is where the GUI will be inserted -->
  <div id="gui-container">
    <div id="gui" class="gui-div">
      <div id="workspace" class="ac-workspace"></div>
    </div>
  </div>
  <div id="overlay">
    <div id="overlay-text">To optimize your experience in this experiment, click anywhere to enter full-screen mode.</div>
  </div>
  <div id="hidden-sub-id" style="display: none;"><?php echo $_GET['id'] ?></div>
  <div id="hidden-test" style="display: none;"><?php echo $_GET['test'] ?></div>
  <div id="hidden-alt" style="display: none;"><?php echo $_GET['alt'] ?></div>
  <div id="cb-id" style="display: none;"><?php echo count(glob("cb/*")) ?></div>
  <div id="prolific-id" style="display: none;"><?php echo $_GET['PROLIFIC_PID'] ?></div>
  <div id="study-id" style="display: none;"><?php echo $_GET['STUDY_ID'] ?></div>
  <div id="session-id" style="display: none;"><?php echo $_GET['SESSION_ID'] ?></div>


  <script>
    // SCRIPTS_INSERTED_HERE
  </script>

</body>
</html>