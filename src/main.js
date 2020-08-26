window.onload = function () {
  //
  // Amazon-MTurk script to set the userId for the subject.
  //
  turkSetAssignmentID();
  window._acvs_guid = "78AA3BF1B3C34A9CB8DA33B17B01649A";

  exp.HtmlGui.show_header("Online REP Experiment - Cognitive Control Lab");

  //
  // If we are just beginning the experiment, and we are NOT in an iframe...
  //
  if (!util.Util.window_is_iframe()) {

    if (navigator.cookieEnabled == false) {
      d3.select("#ace_instructions").style("display", "none");
      d3.select("body").append("p").html("You must enable cookies in your browser to complete this HIT. All cookies for this experiment are set to automatically expire. Thank you!");
      return;
    }

    if (util.Util.get_cookie("completed_acvs") == "true") {
      d3.select("#ace_instructions").style("display", "none");
      alert("Do NOT complete this HIT a second time! Thank you.");
      d3.select("body").append("p").html("You appear to have already completed this experiment. Please contact Cognitive Control Lab if you have further questions. Thank you!");
      return;
    }



    if (assignmentID != "ASSIGNMENT_ID_NOT_AVAILABLE") {
      //
      // We have an assignmentID and are all set to run the experiment. Hide
      // the new window button.
      //
      d3.select(".ace_open_tab_button").style("display", "none");
      d3.select("#ace_instructions").style("display", "none");

      //
      // Begin the experiment.
      //
      const experiment = new exp.DefaultExperiment(acvs_version);
    //const experiment = new exp.RewardExperiment(acvs_version);
    //const experiment = new exp.RandomExperiment(acvs_version);
    // const use_random = Math.random() >= 0.5
    // const experiment = use_random ?
    //                    new exp.RandomExperiment(acvs_version):
    //                    new exp.RewardExperiment(acvs_version);
    //console.log("Random Version: ", use_random)
    experiment.run();

    } else {
    
    // // Otherwise the user does not have an id, so we can assume that they
    // // haven't accepted the HIT yet.
    
      alert("Please accept the hit first!")
    
    // Hide the new window button.
    
      d3.select(".ace_open_tab_button").style("display", "none");
      d3.select("#ace_instructions").style("display", "none");
      d3.select("body").append("p").html("Please go back MTurk and accept the HIT first.");
    }
  }
}


function validate_form() {
  //
  // clear out the users local storage only when they hit the submit button
  //
  if (localStorage.getItem(window._acvs_guid) != null) { // PYTHON_FLAG
    d3.select("#user_result").attr("value", localStorage.getItem(window._acvs_guid));
    alert("Thanks!");
    localStorage.removeItem(window._acvs_guid);
  } else {
    alert("Please complete the experiment first");
    return false;
  }
}
