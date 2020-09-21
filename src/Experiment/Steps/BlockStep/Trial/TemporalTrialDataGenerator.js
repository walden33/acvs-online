/**
 * This is a generator class for temporal acvs experiment. It creates an array
 * of three-object arrays including one logic and two disp.DisplayDataset arrays
 * representing the trial logic and display content for the cue and RSVP stream
 * for every trial.
 * 
 * @tutorial Instantiate where block data needed. Call yield_trial_dataset()
 * public method to get the data of the next trial. Do not change private
 * variables. Change public variables specifc to display settings if needed.
 * 
 * @todo Move common variables to super constructor
 * 
 * @package acvs-online
 * @version 1.2 (09/20/2020)
 * @author Walden Li
 */
exp.TemporalTrialDataGenerator = class extends exp.TrialDataGenerator {

    constructor() {

        // The super() constructor inherits _targetDigits, _distractorDigits,
        // _display, and the initialized _blockData.
        super();

        this._display.digit_size = 14;
        this._display.digit_shift_x = - 2.5;
        this._display.digit_shift_y = 2.5;
        this._display.cue_size = 12;
        this._display.cue_shift_x = -2.7;
        this._display.cue_shift_y = 2.5;

        // Task-specific display settings
        this.colors = [
            "rgb(255, 50, 50)",
            "rgb(50, 50, 255)",
            "rgb(50, 255, 50)",
            "rgb(128, 128, 128)"
        ];
        this.targColorIndexPool = [0, 1];
        this.distractorColorIndexPool = [0, 1, 2, 3];
        // The offset between two digit in one stimulus frame
        this.stimHorizOffset = 2;
        this.stimVertOffset = 2;
        this.firstDigitX = this._display.screen_center_x - this.stimHorizOffset / 2 + this._display.digit_shift_x;
        this.firstDigitY = this._display.screen_center_y - this.stimVertOffset / 2 + this._display.digit_shift_y;
        this.secondDigitX = this._display.screen_center_x + this.stimHorizOffset / 2 + this._display.digit_shift_x;
        this.secondDigitY = this._display.screen_center_y + this.stimVertOffset / 2 + this._display.digit_shift_y;

        // Trial settings
        this.numFrames = 20;
        this.isi = 250;
        this.trialDuration = this.numFrames * this.isi;
        this.preTargFillerRSVPPositionPool = [1, 2, 3, 4];
        this.optTargRSVPPositionPool = [5, 6, 7, 8];
        this.nonOptTargRSVPPositionPool = [9, 10, 11, 12];
        this.postTargFillerRSVPPositionPool = [13, 14, 15, 16];

        // Block settings
        this.numTotalTrials = 96;   // 24*4
        this.targetTypes = [1, 2];  // 1 for RED optimal and 2 for BLUE optimal

        // Create final display dataset
        this._trialConds = this._generate_trial_conditions();
        this._blockData = this._make_block_dataset(this._trialConds);
    }

    /**
     * A method that generates a trial condition matrix (here implemented by a
     * two-dimensional Array).
     * 
     * Crossed vars: optDigit (4) * nonoptDigit (3) * optColor(2) = 24
     * Randomized vars: opt and nonOpt targ RSVP positions. Randomly drawn from
     * a target position pool.
     */
    _generate_trial_conditions() {
        let result = [];
        for (let rep = 0; rep < 4; rep++) { // rep for times so that 24*4=96 = total trials in block
            for (let color = 0; color <= 1; color++) {
                for (let d1 = 2; d1 <= 5; d1++) {
                    for (let d2 = 2; d2 <= 5; d2++) {
                        if (d1 != d2)
                            result.push([d1, d2, color, color === 0 ? 1 : 0]);
                    }
                }
            }
        }

        util.Util.fisher_yates_shuffle(result);    // shuffle the combination

        // Then add optimal and non-optimal target positions
        for (let i = 0; i < result.length; i++) {
            let optTargRSVPPos = util.Util.select_rand_from_array(this.optTargRSVPPositionPool);
            let nonOptTargRSVPPosition = util.Util.select_rand_from_array(this.nonOptTargRSVPPositionPool);
            result[i] = result[i].concat([optTargRSVPPos, nonOptTargRSVPPosition]);
        }
        return result;
    }

    /**
     * This method creates a cue display and all frames of stimuli in a trial
     * given optimal target digit, non-optimal target digit, optimal target
     * color index, non-optimal target color index, optimal target position in
     * the RSVP stream, and non-optimal target position in the RSVP stream.
     * 
     * @param {number} optTargDigit : 2-5
     * @param {number} nonOptTargDigit : 2-5
     * @param {number} optTargColor : 0-1
     * @param {number} nonOptTargColor : 0-1
     * @param {number} optTargRSVPPosition : 
     * @param {number} nonOptTargRSVPPosition :
     */
    _make_trial_dataset(optTargDigit, nonOptTargDigit, optTargColorIndex,
        nonOptTargColorIndex, optTargRSVPPosition, nonOptTargRSVPPosition) {

        // Initialize return objects
        let cue_display = new disp.DisplayDataset();
        let rsvp_stream = [];

        // Create 2D trial arrays of digit and color. In every array, each
        // dimension represents one of the two superimposed stimulus.
        let digits = [[], []];
        let colors = [[], []];
        for (let i = 0; i < this.numFrames; i++) {
            if (i === optTargRSVPPosition - 1) {   // if current frame shows the opt targ
                // Add optimal target digit and color to one of the superimposed place
                let targ = Math.round(Math.random());    // random 0 or 1; index to put the target
                let nontarg = targ === 1 ? 0 : 1;    // corresponding index for the non-target
                digits[targ].push(optTargDigit);
                digits[nontarg].push(
                    util.Util.choose_from(
                        this._distractorDigits,
                        [   // exclude the one from last trial and the one next to it
                            i === 0 ? undefined : digits[nontarg][i - 1],
                            optTargDigit
                        ]
                    )
                );
                colors[targ].push(optTargColorIndex);
                colors[nontarg].push(
                    util.Util.choose_from(
                        this.distractorColorIndexPool,
                        [   // exclude the one from last trial and the one next to it
                            i === 0 ? undefined : colors[nontarg][i - 1],
                            optTargColorIndex
                        ]
                    )
                );
            } else if (i === nonOptTargRSVPPosition - 1) {  // if current frame shows the non opt targ
                // Add non-optimal target digit and color to one of the superimposed place
                let targ = Math.round(Math.random());    // random 0 or 1; index to put the optimal target
                let nontarg = targ === 1 ? 0 : 1;   // corresponding index for the non-optimal target
                digits[targ].push(nonOptTargDigit);
                digits[nontarg].push(
                    util.Util.choose_from(
                        this._distractorDigits,
                        [   // exclude the one from last trial and the one next to it
                            i === 0 ? undefined : digits[nontarg][i - 1],
                            nonOptTargDigit
                        ]
                    )
                );
                colors[targ].push(nonOptTargColorIndex);
                colors[nontarg].push(
                    util.Util.choose_from(
                        this.distractorColorIndexPool,
                        [   // exclude the one from last trial and the one next to it
                            i === 0 ? undefined : colors[nontarg][i - 1],
                            nonOptTargColorIndex
                        ]
                    )
                );
            } else {    // if current frame shows a filler
                // Add two fillers
                for (let j = 0; j < 2; j++) {
                    // First choose color and then choose digit, and if the
                    // color if a distractor color, we can put target digits
                    // on it
                    colors[j].push(
                        util.Util.choose_from(
                            this.distractorColorIndexPool,
                            [
                                i === 0 ? undefined : colors[j][i - 1], // color from last trial
                                j === 0 ? undefined : colors[0][i]
                            ]
                        )
                    );
                    digits[j].push(
                        util.Util.choose_from(
                            this.targColorIndexPool.includes(colors[j][i]) ?    // if color is a targ color
                                this._distractorDigits :
                                this._distractorDigits.concat(this._targetDigits)
                                ,
                            [
                                i === 0 ? undefined : digits[j][i - 1], // digit from last trial
                                j === 0 ? undefined : digits[0][i]  // digit next to it
                            ]
                        )
                    );
                }
            }
        }

        // Create RSVP stream 
        for (let i = 0; i < this.numFrames; i++) {
            let stim = new disp.DisplayDataset();
            for (let j = 0; j < 2; j++) {
                stim.add_a_text(new disp.Text(
                    digits[j][i] + '',
                    j === 0 ? this.firstDigitX + '' : this.secondDigitX + '',
                    j === 0 ? this.firstDigitY + '' : this.secondDigitY + '',
                    this.colors[colors[j][i]],
                    this._display.digit_size,
                    null
                ))
            }

            rsvp_stream.push(stim);
        }

        // Create the cue
        cue_display.add_a_text(new disp.Text(
            optTargColorIndex === 0 ? "R" : "B",
            this._display.screen_center_x + this._display.cue_shift_x,
            this._display.screen_center_y + this._display.cue_shift_y,
            this._display.letter_cue_color,
            this._display.cue_size + '',
            null
        ));

        return {
            cue: cue_display,
            stimuli: rsvp_stream
        }
    }

    _make_trial_logic(optTargDigit, nonOptTargDigit, optTargColorIndex,
        nonOptTargColorIndex, optTargRSVPPosition, nonOptTargRSVPPosition) {
        return (
            {
                optTargDigit: optTargDigit,
                nonOptTargDigit: nonOptTargDigit,
                optTargColorIndex: optTargColorIndex,
                nonOptTargColorIndex: nonOptTargColorIndex,
                optTargRSVPPosition: optTargRSVPPosition,
                nonOptTargRSVPPosition: nonOptTargRSVPPosition
            }
        );
    }

    /**
     * This method generates an object of three elements:
     *   0: logic
     *   1: cue
     *   2: stimuli
     * Called when class is instantiated.
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
            );
        }
        return result;
    }


}