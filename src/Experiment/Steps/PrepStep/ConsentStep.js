/**
 * 
 */
exp.ConsentStep = class extends util.AbstractStep {
    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        const CONSENT_FORM_URL = "https://exp.leberatory.org/files/forms/Consent_Prolific.pdf";

        // The message
        util.Workspace.workspace().append("p")
            .html("The following is the consent form. Please read it carefully.")
            .style("font-size", "1.2em")
            .style("font-style", "italic")
            .style("text-align", "center")

        // Use an <iframe> to display the consent form
        util.Workspace.workspace().append("iframe")
            .attr("width", "70%")
            .attr("height", "400")
            .attr("src", CONSENT_FORM_URL);
        
        const responseArea = util.Workspace.workspace().append("div")
            .attr("id", "consent-response-area")
            .style("width", "80%")
            .style("display", "block")
            .style("margin", "auto");
        
        responseArea.append("button")
        .attr("class", "btn-wide")
        .text("I agree to participate")
        .on("click", (function(){
            this._db.EventsTable.add_new_row("Subject agreed to consent form");
            alert("Before we get started, please answer 2 quick questions.");
            let age = prompt("Please type your age:", "N/A");
            let gender = prompt("Please type your gender (Female/Male/Non-Binary):", "N/A");
            alert("Thank you!");
            this._db._user_data = {
                self_reported_age: age,
                self_reported_gender: gender,
                // sub_id: SUB_ID,
                prolific_id: util.Util.get_prolific_id(),
                study_id: util.Util.get_study_id(),
                session_id: util.Util.get_session_id(),
                cb_id: util.Util.get_cb_id()
            };
            util.Workspace.clear_workspace();
            this.step_completed_signal.emit();
            }).bind(this));

        responseArea.append("button")
        .text("I do NOT agree to participate")
        .attr("class", "btn-wide")
        .on("click", () => {
            util.Workspace.clear_header();
            util.Workspace.clear_workspace();
            util.Workspace.append_paragraphs([
                "<br><br><br><br>",
                "You have declined to participate.",
                "<br>",
                "Thank you for your consideration.",
                "<br>",
                "You may now close the tab."
            ]);
        });
        
    }

}
