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
            .style("animation", "blinker 1s linear infinite")
            .html("Preparing experiment data...");

        // Send to server
        const link = this._submission_link;
        $.ajax({
            type: "POST",
            url: link,
            data: {
                stimuli: {
                    prolificId: util.Util.get_prolific_id,
                    sessionId: util.Util.get_session_id,
                    studyId: util.Util.get_study_id,
                    stimuliData: JSON.stringify(this._data)
                }
            },
            success: () => {
                util.Workspace.workspace().select(".debriefing-title")
                    .html("Experiment preparation ready.");
                setTimeout( (()=> {
                    util.Workspace.workspace().select(".debriefing-title").remove();
                    this.step_completed_signal.emit();
                }).bind(this), 100);
                
            },
            failure: (errMsg) => {
                alert("There is something wrong this your Internet connection" +
                ". Please refresh and try again. Error message: " + errMsg);
            }
        })
    }

}
