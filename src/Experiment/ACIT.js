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
        const NUM_TASK1_BLOCK = 1;
        const NUM_TASK2_BLOCK = 1;
        const NUM_STANDARD_INSTR_PAGES = 0;
        const NUM_COLORCUE_INSTR_PAGES = 0;
        const NUM_STANDARD_INFO_PAGES = 1;
        const NUM_COLORCUE_INFO_PAGES = 1;

        // Get determine version based on counterbalance id
        // Possible values for version_id: 1, 2, 3, 0
        const version_id = parseInt(util.Util.get_cb_id()) % 4;

        if (version_id === 1) {
            // Standard ACVS informed + Color Cue ACVS
            this._db.experiment_type = "ACIT-1-Info-Standard+Cue";
            const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acit-1/";
            // 1. Instructions for Standard ACVS
            for (let i = 1; i <= NUM_STANDARD_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 2. Practice trials for Standard ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 3. Optimal strategy info for Standard ACVS
            for (let i = NUM_STANDARD_INSTR_PAGES+1; i <= NUM_STANDARD_INSTR_PAGES + NUM_STANDARD_INFO_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 4. Experimental blocks for Standard ACVS
            for (let i = 1; i <= NUM_TASK1_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.StandardDisplayGenerator(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
            // 5. Task interval
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${NUM_STANDARD_INSTR_PAGES + NUM_STANDARD_INFO_PAGES + 1}.${INSTR_FILE_EXT}>`], " "));
            // 6. Instructions for Color Cue ACVS
            for (let i = NUM_STANDARD_INSTR_PAGES + NUM_STANDARD_INFO_PAGES + 1 + 1; i <= NUM_STANDARD_INSTR_PAGES + NUM_STANDARD_INFO_PAGES + 1 + NUM_COLORCUE_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 7. Practice trials for Color Cue ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.ColorCueDisplayGenerator2(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 8. Experimental blocks for Color Cue ACVS
            for (let i = NUM_TASK1_BLOCK + 1; i <= NUM_TASK1_BLOCK + NUM_TASK2_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.ColorCueDisplayGenerator2(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
        } else if (version_id === 2) {
            // Color Cue ACVS informed + Standard ACVS
            this._db.experiment_type = "ACIT-2-Info-Cue+Standard";
            const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acit-2/";
            // 1. Instructions for Color Cue ACVS
            for (let i = 1; i <= NUM_COLORCUE_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 2. Practice trials for Color Cue ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.ColorCueDisplayGenerator2(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 3. Optimal strategy info for Color Cue ACVS
            for (let i = NUM_COLORCUE_INSTR_PAGES+1; i <= NUM_COLORCUE_INSTR_PAGES + NUM_COLORCUE_INFO_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 4. Experimental blocks for Color Cue ACVS
            for (let i = 1; i <= NUM_TASK1_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.ColorCueDisplayGenerator2(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
            // 5. Task interval
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${NUM_COLORCUE_INSTR_PAGES + NUM_COLORCUE_INFO_PAGES + 1}.${INSTR_FILE_EXT}>`], " "));
            // 6. Instructions for Standard ACVS
            for (let i = NUM_COLORCUE_INSTR_PAGES + NUM_COLORCUE_INFO_PAGES + 1 + 1; i <= NUM_COLORCUE_INSTR_PAGES + NUM_COLORCUE_INFO_PAGES + 1 + NUM_STANDARD_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 7. Practice trials for Standard ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 8. Experimental blocks for Standard ACVS
            for (let i = NUM_TASK1_BLOCK + 1; i <= NUM_TASK1_BLOCK + NUM_TASK2_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.StandardDisplayGenerator(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
        } else if (version_id === 3) {
            // Standard ACVS + Color Cue ACVS
            this._db.experiment_type = "ACIT-3-Ctrl-Standard+Cue";
            const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acit-3/";
            // 1. Instructions for Standard ACVS
            for (let i = 1; i <= NUM_STANDARD_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 2. Practice trials for Standard ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 3. Experimental blocks for Standard ACVS
            for (let i = 1; i <= NUM_TASK1_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.StandardDisplayGenerator(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
            // 4. Task interval
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${NUM_STANDARD_INSTR_PAGES + 1}.${INSTR_FILE_EXT}>`], " "));
            // 5. Instructions for Color Cue ACVS
            for (let i = NUM_STANDARD_INSTR_PAGES + 1 + 1; i <= NUM_STANDARD_INSTR_PAGES + 1 + NUM_COLORCUE_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 6. Practice trials for Color Cue ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.ColorCueDisplayGenerator2(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 7. Experimental blocks for Color Cue ACVS
            for (let i = NUM_TASK1_BLOCK + 1; i <= NUM_TASK1_BLOCK + NUM_TASK2_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.ColorCueDisplayGenerator2(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
        } else if (version_id === 4) {
            // Color Cue ACVS + Standard ACVS
            this._db.experiment_type = "ACIT-4-Ctrl-Cue+Standard";
            const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acit-4/";
            // 1. Instructions for Color Cue ACVS
            for (let i = 1; i <= NUM_COLORCUE_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 2. Practice trials for Color Cue ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.ColorCueDisplayGenerator2(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 3. Experimental blocks for Color Cue ACVS
            for (let i = 1; i <= NUM_TASK1_BLOCK; i++) {
                this.add_new_step(new exp.Block(
                    this._db,
                    i,  // block number
                    new disp.ColorCueDisplayGenerator2(84),    // is not practice block; has preview
                    [0, 400, 1400]  // timing
                ));
            }
            // 4. Task interval
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${NUM_COLORCUE_INSTR_PAGES + 1}.${INSTR_FILE_EXT}>`], " "));
            // 5. Instructions for Standard ACVS
            for (let i = NUM_COLORCUE_INSTR_PAGES + 1 + 1; i <= NUM_COLORCUE_INSTR_PAGES + 1 + NUM_STANDARD_INSTR_PAGES; i++) {
                this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}${i}.${INSTR_FILE_EXT}>`], " "));
            }
            // 6. Practice trials for Standard ACVS
            this.add_new_step(new exp.Block(
                this._db,
                0,  // block number
                new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
                [0, 400, 1400]  // timing
            ));
            // 7. Experimental blocks for Standard ACVS
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
