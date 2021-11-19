///////////////////////////////////////////////////////////////////////////////
///
/// The <BrowserAuditStep> will gather information about the user's
/// browser and require an acknowledgment from the user to proceed.
///
exp.BrowserAuditStep = class extends(util.AbstractStep) {
  constructor(db) {
    super();
    this._db = db
  }


  // add an event listener to the browser to check if window is maximized
  checkMax() {
    util.Util.check_window_max()
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Override the <AbstractStep> execute method
  ///
  execute () {
    this._db.EventsTable.add_new_row("Checking Browser Step");

    let browser = new exp.Browser();
    this._db.BrowserInfo = browser;

    // print browser information to the screen
    let html = [ "<br><br><br><br>",
                 "<hr>",
                 '<ul"> <li> By proceeding you acknowledge you have read and understood the <a target="_blank" href="https://testbucketformturkimages.s3-us-east-2.amazonaws.com/14_Consent_Paid_MTurk.pdf">Consent To Participate in Reasearch Form</a>, </li><li> you are at least 18 years of age, and </li><li> you voluntarily agree to participate in this study.</li> </ul>',
                 "<hr>"
               ]
    exp.HtmlGui.guiDiv().append("div").attr("id", "workspace").attr("class", "ac-workspace");
    exp.HtmlGui.clear_workspace();
    exp.HtmlGui.append_paragraphs(html);
    // create a button for the user to press to acknowledge data collection
    let button = exp.HtmlGui.workspace().selectAll("button").data(["I consent to participate in this study"]).enter().append("button");
    button.text(function(d){return d;});
    button.attr("style", function(d){return "font-size: 1.5em;";});
    button.attr("id", function(d){return d;});
    button.on("click", (function(){
      this._db.EventsTable.add_new_row("Worker agreed to consent form");
      alert("Before we get started, please answer 2 quick questions.");
      let age = prompt("Please type your age:", "N/A");
      let gender = prompt("Please type your gender:", "N/A");
      alert("Thank you!");
      this._db._user_data = {
        workerId: turkGetParam( "workerId", "NONE" ),
        assignmentId: turkGetParam( "assignmentId", "NONE" ),
        hitId: turkGetParam( "hitId", "NONE" ),
        turkSubmitTo: turkGetParam( "turkSubmitTo", "NONE" ),
        self_reported_age: age,
        self_reported_gender: gender
      };
      this.checkMax();
      this.step_completed_signal.emit();
    }).bind(this))

  }

}
