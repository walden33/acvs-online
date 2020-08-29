exp.TemporalTrial = class extends exp.AbstractTrial {

    constructor(logic, display_data) {
        super()

        this.logic = logic;

        this.data = display_data;

        this.trial_completed_signal = new util.Signal();

        this.trial_data = { "trialCreatedAt": performance.now() };

        this.rsvp_interval = 100;

        this.display_widget = new disp.DisplayWidget(exp.HtmlGui.workspace());

        this.answer_keys = new Map([["v", 2], ["b", 3], ["n", 4], ["m", 5]]);

        this.num_keys_pressed = 0;

        // These two parameters are used in blockstep
        this._block_number;
        this._trial_number_in_block;

    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// helper method which creates and initializes the settings for the chart-
    /// graphic for this trial.
    ///
    initialize_chart_settings() {
        exp.HtmlGui.clear_header();
        exp.HtmlGui.clear_workspace();


        // this.chart_widget.set_ring_radius( 45 );
        // this.chart_widget.set_square_size( 4 );
        // this.chart_widget.set_cross_color( "rgb(255,255,255)" );
        // this.chart_widget.set_square_colors(["rgb(254, 0, 254)", "rgb(0, 150, 150)", "rgb(105, 105, 105)"]);
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// helper method which creates and initializes the KeyFilter to capture user
    /// input during this trial.
    ///
    initialize_keyboard() {
        this.keyboard = new util.KeyFilter((function (the_key_the_user_pressed) {
            let time_stamp = performance.now();
            this.num_keys_pressed += 1;

            if (this.answer_keys.has(the_key_the_user_pressed)) {
                this.respond_to_valid_user_keyboard_input(the_key_the_user_pressed, time_stamp);
            } else {
                this.respond_to_invalid_user_keyboard_input(the_key_the_user_pressed);
            }
        }).bind(this), false);
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// helper method providing the logic for what happens when the user hits a
    /// valid key.
    ///
    respond_to_valid_user_keyboard_input(the_key_the_user_pressed, time_stamp) {
        let result = false;
        if (this.answer_keys.get(the_key_the_user_pressed) === this.logic.optTargDigit ||
            this.answer_keys.get(the_key_the_user_pressed) === this.logic.nonOptTargDigit) {
            result = true;
        } else {
            util.Util.play_beep_sound();
        }

        this.trial_data.blockTrial = this._trial_number_in_block;
        this.trial_data.blockNumber = this._block_number;


        this.trial_data.optTargIndex = this.stimuli_dataset.logic.optTargIndex;
        this.trial_data.nonOptTargIndex = this.stimuli_dataset.logic.nonOptTargIndex;

        this.trial_data.optTargDigit = this.stimuli_dataset.logic.optTargDigit;
        this.trial_data.nonOptTargDigit = this.stimuli_dataset.logic.nonOptTargDigit;

        this.trial_data.optTargEcc = this.stimuli_dataset.logic.optTargEcc;
        this.trial_data.nonOptTargEcc = this.stimuli_dataset.logic.nonOptTargEcc;

        this.trial_data.optTargRegion = this.stimuli_dataset.logic.optTargRegion;
        this.trial_data.nonOptTargRegion = this.stimuli_dataset.logic.nonOptTargRegion;

        this.trial_data.response = this.answer_keys.get(the_key_the_user_pressed);
        this.trial_data.targChoice = this.trial_data.response == this.trial_data.optTargDigit ? 1 :
            this.trial_data.response == this.trial_data.nonOptTargDigit ? 2 :
                0;
        this.trial_data.acc = result ? 1 : 0;
        this.trial_data.bool = result;
        this.trial_data.rt = time_stamp - this.trial_data.chart_shown_to_user_at_time;
        this.trial_data.answerKeyRecieved = the_key_the_user_pressed;
        this.trial_data.answerDigitRecieved = this.answer_keys.get(the_key_the_user_pressed);
        this.trial_data.numberOfKeysPressed = this.num_keys_pressed;
        this.trial_data.answerRecievedAt = time_stamp;
        this.trial_data.result = result ? "correct" : "incorrect";
        // this.trial_data.chart_dataset = this.chart_dataset;

        this.keyboard = this.keyboard.destroy();
        this.show_debriefing();
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// helper method providing the logic for what happens when the user hits an
    /// invalid key.
    ///
    respond_to_invalid_user_keyboard_input(the_key_the_user_pressed) {
        exp.HtmlGui.show_message("Key '" + the_key_the_user_pressed + "' not recognized. Please use: 'v' for 2, 'b' for 3, 'n' for 4, and 'm' for 5", "red");

        util.Util.play_beep_sound();

        setTimeout(function () {
            exp.HtmlGui.show_message(".", "black");
        }, 2000);
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// helper method providing the logic for what is shown to the user after
    /// completing the trial by providing valid user input.
    ///
    show_debriefing() {
        // WL: this is adapted from RewardTrial.js
        if (this.trial_data.result == "incorrect") {
            this.display_widget.show_text("Incorrect");
        } else {
            this.display_widget.show_text("Correct");
        }

        if (window._secret_speed != undefined) {
            this.length_of_time_debreifing_is_shown = window._secret_speed;
        }

        setTimeout((function () {
            this.display_widget = this.display_widget.destroy();
            this.trial_completed_signal.emit(this.trial_data);
        }).bind(this), this.length_of_time_debreifing_is_shown);
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// Executes this trial of the block.
    ///
    run_trial() {
        // this.initialize_chart_settings();
        this.initialize_keyboard();

        // show the fixation cross
        // this.chart_widget.show_cross_only();
        this.display_widget.clear();

        if (window._secret_speed != undefined) {
            this.length_of_time_cue_is_shown = window._secret_speed;
        }


        this.display_widget.draw_cue();


        // wait a second...
        setTimeout((function () {
            // show the chart and turn on the keypress listener:
            this.display_widget.draw_stimuli();
            this.keyboard.turn_on();
            this.trial_data.chart_shown_to_user_at_time = performance.now();
        }).bind(this), this.length_of_time_cue_is_shown);
    }

}