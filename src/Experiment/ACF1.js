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

        const baseline_display_generator = new disp.MCFBaselineDisplayGenerator();

        // this.add_new_step(new exp.ConsentStep(this._db));
        // this.add_new_step(new exp.CheckBrowserStep(this._db));

        const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acf1/";
        const INSTR_FILE_EXT = "jpeg";

        // // Get determine version based on counterbalance id
        // // Possible values for version_id: 1, 2, 3, 4, 5, 0
        const version_id = parseInt(util.Util.get_cb_id()) % 6;

        let g1, g2, g3;
        const trialsPerBlock = 15;
        if (version_id === 1) {
            const targColors = ["red", "green", "blue"];
            // Create display generators
            g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g3 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        } else if (version_id === 2) {
            const targColors = ["red", "blue", "green"];
            // Create display generators
            g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g3 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        } else if (version_id === 3) {
            const targColors = ["green", "red", "blue"];
            // Create display generators
            g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g3 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        } else if (version_id === 4) {
            const targColors = ["green", "blue", "red"];
            // Create display generators
            g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g3 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        } else if (version_id === 5) {
            const targColors = ["blue", "red", "green"];
            // Create display generators
            g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g3 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        } else if (version_id === 0) {
            const targColors = ["blue", "green", "red"];
            // Create display generators
            g1 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g2 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
            g3 = new disp.ACFDisplayGenerator1(trialsPerBlock, ...targColors);
        }        

        // if (version_id === 1) {
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}1.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 1, baseline_display_generator, 18));
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}2.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 0, new disp.MCFDisplayGenerator2(2, "red", "green")));
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}3.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 2, new disp.MCFDisplayGenerator2(10, "red", "green")));
        //     this.add_new_step(new exp.MCFBlock(this._db, 3, new disp.MCFDisplayGenerator2(10, "red", "green")));
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}4.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 4, baseline_display_generator));
        // } else if (version_id === 0) {
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}1.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 1, baseline_display_generator, 18));
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}5.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 0, new disp.MCFDisplayGenerator2(2, "green", "red")));
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}6.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 2, new disp.MCFDisplayGenerator2(10, "green", "red")));
        //     this.add_new_step(new exp.MCFBlock(this._db, 3, new disp.MCFDisplayGenerator2(10, "green", "red")));
        //     this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}4.${INSTR_FILE_EXT}>`], " "));
        //     this.add_new_step(new exp.MCFBlock(this._db, 4, baseline_display_generator));
        // }

        this.add_new_step(new exp.SubmitStimuliStep(
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            g1, g2, g3));

        this.add_new_step(new exp.ACFBlock(this._db, 1, g1));

        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        // this.add_new_step(new exp.ACFBlock(this._db, 1, new disp.ACFDisplayGenerator1(3, "red", "green", "blue")));

        this.add_new_step(new exp.SubmitDataStep(this._db, "receive.php"));

    }
}
