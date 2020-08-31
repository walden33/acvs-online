/**
 * The classical ACVS as in Irons & Leber (2018).
 * 
 * RED optimal trials: 13 RED, 27 BLUE, 14 GREEN
 * BLUE optimal trials: 27 RED, 13 BLUE, 14 GREEN
 */
exp.StandardTrialDataGenerator = class extends exp.AbstractTrialDataGenerator {

    constructor() {
        super();
        this.numTotalTrials = 108;
        this.colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 255, 0)"
        ];
        // 1+1+14+12+12+14=54
        this.numGreenDist = 14;
        this.numRedDist = 12;
        this.numBlueDist = 12;
        this.numVarDist = 14;
    }


    /**
     * Crossed variables: optEcc (3) * nonOptEcc (3) * optDigit (4) * nonOptDigit (3) = 108
     * Balanced variables: opt & nonOpt colors (2)
     * 
     * An example of one row is 3 1 3 4 1 2, which means this trial has an
     * optimal target on the ring furthermost to the center, a digit 3, and is
     * colored RED, as well as a non-optimal target on the ring closest to the
     * center, a digit 4, and is colored BLUE.
     */
    _generate_trial_conditions() {

        let result = [];

        for (let ecc1 = 1; ecc1 <= 3; ecc1++) {
            for (let ecc2 = 1; ecc2 <= 3; ecc2++) {
                for (let d1 = 2; d1 <= 5; d1++) {
                    for ( let d2 = 2; d2 <= 5; d2++ ) {
                        if ( d1 !== d2 ) result.push([ecc1, ecc2, d1, d2]);
                    }
                }
            }
        }
        result = util.Util.fisher_yates_shuffle(trialConds);

        let optTargColorArray = this._generate_opt_target_types( 2, this.numTotalTrials, 6 );
        let optColor, nonOptColor;  // temp vars for each trial
        for ( let i = 0; i < result.length; i++ ) {
            optColor = optTargColorArray.pop();
            optColor === 1 ? nonOptColor = 2 : nonOptColor = 1;
            result[i] = result[i].concat( [ optColor, nonOptColor ] );
        }

        return result;

    }


    /**
     * 
     * @param {number} optTargColor : 0, 1
     * @param {number} nonOptTargColor : 0, 1
     * @param {number} optTargEcc : 1-3
     * @param {number} nonOptTargEcc : 1-3
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit : 2-5
     */
    _make_stimuli_display( optTargColor, nonOptTargColor, optTargEcc,
        nonOptTargEcc, optTargDigit, nonOptTargDigit)
    {
        const x = this.display.screen_center_x;
        const y = this.display.screen_center_y;
        const sz = this.display.square_size;
        const digit_size = this.display.digit_size;

        let result = new disp.DisplayDataset();

        const gridPos = this.display.get_grid_pos();

        // Add potential targets to pools according to required eccentricity
        let optTargPool = [];
        let nonOptTargPool = [];
        let nonTargPool = [];
        for ( let i=1; i<=54; i++ ) {
            let currentGrid = gridPos.get(i);
            if ( currentGrid.ecc === optTargEcc ) {
                optTargPool.push(i);
            } else if ( currentGrid.ecc === nonOptTargEcc ) {
                nonOptTargPool.push(i);
            } else {    // add the rest to non-target pool
                nonTargPool.push(i);
            }
        }

        // Randomly select targets
        const optTargPos = util.Util.select_rand_from_array( optTargPool, replace=false );
        const optTargGrid = gridPos.get(optTargPos);
        const nonOptTargPos = util.Util.select_rand_from_array(nonOptTargPool);
        const nonOptTargGrid = gridPos.get(nonOptTargPos);

        // Add the rest to non-target pool
        nonTargPool.concat(optTargPool).concat(nonOptTargPool);
        // Shuffle the non-target pool
        util.Util.fisher_yates_shuffle(nonTargPool);

        // Add two targets to the display
        // Add rects
        result.add_a_rect( new disp.Rect(
            optTargGrid.rect_x+'',
            optTargGrid.rect_y+'',
            sz+'',
            sz+'',
            this.colors[ optTargColor ]
        ));
        result.add_a_rect( new disp.Rect(
            nonOptTargGrid.rect_x+'',
            nonOptTargGrid.rect_y+'',
            sz+'',
            sz+'',
            this.colors[ nonOptTargColor ]
        ));
        // Add digits
        result.add_a_text( new disp.Text(
            optTargDigit+'',
            optTargGrid.x+'',
            optTargGrid.y+'',
            this.display.digit_color,
            this.display.digit_size,
            this.display.digit_class_name
        ));
        result.add_a_text( new disp.Text(
            nonOptTargDigit+'',
            nonOptTargGrid.x+'',
            nonOptTargGrid.y+'',
            this.display.digit_color,
            this.display.digit_size,
            this.display.digit_class_name
        ));

        // Add GREEN distractor rects and digits. They can be of any digit.
        for ( let i=0; i<this.numGreenDist; i++ ) {
            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info
            // add rects
            result.add_a_rect( new disp.Rect(
                grid.rect_x+'',
                grid.rect_y+'',
                sz+'',
                sz+'',
                this.colors[2]
            ));
            // add digits
            result.add_a_text( new disp.Text(
                util.Util.select_rand_from_array(this.targetDigits.concat(this.distractorDigits))+'',
                grid.x+'',
                grid.y+'',
                this.display.digit_color,
                this.display.digit_size,
                this.display.digit_class_name
            ));
        }

        // Add RED distractor rects and digits. Digits must be 6-9.
        for ( let i=0; i<this.numRedDist; i++ ) {
            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info
            // add rects
            result.add_a_rect( new disp.Rect(
                grid.rect_x+'',
                grid.rect_y+'',
                sz+'',
                sz+'',
                this.colors[0]
            ));
            // add digits
            result.add_a_text( new disp.Text(
                util.Util.select_rand_from_array(this.distractorDigits)+'',
                grid.x+'',
                grid.y+'',
                this.display.digit_color,
                this.display.digit_size,
                this.display.digit_class_name
            ));
        }

        // Add BLUE distractor rects and digits. Digits must be 6-9.
        for ( let i=0; i<this.numBlueDist; i++ ) {
            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info
            // add rects
            result.add_a_rect( new disp.Rect(
                grid.rect_x+'',
                grid.rect_y+'',
                sz+'',
                sz+'',
                this.colors[1]
            ));
            // add digits
            result.add_a_text( new disp.Text(
                util.Util.select_rand_from_array(this.distractorDigits)+'',
                grid.x+'',
                grid.y+'',
                this.display.digit_color,
                this.display.digit_size,
                this.display.digit_class_name
            ));
        }

        // Add variable distractor rects and digits
        for ( let i=0; i<this.numBlueDist; i++ ) {
            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info
            // add rects
            result.add_a_rect( new disp.Rect(
                grid.rect_x+'',
                grid.rect_y+'',
                sz+'',
                sz+'',
                // if opt targ color is RED, var dist color should be blue, and vice versa
                optTargColor === 0 ? this.colors[1] : this.colors[0]
            ));
            // add digits
            result.add_a_text( new disp.Text(
                util.Util.select_rand_from_array(this.distractorDigits)+'',
                grid.x+'',
                grid.y+'',
                this.display.digit_color,
                this.display.digit_size,
                this.display.digit_class_name
            ));
        }

        // Finally, add fixation cross

        return result;

    }

}