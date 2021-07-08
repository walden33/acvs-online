/**
 * <ACMCFDisplayGenerator> is a base class for the Adaptive Choice Foraging (or
 * Adaptive Choice Mouse Click Foraging) Task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (07/05/2021)
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
        this._n_targ_per_color = 15;
        this._n_dist_opt_color = 10;
        this._n_items_opt_color = this._n_targ_per_color + this._n_dist_opt_color;
        this._n_dist_non_opt_color = 35;
        this._n_items_non_opt_color = this._n_targ_per_color + this._n_dist_non_opt_color;
        (function assert_total_item_within_bound() {
            if (this._n_items_opt_color * 2 + this._n_items_non_opt_color >
                this._n_items_x * this._n_items_y) {
                throw Error("Number of items in display exceeds maximum.")
            }
        }).bind(this)();

        /**
         * A 3x3 matrix representing if a particular colored shape is a target.
         * Rows are colors and columns are shapes.
         */
        this._is_targ = util.Util.ndarray([3, 3], 0);

        /** A 3x3 matrix representing the number of each type of object. */
        this._item_count = util.Util.ndarray([3, 3], 0);

        // Stimulus shape settings
        this._shape_0 = "square";
        this._shape_1 = "circle";
        this._shape_2 = "diamond";
        this._shapes = [this._shape_0, this._shape_1, this._shape_2];
        this._circle_radius = 0.7;
        this._square_size = 2;
        this._diamond_main_axis_len = 2.8;
        this._diamond_cross_axis_len = 3;
        this._background_rect_size = 3;

        // Stimulus color settings
        // Exact color string to use in <svg> shapes. Could be a generic name
        // or an rgb.
        // this._color_0 = "#FF5733";
        this._color_0 = "rgb(255,55,55)";
        this._color_1 = "rgb(38,125,0)";
        this._color_2 = "rgb(85,85,255)";
        this._colors = [this._color_0, this._color_1, this._color_2];
        // Color aliases.
        this._color_0_alias = "red";
        this._color_1_alias = "green";
        this._color_2_alias = "blue";
        this._color_aliases = [this._color_0_alias, this._color_1_alias, this._color_2_alias];

        // An array of all displays in this generator
        this._block_displays = [];

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
            if (color_index < 0) {
                color_index = this._color_aliases.indexOf(color);
            }
            (function assert() {
                if (color_index < 0) {
                    throw Error(`Color ${color} not found.`);
                }
            })();
        } else if (typeof color === "number") {
            (function assert() {
                if (color >= this._colors.length) {
                    throw Error(`Color index ${color} out of bound.`);
                }
            }).bind(this)();
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
            }).bind(this)();
            shape_index = shape;
        }

        return this._item_count[color_index][shape_index];

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
            if (color_index < 0) {
                color_index = this._color_aliases.indexOf(color);
            }
            (function assert() {
                if (color_index < 0) {
                    throw Error(`Color ${color} not found.`);
                }
            })();
        } else if (typeof color === "number") {
            (function assert() {
                if (color >= this._colors.length) {
                    throw Error(`Color index ${color} out of bound.`);
                }
            }).bind(this)();
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
            }).bind(this)();
            shape_index = shape;
        }
        this._item_count[color_index][shape_index] = count;

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

    /**
     * Return the alias color name of an exact color name.
     * For example, if the red color in the display uses a different rgb string
     * to represent color instead of "red", this function will return "red" if
     * input is the exact rgb value of the red color.
     * 
     * @param {string} str color name
     */
    _get_color_alias(str) {
        if (this._color_aliases.indexOf(str) > -1) {
            // if color name matches what is already alias name, return itself
            return str;
        } else {
            // if color name does not match alias name, look up for its exact
            const index = this._colors.indexOf(str);
            if (index > -1) {
                return this._color_aliases[index];
            }
        }
        return null;
    }

    _colors_are_equal(color1, color2) {
        return this._get_color_value(color1) === this._get_color_value(color2);
    }

    /**
     * Given center point coordinates, two dimenson lengths, and other info,
     * return a <Polygon> object of the diamond.
     * 
     * @param {number} x center x
     * @param {number} y center y
     * @param {number} mainLen length of the main (horizontal) axis
     * @param {number} crossLen length of the cross (vertical) axis
     * @param {string} fill color
     * @param {string} className 
     * @param {string} id 
     * @param {string} transform 
     */
    _make_a_diamond(x, y, mainLen, crossLen, fill, className = undefined,
        id = undefined, transform = undefined) {
        const points = `${x},${y - crossLen / 2} `  // top
            .concat(`${x - mainLen / 2},${y} `) // left
            .concat(`${x},${y + crossLen / 2} `) // bottom
            .concat(`${x + mainLen / 2},${y}`); // right
        return new disp.Polygon(points, fill, className, id, transform);
    }

    _generate_trial_conditions() {
        throw Error("Abstract method called.")
    }

    _make_trial_logic() {
        throw Error("Abstract method called.")
    }

    _make_trial_display() {
        throw Error("Abstract method called.")
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
        throw Error("Abstract method called.")
    }

}
