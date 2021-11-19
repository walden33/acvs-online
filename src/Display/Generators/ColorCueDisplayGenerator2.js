/**
 * A generators class that yields a block of Color Cue ACVS displays. Previously
 * named "ColorCueTrialDataGenerator" (before 1.4), but updated when I tried
 * to systematically separate display logic from experiment logic.
 * 
 * @author Walden Y. Li
 * @version 1.6 (updated 10/17/2020)
 */
disp.ColorCueDisplayGenerator2 = class extends disp.DisplayGenerator {

    constructor(num_trials, num_trials_to_slice = undefined, has_preview = true) {
        super(num_trials, num_trials_to_slice);
        if (num_trials % 12 !== 0) {
            throw RangeError("Number of total block trials must be an " +
                "integer multiple of 12.");
        }
        if (num_trials_to_slice !== undefined && num_trials_to_slice > num_trials) {
            throw RangeError("Number of sliced trials must not exceed " +
                "number of total trials.");
        }
        this._has_preview = has_preview;

        // Set paradigm-specific settings
        this._colors = [
            "rgb(150, 0, 150)", // MAGENTA
            "rgb(0, 115, 115)", // CYAN
            "rgb(179, 107, 0)",  // ORANGE
            "rgb(98, 98, 98)"   // GREY
        ];

        this._num_of_squares = [14, 14, 14, 12];

        // Create block data according to trial conditions
        this._block_data = this._make_block_displays(
            this._generate_trial_conditions());
    }

    /**
     * 
     * @param {number} optTargColor : 0, 1
     * @param {number} nonOptTargColor : 0, 1
     * @param {number} optTargEcc : 1-3
     * @param {number} nonOptTargEcc : 1-3
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit : 2-5
     */
    _make_trial_display(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor, nonTargColor) {

        const sz = this._setting.square_size;

        let cue_display = new disp.DisplayDataset();
        let preview = new disp.DisplayDataset();
        let stimuli = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();

        const targPosInfo = this._generate_target_pools_by_ecc(gridPos, optTargEcc, nonOptTargEcc);
        const optTargPos = targPosInfo.optTargPos;
        const nonOptTargPos = targPosInfo.nonOptTargPos;
        const nonTargPool = targPosInfo.nonTargPool;

        const optTargGrid = gridPos.get(optTargPos);
        const nonOptTargGrid = gridPos.get(nonOptTargPos);

        // 1. Add two targets

        // 1.1 Add rects
        let optRect = new disp.Rect(
            optTargGrid.rect_x + '',
            optTargGrid.rect_y + '',
            sz + '',
            sz + '',
            this._colors[optTargColor]
        );
        let nonOptRect = new disp.Rect(
            nonOptTargGrid.rect_x + '',
            nonOptTargGrid.rect_y + '',
            sz + '',
            sz + '',
            this._colors[nonOptTargColor]
        );

        stimuli.add_rects([optRect, nonOptRect]);
        if (this._has_preview) preview.add_rects([optRect, nonOptRect]);

        // 1.2 Add digits
        stimuli.add_a_text(new disp.Text(
            optTargDigit + '',
            optTargGrid.x + this._setting.digit_shift_x + '',
            optTargGrid.y + this._setting.digit_shift_y + '',
            this._setting.digit_color,
            this._setting.digit_size,
            this._setting.digit_class_name
        ));
        stimuli.add_a_text(new disp.Text(
            nonOptTargDigit + '',
            nonOptTargGrid.x + this._setting.digit_shift_x + '',
            nonOptTargGrid.y + this._setting.digit_shift_y + '',
            this._setting.digit_color,
            this._setting.digit_size,
            this._setting.digit_class_name
        ));

        // 2. Add distractor rects and digits. They can be of any digit.
        for (let color = 0; color <= 2; color++) {
            // determine number of squares of current color
            let n = nonTargColor === color ? 14 : 13;

            // add rects of current color
            for (let i = 0; i < n; i++) {

                let j = nonTargPool.pop();  // grid position number
                let grid = gridPos.get(j);  // grid info

                // 2.1 add rects
                let currentRect = new disp.Rect(
                    grid.rect_x + '',
                    grid.rect_y + '',
                    sz + '',
                    sz + '',
                    this._colors[color]
                );
                stimuli.add_a_rect(currentRect);
                if (this._has_preview) preview.add_a_rect(currentRect);

                // 2.2 add distractor digits
                stimuli.add_a_text(new disp.Text(
                    util.Util.select_rand_from_array(this._distractor_digits) + '',
                    grid.x + this._setting.digit_shift_x + '',
                    grid.y + this._setting.digit_shift_y + '',
                    this._setting.digit_color,
                    this._setting.digit_size,
                    this._setting.digit_class_name
                ));
            }
        }

        // 3. Add irrelavent distractors
        for (let i = 0; i < this._num_of_squares[3]; i++) {
            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 2.1 add rects
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[3]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 2.2 add distractor digits
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractor_digits.concat(this._target_digits)) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_class_name
            ));
        }

        // Add the cue to all cue, preview, and stimuli displays
        const the_cue = this._make_a_cue(optTargColor, nonOptTargColor, nonTargColor);
        cue_display.merge(the_cue);
        preview.merge(the_cue);
        stimuli.merge(the_cue);

        // Return displays
        let displays = {};
        if (this._has_preview) {
            // If task has preview, include it
            displays.cue = [cue_display, preview];
        } else {
            displays.cue = [cue_display];
        }
        displays.stimuli = [stimuli];

        return displays;

    }

    _generate_trial_conditions() {

        let result = [];

        // Determine target eccentricity
        let ecc1 = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);
        let ecc2 = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);

        for (let i = 0; i < this._num_total_trials; i++) {
            result.push([ecc1.pop(), ecc2.pop()]);
        }

        // Generate digits
        let digits = this._generate_trial_digits(this._num_total_trials);

        // Generator color combinations
        const color_combs = [
            [[0, 1, 2], [0, 2, 1]],   // MAGENTA optimal
            [[1, 0, 2], [1, 2, 0]],   // CYAN optimal
            [[2, 0, 1], [2, 1, 0]]    // ORANGE optimal
        ];
        let colorRows = util.Util.generate_random_array([0, 1, 2], this._num_total_trials, 3);
        let colorColumns = util.Util.generate_random_array([0, 1], this._num_total_trials);

        // Add everything to the output
        for (let i = 0; i < this._num_total_trials; i++) {
            let current_colors = color_combs[colorRows.pop()][colorColumns.pop()];  // get current trial opt & nonOpt color indexes
            result[i] = result[i].concat(digits.pop()).concat(current_colors);
        }

        return result;

    }

        /**
     * 
     * @param {number} optTargColor 
     * @param {number} nonOptTargColor 
     * @param {number} nonTargColor 
     */
    _make_a_cue( optTargColor, nonOptTargColor, nonTargColor) {

        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y; 
        const r = this._setting.cue_radius; // radius of cue outer circle
        const sc = this._setting.cue_stroke_color;  // stroke color of the cue outer circle and dividing line
        const sw = this._setting.cue_stroke_width;  // stroke width of the cue outer circle and dividing line

        /**
         * Helper functions to create a <disp.Circle> at a location in the cue circle
         * 
         * @param {number} pos_horiz : -1: left, 0: mid, 1: right
         * @param {number} pos_vert : -1: top, 0: mid, 1: bottom
         * @param {String} color : cue circle color
         */
        const create_color_cue_at = (pos_horiz, pos_vert, color) => {
            return new disp.Circle(
                x + pos_horiz * 1.0 + '',
                y + pos_vert * 1.0 + '',
                '0.5',
                color,
                null,
                null
            );
        }

        let result = new disp.DisplayDataset();

        // First add the border circle and the dividing line
        result.add_a_circle(new disp.Circle(
            x+'', y+'', r+'', null, sc, sw
        ));
        result.add_a_line(new disp.Line(
            x - r+'', y+'', x + r+'', y+'', sc, sw
        ));

        // First, determine where to put the optTargColor cue (top/bottom)
        if (Math.random() < 0.5) {    // opt top
            result.add_a_circle( create_color_cue_at( 0, -1, this._colors[optTargColor]) );
            // then determine where to put the nonOptTargColor (and thus nonTargColor)
            if (Math.random() < 0.5) {  // nonOpt bot left
                result.add_a_circle( create_color_cue_at( -1, 1, this._colors[nonOptTargColor]) );
                result.add_a_circle( create_color_cue_at( 1, 1, this._colors[nonTargColor]) );
            } else {    //  nonOpt bot right
                result.add_a_circle( create_color_cue_at( 1, 1, this._colors[nonOptTargColor]) );
                result.add_a_circle( create_color_cue_at( -1, 1, this._colors[nonTargColor]) );
            }
        } else {    // opt bottom
            result.add_a_circle( create_color_cue_at( 0, 1, this._colors[optTargColor]) );
            // then do the same thing for the rest colors
            if (Math.random() < 0.5) {  // nonOpt top left
                result.add_a_circle( create_color_cue_at( -1, -1, this._colors[nonOptTargColor]) );
                result.add_a_circle( create_color_cue_at( 1, -1, this._colors[nonTargColor]) );
            } else {    //  nonOpt top right
                result.add_a_circle( create_color_cue_at( 1, -1, this._colors[nonOptTargColor]) );
                result.add_a_circle( create_color_cue_at( -1, -1, this._colors[nonTargColor]) );
            }
        }

        return result;

    }

    _make_trial_logic(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor) {
        return (
            {
                optTargEcc: optTargEcc,
                nonOptTargEcc: nonOptTargEcc,
                optTargDigit: optTargDigit,
                nonOptTargDigit: nonOptTargDigit,
                optTargColor: optTargColor,
                nonOptTargColor: nonOptTargColor
            }
        );
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
