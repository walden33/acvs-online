/**
 * 
 */
exp.ACMC1 = class extends exp.ExperimentKernel {
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

        this._db.add_new_table("_user_info");

        const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acmc1/";
        const INSTR_FILE_EXT = "jpeg";

        this.add_new_step(new exp.ConsentStep(this._db, false));
        this.add_new_step(new exp.CollectInfoStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        for (let i = 1; i <= 10; i++) {
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.${INSTR_FILE_EXT}>`], " "));
        }
        this.add_new_step(new exp.ACMCBlock(this._db, 0, new disp.ACMouseContDisplayGenerator1(10)));

        this.add_new_step(new exp.ACMCBlock(this._db, 1, new disp.ACMouseContDisplayGenerator1(80)));
        this.add_new_step(new exp.ACMCBlock(this._db, 2, new disp.ACMouseContDisplayGenerator1(80)));
        this.add_new_step(new exp.ACMCBlock(this._db, 3, new disp.ACMouseContDisplayGenerator1(80)));


        const q1 = new exp.MultipleChoiceSurvey(this._db);
        q1.set_question("That's it for the task! Next we just have a few" + 
            "questions.  In this experiment, what method were you using" +
            "to move your mouse?");
        q1.set_choices(["A physical mouse", "A trackpad"]);
        const q2 = new exp.MultipleChoiceSurvey(this._db);
        q2.set_question("What kind of monitor are you using?");
        q2.set_choices(["A laptop's internal monitor", "An external monitor"]);
        this.add_new_step(q1);
        this.add_new_step(q2);

        this.add_new_step(new exp.SubmitDataStep(this._db, `receive.php?id=${util.Util.get_sub_id()}`));

    }
}
