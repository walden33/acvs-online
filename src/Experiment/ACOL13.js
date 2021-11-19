/**
 * ACOL-13 is the first attempt to Temporal ACVS.
 * 
 * @author Walden Li
 */
exp.ACOL13 = class extends exp.ExperimentKernel {

    constructor() {

        super();
        //
        // Set up the database
        //
        this._db.experiment_type = "ACOL-13";

        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("Event");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        this._db.add_new_table("_user_data");

        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        const NUM_INSTR_SLIDES = 8;
        const INSTR_ROOT = "https://psy-ccl.asc.ohio-state.edu/files/instr/acol-13/";
        const INSTR_FILE_EXT = "jpeg";
        for (let i = 1; i <= NUM_INSTR_SLIDES; i++) {

            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.${INSTR_FILE_EXT}>`], " "));
        }
        // }


        // Practice block
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new disp.TemporalDisplayGenerator(12, 10),    // practice block
            [0, 400, 600, 850]  // timing
        ));

        const NUM_TASK_BLOCK = 3;
        // Experimental blocks
        for (let i = 1; i <= NUM_TASK_BLOCK; i++) {
            this.add_new_step(new exp.Block(
                this._db,
                i,  // block number
                new disp.TemporalDisplayGenerator(84),    // not practice block
                [0, 400, 600, 850]  // timing
            ));
        }

        this.add_new_step(new exp.SubmitDataStep(this._db));
    }
}

