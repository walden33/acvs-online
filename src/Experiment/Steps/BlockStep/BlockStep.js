///////////////////////////////////////////////////////////////////////////////
///
/// <BlockStep> represents a block of <Trial>'s for the user to complete.
///
exp.BlockStep = class extends util.AbstractStep {
    constructor(db, blocknum) {
        super();

        this._db = db;
        this._blocknum = blocknum;

        // object which generates random datasets for the chart widget
        this._display_dataset_generator = new exp.SpatialCueTrialGenerator();

        // array of 1s & 0s for "correct" & "incorrect" for each trial
        this._accuracy_data = [];

        // array of all of the data for all for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;
    }

    /**
     * Returns a new <Trial> object given display datasets.
     * 
     * @param {disp.DisplayDataset} cue_dataset 
     * @param {disp.DisplayDataset} stimuli_dataset 
     */
    _construct_trial( cue_dataset, stimuli_dataset ) {
        // this is a constructor for some exp.AbstractTrial derived subclass
        return new exp.Trial( cue_dataset, stimuli_dataset );
    }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// Run the next trial of the block until there are no more trials.
    ///
    _run_next_trial(previous_results = null) {
        if (previous_results != null) {
            this._accuracy_data.push(previous_results.bool);
            this._all_trials_data.push(previous_results);
        }

        let datasets = this._display_dataset_generator.yield_trial_dataset();

        if (datasets != null) {
            // create a new trial
            let trial = this._construct_trial( ...datasets );
            trial._trial_number_in_block = this._trial_num;
            this._trial_num++;
            trial._block_number = this._blocknum;

            // when the trial is completed call the next trial (~recursive)
            trial.trial_completed_signal.connect(this._run_next_trial.bind(this));

            // start the trial
            trial.run_trial();
        } else {
            // all trials have been completed so tell the user how they did.
            this._save_data();
            this._show_summary();
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// Record the results after all the trials have been completed.
    ///
    _save_data() {
        this._db.ExperimentTable.add_new_row(this._blocknum, this._all_trials_data);
        localStorage.setItem(window._acvs_guid, btoa(JSON.stringify(this._db)));
    }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// Show a summary of the block.
    ///
    _show_summary() {
        let paragraph = [];
        paragraph.push("<br><br><br>");
        paragraph.push("<b>You Completed Block #" + this._blocknum + "!</b>");
        paragraph.push("<hr>");
        paragraph.push("Your Accuracy: " + (Math.round(util.Util.mean(this._accuracy_data) * 1000) / 10) + "%");
        paragraph.push("<hr>");
        paragraph.push("<b>Ready to continue?</b>");
        exp.HtmlGui.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        exp.HtmlGui.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        exp.HtmlGui.clear_message()
    }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// Override the <AbstractStep> execute method.
    ///
    execute() {
        this._db.EventsTable.add_new_row("beginning block step #" + this._blocknum);
        this._run_next_trial();
        exp.HtmlGui.show_message(".", "black");
    }
}
