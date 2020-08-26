/**
 * This is a generator class for temporal acvs experiment.
 * 
 * @package acvs-online
 * @version 1.1 (08/26/2020)
 * @author Walden Li
 */
exp.TemporalTrialGenerator = class extends exp.AbstractTrialDataGenerator {

    constructor() {
        super()
        this.numTotalTrials = 108;
        this.targetTypes = [1, 2];  // 1 for left optimal and 2 for right optimal
        this.trialConds = this._generate_trial_conditions();
        this.blockData = this._make_block_dataset( this.trialConds );
    }

        /**
     * A method that generates a trial condition matrix (here implemented by a
     * two-dimensional Array).
     * 
     * What get controlled in ac-spatial-cue?
     * Crossed vars: optDigit (4) * nonoptDigit (3) * optEcc (3) * nonoptEcc(3) = 108
     * We also want to balance optimal target regions (3/5), but will not cross
     * them with other variables.
     */
    _generate_trial_conditions() {
        // First add non target region-specific conditions
        let result = [];
        for (let ecc1 = 1; ecc1 <= 3; ecc1++) {
            for (let ecc2 = 1; ecc2 <= 3; ecc2++) {
                for (let d1 = 2; d1 <= 5; d1++) {
                    for (let d2 = 2; d2 <= 5; d2++) {
                        if (d1 != d2)
                            result.push([ecc1, ecc2, d1, d2]);
                    }
                }
            }
        }
        result = util.Util.fisher_yates_shuffle(result);    // shuffle the combination
        // Then add optimal target regions
        let optTargTypesArray = this._generate_opt_target_types();
        for (let i = 0; i < result.length; i++) {
            let optTargSide = optTargTypesArray.pop();
            let nonOptTargSide = util.Util.select_rand_from_array([1,2], optTargSide);
            result[i] = result[i].concat([ optTargSide, nonOptTargSide ]);
        }
        return result;
    }

    /**
     * A helper method. Used to generate a "run" of trials in which the optimal
     * target have certain same attribute. For example, in previous color
     * versions of ACVS, we have "runs" of RED or BLUE optimal.  Here, we have
     * "runs" of LEFT or RIGHT optimal.
     */
    _generate_opt_target_types() {
        const MAXREP = 3;
        let result = [];
        for (let i = 1; i <= 2; i++) {
            for (let j = 0; j < 54; j++) {
                result.push(i);
            }
        }
        util.Util.fisher_yates_shuffle(result);
        // Check if there are more than MAXREP reps in a run
        let previous = result[0];
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
        if (maxRep > MAXREP) {
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



}