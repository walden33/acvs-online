/**
 * ACOL-6 is an experiment to test the internal consistency of the Standard
 * Preview ACVS. It has 6 blocks * 84 trials, and takes less than an hour to
 * finish.
 * This version uses updated display generator classes separated from experiment
 * logic to independent display logic.
 * 
 * @author Walden Y. Li
 */
exp.ACOL6 = class extends exp.ExperimentKernel {

    constructor() {

        super();
        //
        // Set up the database
        //
        this._db.experiment_type = "ACOL-6";

        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("Event");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        this._db.add_new_table("_user_data");

        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        const NUM_INSTR_SLIDES = 9;
        const INSTR_ROOT = "https://psy-ccl.asc.ohio-state.edu/files/instr/acol-6/";
        const INSTR_FILE_EXT = "jpeg";
        for (let i = 1; i <= NUM_INSTR_SLIDES; i++) {

            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.${INSTR_FILE_EXT}>`], " "));
        }
        // }


        // Practice block
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new disp.StandardDisplayGenerator(true, 12, 10),    // is practice block; has preview
            [0, 400, 1400]  // timing
        ));

        const NUM_TASK_BLOCK = 6;
        // Experimental blocks
        for (let i = 1; i <= NUM_TASK_BLOCK; i++) {
            this.add_new_step(new exp.Block(
                this._db,
                i,  // block number
                new disp.StandardDisplayGenerator(true, 84),    // is not practice block; has preview
                [0, 400, 1400]  // timing
            ));
        }

        this.add_new_step(new exp.SubmitDataStep(this._db));
    }
}

