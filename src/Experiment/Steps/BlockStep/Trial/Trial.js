///////////////////////////////////////////////////////////////////////////////
///
/// <Trial> represents a trial of a block.
///
exp.Trial = class extends exp.AbstractTrial {

  /**
   * 
   * @param {} logic 
   * @param {Array<disp.DisplayDataset} cue 
   * @param {Array<disp.DisplayDataset} stimuli 
   * @param {Array<number>} timing : time stamps of the trial in ms
   */
  constructor ( logic, cue, stimuli, timing ) {

    super();
    // Check if enough time stamps are provided
    if( (timing.length-1) !== cue.length ) throw ( "ERROR: Mismatch in cue frames and number of time stamps" );
    this.logic = logic;
    this.timing = timing;
    this.cue = cue;
    this.stimuli = stimuli;


    this.trial_completed_signal = new util.Signal();

    this.display_widget = new disp.DisplayWidget( exp.HtmlGui.workspace() );

    this.display_widget.set_cue( cue );
    this.display_widget.set_stimuli( stimuli );

    // create an object to store the data for this Trial
    this.trial_data = { "trialCreatedAt" : performance.now() };
    // this is the amount of time a message is shown to the user after hitting
    // a response key
    this.length_of_time_debreifing_is_shown = 1000; //ms
    // this is the amount of time a fixation cross is shown to the user before
    // the graphic is shown

    //TODO: blank screen 500ms

    //TODO: cue for 1000ms
    this.length_of_time_cue_is_shown = 1000;

    this.length_of_time_cross_is_shown = 1500 // ms
    // this maps the answer keys to the target numbers
    this.answer_keys = new Map([ ["v", 2], ["b", 3], ["n", 4], ["m", 5] ]);
    // this is a counter for the total number of keys the user presses during
    // the trial
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
  initialize_chart_settings () {
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
  initialize_keyboard () {
    this.keyboard = new util.KeyFilter( (function (the_key_the_user_pressed) {
      let time_stamp = performance.now();
      this.num_keys_pressed += 1;

      if (this.answer_keys.has(the_key_the_user_pressed)) {
        this.respond_to_valid_user_keyboard_input(the_key_the_user_pressed, time_stamp);
      } else {
        this.respond_to_invalid_user_keyboard_input(the_key_the_user_pressed);
      }
    }).bind(this), false );
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// helper method providing the logic for what happens when the user hits a
  /// valid key.
  ///
  respond_to_valid_user_keyboard_input (the_key_the_user_pressed, time_stamp) {
    let result = false;
    if ( this.answer_keys.get(the_key_the_user_pressed) == this.logic.optTargDigit ||
         this.answer_keys.get(the_key_the_user_pressed) == this.logic.nonOptTargDigit ) {
      result = true;
    } else {
      util.Util.play_beep_sound();
    }

    this.trial_data.blockTrial = this._trial_number_in_block;
    this.trial_data.blockNumber = this._block_number;

    
    this.trial_data.optTargIndex = this.logic.optTargIndex;
    this.trial_data.nonOptTargIndex = this.logic.nonOptTargIndex;
    
    this.trial_data.optTargDigit = this.logic.optTargDigit;
    this.trial_data.nonOptTargDigit = this.logic.nonOptTargDigit;

    this.trial_data.optTargEcc = this.logic.optTargEcc;
    this.trial_data.nonOptTargEcc = this.logic.nonOptTargEcc;

    this.trial_data.optTargRegion = this.logic.optTargRegion;
    this.trial_data.nonOptTargRegion = this.logic.nonOptTargRegion;

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
  respond_to_invalid_user_keyboard_input (the_key_the_user_pressed) {
    exp.HtmlGui.show_message("Key '" + the_key_the_user_pressed + "' not recognized. Please use: 'v' for 2, 'b' for 3, 'n' for 4, and 'm' for 5", "red");

    util.Util.play_beep_sound();

    setTimeout( function () {
      exp.HtmlGui.show_message(".", "black");
    }, 2000 );
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// helper method providing the logic for what is shown to the user after
  /// completing the trial by providing valid user input.
  ///
  show_debriefing () {
    // WL: this is adapted from RewardTrial.js
    if (this.trial_data.result == "incorrect") {
      this.display_widget.show_text("Incorrect");
    } else {
      this.display_widget.show_text("Correct");
    }

    if (window._secret_speed != undefined) {
      this.length_of_time_debreifing_is_shown = window._secret_speed;
    }

    setTimeout( (function () {
      this.display_widget = this.display_widget.destroy();
      this.trial_completed_signal.emit(this.trial_data);
    }).bind(this), this.length_of_time_debreifing_is_shown );
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Executes this trial of the block.
  ///
  run_trial () {
    // this.initialize_chart_settings();
    this.initialize_keyboard();
    
    // show the fixation cross
    // this.chart_widget.show_cross_only();
    this.display_widget.clear();

    for( let i = 0; i < this.cue.length ; i++ ) {
      setTimeout( (() => {
        this.display_widget.draw( this.cue[i] );
      }).bind(this), this.timing[i] );
    }

    for( let i = 0 ; i < this.stimuli.length; i++ ) {
      setTimeout( (() => {
        this.display_widget.draw( this.stimuli[i] );
        // turn on keyboard at the first iteration
        if( i==0 ) {
          this.keyboard.turn_on();
          this.trial_data.stimuli_shown_at = performance.now();
        }
      }).bind(this), this.timing[ this.cue.length + i ] );
    }

  }
}
