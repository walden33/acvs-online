/**
 * <Block> represents a block of ACVS experiment.
 * 
 * @package acvs-online
 * @author Walden Li
 * @version 1.4 (8/30/2020)
 */
exp.Block = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} blockNo 
     * @param {string} blockType
     * @param {exp.TrialDataGenerator} dataGenerator 
     */
    constructor(db, blockNo, blockType, dataGenerator) {
        super();

        this._db = db;

        this._blockNo = blockNo;

        this._blockType = blockType;

        this._display_dataset_generator = dataGenerator;

        // array of 1s & 0s for "correct" & "incorrect" for each trial
        this._accuracy_data = [];

        // array of all of the data for all for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;

    }


    /**
     * 
     * @param {exp.TrialInfo} logic : the condition of the trial
     * @param {Array<disp.DisplayDataset>} cue : an array (usually one element) that contains the cue <DisplayDataset>(s) for the trial
     * @param {Array<disp.DisplayDataset>} stimuli : array (also usually one element) that contains the stimuli <DisplayDataset>(s) for the trial
     */
    _construct_trial(logic, cue, stimuli) {
        switch (this._blockType) {
            case "Standard":
                if(util.Util.is_test_mode()) return new exp.Trial(logic, cue, stimuli, [0, 0, 0]);
                return new exp.Trial(logic, cue, stimuli, [0, 400, 1400]);
                // return new exp.Trial(logic, cue, stimuli, [0, 0, 0]);
            case "ColorCue":
                if(util.Util.is_test_mode()) return new exp.Trial(logic, cue, stimuli, [0, 0]);
                return new exp.Trial(logic, cue, stimuli, [0, 1000]);
        }
    }

    _run_next_trial(previous_results = null) {
        if (previous_results != null) {
            this._accuracy_data.push(previous_results.bool);
            this._all_trials_data.push(previous_results);
        }

        let datasets = this._display_dataset_generator.yield_trial_dataset();

        if (datasets != null) {
            // create a new trial
            let trial = this._construct_trial(datasets.logic, datasets.cue, datasets.stimuli);
            trial._trial_number_in_block = this._trial_num;
            this._trial_num++;
            trial._block_number = this._blockNo;

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

    _save_data() {
        this._db.ExperimentTable.add_new_row(this._blockNo, this._all_trials_data);
        console.log(this._db);
        localStorage.setItem(window._acvs_guid, btoa(JSON.stringify(this._db)));
    }

    _show_summary() {
        // Show cursor
        util.Workspace.show_cursor();
        // Calculate accuracy (%)
        const accuracy = (Math.round(util.Util.mean(this._accuracy_data) * 1000) / 10);
        // Save to database if this is the practice block
        // Used to generate a replay of instructions if accuracy is to low
        if (this._blockNo === 0) {
            this._db._user_data.practice_accuracy = accuracy;
        }
        let paragraph = [];
        paragraph.push("<br><br><br>");
        if(this._blockNo !== 0) {
            paragraph.push("<b>You complete the practice block!</b>");
        }
        paragraph.push("<b>You Completed Block #" + this._blockNo + "!</b>");
        paragraph.push("<hr>");
        paragraph.push("Your Accuracy: " + accuracy + "%");
        paragraph.push("<hr>");
        accuracy >= 70 ?
            paragraph.push("<b>Ready to continue?</b>") :
            paragraph.push("<b>Ready to continue?</b>");
        exp.HtmlGui.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        exp.HtmlGui.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        exp.HtmlGui.clear_message()
    }

    execute() {
        util.Workspace.hide_cursor();
        exp.HtmlGui.clear_header();
        exp.HtmlGui.clear_workspace();
        this._db.EventsTable.add_new_row("beginning block step #" + this._blockNo);
        this._run_next_trial();
        exp.HtmlGui.show_message(".", "black");
    }

}