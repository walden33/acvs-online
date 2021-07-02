/**
 * The display generator for ACF task.
 * 
 * @author Walden Y. Li
 * @created 07/02/2021
 */
disp.ACFDisplayGenerator1 = class extends disp.ACFDisplayGenerator {


    constructor(n_trials, targ_sq_color, targ_cir_color, targ_diamond_color) {

        super();

        this._n_total_trials = n_trials;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._targ_diamond_color = targ_diamond_color;

        this._block_displays = this._make_block_displays(
            this._generate_trial_conditions()
        );

    }

    /**
     * Balanced variables within one block:
     * Non optimal target shape (0, 1, 2) max rep = 3
     */
    _generate_trial_conditions() {

        let result = [];

        (function assert() {
            if (this._n_total_trials % 3 !== 0) {
                throw Error("Total trial number must be a multiple of 3.")
            }
        }).bind(this)();

        let optColors = util.Util.generate_random_array([0, 1, 2], this._n_total_trials, 3);

        for (let i = 0; i < this._n_total_trials; i++) {
            let nonOptColor = optColors.pop();
            result[i] = [nonOptColor];
        }

        return result;

    }

    _make_trial_logic(nonOptTargShape) {
        return ({
            // Between-sub variables
            targ_sq_color: this._targ_sq_color,
            targ_cir_color: this._targ_cir_color,
            targ_diamond_color: this._targ_diamond_color,
            // Trial-specific variables
            nonOptTargShape: nonOptTargShape,
            optTarg1Shape: "N/A",    // in this version the two optimal target types are in equal number
            optTarg2Shape: "N/A"
        });
    }

    _make_trial_display(nonOptTargShape) {

        let result = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();
        let items = util.Util.range(this._n_total_items);
        util.Util.fisher_yates_shuffle(items);

        // Determine shape numbers in the display
        const n_targ_sq = nonOptTargShape === 0 ? this._n_non_opt_targ_targs :
            this._n_opt_targ_1_targs;
        const n_dist_sq = nonOptTargShape === 0 ? this._n_non_opt_targ_dist :
            this._n_opt_targ_1_dist;
        const n_targ_cir = nonOptTargShape === 1 ? this._n_non_opt_targ_targs :
            this._n_opt_targ_1_targs;
        const n_dist_cir = nonOptTargShape === 1 ? this._n_non_opt_targ_dist :
            this._n_opt_targ_1_dist;
        const n_targ_diamond = nonOptTargShape === 2 ? this._n_non_opt_targ_targs :
            this._n_opt_targ_1_targs;
        const n_dist_diamond = nonOptTargShape === 2 ? this._n_non_opt_targ_dist :
            this._n_opt_targ_1_dist;
        
        // 1. Add target squares
        for (let i = 0; i < n_targ_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
            // Add target shape
            result.add_a_rect(new disp.Rect(
                x - this._square_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._square_size / 2 + '',
                this._square_size,
                this._square_size,
                this._targ_sq_color,
                `targ_sq_${this._targ_sq_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size / 2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `targ_sq_${this._targ_sq_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 2. Add distractor squares
        for (let i = 0; i < n_dist_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
            result.add_a_rect(new disp.Rect(
                x - this._square_size / 2 + '',
                y - this._square_size / 2 + '',
                this._square_size,
                this._square_size,
                this._dist_sq_color,
                `dist_sq_${this._dist_sq_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size / 2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `dist_sq_${this._dist_sq_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 3. Add target circles
        for (let i = 0; i < n_targ_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
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
                x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size / 2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `targ_cir_${this._targ_cir_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 4. Add distractor circles
        for (let i = 0; i < n_dist_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
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
                x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size / 2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `dist_cir_${this._dist_cir_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        return result;

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


}
