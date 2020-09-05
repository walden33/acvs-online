/**
 * <Block> represents a block of ACVS experiment.
 * 
 * @package acvs-online
 * @author Walden Li
 * @version 1.4 (8/30/2020)
 */
exp.Block = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} blockNo 
     * @param {string} blockType
     * @param {exp.TrialDataGenerator} dataGenerator 
     */
    constructor(db, blockNo, blockType, dataGenerator) {

        super();

        this._db = db;

        this._blockNo = blockNo;

        this._blockType = blockType;

        this._display_dataset_generator = dataGenerator;

        // array of 1s & 0s for "correct" & "incorrect" for each trial
        this._accuracy_data = [];

        // array of all of the data for all for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;

    }


    /**
     * 
     * @param {exp.TrialInfo} logic : the condition of the trial
     * @param {Array<disp.DisplayDataset>} cue : an array (usually one element) that contains the cue <DisplayDataset>(s) for the trial
     * @param {Array<disp.DisplayDataset>} stimuli : array (also usually one element) that contains the stimuli <DisplayDataset>(s) for the trial
     */
    _construct_trial( logic, cue, stimuli ) {
        switch( this._blockType ) {
            case "Standard":
                return new exp.Trial( logic, cue, stimuli );
        }
    }

}