/**
 * This is a generator object that returns a <disp.DisplayDataset> for each
 * trial in a block. When exhausted, this generator will return null and the
 * <BlockStep> will trigger a finish signal.
 * 
 * In previous versions, the similar <ChartDatasetGenerator> only handled one
 * type of block and did not specify the elements for the widget to draw. This
 * new version, however, is designed to be more generic.
 * 
 * Since 1.4, a substantial change from previous versions is that the generator
 * now follows pre-determined display settings ordered by disp.Display class.
 * This avoids calculations in the <DisplayWidget> class. The aim here is to
 * separate data logic from display logic.
 * 
 * @package ac-spatial-cue-1
 * @version 1.4 (07/20/2020)
 * @author Walden Li
 */
exp.DisplayDatasetGenerator = class {
    constructor() {
        this.targetDigits = [2, 3, 4, 5];
        this.distractorDigits = [6, 7, 8, 9];
        this.numTotalTrials = 108;  // total number of trials
        this.numRegions = 3;    // total number of separated areas in a display
        this.numTrialsPerRegion = this.numTotalTrials / this.numRegions;
        this.display = new disp.Display();  // instantiate a disp.Display class to get display-specific parameters
        this.trialConds = this._generate_trial_conditions()
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
            let optTargRegion = optTargTypesArray.pop();
            let nonOptTargRegion = util.Util.select_rand_from_array([1,2,3], optTargRegion);
            result[i] = result[i].concat([ optTargRegion, nonOptTargRegion ]);
        }
        return result;
    }

    /**
     * A helper method. Used to generate a "run" of trials in which the optimal
     * target have certain same attribute. For example, in previous color
     * versions of ACVS, we have "runs" of RED or BLUE optimal.  Here, we have
     * "runs" of REGION 1, REGION 2, ... or REGION n, optimal target position.
     * 
     * @since 1.4
     */
    _generate_opt_target_types() {
        const MAXREP = 3;
        let result = [];
        for (let i = 1; i <= 3; i++) {
            for (let j = 0; j < 36; j++) {
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
     * @param {number} optTargRegion : 1-5
     * @param {number} nonOptTargRegion : 1-5
     * 
     * @returns {disp.DisplayDataset}
     */
    _make_stimuli_display(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargRegion, nonOptTargRegion) {

        /**
         * A helper function that tells if a certain grid belongs to an AC
         * Spatial Cue "Region".
         * 
         * @param {number} alpha : the grid's deviation angle (in rad) from origin
         * 
         * @returns {number} : Region number where the grid belongs (0 for region boundary lines)
         */
        const getRegionOf = function(alpha) {
            for (let i = 1; i <= 3; i++) {
                if ( alpha > 2*Math.PI/3 * (i-1) && alpha < 2*Math.PI/3 * i ) {
                    return i;
                }
            }
            return 0;
        }

        // Initialize a display dataset object
        let result = new disp.DisplayDataset();

        // Copy some established logic to the object
        result.set_logic( "optTargEcc", optTargEcc );
        result.set_logic( "nonOptTargEcc", nonOptTargEcc );
        result.set_logic( "optTargDigit", optTargDigit );
        result.set_logic( "nonOptTargDigit", nonOptTargDigit );
        result.set_logic( "optTargRegion", optTargRegion );
        result.set_logic( "nonOptTargRegion", nonOptTargRegion );


        // Get grid position coordinates
        const gridPos = this.display.get_grid_pos();

        // Add candidate grid indexes into pools
        let optTargPool = [], nonOptTargPool = [], distractorPool = [];
        for ( let [i, grid] of gridPos ) {
            if ( grid.ecc === optTargEcc && getRegionOf(grid.alpha) === optTargRegion ) {
                optTargPool.push(i);    // add the grid index to the pool
            } else if ( grid.ecc === nonOptTargEcc && getRegionOf(grid.alpha) === nonOptTargRegion) {
                nonOptTargPool.push(i);
            // Next add distractors, and in this paradigm, avoid region boundary lines
            } else if ( getRegionOf(grid.alpha) !== 0 ) {    // if region is not 0 (boundary lines)
                distractorPool.push(i);
            }
        }

        // Select the optimal and non-optimal target
        let optTargIndex = util.Util.select_rand_from_array( optTargPool );
        let nonOptTargIndex = util.Util.select_rand_from_array( nonOptTargPool );

        // Store these information in the logic of the dataset
        result.set_logic( "optTargIndex", optTargIndex );
        result.set_logic( "nonOptTargIndex", nonOptTargIndex );

        // Start making the display
        // First add two target squares
        let optGrid = gridPos.get(optTargIndex);
        let nonOptGrid = gridPos.get(nonOptTargIndex);
        result.add_rects([
            new disp.Rect(
                optGrid.rect_x+'',
                optGrid.rect_y+'',
                this.display.square_size+'',
                this.display.square_size+'',
                this.display.square_color
            ),
            new disp.Rect(
                nonOptGrid.rect_x+'',
                nonOptGrid.rect_y+'',
                this.display.square_size+'',
                this.display.square_size+'',
                this.display.square_color
            )
        ]);
        result.add_texts([
            new disp.Text(
                optTargDigit+'',
                optGrid.x+'',
                optGrid.y+'',
                'white',
                this.display.digit_size,
                'acvs-digit'
            )
        ]);
        result.add_texts([
            new disp.Text(
                nonOptTargDigit+'',
                nonOptGrid.x+'',
                nonOptGrid.y+'',
                'white',
                this.display.digit_size,
                'acvs-digit'
            )
        ]);

        // Then add distractor squares
        for ( let [i, grid] of gridPos ) {
            if ( i !== optTargIndex && i !== nonOptTargIndex) { // if non-target
                if ( getRegionOf(grid.alpha) !== 0 ) {   // if not on the region boundary lines
                    // Add the rect
                    result.add_a_rect( new disp.Rect(
                        grid.rect_x+'',
                        grid.rect_y+'',
                        this.display.square_size+'',
                        this.display.square_size+'',
                        this.display.square_color,
                        'acvs-digit'
                    ));
                    // And the digit
                    result.add_a_text( new disp.Text(
                        util.Util.select_rand_from_array( this.distractorDigits ) +'',
                        grid.x,
                        grid.y,
                        'white',
                        this.display.digit_size,
                        'acvs-digit'
                    ));
                }
            }
        }

        this._add_a_cue( result, optTargRegion, nonOptTargRegion );

        return result;

    }

    /**
     * Given an optTargRegion and nonOptTargRegion combination, generate a cue
     * that indicates these two regions.
     * 
     * @returns {disp.DisplayDataset}
     * 
     * TODO: Remove unused params
     */
    _make_cue_display(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargRegion, nonOptTargRegion) {
        let result = new disp.DisplayDataset();
        // Draw a circle on the center of the screen
        this._add_a_cue( result, optTargRegion, nonOptTargRegion );
        return result;
    }


    /**
     * Given a display dataset and opt/nonopt regions, add to the dataset a
     * circle cue at the center of the display.
     * 
     * @param {disp.DisplayDataset} dispDataset : A display dataset that needs to add the cue to
     * @param {number} optTargRegion 
     * @param {number} nonOptTargRegion 
     * 
     */
    _add_a_cue( dispDataset, optTargRegion, nonOptTargRegion ) {

        // Get some useful variables
        const x = this.display.screen_center_x, y = this.display.screen_center_y;
        const r = this.display.cue_radius;
        const color = this.display.square_color;
        const sw = this.display.cue_stroke_width;

        // Draw a circle on the center of the screen
        dispDataset.add_a_circle(new disp.Circle(
            x, y, r, null, color, sw
        ));

        // optTargRegion = 1, 2, 3
        // Draw region boundary line #1 (smaller rotation from origin)
        dispDataset.add_a_line(new disp.Line(
            x,
            y,
            x + Math.cos(Math.PI/2 + 2*Math.PI/3*(optTargRegion-1)) * r ,
            y + Math.sin(Math.PI/2 + 2*Math.PI/3*(optTargRegion-1)) * r,
            color,
            sw
        ));

        // Draw region boundary line #2 (larger rotation from origin)
        dispDataset.add_a_line(new disp.Line(
            x,
            y,
            x + Math.cos(Math.PI/2 + 2*Math.PI/3*optTargRegion) * r ,
            y + Math.sin(Math.PI/2 + 2*Math.PI/3*optTargRegion) * r,
            color,
            sw
        ));
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
            result.push([
                this._make_cue_display( ...currentTrialCond ), 
                this._make_stimuli_display( ...currentTrialCond )
            ])
        }
        return result;
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