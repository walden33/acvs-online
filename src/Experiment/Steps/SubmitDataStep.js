/**
 * Submit data step. Changed from using an ajax call to send stringified json
 * database to an XMLHttpRequest.
 * 
 * @package acvs-online
 * @version 1.4
 * @author Walden Li
 */
exp.SubmitDataStep = class extends util.AbstractStep {

    constructor(db, sub_link) {
        super();
        this._db = db;
        this._submission_link = sub_link;
    }

    execute() {

        const sub_link = this._submission_link;

        util.Workspace.clear_workspace();
        util.Workspace.show_header("Online REP Experiment - Cognitive Control Lab");
        d3.select("#overlay").remove();

        // Tell participants we are submitting data
        util.Workspace.workspace().append("p").attr("class", "debriefing-title")
            .style("animation", "blinker 1s linear infinite")
            .html("Submitting data ... Please wait ...");

        // Submit data
        $.ajax({
            type: "POST",
            url: sub_link,
            data: {
                "data": JSON.stringify(this._db)
            },
            success: () => {
                util.Workspace.workspace().select(".debriefing-title")
                    .html("-- END OF EXPERIMENT --");
                alert("Data submitted!");
            },
            failure: (errMsg) => {
                alert(errMsg);
            }
        })

        // Debriefing message
        util.Workspace.workspace().append("p").attr("class", "debriefing-msg")
            .html(
                "You have completed the experiment. Thank you for your " +
                "participation. " + 
                "We will be able to identify you with the submitted data and " +
                "distribute REP credit within 24 hours." +
                "If you do not get your credit within 24 hours, or if you " +
                "have any questions or concerns, " +
                "please email us at the following address:</br>" +
                "li.6942@osu.edu (Walden Li)" +
                "</br></br>" +
                "For your information, please find the debriefing form attached:"
            );

        // Debriefing form button
        util.Workspace.workspace().append("button")
            .attr("class", "btn-regular")
            .text("Download")
            .on("click", () => {
                window.open("https://psy-ccl.asc.ohio-state.edu/files/forms/debrief_REP_online.pdf")
            });

        this._db.EventsTable.add_new_row("Data submitted.");
        util.Util.set_cookie("completed_acvs", "true", 30);

    }

}
