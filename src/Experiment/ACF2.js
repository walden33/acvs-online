/**
 * ACF2 is an experiment with three tasks: ACVS, MCFT, and ACVF.
 */
exp.ACF2 = class extends exp.ExperimentKernel {
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

        const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acf2/";
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
        const g_acvs_0 = new disp.StandardDisplayGenerator(84);
        const g_acvs_1 = new disp.StandardDisplayGenerator(84);
        const b = new disp.MCFBaselineDisplayGenerator();
        const g_mcf_0 = new disp.MCFDisplayGenerator1(20, ...mcf_colors);
        const g_acf_0 = new disp.ACFDisplayGenerator1(21, ...acf_colors);

        // Send stimuli (first part)
        this.add_new_step(new exp.SubmitStimuliStep(
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            g_acvs_0, g_acvs_1)
        );

        // Informed consent
        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

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

        // Block 1 & 2 (ACVS)
        this.add_new_step(new exp.Block(this._db, 1, g_acvs_0, [0, 400, 1400]));
        this.add_new_step(new exp.Block(this._db, 2, g_acvs_1, [0, 400, 1400]));

        // Send stimuli (second part)
        this.add_new_step(new exp.SubmitStimuliStep(
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            b, g_mcf_0)
        );

        // Block 3 (Mouse Click Baseline)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}baseline_0.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 3, b, 18));

        // MCF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}mcf_0_cb_${mcf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 0, new disp.MCFDisplayGenerator1(2, ...mcf_colors), mcf_version));

        // Block 4 (MCF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}mcf_1_cb_${mcf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 4, g_mcf_0, mcf_version));

        // Send stimuli (final part)
        this.add_new_step(new exp.SubmitStimuliStep(
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            g_acf_0)
        );

        // ACVF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acf_0_cb_${acf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 0, new disp.ACFDisplayGenerator1(3, ...acf_colors)));

        // Block 5 (ACVF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acf_1_cb_${acf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 5, g_acf_0));

        // Block 6 (Mouse Click Baseline 2nd half)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}baseline_1.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 7, b));

        this.add_new_step(new exp.SubmitDataStep(this._db,
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            "https://app.prolific.co/submissions/complete?cc=2BE7278B")
        );

    }
}
