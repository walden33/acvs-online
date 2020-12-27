/**
 * A new idea for color cue. Don't know if it will work.
 */
disp.ColorCueDisplayGenerator3 = class extends disp.DisplayGenerator {

    constructor(num_trials, num_trials_to_slice=undefined, has_preview = false)
    {
        super(num_trials, num_trials_to_slice);

        // Experimental
        this._setting.digit_size = 4*0.65;

        if (num_trials % 3 !== 0) {
            throw RangeError( "Number of total block trials must be an " +
            "integer multiple of 3.");
        }
        this._num_trials_to_slice = num_trials_to_slice;
        if (num_trials_to_slice !== undefined && num_trials_to_slice > num_trials) {
            throw RangeError( "Number of sliced trials must not exceed " +
            "number of total trials." );
        }
        // Set paradigm-specific settings
        this._colors = [
            "rgb(150, 0, 150)", // MAGENTA
            "rgb(0, 115, 115)", // CYAN
            "rgb(179, 107, 0)"  // ORANGE
        ];
        // Set square colors (1+1+14+12+12+14=54)
        this._num_orange_dist = 16;
        this._num_magenta_dist = 18;
        this._num_cyan_dist = 18;
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
        nonOptTargDigit, optTargColor, nonOptTargColor) {
        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y;
        const sz = this._setting.square_size;

        let fixation = new disp.DisplayDataset();
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

        // 1.1 Add rects to both preivew and stimuli (if a preview is ordered)
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

        // 1.2 Add digits to stimuli but not preview
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

        // 2. Add Color2 distractor rects and digits. They can be of any digit.
        for (let i = 0; i < this._num_orange_dist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 2.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[2]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 2.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._target_digits.concat(
                    this._distractor_digits)) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_class_name
            ));
        }

        // 3. Add Color0 distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._num_magenta_dist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 3.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[0]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 3.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractor_digits) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_class_name
            ));
        }

        // 4. Add Color1 distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._num_cyan_dist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 4.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[1]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 4.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractor_digits) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_class_name
            ));
        }


        const the_cue = this._make_a_cue( 0, 1, 2 );
        stimuli.merge( the_cue );


        // Decide if return includes a preview
        if (this._has_preview) {
            return {
                cue: [preview],
                stimuli: [stimuli]
            }
        }
        return {
            cue: [preview],
            stimuli: [stimuli]
        }

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
        let colorRows = util.Util.generate_random_array( [0, 1, 2], this._num_total_trials, 3 );
        let colorColumns = util.Util.generate_random_array( [0, 1], this._num_total_trials);

        // Add everything to the output
        for (let i = 0; i < this._num_total_trials; i++) {
            let current_colors = color_combs[colorRows.pop()][colorColumns.pop()];  // get current trial opt & nonOpt color indexes
            result[i] = result[i].concat(digits.pop()).concat(current_colors);
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

    /**
     * 
     * @param {number} optTargColor 
     * @param {number} nonOptTargColor 
     */
    _make_a_cue( optTargColor, nonOptTargColor) {

        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y; 

        /**
         * A helper function to add a digit to the incoming display. Takes in
         * digit, its color, and its position on the screen (left, up, and
         * right)
         * 
         * @param {disp.DisplayDataset} display 
         * @param {number} digit 
         * @param {number} color 
         * @param {number} location : 0, 1, 2 for left, up, and right
         * 
         * @updates display
         */
        const add_color_cue = (display, color, location) => {
            const R = 1;    // imaginary circumcircle of the three dots
            const r = 0.5;  // radius of the three dots
            let shift = [0, 0];
            if (location===0) {
                shift[1] = -R;
                shift[0] = -R * Math.sin(Math.PI/3);
                shift[1] = R * Math.cos(Math.PI/3);
            } else if (location===1) {
                shift[1] = -R;
            } else if (location===2) {
                shift[0] = R * Math.sin(Math.PI/3);
                shift[1] = R * Math.cos(Math.PI/3);
            }
            display.add_a_circle(new disp.Circle(
                x + shift[0],
                y + shift[1],
                r,
                this._colors[color],
                null,
                null
            ));
        }

        let result = new disp.DisplayDataset();

        // First add the border circle
        result.add_a_circle(new disp.Circle(
            x+'',
            y+'',
            this._setting.cue_radius+'',
            null,
            this._setting.cue_stroke_color,
            this._setting.cue_stroke_width
        ));

        // Then add the three colors
        let colorCues = [optTargColor, optTargColor, nonOptTargColor];
        util.Util.fisher_yates_shuffle(colorCues);
        colorCues.forEach((color, index) => {
            add_color_cue(result, color, index)
        })

        // // First, determine where to put the optTargColor cue (top/bottom)
        // if (Math.random() < 0.5) {    // opt top
        //     result.add_a_circle( create_color_cue_at( 0, -1, this._colors[optTargColor]) );
        //     // then determine where to put the nonOptTargColor (and thus nonTargColor)
        //     if (Math.random() < 0.5) {  // nonOpt bot left
        //         result.add_a_circle( create_color_cue_at( -1, 1, this._colors[nonOptTargColor]) );
        //         result.add_a_circle( create_color_cue_at( 1, 1, this._colors[nonTargColor]) );
        //     } else {    //  nonOpt bot right
        //         result.add_a_circle( create_color_cue_at( 1, 1, this._colors[nonOptTargColor]) );
        //         result.add_a_circle( create_color_cue_at( -1, 1, this._colors[nonTargColor]) );
        //     }
        // } else {    // opt bottom
        //     result.add_a_circle( create_color_cue_at( 0, 1, this._colors[optTargColor]) );
        //     // then do the same thing for the rest colors
        //     if (Math.random() < 0.5) {  // nonOpt top left
        //         result.add_a_circle( create_color_cue_at( -1, -1, this._colors[nonOptTargColor]) );
        //         result.add_a_circle( create_color_cue_at( 1, -1, this._colors[nonTargColor]) );
        //     } else {    //  nonOpt top right
        //         result.add_a_circle( create_color_cue_at( 1, -1, this._colors[nonOptTargColor]) );
        //         result.add_a_circle( create_color_cue_at( -1, -1, this._colors[nonTargColor]) );
        //     }
        // }
        // result.add_a_circle( create_color_cue_at( 0, -1, this._colors[optTargColor]) );
        // result.add_a_circle( create_color_cue_at( 0, 1, this._colors[optTargColor]) );
        // result.add_a_circle( create_color_cue_at( 0, 0, this._colors[nonOptTargColor]) );

        return result;

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
        if (this._num_trials_to_slice !== undefined) {
            result = result.slice(0, this._num_trials_to_slice);
        }
        return result;
    }

}