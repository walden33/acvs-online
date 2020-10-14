/**
 * A new idea for color cue. Don't know if it will work.
 */
disp.ColorCueDisplayGenerator2 = class extends disp.DisplayGenerator {

    constructor(num_trials, has_preview = false) {
        super();
        this._num_total_trials = num_trials;
        this._has_preview = has_preview;
        this._colors = [
            "rgb(150, 0, 150)", // MAGENTA
            "rgb(0, 115, 115)", // CYAN
            "rgb(179, 107, 0)"  // ORANGE
        ];
        this._trial_conds = this._generate_trial_conditions();
        this._block_data = this._make_block_dataset(this._trial_conds);
    }

    _generate_trial_conditions() {

        let result = [];


    }

}