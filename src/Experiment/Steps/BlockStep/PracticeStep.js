///////////////////////////////////////////////////////////////////////////////
///
/// <PracticeStep> represents a block of <Trial>'s for the user to complete.
///
exp.PracticeStep = class extends util.AbstractStep {
    constructor(db) {
        super();

        this._db = db;

        // object which generates random datasets for the chart widget
        this._chart_dataset_generator = new exp.ChartDatasetGenerator(true);

        // array of 1s & 0s for "correct" & "incorrect" for each trial
        this._accuracy_data = [];

        // array of all of the data for all for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;
    }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// The construction of the trial is separated out into this function so that
    /// subclasses may override this step.
    ///
    _construct_trial(chart_dataset) {
        // this is a constructor for some exp.AbstractTrial derived subclass
        return new exp.Trial(chart_dataset);
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

        let chart_dataset = this._chart_dataset_generator.yield_chartDataset();

        if (chart_dataset != null) {
            // create a new trial
            let trial = this._construct_trial(chart_dataset);
            trial._trial_number_in_block = this._trial_num;
            this._trial_num++;
            trial._block_number = 0;

            // when the trial is completed call the next trial (~recursive)
            trial.trial_completed_signal.connect(this._run_next_trial.bind(this));

            // start the trial
            trial.run_trial();
        } else {
            // all trials have been completed so tell the user how they did.
            // this._save_data();
            this._show_summary();
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// Record the results after all the trials have been completed.
    ///
    // _save_data() {
    //     this._db.ExperimentTable.add_new_row(this._blocknum, this._all_trials_data);
    // }

    ////////////////////////////////////////////////////////////////////////////
    ///
    /// Show a summary of the block.
    ///
    _show_summary() {
        let paragraph = [];
        paragraph.push("<br><br><br>");
        paragraph.push("<b>You Completed the Practice Block! </b>");
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
        this._db.EventsTable.add_new_row("beginning practice block");
        this._run_next_trial();
        exp.HtmlGui.show_message(".", "black");
    }
}
