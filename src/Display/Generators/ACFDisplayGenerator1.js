/**
 * The display generator for ACF task.
 * 
 * @author Walden Y. Li
 * @created 07/02/2021
 */
disp.ACFDisplayGenerator1 = class extends disp.ACFDisplayGenerator {

    /**
     * 
     * @param {number} n_trials 
     * @param {number} targ_sq_color target square color (exact value or alias)
     * @param {number} targ_cir_color target circle color (exact value or alias)
     * @param {number} targ_diamond_color target diamond color (exact value or alias)
     */
    constructor(n_trials, targ_sq_color, targ_cir_color, targ_diamond_color) {

        super();

        this._n_total_trials = n_trials;
        this._targ_sq_color = this._get_color_value(targ_sq_color);
        this._targ_cir_color = this._get_color_value(targ_cir_color);
        this._targ_diamond_color = this._get_color_value(targ_diamond_color);

        // this._block_displays = this._make_block_displays(
        //     this._generate_trial_conditions()
        // );

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

        // Determine number of each item type in the display
        // this._set_item_count(this._targ_sq_color, "square", this._n_opt_color_1_targ);
        // this._set_item_count(this._targ_cir_color, "circle", this._n_opt_color_2_targ);
        // this._set_item_count(this._targ_diamond_color, "diamond", this._n_non_opt_color_targ);
        this._set_item_count(this._targ_sq_color, "square", 25);
        this._set_item_count(this._targ_cir_color, "circle", 25);
        this._set_item_count(this._targ_diamond_color, "diamond", 50);

        
        // 1. Add squares
        this._colors.forEach( (function add_squares(color) {

            for (let i = 0; i < this._get_item_count(color, "square"); i++) {
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
                    this._get_color_value(color),
                    this._colors_are_equal(color, this._targ_sq_color) ?
                        `targ_sq_${this._get_color_alias(color)}` :
                        `dist_sq_${this._get_color_alias(color)}`,
                    `pos_${grid_no}`
                ));
                // Add transparent ground shapes
                result.add_a_rect(new disp.Rect(
                    x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._background_rect_size / 2 + '',
                    this._background_rect_size,
                    this._background_rect_size,
                    "transparent",
                    this._colors_are_equal(color, this._targ_sq_color) ?
                        `targ_sq_${this._get_color_alias(color)}` :
                        `dist_sq_${this._get_color_alias(color)}`,
                    `pos_${grid_no}_bg`
                ));
            }

        }).bind(this) );

        // 2. Add circles
        this._colors.forEach( (function add_circles(color) {

            for (let i = 0; i < this._get_item_count(color, "circle"); i++) {
                // Get grid info
                let grid_no = items.pop();
                let grid = gridPos.get(grid_no);
                // Set coordinates with a random jitter
                let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
                let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
                // Add target shape
                result.add_a_circle(new disp.Circle(
                    x + '',
                    y + '',
                    this._circle_radius,
                    this._get_color_value(color),
                    this._get_color_value(color),
                    null,
                    this._colors_are_equal(color, this._targ_cir_color) ?
                        `targ_cir_${this._get_color_alias(color)}` :
                        `dist_cir_${this._get_color_alias(color)}`,
                    `pos_${grid_no}`
                ));
                // Add transparent ground shapes
                result.add_a_rect(new disp.Rect(
                    x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._background_rect_size / 2 + '',
                    this._background_rect_size,
                    this._background_rect_size,
                    "transparent",
                    this._colors_are_equal(color, this._targ_cir_color) ?
                        `targ_cir_${this._get_color_alias(color)}` :
                        `dist_cir_${this._get_color_alias(color)}`,
                    `pos_${grid_no}_bg`
                ));
            }

        }).bind(this) );

        // 3. Add diamonds
        this._colors.forEach( (function add_diamonds(color) {

            for (let i = 0; i < this._get_item_count(color, "diamond"); i++) {
                // Get grid info
                let grid_no = items.pop();
                let grid = gridPos.get(grid_no);
                // Set coordinates with a random jitter
                let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
                let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
                // Generate polygon
                const poly = this._make_a_diamond(
                    x,
                    y,
                    this._diamond_main_axis_len,
                    this._diamond_cross_axis_len,
                    this._get_color_value(color),
                    this._colors_are_equal(color, this._targ_diamond_color) ?
                        `targ_diamond_${this._get_color_alias(color)}` :
                        `dist_diamond_${this._get_color_alias(color)}`,
                    `pos_${grid_no}`
                );
                // Add target shape
                result.add_a_polygon(poly);
                // Add transparent ground shapes
                result.add_a_rect(new disp.Rect(
                    x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._background_rect_size / 2 + '',
                    this._background_rect_size,
                    this._background_rect_size,
                    "transparent",
                    this._colors_are_equal(color, this._targ_diamond_color) ?
                        `targ_diamond_${this._get_color_alias(color)}` :
                        `dist_diamond_${this._get_color_alias(color)}`,
                    `pos_${grid_no}_bg`
                ));
            }

        }).bind(this) );
        

        (function assert_display_complete() {
            if (items.length > 0) {
                throw Error("Display not complete.");
            }
        })();

        return result;

    }



}
