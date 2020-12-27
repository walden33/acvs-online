/**
 * ACIT Experiment with 4 counterbalance versions
 * ACIT1: Instruction Standard + Color Cue
 * ACIT2: Instruction Color Cue + Standard
 * ACIT3: Control Standard + Color Cue (ACOL12)
 * ACIT4: Control Color Cue + Standard
 */
exp.ACIT = class extends exp.ExperimentKernel {
    constructor() {

        super();
        //
        // Set up the database
        //
        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("Event");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        this._db.add_new_table("_user_data");

        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        const INSTR_FILE_EXT = "jpeg";
        const NUM_TASK1_BLOCK = 2;
        const NUM_TASK2_BLOCK = 2;

        // Get determine version based on counterbalance id
        const version_id = parseInt(util.Util.get_cb_id()) % 4;

        // if (Math.random() < 0.5) {
        if (version_id === 1 || version_id === 3) {
            // If first task is Standard ACVS (ACIT 1 & 3)
            let instr_root = "";
            let num_task1_instr_slides = 0;
            let num_task2_instr_slides = 0;
            // if (Math.random() < 0.5) {
            if (version_id === 1) {
                // If first task is informed
                this._db.experiment_type = "ACIT-1";
                num_task1_instr_slides = 10;
                num_task2_instr_slides = 10;
                instr_root = "https://exp.leberatory.org/files/instr/acit-1/";
            } else {
                // If first task is control
                this._db.experiment_type = "ACIT-3";
                num_task1_instr_slides = 9;
                num_task2_instr_slides = 10;
                instr_root = "https://exp.leberatory.org/files/instr/acit-3/";
            }

            // Instructions for Standard ACVS
            for (let i = 1; i <= num_task1_instr_slides; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${instr_root}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // Practice block for Standard ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // Experimental blocks for Standard ACVS
            for (let i = 1; i <= num_task1_instr_slides; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.StandardDisplayGenerator(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }

            // Instruction slide for the task interval
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${instr_root}${num_task1_instr_slides + 1}.${INSTR_FILE_EXT}>`], " "));

            // Instructions for Color Cue ACVS
            for (let i = num_task1_instr_slides + 1 + 1; i <= num_task1_instr_slides + 1 + num_task2_instr_slides; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${instr_root}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // Practice block for Color Cue ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.ColorCueDisplayGenerator2(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // Experimental blocks for Color Cue ACVS
            for (let i = NUM_TASK1_BLOCK + 1; i <= NUM_TASK1_BLOCK + NUM_TASK2_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.ColorCueDisplayGenerator2(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
        } else {
            // If first task is Color Cue ACVS (ACIT 2 & 4)
            let instr_root = "";
            let num_task1_instr_slides = 0;
            let num_task2_instr_slides = 0;
            // if (Math.random() < 0.5) {
            if (version_id === 2) {
                // If first task is informed
                this._db.experiment_type = "ACIT-2";
                num_task1_instr_slides = 12;
                num_task2_instr_slides = 8;
                instr_root = "https://exp.leberatory.org/files/instr/acit-2/";
            } else {
                // If first task is control
                this._db.experiment_type = "ACIT-4";
                num_task1_instr_slides = 11;
                num_task2_instr_slides = 8;
                instr_root = "https://exp.leberatory.org/files/instr/acit-4/";
            }

            // Instructions for Color Cue ACVS
            for (let i = 1; i <= num_task1_instr_slides; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${instr_root}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // Practice block for Color Cue ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.ColorCueDisplayGenerator2(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // Experimental blocks for Color Cue ACVS
            for (let i = 1; i <= NUM_TASK1_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.ColorCueDisplayGenerator2(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }

            // Instruction slide for the task interval
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${instr_root}${num_task1_instr_slides + 1}.${INSTR_FILE_EXT}>`], " "));

            // Instructions for Standard ACVS
            for (let i = num_task1_instr_slides + 1 + 1; i <= num_task1_instr_slides + 1 + num_task2_instr_slides; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${instr_root}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // Practice block for Standard ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // Experimental blocks for Standard ACVS
            for (let i = NUM_TASK1_BLOCK + 1; i <= NUM_TASK1_BLOCK + NUM_TASK2_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.StandardDisplayGenerator(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
        }



        this.add_new_step(new exp.SubmitDataStep(this._db));
    }
}
