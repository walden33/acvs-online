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
        this._n_opt_targ_1_items = 15;
        this._n_opt_targ_2_items = 15;
        // this._n_opt_targ_1_shapes = 25;
        // this._n_opt_targ_1_targs = 15;
        // this._n_opt_targ_1_dist = this._n_opt_targ_1_shapes - this._n_opt_targ_1_targs;
        // this._n_opt_targ_2_shapes = 25;
        // this._n_opt_targ_2_targs = 15;
        // this._n_opt_targ_2_dist = this._n_opt_targ_2_shapes - this._n_opt_targ_2_targs;
        // this._n_non_opt_targ_shapes = 50;
        // this._n_non_opt_targ_targs = 15;
        // this._n_non_opt_targ_dist = this._n_non_opt_targ_shapes - this._n_non_opt_targ_targs;
        // (function assert() {
        //     if (this._n_items_x * this._n_items_y !== this._n_opt_targ_1_shapes
        //         + this._n_opt_targ_2_shapes + this._n_non_opt_targ_shapes) {
        //         throw Error("Display item numbers mismatch.")
        //     }
        // }).bind(this)();
        this._n_items_color_shape = util.Util.ndarray([3,3], 0);

        // Stimulus shape settings
        this._shape_0 = "square";
        this._shape_1 = "circle";
        this._shape_2 = "diamond";
        this._shapes = [this._shape_0, this._shape_1, this._shape_2];
        this._circle_radius = 0.7;
        this._square_size = 2;
        this._diamond_main_axis_len = 2;
        this._diamond_cross_axis_len = 2;
        this._background_rect_size = 3;

        // Stimulus color settings
        // Exact color string to use in <svg> shapes. Could be a generic name
        // or an rgb.
        this._color_0 = "red";
        this._color_1 = "green";
        this._color_2 = "blue";
        this._colors = [this._color_0, this._color_1, this._color_2];
        // Color aliases.
        this._color_0_alias = "red";
        this._color_1_alias = "green";
        this._color_2_alias = "blue";
        this._color_aliases = [this._color_0_alias, this._color_1_alias, this._color_2_alias];

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

    /**
     * Private helper function for the display generator to look up number of
     * items there should be in the display.
     * 
     * @param {*} color index or name string of the color
     * @param {*} shape index or name string of the shape
     */
    _get_item_count(color, shape) {
        
        (function assert_input_type() {
            if (typeof color !== "number" && typeof color !== "string") {
                throw TypeError("Input color type error");
            }
            if (typeof shape !== "number" && typeof shape !== "string") {
                throw TypeError("Input shape type error");
            }
        })();

        let color_index;
        let shape_index;
        if (typeof color === "string") {
            color_index = this._colors.indexOf(color);
            (function assert() {
                if (color_index < 0) {
                    throw Error(`Color ${color} not found.`);
                }
            })();
        } else if (typeof color === "number") {
            (function assert() {
                if (color >= this._color.length) {
                    throw Error(`Color index ${color} out of bound.`);
                }
            })();
            color_index = color;
        }

        if (typeof shape === "string") {
            shape_index = this._shapes.indexOf(shape);
            (function assert() {
                if (shape_index < 0) {
                    throw Error(`Shape ${shape} not found.`);
                }
            })();
        } else if (typeof shape === "number") {
            (function assert() {
                if (shape >= this._shapes.length) {
                    throw Error(`Shape index ${shape} out of bound.`);
                }
            })();
            shape_index = shape;
        }

        return this._n_items_color_shape[color_index, shape_index];

    }

    /**
     * Private helper function for the display generator to set number of
     * items there should be in the display.
     * 
     * @param {*} color 
     * @param {*} shape 
     * @param {number} count 
     */
    _set_item_count(color, shape, count) {

        (function assert_input_type() {
            if (typeof color !== "number" && typeof color !== "string") {
                throw TypeError("Input color type error");
            }
            if (typeof shape !== "number" && typeof shape !== "string") {
                throw TypeError("Input shape type error");
            }
            if (count < 0 || !Number.isInteger(count)) {
                throw RangeError("Number of items should be a positive integer.");
            }
        })();

        let color_index;
        let shape_index;
        if (typeof color === "string") {
            color_index = this._colors.indexOf(color);
            (function assert() {
                if (color_index < 0) {
                    throw Error(`Color ${color} not found.`);
                }
            })();
        } else if (typeof color === "number") {
            (function assert() {
                if (color >= this._color.length) {
                    throw Error(`Color index ${color} out of bound.`);
                }
            })();
            color_index = color;
        }

        if (typeof shape === "string") {
            shape_index = this._shapes.indexOf(shape);
            (function assert() {
                if (shape_index < 0) {
                    throw Error(`Shape ${shape} not found.`);
                }
            })();
        } else if (typeof shape === "number") {
            (function assert() {
                if (shape >= this._shapes.length) {
                    throw Error(`Shape index ${shape} out of bound.`);
                }
            })();
            shape_index = shape;
        }

        this._n_items_color_shape[color_index, shape_index] = count;

    }

    /**
     * Return the exact color name of an alias color name.
     * For example, if the red color in the display uses a different rgb string
     * to represent color instead of "red", this function will return the exact
     * rgb of the red color when getting input "red".
     * 
     * @param {string} str color name
     */
    _get_color_value(str) {
        if (this._colors.indexOf(str) > -1) {
            // if color name matches what is already exact name, return itself
            return str;
        } else {
            // if color name does not match exact name, look up for its alias
            const index = this._color_aliases.indexOf(str);
            if (index > -1) {
                return this._colors[index];
            }
        }
        return null;
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

    /**
     * "Public" method. Generates all displays in this generator and store in
     * `this._block_displays`.
     */
    make_block_displays() {

    }

}
