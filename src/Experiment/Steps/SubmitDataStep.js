///////////////////////////////////////////////////////////////////////////////
///
/// <SubmitDataStep> concludes the "HIT"/experiment and lets the user submit
/// their data to the MTURK servers.
///
exp.SubmitDataStep = class extends(util.AbstractStep) {
  constructor ( db ) {
    super();
    this._db = db;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Override the AbstractStep execute method.
  ///
  execute () {
    
    exp.HtmlGui.clear_workspace();

    let paragraphs = []
    paragraphs.push("<br><br><br>");
    paragraphs.push("<hr>");
    paragraphs.push('<b>End of Experiment</b>')
    paragraphs.push('You have completed the experiment.')
    paragraphs.push('Please find the debriefing information')
    paragraphs.push("<hr>");
    paragraphs.push("Thank you for participating in our experiment!");
    paragraphs.push("If you have any questions, comments, or concerns, please email us at all of the following emails:");
    paragraphs.push("li.6942@osu.edu, leber.30@osu.edu, cognitivecontrol@osu.edu");
    paragraphs.push("<hr>");
    exp.HtmlGui.append_paragraphs(paragraphs)

    this._db.EventsTable.add_new_row("about to submit experiment");
    //console.log(this._db);
    //
    // Save the user's data as a cookie on thier machine. It will be retrieved
    // and deleted when they navigate back to the Amazon MTURK website.
    //
    localStorage.setItem(window._acvs_guid, btoa(JSON.stringify(this._db)));
    //
    // set a cookie to indicate they have completed this experiment
    //
    util.Util.set_cookie("completed_acvs", "true", 30);
    //
    // for debugging
    //
    console.log(this._db)
  }
}
