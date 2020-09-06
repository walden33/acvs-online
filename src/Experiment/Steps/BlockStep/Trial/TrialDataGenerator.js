exp.TrialDataGenerator = class {

    constructor() {
        this.targetDigits = [2, 3, 4, 5];
        this.distractorDigits = [6, 7, 8, 9];
        this.display = new disp.Display();
        this.blockData = [];
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
     * Returns the next array of <DisplayDataset> with a trial condition
     * logic array in this block.  When exhausted this method will return null.
     * 
     */
    yield_trial_dataset() {
        if ( this.blockData.length > 0 ) {
            return this.blockData.pop();
        } else {
            return null;
        }
    }

}