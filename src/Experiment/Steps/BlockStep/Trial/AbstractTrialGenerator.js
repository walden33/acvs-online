exp.AbstractTrialGenerator = class {

    constructor() {
    }

    yield_trial_dataset() {
        throw( "Abstract method called." )
    }

}