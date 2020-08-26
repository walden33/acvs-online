///////////////////////////////////////////////////////////////////////////////
///
/// <AbstractStep> defines a common interface to be used by all derived
/// Step objects.
///
util.AbstractStep = class {
  constructor () {
    // all derived classes should emit() this Signal at the end of their
    // overridden execute() method.
    this.step_completed_signal = new util.Signal();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// The main routine called to start this step.
  ///
  execute()  {
    throw "Error: Abstract method called";
  }
}
