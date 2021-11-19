/**
 * The base class of display generators for AC Mouse Cont.
 * 
 * @author Walden Y. Li
 * @version 1.1 (updated 11/19/2021)
 * 
 */
disp.ACMouseContDisplayGenerator = class {

    /**
     * 
     * @param {number} num_trials : The number of trials specified for
     *   generating the block trial conditions.
     * @param {number} num_trials_to_slice : The number of actual trials needed
     *   in this block, if defined.
     * @requires
     *   (num_trials_to_slice <= num_trials && num_trials_to_slice % 3 === 0)
     *   if (num_trials_to_slice !== undefined)
     */
    constructor(num_trials, num_trials_to_slice) {
        this._num_total_trials = num_trials;
        this._num_trials_to_slice = num_trials_to_slice;
        this._target_digits = [2, 3, 4, 5];
        this._distractor_digits = [6, 7, 8, 9];
        this._setting = new disp.DisplaySetting();
        this._block_data = null;
    }

    _get_grid_pos() {
        let result = new Map();
        const r = this._setting.ring_radius;
        const cx = this._setting.screen_center_x;
        const cy = this._setting.screen_center_y;
        const sz = this._setting.square_size;
        const p = this._setting.subring_radius_proportion;
        let i = 1;  // grid number, to be set as the key of the output <Map>
        for (let j = 0; j < 3; j++) {   // three rings, from inner to outer
            let n = this._setting.ring_square_numbers[j];    // get # of squares in this ring
            for (let k = 0; k < n; k++) {
                // Create an Object to store grid info
                let grid = {};
                let angle = 2 * Math.PI / n;
                grid.x = Math.cos(angle * k + Math.PI / 2) * r * p[j] + cx;
                grid.y = Math.sin(angle * k + Math.PI / 2) * r * p[j] + cy;
                grid.rect_x = grid.x - sz / 2;
                grid.rect_y = grid.y - sz / 2;
                grid.ecc = j + 1;     // eccentricity
                grid.alpha = angle * k;
                // Set the Object as the value of the key (grid number)
                result.set(i, grid);
                i++;
            }

        }
        return result;
    }

    _generate_trial_conditions() {
        throw ReferenceError("Abstract method called");
    }

    _make_block_displays() {
        throw ReferenceError("Abstract method called");
    }

    /**
     * Returns the reference to the display settings object
     */
    get_setting() {
        return this._setting;
    }

    /**
     * Returns the next array of <Display> with a trial condition logic array
     * in this block.  When exhausted this method will return null.
     */
    yield_trial_display() {
        if (this._block_data.length > 0) {
            return this._block_data.pop();
        } else {
            return null;
        }
    }

    /**
     * A static version of the method get_grid_pos().
     */
    static get_grid_pos() {
        const setting = new disp.DisplaySetting();
        let result = new Map();
        const r = setting.ring_radius;
        const cx = setting.screen_center_x;
        const cy = setting.screen_center_y;
        const sz = setting.square_size;
        const p = setting.subring_radius_proportion;
        let i = 1;  // grid number, to be set as the key of the output <Map>
        for (let j = 0; j < 3; j++) {   // three rings, from inner to outer
            let n = setting.ring_square_numbers[j];    // get # of squares in this ring
            for (let k = 0; k < n; k++) {
                // Create an Object to store grid info
                let grid = {};
                let angle = 2 * Math.PI / n;
                grid.x = Math.cos(angle * k + Math.PI / 2) * r * p[j] + cx;
                grid.y = Math.sin(angle * k + Math.PI / 2) * r * p[j] + cy;
                grid.rect_x = grid.x - sz / 2;
                grid.rect_y = grid.y - sz / 2;
                grid.ecc = j + 1;     // eccentricity
                grid.alpha = angle * k;
                // Set the Object as the value of the key (grid number)
                result.set(i, grid);
                i++;
            }

        }
        return result;
    }
}
