exp.TrialDataGenerator = class {

    constructor() {
        this._targetDigits = [2, 3, 4, 5];
        this._distractorDigits = [6, 7, 8, 9];
        this._display = new disp.Display();
        this._blockData = [];
    }


    /**
     * A helper method. Used to generate a "run" of trials in which the optimal
     * target have certain same attribute. For example, in previous color
     * versions of ACVS, we have "runs" of RED or BLUE optimal.  Here, we have
     * "runs" of LEFT or RIGHT optimal.
     * 
     * @param {number} num_opt_type : Number of optimal target types. For example, 2 for experiments that have BLUE optimal and RED optmial trials.
     * @param {number} num_total_trials : Number of trials in this block.
     * @param {number} max_rep : Maximum number of repitions allowed for each run of optimal target type trials.
     */
    _generate_opt_target_types( num_opt_type, num_total_trials, max_rep) {

        // Calculate the number of reps that need to be generated
        const reps = num_total_trials / num_opt_type;
        // if (reps%1 !== 0) throw("Total number of trials must be a multiple of optimal target types.")

        let result = [];
        for (let i = 0; i < num_opt_type; i++) {
            for (let j = 0; j < reps; j++) {
                result.push(i);
            }
        }
        util.Util.fisher_yates_shuffle(result);

        // Check if there are more than MAXREP reps in a run
        let previous = result[0];
        // rep: current run rep numbers; maxRep: max rep numbers recorded so far
        let rep = 1, maxRep = 1;
        for (let i = 1; i < result.length; i++) {
            if (result[i] === previous) {
                rep++;
            } else {
                maxRep = Math.max(rep, maxRep);
                rep = 1;
            }
            previous = result[i];
        }
        if ( maxRep > max_rep ) {
            return this._generate_opt_target_types(num_opt_type, num_total_trials, max_rep)    // generate another array
        } else return result;

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
     * Returns the next array of <DisplayDataset> with a trial condition
     * logic array in this block.  When exhausted this method will return null.
     * 
     */
    yield_trial_dataset() {
        if ( this._blockData.length > 0 ) {
            return this._blockData.pop();
        } else {
            return null;
        }
    }

}