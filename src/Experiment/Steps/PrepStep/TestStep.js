
exp.TestStep = class extends util.AbstractStep {

    constructor(db) {
        super();
        this._db = db;
    }

    execute() {
        exp.HtmlGui.append_paragraphs([
            "The following experiment is running under the test mode.",
            "You can specify relevant task parameters if needed."
        ])
        exp.HtmlGui.workspace().append("button").text("dsaf");
        setTimeout( ()=>{this.step_completed_signal.emit();}, 5000 )
    }

}