exp.AbstractTrialDataGenerator = class {

    constructor() {
        this.targetDigits = [2, 3, 4, 5];
        this.distractorDigits = [6, 7, 8, 9];
        this.display = new disp.Display();
        this.blockData = [];
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