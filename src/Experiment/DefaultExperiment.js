///////////////////////////////////////////////////////////////////////////////
///
/// The default implementation of the Adaptive Choice Experiment.
///
/// let experiment = new exp.DefaultExperiment();
/// experiment.run();
///
exp.DefaultExperiment = class extends util.ExperimentBase {
    constructor(version) {
        super(version);
        //
        // Set up the database
        //
        this._db.experiment_type = 'DefaultVersion';

        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("What");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        //
        // Set up the experiment
        // this.add_new_step(new exp.TestStep(this._db));
        // If run locally, do not add these steps.
        if (window.location.pathname.substring(0,5) !== "/User") {
            this.add_new_step(new exp.ConsentStep(this._db));
            this.add_new_step(new exp.CheckBrowserStep(this._db));
            this.add_new_step(new exp.PreparationStep(this._db));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide1.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide2.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide3.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide4.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide5.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide6.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide7.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide8.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide9.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide10.PNG">'], " "));
            this.add_new_step(new exp.BriefingStep(this._db, ['<img src="https://psy-ccl.asc.ohio-state.edu/experiments/ac_space_9/instructions/Slide11.PNG">'], " "));    
        }


        // Add practice block
        this.add_new_step(new exp.Block(this._db, 0, "Standard", new exp.StandardTrialDataGenerator(true, true)));

        const NUM_EXP_BLOCK = 3;
        for (let i = 1; i <= NUM_EXP_BLOCK; i++) {
            this.add_new_step(new exp.Block(this._db, i, "Standard", new exp.StandardTrialDataGenerator(false, true)));
        }

        this.add_new_step(new exp.SubmitDataStep(this._db));
    }
}
