///////////////////////////////////////////////////////////////////////////////
///
/// <FeedbackStep> gathers general feedback from the participant.
///
exp.FeedbackStep = class extends(util.AbstractStep) {
  constructor ( db ) {
    super();
    this._db = db;
  }
      
    
  validateForm() {
        let x = document.forms["myForm"]["Text1"].value;
        alert(x);
        this._db._userFeedback = x;
        this._db.EventsTable.add_new_row("user feedback was collected");
        setTimeout(this.step_completed_signal.emit(), 100);
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
    paragraphs.push('Please describe what you were thinking about during the task (i.e. strategy for completing the task, thoughts, moods, location) or general feedback about the experiment.');
    paragraphs.push('<br><br><br>');
    paragraphs.push('If you do not want ot provide this information type NA.');
    paragraphs.push('<br><br><br>');
    paragraphs.push('<textarea name="Text1" cols="40" rows="5"></textarea> <br>');
    paragraphs.push("<hr>");
      
    exp.HtmlGui.append_paragraphs(paragraphs);
    exp.HtmlGui.append_button( "Continue", this.validateForm.bind(this) );

  }
}
