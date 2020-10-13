/**
 * ACOL-8 is a pilot experiment for letter cue acvs. We are interested in the
 * distribution of proportion optimal in this task.
 * 
 * @author Walden Li
 */
exp.ACOL8 = class extends exp.ExperimentKernel {

    constructor() {

        super();
        //
        // Set up the database
        //
        this._db.experiment_type = "ACOL-8";

        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("Event");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        this._db.add_new_table("_user_data");

        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        const NUM_INSTR_SLIDES = 10;
        const INSTR_ROOT = "https://psy-ccl.asc.ohio-state.edu/files/instr/acol-8/";
        const INSTR_FILE_EXT = "JPG";
        for (let i = 1; i <= NUM_INSTR_SLIDES; i++) {

            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.${INSTR_FILE_EXT}>`], " "));
        }
        // }


        // Practice block for Color Cue ACVS
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new exp.SpatialLetterCueDisplayGenerator(true),    // practice block
            [0, 400]  // timing
        ));

        const NUM_TASK_BLOCK = 3;
        // Experimental blocks for Color Cue ACVS
        for (let i = 1; i <= NUM_TASK_BLOCK; i++) {
            this.add_new_step(new exp.Block(
                this._db,
                i,  // block number
                new exp.SpatialLetterCueDisplayGenerator(false),    // not practice block
                [0, 400]  // timing
            ));
        }

        this.add_new_step(new exp.SubmitDataStep(this._db));
    }
}

