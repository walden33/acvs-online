/**
 * The preparation step is intended to collect participant's demographic
 * information.
 */
exp.PreparationStep = class extends(util.AbstractStep) {
    constructor(db) {
        super();
        this._db = db;
    }

    execute() {


        // exp.HtmlGui.clear_header();
        // exp.HtmlGui.clear_workspace();

        const form = exp.HtmlGui.workspace().append("form")
            .attr("name", "info")
            .attr("id", "participant-info");
        form.append("label").html("Age");

        
        // this.step_completed_signal.emit();
    }

}