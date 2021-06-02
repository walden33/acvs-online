/**
 * The kernel for a display generator class that has basic settings and methods
 * for creating abstract trial logic.
 * 
 * Update (10/16/2020): has_preview, num_trials, and num_trials_to_slice were
 *   extracted to this base class constructor.
 * 
 * @author Walden Y. Li
 * @version 1.6
 */
disp.DisplayGenerator = class {

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

    /**
     * Helper function to get the distance between to grid positions
     * @param {Object} grid1 
     * @param {Object} grid2 
     */
    _get_grid_dist(grid1, grid2) {
        return Math.sqrt((grid1.x - grid2.x) * (grid1.x - grid2.x) +
            (grid1.y - grid2.y) * (grid1.y - grid2.y));
    }


    /**
     * Given display grid position info, the optimal target eccentricity, and
     * the non-optimal target eccentricity, return an object with three items:
     * 0. "optTargPos" : the position (indexed between 0 - 53) of the opt targ
     * 1. "nonOptTargPos" : same as above, of the non opt targ
     * 2. "nonTargPool" : an array of randomized grid position indexes without
     *     two targets
     * 
     * @param {Map<number,object>} gridPos 
     * @param {number} optTargEcc 
     * @param {number} nonOptTargEcc 
     */
    _generate_target_pools_by_ecc(gridPos, optTargEcc, nonOptTargEcc,
        nOptTarg = 1, nNonOptTarg = 1) {

        let result = {};

        // Add potential targets to pools according to required eccentricity
        let optTargPool = [];
        let nonOptTargPool = [];
        let nonTargPool = [];

        // If optTargEcc === nonOptTargEcc, put them in a combined pool, and 
        // then split in half
        let targPool = [];
        if (optTargEcc !== nonOptTargEcc) {
            for (let [i, grid] of gridPos) {
                if (grid.ecc === optTargEcc) {
                    optTargPool.push(i);
                } else if (grid.ecc === nonOptTargEcc) {
                    nonOptTargPool.push(i);
                } else {    // add the rest to non-target pool
                    nonTargPool.push(i);
                }
            }
        } else {
            for (let [i, grid] of gridPos) {
                if (grid.ecc === optTargEcc) {
                    targPool.push(i);
                } else {    // add the rest to non-target pool
                    nonTargPool.push(i);
                }
            }
            // find a rough center of the targPool
            let n = Math.floor(targPool.length / 2);
            // give each half of targPool items to optTargPool and nonOptTargPool
            optTargPool = targPool.slice(0, n);
            nonOptTargPool = targPool.slice(n);
        }

        // Randomly select targets
        // const optTargPos = util.Util.select_rand_from_array(optTargPool, null, false);
        // const nonOptTargPos = util.Util.select_rand_from_array(nonOptTargPool, null, false);
        // Randomly select target grids (and make sure they are not close to
        // each other)
        if (nOptTarg === 1 && nNonOptTarg === 1) {
            let optTargPos, nonOptTargPos;
            let selected = false;
            while (!selected) {
                optTargPos = util.Util.choose_from(optTargPool);
                nonOptTargPos = util.Util.choose_from(nonOptTargPool, [optTargPos]);
                if (this._get_grid_dist(gridPos.get(optTargPos), gridPos.get(
                    nonOptTargPos)) >= this._setting.min_targ_dist) {
                    selected = true;
                }
            }
            result.optTargPos = optTargPos;
            result.nonOptTargPos = nonOptTargPos;
            // Remove target positions from the pool
            optTargPool.splice(optTargPool.indexOf(optTargPos), 1);
            nonOptTargPool.splice(nonOptTargPool.indexOf(nonOptTargPos), 1);
        } else {
            let optTargPos = [];
            let nonOptTargPos = [];

        }


        // Add the rest to non-target pool
        nonTargPool = nonTargPool.concat(optTargPool).concat(nonOptTargPool);
        // Shuffle the non-target pool
        util.Util.fisher_yates_shuffle(nonTargPool);
        result.nonTargPool = nonTargPool;

        // Return three things with an object
        return result;

    }


    /**
     * 
     * @param {number} num_total_trials 
     * @requires num_total_trials % 12 === 0
     */
    _generate_trial_digits(num_total_trials) {

        let result = [];

        // All possible combinations of target digits
        // Every row is a choice of optimal target digit
        const digit_combs = [
            [[2, 3], [2, 4], [2, 5]],   // opt digit == 2
            [[3, 2], [3, 4], [3, 5]],   // opt digit == 3
            [[4, 2], [4, 3], [4, 5]],
            [[5, 2], [5, 3], [5, 4]]
        ]
        const digitRows = util.Util.generate_random_array([0, 1, 2, 3], num_total_trials, 3);
        const digitColumns = util.Util.generate_random_array([0, 1, 2], num_total_trials, 3);

        for (let i = 0; i < num_total_trials; i++) {
            result.push(digit_combs[digitRows.pop()][digitColumns.pop()]);
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
