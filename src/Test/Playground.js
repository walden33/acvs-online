const Playground = class extends util.ExperimentBase {
    constructor() {
        super();
        this.add_new_step(new exp.Block(this._db, 0, "Standard", new exp.StandardTrialDataGenerator(true, true)));

    }
}