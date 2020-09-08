/**
 * The classical ACVS as in Irons & Leber (2018).
 * 
 * RED optimal trials: 13 RED, 27 BLUE, 14 GREEN
 * BLUE optimal trials: 27 RED, 13 BLUE, 14 GREEN
 * 
 * @package acvs-online
 * @version 1.4 (9/7/2020)
 * @author Walden Li
 */
exp.StandardTrialDataGenerator = class extends exp.TrialDataGenerator {

    constructor(is_practice = false, has_preview = false) {
        super();
        this._is_practice = is_practice; // if block is practice block, _make_block_dataset will return only 10 trials
        this._has_preview = has_preview; // if task has preview, _make_stimuli_dataset will return both preview and search array displays
        this._numTotalTrials = 108;
        this._colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 150, 0)"
        ];
        // 1+1+14+12+12+14=54
        this._numGreenDist = 14;
        this._numRedDist = 12;
        this._numBlueDist = 12;
        this._numVarDist = 14;
        this._trialConds = this._generate_trial_conditions();
        this._blockData = this._make_block_dataset(this._trialConds);
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
                    for (let d2 = 2; d2 <= 5; d2++) {
                        if (d1 !== d2) result.push([ecc1, ecc2, d1, d2]);
                    }
                }
            }
        }
        result = util.Util.fisher_yates_shuffle(result);

        let optTargColorArray = this._generate_opt_target_types(2, this._numTotalTrials, 6);
        let optColor, nonOptColor;  // temp vars for each trial
        for (let i = 0; i < result.length; i++) {
            optColor = optTargColorArray.pop();
            optColor === 1 ? nonOptColor = 0 : nonOptColor = 1;
            result[i] = result[i].concat([optColor, nonOptColor]);
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
    _make_trial_dataset(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor) {
        const x = this._display.screen_center_x;
        const y = this._display.screen_center_y;
        const sz = this._display.square_size;

        let fixation = new disp.DisplayDataset();
        let preview = new disp.DisplayDataset();
        let stimuli = new disp.DisplayDataset();

        const gridPos = this._display.get_grid_pos();

        const targPosInfo = this._generate_target_pools_by_ecc(gridPos, optTargEcc, nonOptTargEcc);
        const optTargPos = targPosInfo.optTargPos;
        const nonOptTargPos = targPosInfo.nonOptTargPos;
        const nonTargPool = targPosInfo.nonTargPool;

        const optTargGrid = gridPos.get(optTargPos);
        const nonOptTargGrid = gridPos.get(nonOptTargPos);

        // 1. Add two targets

        // 1.1 Add rects to both preivew and stimuli (if a preview is ordered)
        let optRect = new disp.Rect(
            optTargGrid.rect_x + '',
            optTargGrid.rect_y + '',
            sz + '',
            sz + '',
            this._colors[optTargColor]
        );
        let nonOptRect = new disp.Rect(
            nonOptTargGrid.rect_x + '',
            nonOptTargGrid.rect_y + '',
            sz + '',
            sz + '',
            this._colors[nonOptTargColor]
        );

        stimuli.add_rects([optRect, nonOptRect]);

        if (this._has_preview) preview.add_rects([optRect, nonOptRect]);

        // 1.2 Add digits to stimuli but not preview
        stimuli.add_a_text(new disp.Text(
            optTargDigit + '',
            optTargGrid.x + '',
            optTargGrid.y + '',
            this._display.digit_color,
            this._display.digit_size,
            this._display.digit_class_name
        ));
        stimuli.add_a_text(new disp.Text(
            nonOptTargDigit + '',
            nonOptTargGrid.x + '',
            nonOptTargGrid.y + '',
            this._display.digit_color,
            this._display.digit_size,
            this._display.digit_class_name
        ));

        // 2. Add GREEN distractor rects and digits. They can be of any digit.
        for (let i = 0; i < this._numGreenDist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 2.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[2]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 2.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._targetDigits.concat(this._distractorDigits)) + '',
                grid.x + '',
                grid.y + '',
                this._display.digit_color,
                this._display.digit_size,
                this._display.digit_class_name
            ));
        }

        // 3. Add RED distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._numRedDist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 3.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[0]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 3.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractorDigits) + '',
                grid.x + '',
                grid.y + '',
                this._display.digit_color,
                this._display.digit_size,
                this._display.digit_class_name
            ));
        }

        // 4. Add BLUE distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._numBlueDist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 4.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                this._colors[1]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 4.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractorDigits) + '',
                grid.x + '',
                grid.y + '',
                this._display.digit_color,
                this._display.digit_size,
                this._display.digit_class_name
            ));
        }

        // 5. Add variable distractor rects and digits
        for (let i = 0; i < this._numVarDist; i++) {

            let j = nonTargPool.pop();  // grid position number
            let grid = gridPos.get(j);  // grid info

            // 5.1 add rects to both preview and stimuli
            let currentRect = new disp.Rect(
                grid.rect_x + '',
                grid.rect_y + '',
                sz + '',
                sz + '',
                // if opt targ color is RED, var dist color should be blue, and vice versa
                optTargColor === 0 ? this._colors[1] : this._colors[0]
            );
            stimuli.add_a_rect(currentRect);
            if (this._has_preview) preview.add_a_rect(currentRect);

            // 5.2 add digits to only stimuli
            stimuli.add_a_text(new disp.Text(
                util.Util.select_rand_from_array(this._distractorDigits) + '',
                grid.x + '',
                grid.y + '',
                this._display.digit_color,
                this._display.digit_size,
                this._display.digit_class_name
            ));
        }

        // Finally, generate a fixation cross to everything
        const fixation_text = new disp.Text(
            '+', x, y, 'white', 3, this._display.fixation_cross_class_name
        );

        fixation.add_a_text(fixation_text);
        if (this._has_preview) preview.add_a_text(fixation_text);
        stimuli.add_a_text(fixation_text);


        // Decide if return includes a preview
        if (this._has_preview) {
            return {
                cue: [fixation, preview],
                stimuli: [stimuli]
            }
        }
        return {
            cue: [fixation],
            stimuli: [stimuli]
        }

    }


    _make_trial_logic(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor) {
        return (
        {
            optTargEcc: optTargEcc,
            nonOptTargEcc: nonOptTargEcc,
            optTargDigit: optTargDigit,
            nonOptTargDigit: nonOptTargDigit,
            optTargColor: optTargColor,
            nonOptTargColor: nonOptTargColor
        }
        );
    }

    /**
     * 
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
                    "logic": currentTrialLogic,
                    "cue": currentTrialDisplays.cue,
                    "stimuli": currentTrialDisplays.stimuli
                }
            );
        }
        if (this._is_practice) return result.slice(0, 10);
        return result;
    }

}