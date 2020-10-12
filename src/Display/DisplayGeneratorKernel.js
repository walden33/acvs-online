/**
 * The kernel for a display generator class that has basic settings and methods
 * for creating abstract trial logic.
 * 
 * @author Walden Y. Li
 * @version 1.6
 */
disp.DisplayGeneratorKernel = class {
    constructor() {
        this._target_digits = [2, 3, 4, 5];
        this._distractor_digits = [6, 7, 8, 9];
        this._setting = new disp.DisplaySetting();
        this._block_data = [];
    }

    /**
     * Given display grid position info, the optimal target eccentricity, and
     * the non-optimal target eccentricity, return a js object with three items:
     * 0. "optTargPos" : the position (indexed between 0 - 53) of the opt targ
     * 1. "nonOptTargPos" : same as above, of the non opt targ
     * 2. "nonTargPool" : an array of randomized grid position indexes without
     *     two targets
     * 
     * @param {Map<number,object>} gridPos 
     * @param {number} optTargEcc 
     * @param {number} nonOptTargEcc 
     */
    _generate_target_pools_by_ecc( gridPos, optTargEcc, nonOptTargEcc ) {

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
            let n = Math.floor(targPool.length/2);
            // give each half of targPool items to optTargPool and nonOptTargPool
            optTargPool = targPool.slice( 0, n );
            nonOptTargPool = targPool.slice( n );
        }

        // Randomly select targets
        const optTargPos = util.Util.select_rand_from_array(optTargPool, null, false);
        const nonOptTargPos = util.Util.select_rand_from_array(nonOptTargPool, null, false);

        // Add the rest to non-target pool
        nonTargPool = nonTargPool.concat(optTargPool).concat(nonOptTargPool);
        // Shuffle the non-target pool
        util.Util.fisher_yates_shuffle(nonTargPool);

        // Return three things with an object
        return {
            optTargPos: optTargPos,
            nonOptTargPos: nonOptTargPos,
            nonTargPool: nonTargPool
        };

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

        for( let i = 0; i < num_total_trials; i++ ) {
            result.push( digit_combs[digitRows.pop()][digitColumns.pop()] );
        }

        return result;

    }

    /**
     * Returns the next array of <Display> with a trial condition logic array
     * in this block.  When exhausted this method will return null.
     */
    yield_trial_dataset() {
        if ( this._block_data.length > 0 ) {
            return this._block_data.pop();
        } else {
            return null;
        }
    }
}