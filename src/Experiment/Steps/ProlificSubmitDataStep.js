/**
 * Submit data step designed for experiments run on Prolific.
 * 
 * @package acvs-online
 * @version 1.2 (updated 1/1/2021)
 * @author Walden Y. Li
 */
exp.SubmitDataStep = class extends util.AbstractStep {

    constructor(db, submitLink, completeLink) {
        super();
        this._db = db;
        this._submit_link = submitLink;
        this._complete_link = completeLink;
    }

    execute() {

        util.Workspace.clear_workspace();
        util.Workspace.show_header("Online Experiment - Cognitive Control Lab");
        d3.select("#overlay").remove();

        // Tell participants we are submitting data
        util.Workspace.workspace().append("p").attr("class", "debriefing-title")
            .html("Submitting data ...");

        util.Util.redirect(this._complete_link, 10000);
        
        // Submit data
        $.ajax({
            type: "POST",
            url: this._submit_link,
            data: {
                "data": JSON.stringify(this._db)
            },
            success: () => {
                util.Workspace.workspace().select(".debriefing-title")
                    .html("-- END OF EXPERIMENT --");
                util.Util.clear_timeouts();
                util.Util.redirect(this._complete_link, 2000);
            },
            failure: (errMsg) => {
                alert(errMsg);
            }
        })

        // Debriefing message
        util.Workspace.workspace().append("p").attr("class", "debriefing-msg")
            .html(
                "<p>You have completed the experiment. Thank you for your " +
                "participation.</p>" + 
                "<p>IMPORTANT: If not automatically redirected after 10 seconds, " +
                "Please click on the button below to go back to Prolific." +
                "If you " +
                "have any questions or concerns, " +
                "please email us at the following address:</br>" +
                "li.6942@osu.edu (Walden Li)."
            );

        // Debriefing form button
        util.Workspace.workspace().append("button")
            .attr("class", "btn-regular")
            .text("GO BACK TO PROLIFIC")
            .on("click", () => {
                window.open(this._complete_link);
            });

        this._db.EventsTable.add_new_row("Data submitted.");
        util.Util.set_cookie("completed_acvs", "true", 30);

    }

}
