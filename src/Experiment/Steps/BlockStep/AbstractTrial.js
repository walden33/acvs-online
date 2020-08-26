///////////////////////////////////////////////////////////////////////////////
///
/// Abstract Base Class for Block Trials
///
exp.AbstractTrial = class {
  constructor () {
    this.trial_completed_signal = null //new util.Signal();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// All subclasses should override this method in order to provide the
  /// behavior for the trial.
  ///
  run_trial () {
    throw ("abstract method called");
  }
}
