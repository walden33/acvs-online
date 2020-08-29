/**
 * This is a generator class for temporal acvs experiment.
 * 
 * @package acvs-online
 * @version 1.1 (08/26/2020)
 * @author Walden Li
 */
exp.TemporalTrialDataGenerator = class extends exp.AbstractTrialDataGenerator {

    constructor() {
        super()
        this.numTotalTrials = 96;   // 24*4
        this.colors = [
            "rgb(255, 50, 50)",
            "rgb(50, 50, 255)",
            "rgb(50, 255, 50)",
            "rgb(128, 128, 128)"
        ]
        this.targetTypes = [1, 2];  // 1 for RED optimal and 2 for BLUE optimal
        this.trialConds = this._generate_trial_conditions();
        this.blockData = this._make_block_dataset( this.trialConds );
    }

    /**
     * A method that generates a trial condition matrix (here implemented by a
     * two-dimensional Array).
     * 
     * What get controlled in temporal ACVS?
     * Crossed vars: optDigit (4) * nonoptDigit (3) * optColor(2) = 24
     */
    _generate_trial_conditions() {
        let result = [];
        for (let rep = 0; rep < 4; rep++) { // rep for times so that 24*4=96 = total trials in block
            for (let color = 1; color <= 2; color++) {
                for (let d1 = 2; d1 <= 5; d1++) {
                    for (let d2 = 2; d2 <= 5; d2++) {
                        if (d1 != d2)
                            result.push([d1, d2, color]);
                    }
                }
            }
        }
        result = util.Util.fisher_yates_shuffle(result);    // shuffle the combination
        // Then add optimal target regions
        let optTargTypesArray = this._generate_opt_target_types( 2, 6 );
        for (let i = 0; i < result.length; i++) {
            let optTargSide = optTargTypesArray.pop();
            let nonOptTargSide = util.Util.select_rand_from_array([1,2], optTargSide);
            result[i] = result[i].concat([ optTargSide, nonOptTargSide, 10, 15 ]);  // TODO
        }
        return result;
    }

    /**
     * A helper method. Used to generate a "run" of trials in which the optimal
     * target have certain same attribute. For example, in previous color
     * versions of ACVS, we have "runs" of RED or BLUE optimal.  Here, we have
     * "runs" of LEFT or RIGHT optimal.
     * 
     * @param {number} num_opt_type : Number of optimal target types. For example, 2 for experiments that have BLUE optimal and RED optmial trials.
     * @param {number} max_rep : Maximum number of repitions allowed for each run of optimal target type trials.
     */
    _generate_opt_target_types( num_opt_type, max_rep) {

        // Calculate the number of reps that need to be generated
        const reps = this.numTotalTrials / num_opt_type;
        if (reps%1 !== 0) throw("Total number of trials must be a multiple of optimal target types.")

        let result = [];
        for (let i = 1; i <= num_opt_type; i++) {
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
            return this._generate_opt_target_types()    // generate another array
        } else return result;

    }

    /**
     * A helper method previously known as _make_chartDataset, but it did not
     * incorprate any display-specific parameters. This new version queries
     * disp.Display class and makes a <disp.DisplayDataset> that can be directly
     * used by display widget to draw the stimuli.
     * 
     * @param {number} optTargEcc : 1-3
     * @param {number} nonOptTargEcc : 1-3
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit :2-5
     * @param {number} optTargSide : 1-2
     * @param {number} nonOptTargSide : 1-2
     * @param {number} optTargPosition : 8, 9, 10, 11, 12
     * @param {number} nonOptTargPosition : 13, 14, 15, 16, 17
     * 
     * @returns {disp.DisplayDataset}
     */
    _make_stimuli_display(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargSide, nonOptTargSide, optTargPosition,
        nonOptTargPosition) {

        let result;

        const numFrames = 20;

        // Copy some established logic to the object
        result.set_logic( "optTargEcc", optTargEcc );
        result.set_logic( "nonOptTargEcc", nonOptTargEcc );
        result.set_logic( "optTargDigit", optTargDigit );
        result.set_logic( "nonOptTargDigit", nonOptTargDigit );
        result.set_logic( "optTargSide", optTargSide );
        result.set_logic( "nonOptTargSide", nonOptTargSide );
        result.set_logic( "optTargPosition", optTargPosition );
        result.set_logic( "nonOptTargPosition", nonOptTargPosition );

        // Generate the RSVP sequence of digits
        let optSideSeq = [], nonOptSideSeq = [];
        for ( let i = 0; i < numFrames; i++ ) {
            optSideSeq.push( util.Util.select_rand_from_array(this.distractorDigits) );
            nonOptSideSeq.push( util.Util.select_rand_from_array(this.distractorDigits) );
        }
        // Replace corresponding positions with the target digit
        optSideSeq[optTargPosition-1] = optTargDigit;
        nonOptSideSeq[nonOptTargPosition-1] = nonOptTargDigit;


        // Start making the display
        // The result is an array containing all frames in this trial. Each
        // frame has its own <DisplayDataset>
        let result = [];

        // Add each frame to the result
        for ( let i = 0; i < numFrames; i++ ) {
            // Create a new display dataset
            let d = new disp.DisplayDataset();

            // Add digits to each frame
            if ( optTargSide === 1 ) {  // if optimal target on the left
                // Add optimal side digit
                d.add_a_text( new disp.Text(
                    optSideSeq[i],
                    this.display.screen_center_x - 20+"",
                    this.display.screen_center_y,
                    'white',
                    this.display.digit_size,
                    'acvs-digit'
                ))
                // Add non-optimal side digit
                d.add_a_text( new disp.Text(
                    nonOptSideSeq[i],
                    this.display.screen_center_x + 20+"",
                    this.display.screen_center_y,
                    'white',
                    this.display.digit_size,
                    'acvs-digit'
                ))
            } else if ( optTargSide === 2 ) {   // if optimal target on the right
                // Add optimal side digit
                d.add_a_text( new disp.Text(
                    optSideSeq[i],
                    this.display.screen_center_x + 20+"",
                    this.display.screen_center_y,
                    'white',
                    this.display.digit_size,
                    'acvs-digit'
                ))
                // Add non-optimal side digit
                d.add_a_text( new disp.Text(
                    nonOptSideSeq[i],
                    this.display.screen_center_x - 20+"",
                    this.display.screen_center_y,
                    'white',
                    this.display.digit_size,
                    'acvs-digit'
                ))
            }

            // Add current display dataset to the result
            result.push(d);

        }

        return result;

    }

    /**
     * This method generates a 2D array of <DisplayDataset>. The first dimension
     * is the cue display and the second is the stimuli display in each trial.
     * 
     * @param {Array<number>} trialConds 
     */
    _make_block_dataset( trialConds ) {
        let trial_conditions = trialConds.slice();  // make a copy
        let result = [];
        let currentTrialCond;
        while( trial_conditions.length > 0 ) {
            currentTrialCond = trial_conditions.pop();
            result.push(
                {
                    "logic" : this.currentTrialCond,
                    "display": this._make_stimuli_display( ...currentTrialCond ) 
                }
            );
        }
        return result;
    }


}