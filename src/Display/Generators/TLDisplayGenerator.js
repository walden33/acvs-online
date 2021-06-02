/**
 * A display generator for a new try of ACVS. Make the paradigm a T among L
 * search while keeping others the same
 * 
 * @author Walden Y. Li
 * @version 1.1 (updated 5/31/2021)
 * 
 */
disp.TLDisplayGenerator = class extends disp.DisplayGenerator {

    constructor(num_trials, num_trials_to_slice=undefined, has_preview=true)
    {
        super(num_trials, num_trials_to_slice);
        if (num_trials % 12 !== 0) {
            throw RangeError( "Number of total block trials must be an " +
            "integer multiple of 12.");
        }
        if (num_trials_to_slice !== undefined && num_trials_to_slice > num_trials) {
            throw RangeError( "Number of sliced trials must not exceed " +
            "number of total trials." );
        }
        this._has_preview = has_preview;
        // Set paradigm-specific settings
        this._colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 150, 0)"
        ];
        // Set square colors (1+1+14+12+12+14=54)
        this._num_green_dist = 14;
        this._num_red_dist = 12;
        this._num_blue_dist = 12;
        this._num_var_dist = 14;    // variable distractor is either red or blue
        this._setting.TL_stroke_width = 0.35;
        this._setting.TL_stroke_color = "white";
        this._setting.T_tail_length = 2.6;
        this._setting.T_head_width = 2.4;
        this._setting.TL_offset = this._setting.T_head_width/2 * 0.9;
        // Create default trial conditions 
        this._trial_conds = this._generate_trial_conditions();
        // Create block data according to trial conditions
        this._block_data = [];
    }

    /**
     * 
     * @param {number} optTargEcc : 1 - 3
     * @param {number} nonOptTargEcc : 1 - 3
     * @param {number} optTargOri : 0 - 3 for right, up, left, down
     * @param {number} nonOptTargOri : same as above
     * @param {number} optTargColor : 0 - 1 for red and blue
     * @param {number} nonOptTargColor : 0 - 1 for red and blue
     */
    _make_trial_display(optTargEcc, nonOptTargEcc, optTargOri,
        nonOptTargOri, optTargColor, nonOptTargColor) {
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

        // 1.2 Add target Ts to stimuli but not preview
        stimuli.merge(
            this._generate_T_shape(optTargGrid.x, optTargGrid.y, optTargOri));
        stimuli.merge(
            this._generate_T_shape(nonOptTargGrid.x, nonOptTargGrid.y, nonOptTargOri));

        // 2. Add GREEN distractor rects and shapes.
        for (let i = 0; i < this._num_green_dist; i++) {

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

            // 2.2 add T shapes (50% chance)
            if (Math.random() < 0.5) {  // T
                stimuli.merge(
                    this._generate_T_shape(
                        grid.x,
                        grid.y,
                        util.Util.gen_random_int(0, 3, true)
                    )
                );
            } else {    // L
                stimuli.merge(
                    this._generate_L_shape(
                        grid.x,
                        grid.y,
                        util.Util.gen_random_int(0, 3, true)
                    )
                );
            }
        }

        // 3. Add RED distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._num_red_dist; i++) {

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

        // 4. Add BLUE distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._num_blue_dist; i++) {

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

        // 5. Add variable distractor rects and digits
        for (let i = 0; i < this._num_var_dist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 5.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                // if opt targ color is RED, var dist color should be blue, and vice versa
                optTargColor === 0 ? this._colors[1] : this._colors[0]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 5.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractor_digits) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_class_name
            ));
        }

        // Finally, generate a fixation cross to everything
        const fixation_text = new disp.Text(
            '+', x, y, 'white', 3, this._setting.fixation_cross_class_name
        );

        fixation.add_a_text(fixation_text);
        if (this._has_preview) preview.add_a_text(fixation_text);
        stimuli.add_a_text(fixation_text);


        // Decide if return includes a preview
        if (this._has_preview) {
            return {
                cue: [fixation, preview],
                stimuli: [stimuli]
            }
        }
        return {
            cue: [fixation],
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

        // Generate optimal target colors
        let optColors = util.Util.generate_random_array([0,1], this._num_total_trials, 3);
        // Add everything to the output
        for( let i = 0; i < result.length; i++ ) {
            let optColor = optColors.pop();
            let nonOptColor = optColor === 1 ? 0 : 1;
            result[i] = result[i].concat(digits.pop().concat([optColor, nonOptColor]));
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
     * @param {number} x : x coordinate of the center of the shape
     * @param {number} y : y coordinate of the center of the shape
     * @param {number} orientation : 0, 1, 2, 3 for right, up, left, down
     */
    _generate_T_shape(x, y, orientation) {
        let result = new disp.DisplayDataset();
        // Draw the tail
        result.add_a_line(new disp.Line(
            x - this._setting.T_tail_length/2,
            y,
            x + this._setting.T_tail_length/2,
            y,
            this._setting.TL_stroke_color,
            this._setting.TL_stroke_width,
            undefined,
            undefined,
            `rotate(${orientation * -90}, ${x}, ${y})`) // counter-clockwise rotation
        );
        // Draw the head
        result.add_a_line(new disp.Line(
            x - this._setting.T_tail_length/2,
            y - this._setting.T_head_width/2,
            x - this._setting.T_tail_length/2,
            y + this._setting.T_head_width/2,
            this._setting.TL_stroke_color,
            this._setting.TL_stroke_width,
            undefined,
            undefined,
            `rotate(${orientation * -90}, ${x}, ${y})`)
        );
        return result;
    }

    /**
     * 
     * @param {number} x : x coordinate of the center of the shape
     * @param {number} y : y coordinate of the center of the shape
     * @param {number} orientation : 0, 1, 2, 3 for right, up, left, down
     */
    _generate_L_shape(x, y, orientation) {
        let result = new disp.DisplayDataset();
        // Draw the tail
        // Determine the offset direction (randomly choose between two)
        let offset = this._setting.TL_offset
        if (Math.random() < 0.5) {
            offset = offset * -1;
        }
        result.add_a_line(new disp.Line(
            x - this._setting.T_tail_length/2,
            y + offset,
            x + this._setting.T_tail_length/2,
            y + offset,
            this._setting.TL_stroke_color,
            this._setting.TL_stroke_width,
            undefined,
            undefined,
            `rotate(${orientation * -90}, ${x}, ${y})`) // counter-clockwise rotation
        );
        // Draw the head
        result.add_a_line(new disp.Line(
            x - this._setting.T_tail_length/2,
            y - this._setting.T_head_width/2,
            x - this._setting.T_tail_length/2,
            y + this._setting.T_head_width/2,
            this._setting.TL_stroke_color,
            this._setting.TL_stroke_width,
            undefined,
            undefined,
            `rotate(${orientation * -90}, ${x}, ${y})`)
        );
        return result;
    }

    make_block_displays() {
        let trial_conditions = this._trial_conds.slice();  // make a copy
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
        this._block_data = result;
    }


}
