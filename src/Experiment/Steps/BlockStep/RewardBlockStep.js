///////////////////////////////////////////////////////////////////////////////
///
/// RewardBlockStep is a sub class of BlockStep that overrides the
/// ShowSummary() method to also score/reward the user based on their
/// performance.
///
exp.RewardBlockStep = class extends exp.BlockStep {
  constructor ( db, blocknum ) {
    super(db, blocknum);
    this._responseTimeBins;
    this._responseTimes;
    if (this._db._reward_bins_array == undefined) {
      this._db._reward_bins_array = [];
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// The construction of the trial is separated out into this function so that
  /// subclasses may override this step.
  ///
  _construct_trial (chart_dataset) {
    // this is a constructor for some exp.AbstractTrial derived subclass
    return new exp.RewardTrial(chart_dataset, this._db, this._blocknum==1);
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// helper method: bin the response times up from the block that occurred
  /// before this most recent block.
  ///
  _quantiles (data, quantiles) {
    let sorted_data = data.slice().sort(function(a,b){return a-b});
    let result = [];
    for (let i = 0; i < quantiles.length; i++) {
      result.push( sorted_data[Math.round((sorted_data.length-1) * quantiles[i])] );
    }
    return result;
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Calculate and record the quantiles from the response times.
  ///
  _bin_response_times_from_block () {
    // get the trial records for the most recently completed block:
    let raw_data = this._all_trials_data;
    let response_times = [];
    for (let i = 0; i < raw_data.length; i++) {
      response_times.push(raw_data[i].responseTime);
    }

    //
    // Per design, exclude first 10 trials from first block of the experiment
    // from the quantiles calculation.
    //
    response_times = (this._blocknum == 1) ? response_times : response_times.slice(10)
    let bins = this._quantiles(response_times, [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]).slice(1);

    this._db._reward_bins_array.push(bins);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Calculate and return the total reward from this block
  ///
  _get_sum_of_reward_scores_from_block () {
    if (this._blocknum > 1) {
      let raw_data = this._all_trials_data;
      let total_reward = 0.0;
      for (let i = 0; i < raw_data.length; i++) {
        total_reward += raw_data[i].reward_score;
      }
      return total_reward;
    } else {
      return 0;
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Record the results after all the trials have been completed.
  ///
  _save_data () {
    this._bin_response_times_from_block();
    this._total_score = this._get_sum_of_reward_scores_from_block();
    this._db.ExperimentTable.add_new_row(this._blocknum, this._all_trials_data, this._total_score);
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// overridden method
  /// shows the summary page for the most recently completed block.
  ///
  _show_summary () {
    // clear everything
    // show a continue button for the user to click
    let total_score = this._total_score;

    let paragraph = [];
    paragraph.push("<br><br><br>");
    paragraph.push("<b>You Completed Block #" + this._blocknum + "!</b>");
    paragraph.push("<hr>");
    paragraph.push("Your Accuracy: " + (Math.round(util.Util.mean(this._accuracy_data) * 1000)/10) + "%");
    paragraph.push("<hr>");
    if (this._blocknum > 1) {
      paragraph.push("Bonus Speed Points Earned: " + total_score);
      paragraph.push("<hr>");
    }
    paragraph.push("<b>Ready to continue?</b>");
    exp.HtmlGui.append_paragraphs(paragraph);

    // create a button for the user to press to acknowledge
    exp.HtmlGui.append_button( "Yes", this.step_completed_signal.emit.bind(this.step_completed_signal) );
    exp.HtmlGui.clear_message()
  }
}
