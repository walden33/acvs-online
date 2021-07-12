/**
 * A trial class for Adaptive Choice Visual Foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (07/07/2021)
 * 
 * @created 7/7/21
 */
exp.ACFTrial = class extends exp.AbstractTrial {

    /**
     * 
     * @param {disp.DisplayDataset} stimuli 
     * @param {string} targ_sq_color 
     * @param {string} targ_cir_color 
     * @param {string} targ_diamond_color 
     * @param {number} non_opt_targ_color
     */
    constructor(stimuli, targ_sq_color, targ_cir_color, targ_diamond_color, non_opt_targ_color) {

        super();

        this._stimuli = stimuli;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._targ_diamond_color = targ_diamond_color;
        this._non_opt_targ_color = non_opt_targ_color;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace(), "0 0 100 80", "125vmin");

        // Create an object to store the data for this Trial
        this._trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._fixation_duration = 1000;   // duration fixation cross is shown
        this._feedback_duration = 1500;
        this._max_targ_click_interval = 10000;    // max time allowed between two target clicks before trial resets
        this._err_msg_duration = 3000;  // duration of error message (wrong targ click or timed out) appears on screen

        // Trial runtime variables
        this._n_total_targs = 30;
        this._n_targ_left = this._n_total_targs;
        this._n_run = 1;

        // User response container
        this._response = [];
        this._n_wrong_attempt = 0;

    }


    _process_click(data) {
        // Determine if this object is a target
        if (data.className.slice(0, 4) === "targ") {
            // Create a response object to store information about this click
            let response = {};
            // If it is, record the timestamp of this target click
            response.timestamp = performance.now();
            // Clear existing timeouts
            util.Util.clear_timeouts();
            // Record svg object info
            response.objectInfo = data;
            // Determine if this is a switch of target type (only when this is not the first target in the trial)
            if (this._response.length > 0 &&
                data.className.slice(5, 7) !== this._response[this._response.length - 1].objectInfo.className.slice(5, 7)) {
                this._n_run++;
            }
            // Add reponse data into the trial response array
            this._response.push(response);
            // Decrement remaining target count
            this._n_targ_left--;
            // Remove the object and its background object
            d3.select(`#${data.id}`).remove();
            if (data.id[data.id.length - 1] !== 'g') {
                d3.select(`#${data.id}_bg`).remove();
            } else {
                d3.select(`#${data.id.slice(0, data.id.length - 3)}`).remove();
            }
            // Create a timeout for next object
            this._create_trial_timeout(this._max_targ_click_interval);
        } else {
            // If the clicked object is not a target, clear the display
            this._display_widget.clear();
            // Clear existing timeouts
            util.Util.clear_timeouts();
            // Play a beep sound
            util.Util.play_beep_sound();
            // Show feedback
            this._display_widget.show_feedback(
                `Remember the targets are ${this._targ_sq_color} squares, ` +
                `${this._targ_cir_color} circles, and ` +
                `${this._targ_diamond_color} diamonds. Let's try again!`,
                50, 40, "1.5pt");
            // Increment wrong attempt count
            this._n_wrong_attempt++;
            // After 3 seconds, reset trial parameters show the display again
            this._reset_trial(this._err_msg_duration);
        }
        // Check if there is any target left
        if (this._n_targ_left === 0) {
            this._trial_data.trial_completed_timestamp = performance.now();
            this._end_trial();
        }
    }

    _reset_trial_params() {
        this._response = [];
        this._n_targ_left = this._n_total_targs;
        this._n_run = 1;
    }

    /**
     * Create a timeout such that after certain time, the display refreshes to
     * the original state and trial parameters reset.
     * @param {number} t : time (ms) until reset
     */
    _reset_trial(t) {
        setTimeout(() => {
            this._reset_trial_params();
            this._render();
        }, t)
    }

    _end_trial() {
        util.Util.clear_timeouts();
        // Record trial logic
        this._trial_data.logic = {};
        this._trial_data.logic.targ_sq_color = this._targ_sq_color;
        this._trial_data.logic.targ_cir_color = this._targ_cir_color;
        this._trial_data.logic.targ_diamond_color = this._targ_diamond_color;
        this._trial_data.logic.non_opt_targ_color = this._non_opt_targ_color;
        // Record trial result
        this._trial_data.run_number = this._n_run;
        this._trial_data.run_length = this._n_total_targs / this._n_run;
        this._trial_data.n_wrong_attempt = this._n_wrong_attempt;
        this._trial_data.response = this._response;
        this._trial_data.rt = (this._trial_data.trial_completed_timestamp - this._trial_data.stimuli_rendered_timestamp) / 1000;
        this._display_widget.clear();
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
        util.Util.clear_timeouts();
        this._display_widget.clear();
        this._display_widget.draw(fixation);
        setTimeout(() => {
            this._display_widget.clear();
            this._display_widget.draw(this._stimuli);
            d3.selectAll("rect, circle, polygon").on("click", d => this._process_click(d));
            this._trial_data.stimuli_rendered_timestamp = performance.now();
            // Create a timeout that resets the trial after 10s of no response
            this._create_trial_timeout(this._max_targ_click_interval);
        }, this._fixation_duration);
    }

    /**
     * Create a timeout. After certain time, reset trial parameters and redraw
     * the display.
     * @param {number} t : time (ms) until trial resets
     */
    _create_trial_timeout(t) {
        setTimeout(() => {
            this._display_widget.show_feedback("Please click a target as quickly as you can!");
            this._reset_trial(this._err_msg_duration);
        }, t)
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
