exp.ColorCueTrialDataGenerator = class extends exp.TrialDataGenerator {

    constructor() {
        super();
        this.numTotalTrials = 0;
        this.colors = [
            "rgb(254, 0, 254)",
            "rgb(0, 150, 150)",
            "rgb(105, 105, 105)"
        ];
    }


    /**
     * Crossed variables: optEcc (3) * nonOptEcc (3) * optDigit (4) * nonOptDigit (3) = 108
     * Balanced variables: opt&nonOpt color combinations (3*2=6)
     * 
     * An example of one row is 3 1 3 4 1 2, which means this trial has an
     * optimal target on the ring furthermost to the center, a digit 3, and is
     * colored MAGENTA, as well as a non-optimal target on the ring closest to
     * the center, a digit 4, and is colored CYAN.
     */
    _generate_trial_conditions() {

        let result = [];


        result = util.Util.fisher_yates_shuffle(result);

        const color_combs = [
            [ [ 1,2 ], [ 1,3 ] ],
            [ [ 2,1 ], [ 2,3 ] ],
            [ [ 3,1 ], [ 3,2 ] ]
        ];

        const opt = this._generate_opt_target_types( 3, 108, 3 );
        const nonOpt = this._generate_opt_target_types( 2, 108, 3 );
        for ( let i=0; i<result.length; i++ ) {
            current_color_comb = color_combs[opt.pop()][nonOpt.pop()];  // get current trial opt & nonOpt color code
            result[i] = result[i].concat( current_color_comb );
        }

    }

}