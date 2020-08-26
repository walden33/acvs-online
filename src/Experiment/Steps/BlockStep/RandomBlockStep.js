///////////////////////////////////////////////////////////////////////////////
///
/// RandomBlockStep is a sub class of RewardBlockStep that overrides the
/// _construct_trial() method to so that the user receives a random score
/// instead of one based on their performance.
///
exp.RandomBlockStep = class extends exp.RewardBlockStep {
  constructor ( db, blocknum ) {
    super(db, blocknum);
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// The construction of the trial is separated out into this function so that
  /// subclasses may override this step.
  ///
  _construct_trial (chart_dataset) {
    // this is a constructor for some exp.AbstractTrial derived subclass
    return new exp.RandomTrial(chart_dataset, this._db, this._blocknum);
  }
}
