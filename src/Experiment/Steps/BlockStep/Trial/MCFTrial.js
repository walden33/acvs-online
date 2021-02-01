/**
 * 
 */
exp.MCFTrial = class extends exp.AbstractTrial {

    constructor(stimuli, targ_sq_color, targ_cir_color) {

        super();

        this._stimuli = stimuli;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;

        this.trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace());

        // Create an object to store the data for this Trial
        this.trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._iti = 1000;   // fixation cross duration
        this._feedback_duration = 1500;

        // Trial runtime variables
        this._n_targ_left = 40;
        this._n_run = 1;
        this._this._response_sequence = [];
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
            // Remove the object
            d3.select("#" + data.id).remove();
        } else {
            // If not, clear the display
            w.clear();
            // Play a beep sound
            util.Util.play_beep_sound();
            // Show feedback
            w.show_feedback(
                "Oops, remember the targets are " + this._targ_sq_color + " squares " +
                "and " + this._targ_cir_color + " circles.", 50, 40);
            // Increment wrong attempt count
            this._n_wrong_attempt++;
            // Clear response sequence array
            this._response_sequence = [];
            // After 3 seconds, show the display again
            setTimeout(() => {
                render();
            }, 3000);
        }
        // Check if there is any target left
        if (this._n_targ_left === 0) {
            this._end_trial();
        }
    }

    _end_trial() {
        setTimeout((() => {
            this._display_widget = this._display_widget.destroy();
            this.trial_completed_signal.emit(this.trial_data);
        }).bind(this), this._feedback_duration);
    }


    run_trial() {

        this.display_widget.clear();
        util.Workspace.clear_message();

        this._display_widget.draw(this._stimuli);


        if (this.timing.length - this.cue.length === 1) {
            // if stimuli only has one frame (the normal circumstance)
            for (let i = 0; i < this.stimuli.length; i++) {
                setTimeout((() => {
                    this.display_widget.draw(this.stimuli[i]);
                    // turn on keyboard at the first iteration
                    if (i == 0) {
                        this.keyboard.turn_on();
                        this.trial_data.stimuli_shown_at = performance.now();
                    }
                }).bind(this), this.timing[this.cue.length + i]);
            }
        } else {
            // if stimuli has more than one frame (so far this only happens when
            // the stimuli is an RSVP stream)
            // calculate the inter-frame interval
            const isi = this.timing[this.timing.length - 1] - this.timing[this.timing.length - 2];
            // calculate timeout
            const timeout = this.timing[this.cue.length] + this.stimuli.length * isi + 1000;
            // when the first frame is shown, open keyboard and record a timestamp
            setTimeout((() => {
                this.display_widget.draw(this.stimuli[0]);
                this.keyboard.turn_on();
                this.trial_data.stimuli_shown_at = performance.now();
            }).bind(this), this.timing[this.cue.length + 1]);
            // draw the rest of the frames
            for (let i = 1; i < this.stimuli.length - 1; i++) {
                setTimeout((() => {
                    this.display_widget.draw(this.stimuli[i]);
                }).bind(this), this.timing[this.cue.length] + isi * i);
            }

            // timeout
            setTimeout((() => {
                this.respond_to_valid_user_keyboard_input('trial_timed_out', performance.now());
            }).bind(this), timeout);
        }

    }

    set_trial_number(n) {
        this._trial_number_in_block = n;
    }

    set_block_number(n) {
        this._block_number = n;
    }

}
