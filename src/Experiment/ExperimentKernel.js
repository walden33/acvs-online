/**
 * This is a kernel class for experiments.
 * 
 * @author Walden Li
 * @version 1.4 (10/2/2020)
 */
exp.ExperimentKernel = class {

    constructor() {
        this._steps = []; // an array of the experiment steps
        this._steps_finalized = false; // private flag for signaling initialization
        this._db = new util.Database();
        this._run_date = util.Util.today();
    }

    /////////////////////////////////////////////////////////////////////////////
    ///
    /// Adds a new step to the Experiment
    ///
    add_new_step(new_step) {
        if (!(new_step instanceof util.AbstractStep)) {
            throw "Error: argument must be derived from AbstractStep"
        }
        if (this._steps_finalized == true) {
            throw "Error: Cannot append a new step after the experiemnt has started";
        }
        new_step.step_completed_signal.connect(this._execute_next_step.bind(this));
        this._steps.push(new_step);
    }

    /////////////////////////////////////////////////////////////////////////////
    ///
    /// Starts the Experiment
    ///
    run() {
        this._stepsFinalized = true;
        this._execute_next_step();
    }

    /////////////////////////////////////////////////////////////////////////////
    ///
    /// Executes the next step in the experiment each time it is called. Does
    /// nothing if there are no more steps.
    ///
    _execute_next_step() {
        let queuedStep = this._steps.shift();
        if (queuedStep != undefined) {
            queuedStep.execute();
        }
    }
}

