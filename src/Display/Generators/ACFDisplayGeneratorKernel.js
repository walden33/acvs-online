/**
 * <ACMCFDisplayGenerator> is a base class for the Adaptive Choice Foraging (or
 * Adaptive Choice Mouse Click Foraging) Task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (07/02/2021)
 */
disp.ACFDisplayGenerator = class {

    constructor() {

        // Display settings
        this._screen_x = 100;   // length of the main axis (horizontal)
        this._screen_y = 80;    // length of the cross axis (vertical)
        this._screen_x_border = 0;  // length of blank space on x axis from the left OR right border
        this._screen_y_border = 5;  // length of blank space on y axis from the top OR bottom border
        this._max_x_jitter = 3.5;
        this._max_y_jitter = 3.5 / 1.25;

        // Display general settings
        this._n_items_x = 10;   // number of items on the main axis
        this._n_items_y = 10;    // number of items on the cross axis
        this._n_total_items = this._n_items_x * this._n_items_y;
        this._n_opt_targ_1_shapes = 25;
        this._n_opt_targ_1_targs = 15;
        this._n_opt_targ_1_dist = this._n_opt_targ_1_shapes - this._n_opt_targ_1_targs;
        this._n_opt_targ_2_shapes = 25;
        this._n_opt_targ_2_targs = 15;
        this._n_opt_targ_2_dist = this._n_opt_targ_2_shapes - this._n_opt_targ_2_targs;
        this._n_non_opt_targ_shapes = 50;
        this._n_non_opt_targ_targs = 15;
        this._n_non_opt_targ_dist = this._n_non_opt_targ_shapes - this._n_non_opt_targ_targs;
        (function assert() {
            if (this._n_items_x * this._n_items_y !== this._n_opt_targ_1_shapes
                + this._n_opt_targ_2_shapes + this._n_non_opt_targ_shapes) {
                throw Error("Display item numbers mismatch.")
            }
        }).bind(this)();

        // Stimulus shape settings
        this._circle_radius = 0.7;
        this._square_size = 2;
        this._diamond_main_axis_len = 2;
        this._diamond_cross_axis_len = 2;
        this._background_rect_size = 3;

        // Stimulus color settings
        this._color_0 = "red";
        this._color_1 = "green";
        this._color_2 = "blue";
        this._colors = [this._color_0, this._color_1, this._color_2];

        // An array of all displays in this generator
        this._block_displays = null;

    }

    _get_grid_pos() {
        let result = new Map();
        let i = 0;  // grid number, to be set as the keys of the output <Map>
        let x = this._screen_x_border + ((this._screen_x - 2 * this._screen_x_border) / this._n_items_x) / 2;   // initialize x coord.
        for (let j = 0; j < this._n_items_x; j++) {
            let y = this._screen_y_border + ((this._screen_y - 2 * this._screen_y_border) / this._n_items_y) / 2;   // initialize y coord.
            for (let k = 0; k < this._n_items_y; k++) {
                result.set(i, [x, y]);
                i++;
                y += (this._screen_y - 2 * this._screen_y_border) / this._n_items_y;
            }
            x += (this._screen_x - 2 * this._screen_x_border) / this._n_items_x;  // inc. x coord. to the next col.
        }
        return result;
    }

    get_total_displays_count() {
        return this._block_displays.length;
    }

    /**
     * "Public" method. Returns one <DisplayDataset> of this block if there is
     * any left, returns null otherwise.
     */
    yield_trial_display() {
        if (this._block_displays.length > 0) {
            return this._block_displays.pop();
        } else {
            return null;
        }
    }

}
