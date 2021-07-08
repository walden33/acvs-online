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
     * @param {*} targ_sq_color target square color (index, exact value, or alias)
     * @param {*} targ_cir_color target circle color (index, exact value, or alias)
     * @param {*} targ_diamond_color target diamond color (index, exact value, or alias)
     */
    constructor(n_trials, targ_sq_color, targ_cir_color, targ_diamond_color) {

        super();

        this._n_total_trials = n_trials;
        if (typeof targ_sq_color === "string") {
            this._targ_sq_color = this._get_color_value(targ_sq_color);
        } else if (typeof targ_sq_color === "number"){
            this._targ_sq_color = this._colors[targ_sq_color];
        }
        if (typeof targ_cir_color === "string") {
            this._targ_cir_color = this._get_color_value(targ_cir_color);
        } else if (typeof targ_cir_color === "number"){
            this._targ_cir_color = this._colors[targ_cir_color];
        }
        if (typeof targ_diamond_color === "string") {
            this._targ_diamond_color = this._get_color_value(targ_diamond_color);
        } else if (typeof targ_diamond_color === "number"){
            this._targ_diamond_color = this._colors[targ_diamond_color];
        }

        // Set target info in the matrix
        this._is_targ[this._colors.indexOf(this._get_color_value(targ_sq_color))][0] = 1;
        this._is_targ[this._colors.indexOf(this._get_color_value(targ_cir_color))][1] = 1;
        this._is_targ[this._colors.indexOf(this._get_color_value(targ_diamond_color))][2] = 1;

    }

    /**
     * Balanced variables within one block:
     * Non optimal target color (0, 1, 2) max rep = 3
     */
    _generate_trial_conditions() {

        let result = [];

        (function assert() {
            if (this._n_total_trials % 3 !== 0) {
                throw Error("Total trial number must be a multiple of 3.")
            }
        }).bind(this)();

        let nonOptColors = util.Util.generate_random_array([0, 1, 2], this._n_total_trials, 3);

        for (let i = 0; i < this._n_total_trials; i++) {
            result[i] = [nonOptColors.pop()];
        }
        return result;

    }

    _make_trial_logic(nonOptTargColor) {
        return ({
            // Between-sub variables
            targSquareColor: this._get_color_alias(this._targ_sq_color),
            targCircleColor: this._get_color_alias(this._targ_cir_color),
            targDiamondColor: this._get_color_alias(this._targ_diamond_color),
            // Trial-specific variables
            nonOptTargColorIndex: nonOptTargColor,
            nonOptTargColorName: this._color_aliases[nonOptTargColor]
        });
    }

    /**
     * 
     * @param {number} nonOptColor *index* of non-optimal target color
     */
    _make_trial_display(nonOptColor) {
        let result = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();
        let items = util.Util.range(this._n_total_items);
        util.Util.fisher_yates_shuffle(items);

        // Determine number of each item type in the display
        // Targets
        this._set_item_count(this._targ_sq_color, "square", this._n_targ_per_color);
        this._set_item_count(this._targ_cir_color, "circle", this._n_targ_per_color);
        this._set_item_count(this._targ_diamond_color, "diamond", this._n_targ_per_color);
        // Determine non optimal color distractors (more abundant)
        let temp = util.Util.split_int(this._n_dist_non_opt_color, 2);  // spliting nonoptimal dist items into 2
        [0, 1, 2].forEach(
            ((shape) => {
                if (!this._is_targ[nonOptColor][shape]) {
                    this._set_item_count(nonOptColor, shape, temp.pop());
                }
            }).bind(this)
        );
        // Determine optimal colors distractors
        let colors = [0, 1, 2];
        util.Util.remove_element_from_array(colors, nonOptColor);
        // Now ``colors`` only contain optimal target colors
        colors.forEach( ((c) => {
            let temp = util.Util.split_int(this._n_dist_opt_color, 2);
            [0, 1, 2].forEach(
                ((shape) => {
                    if (!this._is_targ[c][shape]) {
                        this._set_item_count(c, shape, temp.pop());
                    }
                }).bind(this)
            );
        }).bind(this));

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
