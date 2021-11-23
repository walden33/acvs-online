/**
 * A display generator class for AC Mouse Cont.
 * 
 * @author Walden Y. Li
 * @version 1.1 (updated 11/18/2021)
 * 
 */
disp.ACMouseContDisplayGenerator1 = class extends disp.ACMouseContDisplayGenerator {

    constructor(num_trials, num_trials_to_slice = undefined, finalize = true) {
        super(num_trials, num_trials_to_slice);
        if (num_trials % 12 !== 0) {
            throw RangeError("Number of total block trials must be an " +
                "integer multiple of 12.");
        }
        if (num_trials_to_slice !== undefined && num_trials_to_slice > num_trials) {
            throw RangeError("Number of sliced trials must not exceed " +
                "number of total trials.");
        }
        // Set paradigm-specific settings
        this._colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 150, 0)"
        ];

        // Set square colors
        this._num_opt_targ = 1;
        this._num_non_opt_targ = 1;
        this._num_green_dist = 14;
        this._num_red_dist = 12;
        this._num_blue_dist = 12;
        this._num_var_dist = 14;    // variable distractor is either red or blue
        this._total = this._num_green_dist + this._num_red_dist + this._num_blue_dist +
            this._num_var_dist + this._num_opt_targ + this._num_non_opt_targ;

        // Set optimal / nonoptimal target appearing position in click sequence
        this._opt_targ_pos_min = 2;
        this._opt_targ_pos_max = 5;
        this._non_opt_targ_pos_min = 9;
        this._non_opt_targ_pos_max = 12;

        // Create block data according to trial conditions
        this._block_data = [];
        if (finalize) this.make_block_displays();
    }

    /**
     * 
     * @param {number} optTargColor : 0, 1
     * @param {number} nonOptTargColor : 0, 1
     */
    _make_trial_display(optTargColor, nonOptTargColor, opt_targ_pos,
        non_opt_targ_pos) {
        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y;
        const sz = this._setting.square_size;

        const fixation = new disp.DisplayDataset();
        const stimuli = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();
        const grids = util.Util.range(this._total);
        util.Util.fisher_yates_shuffle(grids);
        const optTargGrids = [], nonOptTargGrids = [];
        for (let i = 0; i < this._num_opt_targ; i++) {
            optTargGrids.push(grids.pop());
        }
        for (let i = 0; i < this._num_non_opt_targ; i++) {
            nonOptTargGrids.push(grids.pop());
        }

        // 1. Add targets
        // 1.1 Optimal targets
        optTargGrids.forEach(e => {
            const gridIndex = e + 1;  // In the gridPos map the index starts at 1
            const grid = gridPos.get(gridIndex);
            // 1.1.1 Add target rects
            stimuli.add_a_rect(
                new disp.Rect(
                    `${grid.rect_x}`,
                    `${grid.rect_y}`,
                    `${sz}`,
                    `${sz}`,
                    `${this._colors[optTargColor]}`,
                    "opt_targ_square",
                    `opt_targ_square_${gridIndex}`
                )
            );
            // 1.1.2 Add target digits
            stimuli.add_a_text(
                new disp.Text(
                    `${util.Util.gen_random_int(2, 5, true)}`,
                    `${grid.x + this._setting.digit_shift_x}`,
                    `${grid.y + this._setting.digit_shift_y}`,
                    `${this._setting.digit_color}`,
                    `${this._setting.digit_size}`,
                    `${this._setting.digit_font}`,
                    "acvs-digit",
                    `digit_${gridIndex}`
                )
            )
            // 1.1.3 Add target superimposed transparent circle
            stimuli.add_a_circle(
                new disp.Circle(
                    `${grid.x}`,
                    `${grid.y}`,
                    `${sz}`,
                    "transparent",
                    "transparent",
                    "0",
                    "opt_targ_circle_field",
                    `opt_targ_circle_field_${gridIndex}`
                )
            )
        });
        // 1.2 Non-Optimal targets
        nonOptTargGrids.forEach(e => {
            const gridIndex = e + 1;  // In the gridPos map the index starts at 1
            const grid = gridPos.get(gridIndex);
            // 1.2.1 Add target rects
            stimuli.add_a_rect(
                new disp.Rect(
                    `${grid.rect_x}`,
                    `${grid.rect_y}`,
                    `${sz}`,
                    `${sz}`,
                    `${this._colors[nonOptTargColor]}`,
                    "non_opt_targ_square",
                    `non_opt_targ_square_${gridIndex}`
                )
            );
            // 1.2.2 Add target digits
            stimuli.add_a_text(
                new disp.Text(
                    `${util.Util.gen_random_int(2, 5, true)}`,
                    `${grid.x + this._setting.digit_shift_x}`,
                    `${grid.y + this._setting.digit_shift_y}`,
                    `${this._setting.digit_color}`,
                    `${this._setting.digit_size}`,
                    `${this._setting.digit_font}`,
                    "acvs-digit",
                    `digit_${gridIndex}`
                )
            )
            // 1.2.3 Add target superimposed transparent circle
            stimuli.add_a_circle(
                new disp.Circle(
                    `${grid.x}`,
                    `${grid.y}`,
                    `${sz}`,
                    "transparent",
                    "transparent",
                    "0",
                    "non_opt_targ_circle_field",
                    `non_opt_targ_circle_field_${gridIndex}`
                )
            )
        });

        // 2. Add green distractors
        for (let i = 0; i < this._num_green_dist; i++) {
            const gridIndex = grids.pop() + 1;
            const grid = gridPos.get(gridIndex);
            // 2.1 Add square rects
            stimuli.add_a_rect(
                new disp.Rect(
                    `${grid.rect_x}`,
                    `${grid.rect_y}`,
                    `${sz}`,
                    `${sz}`,
                    `${this._colors[2]}`,
                    "green_dist_square",
                    `green_dist_square_${gridIndex}`
                )
            );
            // 2.2 Add digits
            stimuli.add_a_text(
                new disp.Text(
                    `${util.Util.gen_random_int(6, 9, true)}`,
                    `${grid.x + this._setting.digit_shift_x}`,
                    `${grid.y + this._setting.digit_shift_y}`,
                    `${this._setting.digit_color}`,
                    `${this._setting.digit_size}`,
                    `${this._setting.digit_font}`,
                    "acvs-digit",
                    `digit_${gridIndex}`
                )
            )
            // 2.3 Add superimposed transparent circle
            stimuli.add_a_circle(
                new disp.Circle(
                    `${grid.x}`,
                    `${grid.y}`,
                    `${sz}`,
                    "transparent",
                    "transparent",
                    "0",
                    "green_dist_circle_field",
                    `green_dist_circle_field_${gridIndex}`
                )
            )
        }

        // 3. Add red distractors
        for (let i = 0; i < this._num_red_dist; i++) {
            const gridIndex = grids.pop() + 1;
            const grid = gridPos.get(gridIndex);
            // 3.1 Add square rects
            stimuli.add_a_rect(
                new disp.Rect(
                    `${grid.rect_x}`,
                    `${grid.rect_y}`,
                    `${sz}`,
                    `${sz}`,
                    `${this._colors[0]}`,
                    "red_dist_square",
                    `red_dist_square_${gridIndex}`
                )
            );
            // 3.2 Add digits
            stimuli.add_a_text(
                new disp.Text(
                    `${util.Util.gen_random_int(6, 9, true)}`,
                    `${grid.x + this._setting.digit_shift_x}`,
                    `${grid.y + this._setting.digit_shift_y}`,
                    `${this._setting.digit_color}`,
                    `${this._setting.digit_size}`,
                    `${this._setting.digit_font}`,
                    "acvs-digit",
                    `digit_${gridIndex}`
                )
            )
            // 3.3 Add superimposed transparent circle
            stimuli.add_a_circle(
                new disp.Circle(
                    `${grid.x}`,
                    `${grid.y}`,
                    `${sz}`,
                    "transparent",
                    "transparent",
                    "0",
                    "red_dist_circle_field",
                    `red_dist_circle_field_${gridIndex}`
                )
            )
        }

        // 4. Add blue distractors
        for (let i = 0; i < this._num_blue_dist; i++) {
            const gridIndex = grids.pop() + 1;
            const grid = gridPos.get(gridIndex);
            // 4.1 Add square rects
            stimuli.add_a_rect(
                new disp.Rect(
                    `${grid.rect_x}`,
                    `${grid.rect_y}`,
                    `${sz}`,
                    `${sz}`,
                    `${this._colors[1]}`,
                    "blue_dist_square",
                    `blue_dist_square_${gridIndex}`
                )
            );
            // 4.2 Add digits
            stimuli.add_a_text(
                new disp.Text(
                    `${util.Util.gen_random_int(6, 9, true)}`,
                    `${grid.x + this._setting.digit_shift_x}`,
                    `${grid.y + this._setting.digit_shift_y}`,
                    `${this._setting.digit_color}`,
                    `${this._setting.digit_size}`,
                    `${this._setting.digit_font}`,
                    "acvs-digit",
                    `digit_${gridIndex}`
                )
            )
            // 4.3 Add superimposed transparent circle
            stimuli.add_a_circle(
                new disp.Circle(
                    `${grid.x}`,
                    `${grid.y}`,
                    `${sz}`,
                    "transparent",
                    "transparent",
                    "0",
                    "blue_dist_circle_field",
                    `blue_dist_circle_field_${gridIndex}`
                )
            )
        }

        // 5. Add variable distractors
        // The optimal target in this paradigm is actually the larger subset,
        // so variable distractors should be the color of optimal targets
        for (let i = 0; i < this._num_var_dist; i++) {
            const gridIndex = grids.pop() + 1;
            const grid = gridPos.get(gridIndex);
            // 5.1 Add square rects
            stimuli.add_a_rect(
                new disp.Rect(
                    `${grid.rect_x}`,
                    `${grid.rect_y}`,
                    `${sz}`,
                    `${sz}`,
                    `${this._colors[optTargColor]}`,
                    "red_dist_square",
                    `red_dist_square_${gridIndex}`
                )
            );
            // 5.2 Add digits
            stimuli.add_a_text(
                new disp.Text(
                    `${util.Util.gen_random_int(6, 9, true)}`,
                    `${grid.x + this._setting.digit_shift_x}`,
                    `${grid.y + this._setting.digit_shift_y}`,
                    `${this._setting.digit_color}`,
                    `${this._setting.digit_size}`,
                    `${this._setting.digit_font}`,
                    "acvs-digit",
                    `digit_${gridIndex}`
                )
            )
            // 5.3 Add superimposed transparent circle
            stimuli.add_a_circle(
                new disp.Circle(
                    `${grid.x}`,
                    `${grid.y}`,
                    `${sz}`,
                    "transparent",
                    "transparent",
                    "0",
                    `${optTargColor === 0 ? "red" : "blue"}_dist_circle_field`,
                    `${optTargColor === 0 ? "red" : "blue"}_dist_circle_field_${gridIndex}`
                )
            )
        }

        // Finally, generate a fixation cross to everything
        const fixation_text = new disp.Text(
            '+', x, y, 'white', 3, null, this._setting.fixation_cross_class_name
        );

        fixation.add_a_text(fixation_text);
        stimuli.add_a_text(fixation_text);

        return {
            cue: [fixation],
            stimuli: [stimuli]
        }

    }

    _generate_trial_conditions() {

        let result = [];

        // Generate optimal target colors
        const optColors = util.Util.generate_random_array([0, 1], this._num_total_trials, 6);

        // Add everything to the output
        for (let i = 0; i < this._num_total_trials; i++) {
            const optColor = optColors.pop();
            const nonOptColor = optColor === 1 ? 0 : 1;
            // Generate optimal target position in a sequence
            const optPos = util.Util.gen_random_int(this._opt_targ_pos_min, this._opt_targ_pos_max, true);
            // Generate nonoptimal target position in a sequence
            const nonOptPos = util.Util.gen_random_int(this._non_opt_targ_pos_min, this._non_opt_targ_pos_max, true);
            result[i] = [optColor, nonOptColor, optPos, nonOptPos];
        }
        return result;

    }

    _make_trial_logic(optTargColor, nonOptTargColor, optTargGridIndex,
        nonOptTargGridIndex) {
        return (
            {
                optTargColor: optTargColor,
                nonOptTargColor: nonOptTargColor,
                optTargGridIndex: optTargGridIndex,
                nonOptTargGridIndex: nonOptTargGridIndex,
            }
        );
    }

    make_block_displays() {
        const trialConds = this._generate_trial_conditions();
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
        this._block_data = result;
    }

}
