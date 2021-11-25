/**
 * 
 * @author Walden Y. Li
 * @version 1.5 (11/25/2021)
 * 
 */
exp.ACMCBlock = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} block_no 
     * @param {disp.DisplayGenerator} display_generator
     */
    constructor(db, block_no, display_generator) {
        super();

        this._db = db;

        this._block_no = block_no;

        this._display_generator = display_generator;

        // array of all of the data for all for each of the trials
        this._all_trial_result = [];
        this._all_trial_tracking = [];

        this._trial_num = 1;

    }


    /**
     * 
     * @param {Array<disp.DisplayDataset>} stimuli : array (also usually one element) that contains the stimuli <DisplayDataset>(s) for the trial
     * @param {Object} logic : the condition of the trial
     */
    _construct_trial(stimuli, logic) {
        return new exp.ACMCTrial(stimuli, logic);
    }

    _run_next_trial(previous_results = null) {
        if (previous_results !== null) {
            this._all_trials_data.push(previous_results);
        }

        let display = this._display_generator.yield_trial_display();

        if (display !== null) {
            // create a new trial
            let trial = this._construct_trial(display.logic, display.cue, display.stimuli);
            trial.set_trial_number(this._trial_num);            this._trial_num++;
            trial.set_block_number(this._block_no);

            // when the trial is completed call the next trial (~recursive)
            trial.get_trial_completed_signal().connect(this._run_next_trial.bind(this));

            // start the trial
            trial.run_trial();
        } else {
            // block ends
            this._save_data();
            this._show_summary();
        }
    }

    _save_data() {
        this._db.ExperimentTable.add_new_row(this._block_no, this._all_trials_data);
        // localStorage.setItem(window._acvs_guid, btoa(JSON.stringify(this._db)));
    }

    _show_summary() {
        // Show cursor
        util.Workspace.show_cursor();
        // Calculate accuracy (%)
        const accuracy = (Math.round(util.Util.mean(this._accuracy_data) * 1000) / 10);
        let paragraph = [];
        paragraph.push("<br><br><br>");
        if(this._block_no === 0) {
            paragraph.push("<b>You complete the first practice block!</b>");
        } else if (this._block_no === 0.5) {
            paragraph.push("<b>You completed the second practice block!")
        } else {
            paragraph.push("<b>You Completed Block #" + this._block_no + "!</b>");
        }
        paragraph.push("<hr>");
        paragraph.push("Your Accuracy: " + accuracy + "%");
        paragraph.push("<hr>");
        paragraph.push("<b>Ready to continue?</b>");
        util.Workspace.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        util.Workspace.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        util.Workspace.clear_message()
    }

    execute() {
        util.Workspace.clear_header();
        util.Workspace.clear_workspace();
        this._db.EventsTable.add_new_row("beginning block step #" + this._block_no);
        this._run_next_trial();
        util.Workspace.show_message(".", "black");
    }

}