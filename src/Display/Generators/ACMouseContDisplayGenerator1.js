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
        if (num_trials % 2 !== 0) {
            throw RangeError("Number of total block trials must be even");
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

        // Target digits
        this._targ_digit = 5;

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
        this._opt_targ_pos_min = 4;
        this._opt_targ_pos_max = 7;
        this._non_opt_targ_pos_min = 10;
        this._non_opt_targ_pos_max = 13;

        // Create block data according to trial conditions
        this._block_data = [];
        if (finalize) this.make_block_displays();
    }

    /**
     * 
     * @param {number} optTargColor : 0, 1
     */
    _make_trial_display(optTargColor) {
        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y;
        const sz = this._setting.square_size;

        const fixation = new disp.DisplayDataset();
        const stimuli = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();
        const grids = util.Util.range(this._total);
        util.Util.fisher_yates_shuffle(grids);

        // // 1. Add targets
        // // 1.1 Optimal targets
        // optTargGrids.forEach(e => {
        //     const gridIndex = e + 1;  // In the gridPos map the index starts at 1
        //     const grid = gridPos.get(gridIndex);
        //     // 1.1.1 Add target rects
        //     stimuli.add_a_rect(
        //         new disp.Rect(
        //             `${grid.rect_x}`,
        //             `${grid.rect_y}`,
        //             `${sz}`,
        //             `${sz}`,
        //             `${this._colors[optTargColor]}`,
        //             "opt_targ_square",
        //             `opt_targ_square_${gridIndex}`
        //         )
        //     );
        //     // 1.1.2 Add target digits
        //     stimuli.add_a_text(
        //         new disp.Text(
        //             `${util.Util.gen_random_int(2, 5, true)}`,
        //             `${grid.x + this._setting.digit_shift_x}`,
        //             `${grid.y + this._setting.digit_shift_y}`,
        //             `${this._setting.digit_color}`,
        //             `${this._setting.digit_size}`,
        //             `${this._setting.digit_font}`,
        //             "acvs-digit",
        //             `digit_${gridIndex}`
        //         )
        //     )
        //     // 1.1.3 Add target superimposed transparent circle
        //     stimuli.add_a_circle(
        //         new disp.Circle(
        //             `${grid.x}`,
        //             `${grid.y}`,
        //             `${sz}`,
        //             "transparent",
        //             "transparent",
        //             "0",
        //             "opt_targ_circle_field",
        //             `opt_targ_circle_field_${gridIndex}`
        //         )
        //     )
        // });
        // // 1.2 Non-Optimal targets
        // nonOptTargGrids.forEach(e => {
        //     const gridIndex = e + 1;  // In the gridPos map the index starts at 1
        //     const grid = gridPos.get(gridIndex);
        //     // 1.2.1 Add target rects
        //     stimuli.add_a_rect(
        //         new disp.Rect(
        //             `${grid.rect_x}`,
        //             `${grid.rect_y}`,
        //             `${sz}`,
        //             `${sz}`,
        //             `${this._colors[nonOptTargColor]}`,
        //             "non_opt_targ_square",
        //             `non_opt_targ_square_${gridIndex}`
        //         )
        //     );
        //     // 1.2.2 Add target digits
        //     stimuli.add_a_text(
        //         new disp.Text(
        //             `${util.Util.gen_random_int(2, 5, true)}`,
        //             `${grid.x + this._setting.digit_shift_x}`,
        //             `${grid.y + this._setting.digit_shift_y}`,
        //             `${this._setting.digit_color}`,
        //             `${this._setting.digit_size}`,
        //             `${this._setting.digit_font}`,
        //             "acvs-digit",
        //             `digit_${gridIndex}`
        //         )
        //     )
        //     // 1.2.3 Add target superimposed transparent circle
        //     stimuli.add_a_circle(
        //         new disp.Circle(
        //             `${grid.x}`,
        //             `${grid.y}`,
        //             `${sz}`,
        //             "transparent",
        //             "transparent",
        //             "0",
        //             "non_opt_targ_circle_field",
        //             `non_opt_targ_circle_field_${gridIndex}`
        //         )
        //     )
        // });

        // // 2. Add green distractors
        // for (let i = 0; i < this._num_green_dist; i++) {
        //     const gridIndex = grids.pop() + 1;
        //     const grid = gridPos.get(gridIndex);
        //     // 2.1 Add square rects
        //     stimuli.add_a_rect(
        //         new disp.Rect(
        //             `${grid.rect_x}`,
        //             `${grid.rect_y}`,
        //             `${sz}`,
        //             `${sz}`,
        //             `${this._colors[2]}`,
        //             "green_dist_square",
        //             `green_dist_square_${gridIndex}`
        //         )
        //     );
        //     // 2.2 Add digits
        //     stimuli.add_a_text(
        //         new disp.Text(
        //             `${util.Util.gen_random_int(6, 9, true)}`,
        //             `${grid.x + this._setting.digit_shift_x}`,
        //             `${grid.y + this._setting.digit_shift_y}`,
        //             `${this._setting.digit_color}`,
        //             `${this._setting.digit_size}`,
        //             `${this._setting.digit_font}`,
        //             "acvs-digit",
        //             `digit_${gridIndex}`
        //         )
        //     )
        //     // 2.3 Add superimposed transparent circle
        //     stimuli.add_a_circle(
        //         new disp.Circle(
        //             `${grid.x}`,
        //             `${grid.y}`,
        //             `${sz}`,
        //             "transparent",
        //             "transparent",
        //             "0",
        //             "green_dist_circle_field",
        //             `green_dist_circle_field_${gridIndex}`
        //         )
        //     )
        // }

        // // 3. Add red distractors
        // for (let i = 0; i < this._num_red_dist; i++) {
        //     const gridIndex = grids.pop() + 1;
        //     const grid = gridPos.get(gridIndex);
        //     // 3.1 Add square rects
        //     stimuli.add_a_rect(
        //         new disp.Rect(
        //             `${grid.rect_x}`,
        //             `${grid.rect_y}`,
        //             `${sz}`,
        //             `${sz}`,
        //             `${this._colors[0]}`,
        //             "red_dist_square",
        //             `red_dist_square_${gridIndex}`
        //         )
        //     );
        //     // 3.2 Add digits
        //     stimuli.add_a_text(
        //         new disp.Text(
        //             `${util.Util.gen_random_int(6, 9, true)}`,
        //             `${grid.x + this._setting.digit_shift_x}`,
        //             `${grid.y + this._setting.digit_shift_y}`,
        //             `${this._setting.digit_color}`,
        //             `${this._setting.digit_size}`,
        //             `${this._setting.digit_font}`,
        //             "acvs-digit",
        //             `digit_${gridIndex}`
        //         )
        //     )
        //     // 3.3 Add superimposed transparent circle
        //     stimuli.add_a_circle(
        //         new disp.Circle(
        //             `${grid.x}`,
        //             `${grid.y}`,
        //             `${sz}`,
        //             "transparent",
        //             "transparent",
        //             "0",
        //             "red_dist_circle_field",
        //             `red_dist_circle_field_${gridIndex}`
        //         )
        //     )
        // }

        // // 4. Add blue distractors
        // for (let i = 0; i < this._num_blue_dist; i++) {
        //     const gridIndex = grids.pop() + 1;
        //     const grid = gridPos.get(gridIndex);
        //     // 4.1 Add square rects
        //     stimuli.add_a_rect(
        //         new disp.Rect(
        //             `${grid.rect_x}`,
        //             `${grid.rect_y}`,
        //             `${sz}`,
        //             `${sz}`,
        //             `${this._colors[1]}`,
        //             "blue_dist_square",
        //             `blue_dist_square_${gridIndex}`
        //         )
        //     );
        //     // 4.2 Add digits
        //     stimuli.add_a_text(
        //         new disp.Text(
        //             `${util.Util.gen_random_int(6, 9, true)}`,
        //             `${grid.x + this._setting.digit_shift_x}`,
        //             `${grid.y + this._setting.digit_shift_y}`,
        //             `${this._setting.digit_color}`,
        //             `${this._setting.digit_size}`,
        //             `${this._setting.digit_font}`,
        //             "acvs-digit",
        //             `digit_${gridIndex}`
        //         )
        //     )
        //     // 4.3 Add superimposed transparent circle
        //     stimuli.add_a_circle(
        //         new disp.Circle(
        //             `${grid.x}`,
        //             `${grid.y}`,
        //             `${sz}`,
        //             "transparent",
        //             "transparent",
        //             "0",
        //             "blue_dist_circle_field",
        //             `blue_dist_circle_field_${gridIndex}`
        //         )
        //     )
        // }

        // // 5. Add variable distractors
        // // The optimal target in this paradigm is actually the larger subset,
        // // so variable distractors should be the color of optimal targets
        // for (let i = 0; i < this._num_var_dist; i++) {
        //     const gridIndex = grids.pop() + 1;
        //     const grid = gridPos.get(gridIndex);
        //     // 5.1 Add square rects
        //     stimuli.add_a_rect(
        //         new disp.Rect(
        //             `${grid.rect_x}`,
        //             `${grid.rect_y}`,
        //             `${sz}`,
        //             `${sz}`,
        //             `${this._colors[optTargColor]}`,
        //             "red_dist_square",
        //             `red_dist_square_${gridIndex}`
        //         )
        //     );
        //     // 5.2 Add digits
        //     stimuli.add_a_text(
        //         new disp.Text(
        //             `${util.Util.gen_random_int(6, 9, true)}`,
        //             `${grid.x + this._setting.digit_shift_x}`,
        //             `${grid.y + this._setting.digit_shift_y}`,
        //             `${this._setting.digit_color}`,
        //             `${this._setting.digit_size}`,
        //             `${this._setting.digit_font}`,
        //             "acvs-digit",
        //             `digit_${gridIndex}`
        //         )
        //     )
        //     // 5.3 Add superimposed transparent circle
        //     stimuli.add_a_circle(
        //         new disp.Circle(
        //             `${grid.x}`,
        //             `${grid.y}`,
        //             `${sz}`,
        //             "transparent",
        //             "transparent",
        //             "0",
        //             `${optTargColor === 0 ? "red" : "blue"}_dist_circle_field`,
        //             `${optTargColor === 0 ? "red" : "blue"}_dist_circle_field_${gridIndex}`
        //         )
        //     )
        // }

        // 1. Calculate number of squares for each color
        let num_red = this._num_red_dist;
        let num_blue = this._num_blue_dist;
        const num_green = this._num_green_dist;
        if (optTargColor === 0) {
            num_red += this._num_opt_targ + this._num_var_dist;
            num_blue += this._num_non_opt_targ;
        } else {
            num_red += this._num_non_opt_targ;
            num_blue += this._num_opt_targ + this._num_var_dist;
        }

        // 2. Add stimuli
        const num_rects = [num_red, num_blue, num_green];
        let class_names = [];
        if (optTargColor === 0) {
            class_names = ["opt", "nonopt", "dist"];
        } else {
            class_names = ["nonopt", "opt", "dist"];
        }
        ["red", "blue", "green"].forEach((color, i) => {
            for (let j = 0; j < num_rects[i]; j++) {
                const gridIndex = grids.pop() + 1;
                const grid = gridPos.get(gridIndex);
                stimuli.add_a_rect(
                    new disp.Rect(
                        `${grid.rect_x}`,
                        `${grid.rect_y}`,
                        `${sz}`,
                        `${sz}`,
                        color,
                        `${color}_square_${class_names[i]}`,
                        `${color}_square_${class_names[i]}_${gridIndex}`
                    )
                );
                stimuli.add_a_circle(
                    new disp.Circle(
                        `${grid.x}`,
                        `${grid.y}`,
                        `${sz}`,
                        "transparent",
                        "transparent",
                        "0",
                        `${color}_circlefield_${class_names[i]}`,
                        `${color}_circlefield_${class_names[i]}_${gridIndex}`
                    )
                )
                // Placeholder digits
                // If color is green, digits can be 5
                const digit = color === 2 ?
                    `${util.Util.choose_from(util.Util.range(10))}` :
                    `${util.Util.choose_from(util.Util.range(10), [this._targ_digit])}`;
                stimuli.add_a_text(
                    new disp.Text(
                        digit,
                        `${grid.x + this._setting.digit_shift_x}`,
                        `${grid.y + this._setting.digit_shift_y}`,
                        `${this._setting.digit_color}`,
                        `${this._setting.digit_size}`,
                        `${this._setting.digit_font}`,
                        "acvs-digit",
                        `${color}_text_${class_names[i]}_${gridIndex}`
                    )
                )
            }
        });

        // Finally, generate a fixation cross to everything
        const fixation_text = new disp.Text(
            '+', x, y, 'white', 3, null, this._setting.fixation_cross_class_name
        );

        fixation.add_a_text(fixation_text);
        stimuli.add_a_text(fixation_text);

        return stimuli;

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

    _make_trial_logic(optTargColor, nonOptTargColor, optTargPos, nonOptTargPos) {
        return (
            {
                optTargColor: optTargColor,
                nonOptTargColor: nonOptTargColor,
                optTargPos: optTargPos,
                nonOptTargPos: nonOptTargPos,
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
            let currentTrialDisplay = this._make_trial_display(...currentTrialCond);
            let currentTrialLogic = this._make_trial_logic(...currentTrialCond);
            result.push(
                {
                    "logic": currentTrialLogic,
                    "stimuli": currentTrialDisplay
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
