/**
 * A block of the task Adaptive Choice Visual Foraging.
 * 
 * @author Walden Y. Li
 * @version 1.1 (07/07/2021)
 * 
 * @created 7/7/21
 */
exp.ACFBlock = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} block_no 
     * @param {disp.DisplayGenerator} display_generator
     * @param {number} n_max_trials : if display_generator has more displays than
     *  desired, set the trial number needed here 
     */
    constructor(db, block_no, display_generator, n_max_trials=undefined) {
        
        super();

        this._db = db;

        this._block_no = block_no;
        if (n_max_trials !== undefined) {
            this._n_max_trials = n_max_trials;
        } else {
            this._n_max_trials = display_generator.get_total_displays_count();
        }

        // Check display generator type: baseline or main task
        display_generator instanceof disp.MCFBaselineDisplayGenerator ?
            this._block_type = "baseline" : this._block_type = "main";


        this._display_generator = display_generator;

        // Array of data for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;

    }

    _construct_trial(stimuli, logic) {
        if (this._block_type === "main") {
            return new exp.ACFTrial(stimuli, logic["targSquareColor"],
                logic["targCircleColor"], logic["targDiamondColor"],
                logic["nonOptTargColorIndex"]);
        } else if (this._block_type === "baseline") {
            return new exp.MCFBaselineTrial(stimuli);
        }
    }

    _run_next_trial(previous_results = null) {

        if (previous_results != null) {
            this._all_trials_data.push(previous_results);
        }

        if (this._trial_num <= this._n_max_trials) {
            let display = this._display_generator.yield_trial_display();
            if (display !== null) {
                // Create a new trial
                let trial = this._construct_trial(display.stimuli, display.logic);
                trial.set_block_number(this._block_no);
                trial.set_trial_number(this._trial_num);
                this._trial_num++;
    
                // When the trial is completed call the next trial (~recursive)
                trial.get_trial_completed_signal().connect(this._run_next_trial.bind(this));
    
                // start the trial
                trial.run_trial();
            } else {
                // all trials have been completed so tell the user how they did.
                this._save_data();
                this._show_summary();
            }
        } else {
            // Trial about to create exceeds max number of trials in the block
            this._save_data();
            this._show_summary();
        }

    }

    _save_data() {
        this._db.ExperimentTable.add_new_row(this._block_no, this._all_trials_data);
    }

    _show_summary() {
        // Calculate accuracy (%)
        let paragraph = [];
        paragraph.push("<br><br><br>");
        if(this._block_no === 0) {
            paragraph.push("<b>You complete the practice block!</b>");
        } else {
            paragraph.push("<b>You Completed Block #" + this._block_no + "!</b>");
        }
        paragraph.push("<hr>");
        paragraph.push("<b>Ready to continue?</b>");
        util.Workspace.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        util.Workspace.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        util.Workspace.clear_message();
    }

    execute() {
        util.Workspace.clear_header();
        util.Workspace.clear_workspace();
        this._db.EventsTable.add_new_row("beginning block #" + this._block_no);
        this._run_next_trial();
    }

}
