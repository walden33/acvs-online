/**
 * <Block> represents a block of Standard ACVS experiment.
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
     * @param {exp.TrialDataGenerator} dataGenerator 
     */
    constructor(db, blockNo, dataGenerator) {

        super();

        this._db = db;
        this._blockNo = blockNo;

        // this._display_dataset_generator = new exp.StandardTrialDataGenerator();

        // array of 1s & 0s for "correct" & "incorrect" for each trial
        this._accuracy_data = [];

        // array of all of the data for all for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;

    }

    _construct_trial() {
    }

}