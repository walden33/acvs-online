/**
 * The display generator class for a combined strategy task based on unequal
 * subsets of targets and mouse click foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (06/29/2021)
 * 
 * @update 1.2 (06/30/2021) added trial logic maker
 * 
 */
disp.MCFDisplayGenerator2 = class extends disp.MCFDisplayGenerator {

    /**
     * 
     * @param {number} n_trials 
     * @param {string} targ_sq_color 
     * @param {string} targ_cir_color 
     */
    constructor(n_trials, targ_sq_color, targ_cir_color) {

        super();

        if (n_trials % 2 !== 0) {
            throw RangeError( "Number of total block trials must be an " +
            "integer multiple of 2.");
        }

        // Generator parameters
        this._n_total_trials = n_trials;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._dist_sq_color = targ_cir_color;
        this._dist_cir_color = targ_sq_color;

        // An array of displays in the block this generator is responsible for
        this._block_displays = this._make_block_displays(
            this._generate_trial_conditions()
        );

    }

    /**
     * Returns an array of trial condition arrays in a block.
     * This version of MCF will need to counterbalance the optimal target color
     * of the display. For example, in the task where targets are red squares
     * and green circles, there should be half of the trials where the display
     * contains more green squares than red circles (red optimal) and the other
     * half of the trials where it contains more red cirlces than green squares
     * (green optimal).
     * 
     * Note: Color code meaning: 0 = the color of target squares; 1 = the color
     * of target circes. Different between-subject conditions (red squares +
     * green circles vs. green squares + red circles) will affect the meaning
     * of 0 and 1 for optimal/non-optimal color.
     */
    _generate_trial_conditions() {

        let result = [];

        let optColors = util.Util.generate_random_array([0, 1], this._n_total_trials, 3);
        
        for(let i = 0; i < this._n_total_trials; i++) {
            let optColor = optColors.pop();
            let nonOptColor = optColor === 1 ? 0 : 1;
            result[i] = [optColor, nonOptColor];
        }

        return result;

    }

    _make_trial_logic(optTargColor, nonOptTargColor) {
        return ({
            targ_sq_color: this._targ_sq_color,
            targ_cir_color: this._targ_cir_color,
            optTargColor: optTargColor,
            nonOptTargColor: nonOptTargColor
        });
    }

    _make_block_displays(trial_conds) {
        let result = [];
        for (let i = 0; i < this._n_total_trials; i++) {
            let trial_cond = trial_conds.pop(); // [optTargColor, nonOptTargColor]
            result.push({
                "logic": this._make_trial_logic(...trial_cond),
                "stimuli": this._make_trial_display(trial_cond[0])
            });
        }
        return result;
    }

    _make_trial_display(opt_targ_color) {

        console.log(opt_targ_color)

        let result = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();
        let items = util.Util.range(this._n_total_items);
        util.Util.fisher_yates_shuffle(items);

        // Determine distractor items
        if (opt_targ_color === 0) {
            // If optimal target color is the same as target square color,
            // i.e., there should be less distractor circles and more distractor
            // squares
            // @override
            this._n_dist_sq = 35;
            this._n_dist_cir = 5;
        } else if (opt_targ_color === 1) {
            // If optimal target color is the same as target cirlce color,
            // i.e., there should be less distractor squares and more distractor
            // circles
            // @override
            this._n_dist_sq = 5;
            this._n_dist_cir = 35;
        }

        // 1. Add target squares
        for (let i = 0; i < this._n_targ_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            // Add target shape
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._targ_sq_color,
                `targ_sq_${this._targ_sq_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `targ_sq_${this._targ_sq_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 2. Add distractor squares
        for (let i = 0; i < this._n_dist_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._dist_sq_color,
                `dist_sq_${this._dist_sq_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `dist_sq_${this._dist_sq_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 3. Add target circles
        for (let i = 0; i < this._n_targ_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_circle(new disp.Circle(
                x + '',
                y + '',
                this._circle_radius,
                this._targ_cir_color,
                this._targ_cir_color,
                null,
                `targ_cir_${this._targ_cir_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `targ_cir_${this._targ_cir_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 4. Add distractor circles
        for (let i = 0; i < this._n_dist_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_circle(new disp.Circle(
                x + '',
                y + '',
                this._circle_radius,
                this._dist_cir_color,
                this._dist_cir_color,
                null,
                `dist_cir_${this._dist_cir_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `dist_cir_${this._dist_cir_color}`,
                `pos_${grid_no}_bg`
            ));
        }        

        return result;
    }

}
