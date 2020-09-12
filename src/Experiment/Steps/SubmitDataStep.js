/**
 * Submit data step. Changed from using an ajax call to send stringified json
 * database to an XMLHttpRequest.
 * 
 * @package acvs-online
 * @version 1.4
 * @author Walden Li
 */
exp.SubmitDataStep = class extends util.AbstractStep {

    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        exp.HtmlGui.clear_workspace();
        exp.HtmlGui.show_header("Online REP Experiment - Cognitive Control Lab");

        // Use an XMLHttpRequest to send data to server.
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "backend.php");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send( JSON.stringify( this._db ) );

        // Debriefing title
        exp.HtmlGui.workspace().append("p").attr("class", "debriefing-title")
            .html("-- End of experiment --");

        // Debriefing message
        exp.HtmlGui.workspace().append("p").attr("class", "debriefing-msg")
            .html(
                "You have completed the experiment. Thank you for your " +
                "participation. If you have any questions or concerns, " +
                "please email us at all of the following addresses:</br>" +
                "li.6942@osu.edu (Walden Li), leber.30@osu.edu (Dr. Andrew Leber), cognitivecontrol@osu.edu" +
                "</br></br>" +
                "For your information, please find the debriefing form attached:"
            );

        // Debriefing form button
        exp.HtmlGui.workspace().append("button")
            .attr("class", "debriefing-form-btn")
            .text("Download")
            .on("click", () => {
                window.open("https://psy-ccl.asc.ohio-state.edu/files/forms/debrief_REP_online.pdf")
            });

        this._db.EventsTable.add_new_row("Data submitted.");
        util.Util.set_cookie("completed_acvs", "true", 30);

    }

}