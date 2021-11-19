/**
 * The experiment that correlates Standard ACVS with Color Cue ACVS, where
 * participants do 3 blocks of Standard, followed by 3 blocks of Color Cue.
 */
exp.ACOL7 = class extends exp.ExperimentKernel {

    constructor() {

        super();
        //
        // Set up the database
        //
        this._db.experiment_type = "ACOL-7";

        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("Event");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        this._db.add_new_table("_user_data");

        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        // local variables
        const NUM_TASK1_INSTR_SLIDES = 10;
        const NUM_TASK2_INSTR_SLIDES = 10;
        const INSTR_ROOT = "https://psy-ccl.asc.ohio-state.edu/files/instr/acol-7/";
        const INSTR_FILE_EXT = "jpeg";
        const NUM_TASK1_BLOCK = 3;
        const NUM_TASK2_BLOCK = 3;

        // Instructions for Standard ACVS
        for (let i = 1; i <= NUM_TASK1_INSTR_SLIDES; i++) {
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.${INSTR_FILE_EXT}>`], " "));
        }

        // Practice block for Standard ACVS
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
            [0, 400, 1400]  // timing
        ));

        // Experimental blocks for Standard ACVS
        for (let i = 1; i <= NUM_TASK1_BLOCK; i++) {
            this.add_new_step(new exp.Block(
                this._db,
                i,  // block number
                new disp.StandardDisplayGenerator(84),    // is not practice block; has preview
                [0, 400, 1400]  // timing
            ));
        }

        // Instruction slide for the task interval
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${NUM_TASK1_INSTR_SLIDES+1}.${INSTR_FILE_EXT}>`], " "));

        // Instructions for Color Cue ACVS
        for (let i = NUM_TASK1_INSTR_SLIDES + 1 + 1; i <= NUM_TASK1_INSTR_SLIDES + 1 + NUM_TASK2_INSTR_SLIDES; i++) {
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.${INSTR_FILE_EXT}>`], " "));
        }

        // Practice block for Color Cue ACVS
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new disp.ColorCueDisplayGenerator(12, 10),    // is practice block; has preview
            [0, 400, 1400]  // timing
        ));

        // Experimental blocks for Color Cue ACVS
        for (let i = NUM_TASK1_BLOCK + 1; i <= NUM_TASK1_BLOCK + NUM_TASK2_BLOCK; i++) {
            this.add_new_step(new exp.Block(
                this._db,
                i,  // block number
                new disp.ColorCueDisplayGenerator(84),    // is not practice block; has preview
                [0, 400, 1400]  // timing
            ));
        }



        this.add_new_step(new exp.SubmitDataStep(this._db));
    }
}

