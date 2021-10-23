/**
 * The tasks in ACF6 is otherwise same as ACF2 except for changes in:
 * ACVS: ratio becomes 3:1
 * ACF: shapes become squares, pentagons, and diamonds, and ratio increases
 * 
 * ACF6 is also otherwise same as ACF5 except for a difference in task order:
 * ACF --> ACVS --> MCF
 */
exp.ACF6 = class extends exp.ExperimentKernel {
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

        const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acf6/";
        const INSTR_FILE_EXT = "jpeg";

        // Get determine version based on counterbalance id
        // In this experiment, there will be 2 versions of MCFT and 6 versions
        // of ACVF. So, the cb id will be 
        const cb = parseInt(util.Util.get_cb_id());
        const mcf_version = cb % 2;
        const acf_version = cb % 6;
        let mcf_colors, acf_colors;
        switch (mcf_version) {
            case 1: mcf_colors = ["red", "green"]; break;
            case 0: mcf_colors = ["green", "red"]; break;
            default:
        }
        switch (acf_version) {
            case 1: acf_colors = ["red", "green", "blue"]; break;
            case 2: acf_colors = ["red", "blue", "green"]; break;
            case 3: acf_colors = ["green", "red", "blue"]; break;
            case 4: acf_colors = ["green", "blue", "red"]; break;
            case 5: acf_colors = ["blue", "red", "green"]; break;
            case 0: acf_colors = ["blue", "green", "red"]; break;
            default:
        }

        // Generate displays
        const g_acvs = new disp.StandardDisplayGenerator(108);
        const b = new disp.MCFBaselineDisplayGenerator();
        const g_mcf = new disp.MCFDisplayGenerator1(20, ...mcf_colors);
        const g_acf = new disp.ACFDisplayGenerator3(21, ...acf_colors);

        // Send stimuli (first part)
        // this.add_new_step(new exp.SubmitStimuliStep(
        //     `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
        //     g_acvs)
        // );

        // Informed consent
        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        // Block 1 (Mouse Click Baseline)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}baseline_0.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 1, b, 18));

        // ACF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acf_0_cb_${acf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 0, new disp.ACFDisplayGenerator3(3, ...acf_colors)));

        // Block 2 (ACF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acf_1_cb_${acf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 2, g_acf));

        // ACVS instruction and practice block
        for (let i = 0; i < 9; i++) {
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acvs_${i}.${INSTR_FILE_EXT}>`], " "));
        }
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
            [0, 400, 1400]  // timing
        ));

        // Block 3 (ACVS)
        this.add_new_step(new exp.Block(this._db, 3, g_acvs, [0, 400, 1400]));

        // MCF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}mcf_0_cb_${mcf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 0, new disp.MCFDisplayGenerator1(2, ...mcf_colors), mcf_version));

        // Block 4 (MCF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}mcf_1_cb_${mcf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 4, g_mcf, mcf_version));

        // Block 5 (Mouse Click Baseline 2nd half)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}baseline_1.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 5, b));

        this.add_new_step(new exp.SubmitDataStep(this._db,
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            "https://app.prolific.co/submissions/complete?cc=2BE7278B")
        );

    }
}
