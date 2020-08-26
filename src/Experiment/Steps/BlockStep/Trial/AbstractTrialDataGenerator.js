exp.AbstractTrialDataGenerator = class {

    constructor() {
        this.targetDigits = [2, 3, 4, 5];
        this.distractorDigits = [6, 7, 8, 9];
        this.display = new disp.Display();
    }

    yield_trial_dataset() {
        throw( "Abstract method called." )
    }

}