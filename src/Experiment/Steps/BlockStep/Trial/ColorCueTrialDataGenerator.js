/**
 * A block trial data generator for AC_Color_Cue experiment.
 * 
 * @package acvs-online
 * @version 1.4 (9/7/2020)
 * @author Walden Li
 */
exp.ColorCueTrialDataGenerator = class extends exp.TrialDataGenerator {

    constructor(is_practice = false) {
        super();
        this._is_practice = is_practice; // if the block is a practice block
        this._numTotalTrials = 72;
        this._colors = [
            "rgb(150, 0, 150)", // MAGENTA
            "rgb(0, 115, 115)", // CYAN
            "rgb(179, 107, 0)"  // ORANGE
        ];
        this._trialConds = this._generate_trial_conditions();
        this._blockData = this._make_block_dataset(this._trialConds);
    }


    /**
     * Crossed variables: optEcc (3) * nonOptEcc (3) * optDigit (4) * nonOptDigit (3) = 108
     * Balanced variables: opt&nonOpt color combinations (3*2=6)
     * 
     * An example of one row is 3 1 3 4 1 2, which means this trial has an
     * optimal target on the ring furthermost to the center, a digit 3, and is
     * colored MAGENTA, as well as a non-optimal target on the ring closest to
     * the center, a digit 4, and is colored CYAN.
     */
    _generate_trial_conditions() {

        let result = [];

        // All possible combinations of target digits
        // Every row is a choice of optimal target digit
        const digit_combs = [
            [[2, 3], [2, 4], [2, 5]],   // opt digit == 2
            [[3, 2], [3, 4], [3, 5]],   // opt digit == 3
            [[4, 2], [4, 3], [4, 5]],
            [[5, 2], [5, 3], [5, 4]]
        ]
        const digitRows = util.Util.generate_random_array([0, 1, 2, 3], this._numTotalTrials, 3);
        const digitColumns = util.Util.generate_random_array([0, 1, 2], this._numTotalTrials, 3);

        const color_combs = [
            [[0, 1, 2], [0, 2, 1]],   // MAGENTA optimal
            [[1, 0, 2], [1, 2, 0]],   // CYAN optimal
            [[2, 0, 1], [2, 1, 0]]    // ORANGE optimal
        ];

        const colorRows = util.Util.generate_random_array( [0, 1, 2], this._numTotalTrials, 3 );
        const colorColumns = util.Util.generate_random_array( [0, 1], this._numTotalTrials, 3 );

        const ecc1 = util.Util.generate_random_array( [1, 2, 3], this._numTotalTrials, 3 );
        const ecc2 = util.Util.generate_random_array( [1, 2, 3], this._numTotalTrials, 3 );

        for (let i = 0; i < this._numTotalTrials; i++) {
            result.push([ecc1.pop(), ecc2.pop()]);
        }

        for (let i = 0; i < this._numTotalTrials; i++) {
            let current_digit_comb = digit_combs[digitRows.pop()][digitColumns.pop()];
            let current_color_comb = color_combs[colorRows.pop()][colorColumns.pop()];  // get current trial opt & nonOpt color code
            result[i] = result[i].concat(current_digit_comb).concat(current_color_comb);
        }
        util.Util.fisher_yates_shuffle(result);
        return result;

    }


    /**
     * 
     * @param {number} optTargEcc : 1-3
     * @param {number} nonOptTargEcc : 1-3
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit : 2-5
     * @param {number} optTargColor : 0, 1, 2 (will be used as an index of this._colors)
     * @param {number} nonOptTargColor : 0, 1, 2
     * @param {number} nonTargColor : 0, 1, 2
     */
    _make_trial_dataset(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor, nonTargColor) {

        const sz = this._display.square_size;

        let cue_display = new disp.DisplayDataset();
        let stimuli = new disp.DisplayDataset();

        const gridPos = this._display.get_grid_pos();

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

        // 1.2 Add digits
        stimuli.add_a_text(new disp.Text(
            optTargDigit + '',
            optTargGrid.x + this._display.digit_shift_x + '',
            optTargGrid.y + this._display.digit_shift_y +'',
            this._display.digit_color,
            this._display.digit_size,
            this._display.digit_class_name
        ));
        stimuli.add_a_text(new disp.Text(
            nonOptTargDigit + '',
            nonOptTargGrid.x + this._display.digit_shift_x + '',
            nonOptTargGrid.y + this._display.digit_shift_y + '',
            this._display.digit_color,
            this._display.digit_size,
            this._display.digit_class_name
        ));

        // 2. Add distractor rects and digits. They can be of any digit.
        for (let color = 0; color <= 2; color++) {
            // determine number of squares of current color
            let n = nonTargColor === color ? 18 : 17;

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
                    util.Util.select_rand_from_array(this._distractorDigits) + '',
                    grid.x + this._display.digit_shift_x + '',
                    grid.y + this._display.digit_shift_y + '',
                    this._display.digit_color,
                    this._display.digit_size,
                    this._display.digit_class_name
                ));
            }
        }

        // Add a cue to both cue and stimuli displays
        const the_cue = this._make_a_cue( optTargColor, nonOptTargColor, nonTargColor );
        cue_display.merge( the_cue );
        stimuli.merge( the_cue );

        // Return displays
        return {
            cue: [ cue_display ],
            stimuli: [ stimuli ]
        }

    }


    _make_trial_logic(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor, nonTargColor) {
        return (
            {
                optTargEcc: optTargEcc,
                nonOptTargEcc: nonOptTargEcc,
                optTargDigit: optTargDigit,
                nonOptTargDigit: nonOptTargDigit,
                optTargColor: optTargColor,
                nonOptTargColor: nonOptTargColor,
                nonTargColor: nonTargColor
            }
        );
    }


    /**
     * 
     * @param {number} optTargColor 
     * @param {number} nonOptTargColor 
     * @param {number} nonTargColor 
     */
    _make_a_cue( optTargColor, nonOptTargColor, nonTargColor) {

        const x = this._display.screen_center_x;
        const y = this._display.screen_center_y; 
        const r = this._display.cue_radius; // radius of cue outer circle
        const sc = this._display.cue_stroke_color;  // stroke color of the cue outer circle and dividing line
        const sw = this._display.cue_stroke_width;  // stroke width of the cue outer circle and dividing line

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


    _make_block_dataset(trialConds) {
        let trial_conditions = trialConds.slice();  // make a copy
        let result = [];
        let currentTrialCond;
        while (trial_conditions.length > 0) {
            currentTrialCond = trial_conditions.pop();
            let currentTrialDisplays = this._make_trial_dataset(...currentTrialCond);
            let currentTrialLogic = this._make_trial_logic(...currentTrialCond);
            result.push(
                {
                    "logic": currentTrialLogic,
                    "cue": currentTrialDisplays.cue,
                    "stimuli": currentTrialDisplays.stimuli
                }
            );
        }
        if (this._is_practice) return result.slice(0, 10);
        return result;
    }

}