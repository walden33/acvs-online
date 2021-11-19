///////////////////////////////////////////////////////////////////////////////
///
/// The <BriefingSet> is used to put an image on the screen. The step will
/// end when the user types the "key".
///
exp.BriefingStep = class extends(util.AbstractStep) {
  constructor(db, htmlImgTag, callbackKey) {
    super();
    this._db = db;
    this._htmlImgTag = htmlImgTag;
    this._callbackKey = callbackKey;
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Override the <AbstractStep> execute method.
  ///
  execute () {
    // show the image on screen
    util.Workspace.clear_header();
    util.Workspace.clear_workspace();
    util.Workspace.append_paragraphs([this._htmlImgTag]);

    // if the user hits the callbackKey, then the step will exit
    let keyboard = new util.KeyFilter( (function (key) {
        if (key == this._callbackKey) {
          keyboard.destroy();
          this._db.EventsTable.add_new_row("Instruction page callback key received.");
          this.step_completed_signal.emit();
        }
      }).bind(this)
    );
  }
}
