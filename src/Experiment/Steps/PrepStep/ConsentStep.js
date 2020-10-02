/**
 * 
 */
exp.ConsentStep = class extends(util.AbstractStep) {
    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        const CONSENT_FORM_URL = "https://psy-ccl.asc.ohio-state.edu/files/forms/consent_REP_online_exempt.pdf";
        const SUB_ID = d3.select("#hidden-sub-id").html();

        // The message
        exp.HtmlGui.workspace().append("p")
            .html("The following is the consent form. Please read it carefully.")
            .style("font-size", "1.2em")
            .style("font-style", "italic")
            .style("text-align", "center")

        // Use an <iframe> to display the consent form
        exp.HtmlGui.workspace().append("iframe")
            .attr("width", "70%")
            .attr("height", "400")
            .attr("src", CONSENT_FORM_URL);
        
        const responseArea = exp.HtmlGui.workspace().append("div")
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
            let gender = prompt("Please type your gender:", "N/A");
            alert("Thank you!");
            this._db._user_data = {
                self_reported_age: age,
                self_reported_gender: gender,
                sub_id: SUB_ID
            };
            exp.HtmlGui.clear_workspace();
            this.step_completed_signal.emit();
            }).bind(this));

        responseArea.append("button")
        .text("I do NOT agree to participate")
        .attr("class", "btn-wide")
        .on("click", () => {
            exp.HtmlGui.clear_header();
            exp.HtmlGui.clear_workspace();
            exp.HtmlGui.append_paragraphs([
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