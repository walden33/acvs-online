/**
 * ACF1 experiment.
 */
exp.ACF1 = class extends exp.ExperimentKernel {
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

        const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acf1/";
        const INSTR_FILE_EXT = "jpeg";

        // Get determine version based on counterbalance id
        // Possible values for version_id: 1, 2, 3, 4, 5, 0
        const version_id = parseInt(util.Util.get_cb_id()) % 6;
        const trialsPerBlock = 18;
        let targColors;
        switch (version_id) {
            case 1: targColors = ["red", "green", "blue"]; break;
            case 2: targColors = ["red", "blue", "green"]; break;
            case 3: targColors = ["green", "red", "blue"]; break;
            case 4: targColors = ["green", "blue", "red"]; break;
            case 5: targColors = ["blue", "red", "green"]; break;
            case 0: targColors = ["blue", "green", "red"]; break;
            default:
        }
        const g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        const g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        const b = new disp.MCFBaselineDisplayGenerator();

        // Send stimuli
        this.add_new_step(new exp.SubmitStimuliStep(
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            b, g1, g2)
        );

        // Informed consent
        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        // Block 1 (baseline)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}0.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 1, b, 18));

        // ACF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}1_cb_${version_id}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 0, new disp.ACFDisplayGenerator1(3, ...targColors), 3));

        // Block 2-3 (ACF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}2_cb_${version_id}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 2, g1));
        this.add_new_step(new exp.ACFBlock(this._db, 3, g2));

        // Block 4 (baseline)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}3.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 1, b));

        // Submit data
        this.add_new_step(new exp.SubmitDataStep(this._db,
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            "https://app.prolific.co/submissions/complete?cc=2BE7278B")
        );

    }
}
