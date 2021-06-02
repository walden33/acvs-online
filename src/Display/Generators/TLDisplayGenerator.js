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
        this._setting.TL_stroke_width = 0.5;
        this._setting.TL_stroke_color = "white";
        this._setting.T_tail_length = 4;
        this._setting.T_head_width = 2;
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
     * @param {number} nonOptOri : same as above
     * @param {number} optTargColor : 0 - 1 for red and blue
     * @param {number} nonOptTargColor : 0 - 1 for red and blue
     */
    _make_trial_display(optTargEcc, nonOptTargEcc, optTargOri,
        nonOptOri, optTargColor, nonOptTargColor) {
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
        const targ = this._generate_T_shape(optTargGrid.x, optTargGrid.y, 4, 2, 0);
        stimuli.merge(targ);

        // 2. Add GREEN distractor rects and digits. They can be of any digit.
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
            `rotate(${orientation * 90}, ${x}, ${y})`)
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
            `rotate(${orientation * 90}, ${x}, ${y})`)
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



    static generate_one_display(optTargColor) {
        // Generate return object
        let stimuli = new disp.DisplayDataset();
        // Set display parameters
        const setting = new disp.DisplaySetting();
        const sz = setting.square_size;
        const x = setting.screen_center_x;
        const y = setting.screen_center_y;
        const digit_shift_x = setting.digit_shift_x;
        const digit_shift_y = setting.digit_shift_y;
        const digit_color = setting.digit_color;
        const digit_size = setting.digit_size;
        const digit_class_name = setting.digit_class_name;
        const fixation_cross_class_name = setting.fixation_cross_class_name;
        const colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 150, 0)"
        ];
        const target_digits = [2, 3, 4, 5];
        const distractor_digits = [6, 7, 8, 9];
        // Set square numbers (1+1+14+12+12+14=54)
        const num_green_dist = 14;
        const num_red_dist = 12;
        const num_blue_dist = 12;
        const num_var_dist = 14;    // variable distractor is either red or blue
        // Determine target digits
        const optTargDigit = util.Util.choose_from([2,3,4,5]);
        const nonOptTargDigit = util.Util.choose_from([2,3,4,5], optTargDigit);
        // Call static method to get grid positions map
        const gridPos = disp.DisplayGenerator.get_grid_pos();
        // Push all grid info in an array and shuffle
        let gridPool = util.Util.range(54);
        util.Util.fisher_yates_shuffle(gridPool);
        // 1. Add two targets
        let optTargGrid = gridPos.get(gridPool.pop() + 1);
        let nonOptTargGrid = gridPos.get(gridPool.pop() + 1);
        // 1.1 Add rects
        let optRect = new disp.Rect(
            optTargGrid.rect_x + '',
            optTargGrid.rect_y + '',
            sz + '',
            sz + '',
            colors[optTargColor]
        );
        let nonOptRect = new disp.Rect(
            nonOptTargGrid.rect_x + '',
            nonOptTargGrid.rect_y + '',
            sz + '',
            sz + '',
            colors[optTargColor === 0 ? 1 : 0]
        );
        stimuli.add_rects([optRect, nonOptRect]);
        // 1.2 Add digits
        stimuli.add_a_text(new disp.Text(
            optTargDigit + '',
            optTargGrid.x + digit_shift_x + '',
            optTargGrid.y + digit_shift_y + '',
            digit_color,
            digit_size,
            digit_class_name
        ));
        stimuli.add_a_text(new disp.Text(
            nonOptTargDigit + '',
            nonOptTargGrid.x + digit_shift_x + '',
            nonOptTargGrid.y + digit_shift_y + '',
            digit_color,
            digit_size,
            digit_class_name
        ));

        // 2. Add GREEN distractor rects and digits
        for (let i = 0; i < num_green_dist; i++) {

            let grid = gridPos.get(gridPool.pop() + 1);

            // 2.1 add rects
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                colors[2]
            );
            stimuli.add_a_rect(currentRect);

            // 2.2 add digits
            stimuli.add_a_text(new disp.Text(
                util.Util.choose_from(target_digits.concat(distractor_digits)) + '',
                grid.x + digit_shift_x + '',
                grid.y + digit_shift_y + '',
                digit_color,
                digit_size,
                digit_class_name
            ));
        }

        // 3. Add RED distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < num_red_dist; i++) {

            let grid = gridPos.get(gridPool.pop() + 1);

            // 3.1 add rects
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                colors[0]
            );
            stimuli.add_a_rect(currentRect);

            // 3.2 add digits
            stimuli.add_a_text(new disp.Text(
                util.Util.choose_from(distractor_digits) + '',
                grid.x + digit_shift_x + '',
                grid.y + digit_shift_y + '',
                digit_color,
                digit_size,
                digit_class_name
            ));
        }

        // 4. Add BLUE distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < num_blue_dist; i++) {

            let grid = gridPos.get(gridPool.pop() + 1);

            // 4.1 add rects
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                colors[1]
            );
            stimuli.add_a_rect(currentRect);

            // 4.2 add digits
            stimuli.add_a_text(new disp.Text(
                util.Util.choose_from(distractor_digits) + '',
                grid.x + digit_shift_x + '',
                grid.y + digit_shift_y + '',
                digit_color,
                digit_size,
                digit_class_name
            ));
        }

        // 5. Add variable distractor rects and digits
        for (let i = 0; i < num_var_dist; i++) {

            let grid = gridPos.get(gridPool.pop() + 1);

            // 5.1 add rects
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                // if opt targ color is RED, var dist color should be blue, and vice versa
                optTargColor === 0 ? colors[1] : colors[0]
            );
            stimuli.add_a_rect(currentRect);

            // 5.2 add digits
            stimuli.add_a_text(new disp.Text(
                util.Util.choose_from(distractor_digits) + '',
                grid.x + digit_shift_x + '',
                grid.y + digit_shift_y + '',
                digit_color,
                digit_size,
                digit_class_name
            ));
        }

        // Finally, generate a fixation cross to everything
        const fixation_text = new disp.Text(
            '+', x, y, 'white', 3, fixation_cross_class_name
        );

        stimuli.add_a_text(fixation_text);
        
        return stimuli;
    }

}
