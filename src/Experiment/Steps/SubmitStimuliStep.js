/**
 * A step that should be executed before the main experiment. It sends stimuli
 * data to the server to avoid sending larger volume of data in the end of 
 * experiment. It also serves as a check of connection and server readiness.
 * 
 * @author Walden Y. Li
 * @created 07/09/2021
 */
exp.SubmitStimuliStep = class extends util.AbstractStep() {

    constructor(link) {
        this._submission_link = link;
        this._data = [];
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

    /**
     * 
     * @param  {...disp.DisplayGenerator} args display generator to be recorded
     */
    add_display_generator(...args) {
        this._data.concat(args);
    }

}