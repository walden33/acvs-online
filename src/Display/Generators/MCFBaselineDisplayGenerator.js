/**
 * The <DisplayGenerator> class for the baseline task of the MCF task. A
 * baseline task block constitutes of 20 trials of single-target mouse clicking
 * task where a participant is asked to click on the center of the 
 * For a display generator class, a total of 40 different 
 * 
 * @author Walden Y. Li
 * @version 1.2 (06/30/2021)
 * 
 * @update 1.2 (06/30/21) Changed return object for block dataset
 * @created 01/31/2021
 */
disp.MCFBaselineDisplayGenerator = class extends disp.MCFDisplayGenerator {

    constructor() {

        super();

        this._targ_pos_pool = [
            17, 18, 19, 20, 21, 22,
            25, 26, 27, 28, 29, 30,
            33, 34, 35, 36, 37, 38,
            41, 42, 43, 44, 45, 46,
            49, 50, 51, 52, 53, 54,
            57, 58, 59, 60, 61, 62
        ];
        this._grid_pos = this._get_grid_pos();

        this._block_displays = this._make_block_displays();

    }

    _make_trial_display(targ_pos) {
        let result = new disp.DisplayDataset();
        const x = this._grid_pos.get(targ_pos)[0];
        const y = this._grid_pos.get(targ_pos)[1];
        result.add_a_text(new disp.Text(
            '+',
            x,
            y,
            'white',
            3,
            undefined,
            "mcf_baseline_target_cross",
            `cross_${x.toFixed(2)}_${y.toFixed(2)}`
        ));
        return result;
    }

    _make_block_displays() {
        let result = [];
        // Shuffle target positions for each trial
        util.Util.fisher_yates_shuffle(this._targ_pos_pool);
        // For each position, generate a trial
        this._targ_pos_pool.forEach((pos) => {
            result.push({
                logic: null,
                stimuli: this._make_trial_display(pos)
            });
        });
        return result;
    }


    static generate_a_fixation() {
        let result = new disp.DisplayDataset();

        return result;
    }

}
