/**
 * A trial class for Mouse Click Foraging task.
 */
exp.MCFTrial = class extends exp.AbstractTrial {

    constructor(stimuli, targ_sq_color, targ_cir_color) {

        super();

        this._stimuli = stimuli;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace(), "0 0 100 80", "125vmin");

        // Create an object to store the data for this Trial
        this._trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._fixation_duration = 1000;   // duration fixation cross is shown
        this._feedback_duration = 1500;

        // Trial runtime variables
        this._n_targ_left = 40;
        this._n_run = 1;
        this._response_sequence = [];
        this._n_wrong_attempt = 0;

        // These two parameters are used in blockstep
        this._block_number;
        this._trial_number_in_block;
    }


    _process_click(data) {
        // Determine if this object is a target
        if (data.className.slice(0, 4) === "targ") {
            // If it is, determine if this is a switch of target type (only when this is not the first target in the trial)
            if (this._response_sequence.length > 0 &&
                data.className.slice(5, 7) !== this._response_sequence[this._response_sequence.length - 1].slice(5, 7)) {
                this._n_run++;
            }
            // Record it in the response sequence
            this._response_sequence.push(data.className + "_" + data.id);
            // Decrement remaining target count
            this._n_targ_left--;
            // Remove the object and its background object
            d3.select(`#${data.id}`).remove();
            if (data.id[data.id.length-1] !== 'g') {
                d3.select(`#${data.id}_bg`).remove();
            } else {
                d3.select(`#${data.id.slice(0, data.id.length-3)}`).remove();
            }
            // Play sound
            util.Util.play_mario_sound();
        } else {
            // If not, clear the display
            this._display_widget.clear();
            // Play a beep sound
            util.Util.play_beep_sound();
            // Show feedback
            this._display_widget.show_feedback(
                "Oops, remember the targets are " + this._targ_sq_color + " squares " +
                "and " + this._targ_cir_color + " circles. " +
                "Let's try again!", 50, 40);
            // Increment wrong attempt count
            this._n_wrong_attempt++;
            // Reset trial parameters
            this._reset_trial();
            // After 3 seconds, show the display again
            setTimeout(() => {
                this._render();
            }, 3000);
        }
        // Check if there is any target left
        if (this._n_targ_left === 0) {
            this._trial_data.trial_completed_timestamp = performance.now();
            this._end_trial();
        }
    }

    _reset_trial() {
        this._response_sequence = [];
        this._n_targ_left = 40;
        this._n_run = 1;
    }

    _end_trial() {
        // Record trial info
        this._trial_data.blockTrial = this._trial_number_in_block;
        this._trial_data.blockNumber = this._block_number;
        // Record trial result
        this._trial_data.run_number = this._n_run;
        this._trial_data.run_length = 40/this._n_run;
        this._trial_data.n_wrong_attempt = this._n_wrong_attempt;
        this._trial_data.response_sequence = this._response_sequence;
        this._trial_data.rt = (this._trial_data.trial_completed_timestamp - this._trial_data.stimuli_rendered_timestamp)/1000;
        console.log(this._trial_data);
        this._display_widget.clear();
        // this._display_widget.show_feedback()
        setTimeout((() => {
            this._display_widget = this._display_widget.destroy();
            this._trial_completed_signal.emit(this._trial_data);
        }).bind(this), this._feedback_duration);
    }

    /**
     * Render a trial display. Called at the beginning of a trial or when
     * a non-target is clicked and the display needs resetting.
     */
    _render() {
        const fixation = new disp.DisplayDataset();
        fixation.add_a_text(new disp.Text(
            '+', 50, 40, 'white', 3, undefined, "fixation-cross-center"
        ));
        this._display_widget.clear();
        this._display_widget.draw(fixation);
        setTimeout(() => {
            this._display_widget.clear();
            this._display_widget.draw(this._stimuli);
            d3.selectAll("rect, circle").on("click", d => this._process_click(d));
            this._trial_data.stimuli_rendered_timestamp = performance.now();
        }, this._fixation_duration);
    }

    run_trial() {

        this._display_widget.clear();
        util.Workspace.clear_message();

        this._render();
    }

    set_trial_number(n) {
        this._trial_data.blockTrial = n;
    }

    set_block_number(n) {
        this._trial_data.blockNumber = n;
    }

    get_trial_completed_signal() {
        return this._trial_completed_signal;
    }

}
