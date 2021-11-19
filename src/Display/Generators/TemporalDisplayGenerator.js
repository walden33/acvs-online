/**
 * A generator for temporal ACVS displays.
 */
disp.TemporalDisplayGenerator = class extends disp.DisplayGenerator {

    constructor(num_trials, num_trials_to_slice=undefined) {
        super(num_trials, num_trials_to_slice);
        if (num_trials % 12 !== 0) {
            throw RangeError( "Number of total block trials must be an " +
            "integer multiple of 12.");
        }
        if (num_trials_to_slice !== undefined && num_trials_to_slice > num_trials) {
            throw RangeError( "Number of sliced trials must not exceed " +
            "number of total trials." );
        }

        // Overwrite some display seetings
        this._setting.digit_size = 4;

        // Set paradigm-specific settings
        this._colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 150, 0)"
        ];
        // Trial settings
        this._pre_targ_filler_frames = [1, 2, 3, 4];  // target-less filler frames before optimal target sampling frames start
        this._opt_targ_frames = [5, 6, 7, 8];  // after the pre-target fillers, frames that the optimal target be sampled from
        this._non_opt_targ_frames = [9, 10, 11, 12];  // after optimal target sampling frames, frames that the non-optimal target be sampled from
        this._post_targ_filler_frames = [13, 14, 15, 16];  // target-less filler frames after the non-optimal target sampling frames
        this._num_total_frames = this._pre_targ_filler_frames.length +
            this._opt_targ_frames.length + this._non_opt_targ_frames.length +
            this._post_targ_filler_frames.length;

        // Generator all displays in a block
        this._block_data = this._make_block_displays(
            this._generate_trial_conditions());
    }

    /**
     * A function that generates trial condition arrays for a block.
     * Each array element is an array with numbers representing the following:
     * optTargDigit, nonOptTargDigit, optTargColor, nonOptTargColor,
     * optTargPos, nonOptTargPos, optTargLoc, nonOptTargLoc
     * P.S. "position" here means the position in the trial RSVP stream
     */
    _generate_trial_conditions() {

        // Generate digits
        let digits = this._generate_trial_digits(this._num_total_trials);

        // Generate optimal target colors
        let optColors = util.Util.generate_random_array([0,1], this._num_total_trials, 3);

        // Generate positions
        let optTargPositions = util.Util.generate_random_array(
            this._opt_targ_frames, this._num_total_trials, 3);
        let nonOptTargPositions = util.Util.generate_random_array(
            this._non_opt_targ_frames, this._num_total_trials, 3);
        
        // Generate target locations (0, 1, 2 for L U R)
        let optTargLocs = util.Util.generate_random_array(
            [0, 1, 2], this._num_total_trials, 3);
        let nonOptTargLocs = util.Util.generate_random_array(
            [0, 1, 2], this._num_total_trials, 3);    
        
        // Generate the trial condition array
        let result = digits;
        for(let i = 0; i < result.length; i++) {
            let optColor = optColors.pop();
            let nonOptColor = optColor === 0 ? 1 : 0;
            result[i] = result[i].concat([optColor, nonOptColor,
                optTargPositions.pop(), nonOptTargPositions.pop(),
                optTargLocs.pop(), nonOptTargLocs.pop()]);
        }

        return result;
    }


    /**
     * 
     * @param {number} optTargDigit : 2, 3, 4, 5
     * @param {number} nonOptTargDigit : 2, 3, 4, 5
     * @param {number} optTargColor : 0, 1
     * @param {number} nonOptTargColor : 0, 1
     * @param {number} optTargPos : e.g. 5, 6, 7, 8
     * @param {number} nonOptTargPos : e.g. 9, 10, 11, 12
     * @param {number} optTargLoc : location (L U R) on the display; 0, 1, 2
     * @param {number} nonOptTargLoc : location (L U R) on the display; 0, 1, 2
     */
    _make_trial_display(optTargDigit, nonOptTargDigit, optTargColor,
        nonOptTargColor, optTargPos, nonOptTargPos, optTargLoc, nonOptTargLoc) {
        
        /**
         * A helper function to add a digit to the incoming display. Takes in
         * digit, its color, and its position on the screen (L, U, R for left,
         * up, and right)
         * 
         * @param {disp.DisplayDataset} display 
         * @param {number} digit 
         * @param {number} color 
         * @param {number} location : 0, 1, 2 for L, U, R
         * 
         * @updates display
         */
        const add_digit = (display, digit, color, location) => {
            const r = 5;
            let shift = [0, 0];
            if (location===0) {
                shift[1] = -r;
                shift[0] = -r * Math.sin(Math.PI/3);
                shift[1] = r * Math.cos(Math.PI/3);
            } else if (location===1) {
                shift[1] = -r;
            } else if (location===2) {
                shift[0] = r * Math.sin(Math.PI/3);
                shift[1] = r * Math.cos(Math.PI/3);
            }
            let rgb = this._colors[color];
            display.add_a_text(new disp.Text(
                digit+'',
                x + shift[0],
                y + shift[1],
                rgb,
                ds,
                null,
                'Arial'
            ));
        }

        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y;
        const ds = this._setting.digit_size;
        const colorIndices = util.Util.range(this._colors.length);

        let digits = util.Util.ndarray([this._num_total_frames,3],-1);
        let colors = util.Util.ndarray([this._num_total_frames,3],-1);
        digits[optTargPos-1][optTargLoc] = optTargDigit;
        colors[optTargPos-1][optTargLoc] = optTargColor;
        digits[nonOptTargPos-1][nonOptTargLoc] = nonOptTargDigit;
        colors[nonOptTargPos-1][nonOptTargLoc] = nonOptTargColor;
        // Generate digits and colors for the first frame
        digits[0][0] = util.Util.choose_from(this._distractor_digits);
        digits[0][1] = util.Util.choose_from(this._distractor_digits);
        digits[0][2] = util.Util.choose_from(this._distractor_digits);
        colors[0][0] = util.Util.choose_from(colorIndices);
        colors[0][1] = util.Util.choose_from(colorIndices, [ colors[0][0] ]);
        colors[0][2] = util.Util.choose_from(colorIndices, [ colors[0][0], colors[0][1] ]);

        // Generate digits and colors for the rest of the frames,
        // while making sure that for each frame at each location,
        // the digit and its color are different from those at the same
        // location in the previous frame.
        for(let i = 1; i < digits.length; i++) {
            for(let j = 0; j < 3; j++) {
                // i = position number-1, j = location number
                if(colors[i][j] === -1) {
                    colors[i][j] = util.Util.choose_from(colorIndices, colors[i]);
                }
                if(digits[i][j] === -1) {
                    if(colors[i][j] <= 1) {
                        // if digit is in target color, only give 6-9
                        digits[i][j] = util.Util.choose_from(this._distractor_digits, [digits[i-1][j]]);
                    } else {
                        // if digit is in irrelevant distractor color, give 2-9
                        digits[i][j] = util.Util.choose_from(this._distractor_digits.concat(this._target_digits), [digits[i-1][j]]);
                    }
                }
            }
        }
        
        let cue = new disp.DisplayDataset();
        this._add_a_cue(cue, optTargColor, nonOptTargColor);
        const blank = new disp.DisplayDataset();

        // Create the RSVP stream
        let rsvp = [];
        for(let i = 0; i < this._num_total_frames; i++) {
            let frame = new disp.DisplayDataset();
            for(let loc = 0; loc < 3; loc++) {
                add_digit(frame, digits[i][loc], colors[i][loc], loc);
            }
            rsvp.push(frame);
        }
        return {
            cue: [cue, blank],
            stimuli: rsvp
        }
    }

    _add_a_cue(display, optTargColor, nonOptTargColor) {
        // R & B letter as a cue
        // display.add_a_text(new disp.Text(
        //     optTargColor === 0 ? 'R' : 'B',
        //     this._setting.screen_center_x,
        //     this._setting.screen_center_y,
        //     'white',
        //     this._setting.fixation_cross_size,
        //     this._setting.fixation_cross_class_name
        // ));
        // Colored dots as a cue
        const dotSize = .8;
        const horizShift = 1.4;
        // First add the optimal color dot
        display.add_a_circle(new disp.Circle(
            this._setting.screen_center_x - horizShift,
            this._setting.screen_center_y,
            dotSize,
            this._colors[optTargColor],
            null,
            null
        ));
        // Then add the non-optimal color dot
        display.add_a_circle(new disp.Circle(
            this._setting.screen_center_x + horizShift,
            this._setting.screen_center_y,
            dotSize,
            this._colors[nonOptTargColor],
            null,
            null
        ));
    }

    _make_trial_logic(optTargDigit, nonOptTargDigit, optTargColor,
        nonOptTargColor, optTargPos, nonOptTargPos, optTargLoc, nonOptTargLoc) {
        return {
            optTargDigit: optTargDigit,
            nonOptTargDigit: nonOptTargDigit,
            optTargColor: optTargColor,
            nonOptTargColor: nonOptTargColor,
            optTargPos: optTargPos,
            nonOptTargPos: nonOptTargPos,
            optTargLoc: optTargLoc,
            nonOptTargLoc: nonOptTargLoc
        }
    }

    _make_block_displays(trialConds) {
        let trial_conditions = trialConds.slice();  // make a copy
        let result = [];
        let currentTrialCond;
        while (trial_conditions.length > 0) {
            currentTrialCond = trial_conditions.pop();
            let currentTrialDisplays = this._make_trial_display(...currentTrialCond);
            let currentTrialLogic = this._make_trial_logic(...currentTrialCond);
            result.push(
                {
                    "logic": currentTrialLogic,
                    "cue": currentTrialDisplays.cue,
                    "stimuli": currentTrialDisplays.stimuli
                }
            );
        }
        // If number of block trials is less than 20, this is a practice trial,
        // and because the trial condition array 
        if (this._num_trials_to_slice !== undefined) {
            result = result.slice(0, this._num_trials_to_slice);
        }
        return result;
    }

}