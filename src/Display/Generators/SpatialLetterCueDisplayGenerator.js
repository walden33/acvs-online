/**
 * A replication of the previous class implementation of the spatial letter cue
 * task display generator under the new framework.  Also enabled an option to
 * generate preview displays where only the letter cue is present.
 */
disp.SpatialLetterCueDisplayGenerator = class extends disp.DisplayGenerator {

    constructor(has_preview = false) {
        super();
        this._is_practice = is_practice;
        this._has_preview = has_preview;
        this._num_total_trials = 84;
        this._cue_letters = ['L', 'U', 'R'];

        // Set task-specific display settings
        this._display.square_color = "rgb(97, 97, 97)";
        this._display.cue_letter_size = this._display.digit_size;
        this._display.cue_letter_shift_x = -0.75;
        this._display.cue_letter_shift_y = 0.75;
        this._display.cue_letter_color = this._display.square_color;

        this._trialConds = this._generate_trial_conditions();
        this._blockData = this._make_block_dataset(this._trialConds);
    }

    /**
     * A method that generates a trial condition matrix (here implemented by a
     * two-dimensional Array).
     */
    _generate_trial_conditions() {

        let result = [];

        // Determine target eccentricity
        let ecc1 = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);
        let ecc2 = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);

        for (let i = 0; i < this._num_total_trials; i++) {
            result.push([ecc1.pop(), ecc2.pop()]);
        }
        util.Util.fisher_yates_shuffle(result);    // shuffle the combination

        // Generate digits
        let digits = this._generate_trial_digits(this._num_total_trials);

        // Then add optimal target regions
        let optRegions = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);
        for (let i = 0; i < result.length; i++) {
            let optRegion = optRegions.pop();
            let nonOptRegion = util.Util.choose_from([1, 2, 3], [optRegion]);
            result[i] = result[i].concat(digits.pop())
                .concat([optRegion, nonOptRegion]);
        }
        return result;
    }

    /**
     * 
     * @param {number} optTargEcc : 1-3
     * @param {number} nonOptTargEcc : 1-3
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit :2-5
     * @param {number} optTargRegion : 1-3
     * @param {number} nonOptTargRegion : 1-3
     * 
     * @returns {disp.DisplayDataset}
     */
    _make_trial_dataset(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargRegion, nonOptTargRegion) {

        const sz = this._display.square_size;

        /**
         * A helper function that tells if a certain grid belongs to an AC
         * Spatial Cue "Region".
         * 
         * @param {number} alpha : the grid's deviation angle (in rad) from origin
         * 
         * @returns {number} : Region number where the grid belongs (0 for region boundary lines)
         */
        const getRegionOf = function(alpha) {
            let region = 0, found = false;
            for (let i = 1; i <= 3 && !found; i++) {
                if ( alpha > 2*Math.PI/3 * (i-1) && alpha < 2*Math.PI/3 * i ) {
                    region = i;
                    found = true;
                }
            }
            return region;
        }

        // Initialize display datasets
        let cue_display = new disp.DisplayDataset();
        let stimuli = new disp.DisplayDataset();

        // Get grid position coordinates
        const gridPos = this._display.get_grid_pos();

        // Add potential targets to pools according to required eccentricity and region
        let optTargPool = [];
        let nonOptTargPool = [];
        let nonTargPool = [];

        for (let [i, grid] of gridPos) {
            let gridRegion = getRegionOf(grid.alpha);
            if (grid.ecc === optTargEcc && gridRegion === optTargRegion) {
                optTargPool.push(i);
            } else if (grid.ecc === nonOptTargEcc && gridRegion === nonOptTargRegion) {
                nonOptTargPool.push(i);
            } else {    // add the rest to non-target pool
                if (gridRegion!==0) nonTargPool.push(i);
            }
        }

        // Randomly select targets
        const optTargPos = util.Util.choose_from(optTargPool, [], false);
        const nonOptTargPos = util.Util.choose_from(nonOptTargPool, [], false);

        // Add the rest to non-target pool
        nonTargPool = nonTargPool.concat(optTargPool).concat(nonOptTargPool);

        // Shuffle the non-target pool
        // util.Util.fisher_yates_shuffle(nonTargPool);


        const optTargGrid = gridPos.get(optTargPos);
        const nonOptTargGrid = gridPos.get(nonOptTargPos);

        // 1. Add two targets

        // 1.1 Add rects
        let optRect = new disp.Rect(
            optTargGrid.rect_x + '',
            optTargGrid.rect_y + '',
            sz + '',
            sz + '',
            this._display.square_color
        );
        let nonOptRect = new disp.Rect(
            nonOptTargGrid.rect_x + '',
            nonOptTargGrid.rect_y + '',
            sz + '',
            sz + '',
            this._display.square_color
        );

        stimuli.add_rects([optRect, nonOptRect]);

        // 1.2 Add digits
        stimuli.add_a_text(new disp.Text(
            optTargDigit + '',
            optTargGrid.x + this._display.digit_shift_x + '',
            optTargGrid.y + this._display.digit_shift_y +'',
            this._display.digit_color,
            this._display.digit_size,
            this._display.digit_class_name
        ));
        stimuli.add_a_text(new disp.Text(
            nonOptTargDigit + '',
            nonOptTargGrid.x + this._display.digit_shift_x + '',
            nonOptTargGrid.y + this._display.digit_shift_y + '',
            this._display.digit_color,
            this._display.digit_size,
            this._display.digit_class_name
        ));

        // 2. Add distractors
        const n = nonTargPool.length;   // number of distractor squares
        for( let i = 0; i <n; i++ ) {
            let grid = gridPos.get(nonTargPool.pop());

            // 2.1 Add distractor rects
            stimuli.add_a_rect( new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._display.square_color
            ));

            // 2.2 Add distractor digits
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractorDigits) + '',
                grid.x + this._display.digit_shift_x + '',
                grid.y + this._display.digit_shift_y + '',
                this._display.digit_color,
                this._display.digit_size,
                this._display.digit_class_name
            ));
        }

        // Add cue to the stimuli frame
        const the_cue = this._make_a_cue( optTargRegion );
        stimuli.merge( the_cue );
        let fixation = new disp.DisplayDataset();
        fixation.add_a_text(new disp.Text(
            '+',
            this._display.screen_center_x,
            this._display.screen_center_y,
            'white',
            this._display.fixation_cross_size,
            this._display.fixation_cross_class_name
        ));

        // Return displays
        return {
            cue: [ fixation ],
            stimuli: [ stimuli ]
        };

    }


    /**
     * Given the optimal target region, produce a letter cue on the center
     * of the display.
     * 
     * @param {number} optTargRegion : 1-3
     */
    _make_a_cue(optTargRegion) {

        let result = new disp.DisplayDataset();

        const letter = this._cue_letters[optTargRegion-1];

        result.add_a_text( new disp.Text(
            letter,
            this._display.screen_center_x + this._display.cue_letter_shift_x,
            this._display.screen_center_y + this._display.cue_letter_shift_y,
            this._display.cue_letter_color,
            this._display.cue_letter_size + '',
            null    // class name
        ));

        return result;
    }


    /**
     * 
     * @param {number} optTargEcc : 1-3
     * @param {number} nonOptTargEcc : 1-3
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit : 2-5
     * @param {number} optTargRegion : 1-5
     * @param {number} nonOptTargRegion : 1-5
     */
    _make_trial_logic(optTargEcc, nonOptTargEcc, optTargDigit, nonOptTargDigit,
        optTargRegion, nonOptTargRegion) {
        return {
            optTargEcc: optTargEcc,
            nonOptTargEcc: nonOptTargEcc,
            optTargDigit: optTargDigit,
            nonOptTargDigit: nonOptTargDigit,
            optTargRegion: optTargRegion,
            nonOptTargRegion: nonOptTargRegion
        };
    }

    /**
     * This method generates a 2D array of <DisplayDataset>. The first dimension
     * is the cue display and the second is the stimuli display in each trial.
     * 
     * @param {Array<number>} trialConds 
     */
    _make_block_dataset(trialConds) {
        let trial_conditions = trialConds.slice();  // make a copy
        let result = [];
        let currentTrialCond;
        while (trial_conditions.length > 0) {
            currentTrialCond = trial_conditions.pop();
            let currentTrialDisplays = this._make_trial_dataset(...currentTrialCond);
            let currentTrialLogic = this._make_trial_logic(...currentTrialCond);
            result.push(
                {
                    logic: currentTrialLogic,
                    cue: currentTrialDisplays.cue,
                    stimuli: currentTrialDisplays.stimuli
                }
            )
        }
        if (this._is_practice) result = result.slice(0, 10);
        return result;
    }

}