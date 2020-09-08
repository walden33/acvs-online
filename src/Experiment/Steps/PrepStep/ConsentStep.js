/**
 * 
 */
exp.ConsentStep = class extends(util.AbstractStep) {
    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        exp.HtmlGui.append_paragraphs([
            "The following is the consent form. Please read it carefully."
        ])

        const pdf = exp.HtmlGui.workspace().append("iframe")
            .attr("width", "70%")
            .attr("height", "400")
            .attr("src", "/Users/walden/Google Drive/Leber Lab/IRB/Online REP/Consent Forms/Consent_REP_Online_Short.pdf");
        
        const responseArea = exp.HtmlGui.workspace().append("div")
            .attr("id", "consent-response-area")
            .style("width", "80%")
            .style("display", "block")
            .style("margin", "auto");
        
        responseArea.append("button")
        .text("I agree to participate.")
        .style("font-size", "1.5em")
        .style("padding", "8px")
        .style("margin", "24px")
        .on("click", (function(){
            this._db.EventsTable.add_new_row("Worker agreed to consent form");
            alert("Before we get started, please answer 2 quick questions.");
            let age = prompt("Please type your age:", "N/A");
            let gender = prompt("Please type your gender:", "N/A");
            alert("Thank you!");
            this._db._user_data = {
                self_reported_age: age,
                self_reported_gender: gender
            };
            exp.HtmlGui.clear_workspace();
            this.step_completed_signal.emit();
            }).bind(this));

        responseArea.append("button")
        .text("I DO NOT agree to participate.")
        .style("font-size", "1.5em")
        .style("padding", "8px")
        .style("margin", "24px")
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