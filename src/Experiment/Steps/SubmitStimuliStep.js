/**
 * A step that should be executed before the main experiment. It sends stimuli
 * data to the server to avoid sending larger volume of data in the end of 
 * experiment. It also serves as a check of connection and server readiness.
 * 
 * @author Walden Y. Li
 * @created 07/09/2021
 */
exp.SubmitStimuliStep = class extends util.AbstractStep {

    /**
     * 
     * @param {string} link the submission link
     * @param  {...disp.DisplayGenerator} args display generators to record
     */
    constructor(link, ...args) {
        super();
        this._submission_link = link;
        this._data = args;
    }

    execute() {

        // UI
        util.Workspace.workspace().append("p").attr("class", "debriefing-title")
            .html("Submitting data ...");

        // Send to server
        const link = this._submission_link;
        $.ajax({
            type: "POST",
            url: link,
            data: JSON.stringify(this._data),
            success: () => {
                util.Workspace.workspace().select(".debriefing-title")
                    .html("-- END OF EXPERIMENT --");
                alert("Data submitted!");
            },
            failure: (errMsg) => {
                alert(errMsg);
            }
        })
    }

}
