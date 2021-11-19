///////////////////////////////////////////////////////////////////////////////
///
/// <ChartDatasetGenerator> is a generator object that yields the next
/// <ChartDataset> for each trial in a block of trials.  This generator will
/// return *null* when exhausted.
///
/// This generator follows the following randomization scheme:
/// ==========================================================
///
/// ChartDataset-type-1 has (27 blue, 13 red, 14 green) squares
/// ChartDataset-type-2 has (13 blue, 27 red, 14 green) squares
///
/// The generator will yeild 42 <ChartDataset>'s before exhausting.
/// half type-1, half type-2
///
/// There will be "runs" of type-1 or type-2, between 1-6 in a row.
/// For each type, there will be 1 runs of each length.
///
/// The "runs" and "types" will be presented in uniform random order.
///
/// For each chart the two target digits will be selected at random.
///
/// In summary: (1+2+3+4+5+6 runs) * (1 reps) * (2 types) = 42 trials
///
exp.ChartDatasetGenerator = class {
  constructor () {
    this.normalDigits = [ 6, 7, 8, 9 ];
    this.targetDigits = [ 2, 3, 4, 5 ];
    this.colors = [ "rgb(254, 0, 254)"
                 , "rgb(0, 150, 150)"
                 , "rgb(105, 105, 105)" ];

    this.finalList = this._make_block_dataset(this._generate_trial_conditions());
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// WL: helper function: generate trialconds matrix analgous to jesir's code
  /// WL: However, with the limitation of trials, non-optimal target digit
  /// cannot be crossed with other variables. It is balanced.
  _generate_trial_conditions () {
      let trialConds = [];
      for (let optColor = 0; optColor < 3; optColor++) {
        for (let ecc1 = 1; ecc1 < 4; ecc1++) {
              for (let ecc2 = 1; ecc2 < 4; ecc2++) {
                  for (let d1 = 2; d1 < 6; d1++) {
                      let nonOptColor = this._select_rand_from_array([0, 1, 2], optColor);
                      let d2 = this._select_rand_from_array(this.targetDigits, d1);
                        trialConds.push([optColor, nonOptColor, ecc1, ecc2, d1, d2]);
                  }
              }
          }
      }
      return util.Util.fisher_yates_shuffle(trialConds);
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// helper function: copy a random item from array.
  ///
  _select_rand_from_array (array, exclude=null) {
    let rand_index = util.Util.gen_random_int(0, array.length);
    let rand_digit = array[rand_index];
    if (rand_digit === exclude){
      return this._select_rand_from_array(array, exclude);
    }
    return rand_digit;
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// helper function: make a random ChartDataset of "type"
  ///
  ///
  /// WL: This is just to generate a single trial of "type" blue or red.
  /// WL: Amendment. Not only type, but also eccentricity, target digits, should
  /// be taken into consideration.
  /// Parameter
  ///   optColor: 0-2
  ///   nonOptColor: 0-2
  _make_chartDataset (optColor, nonOptColor, optEcc, nonOptEcc, optDigit, nonOptDigit) {
    // pick targets
//    let redTarget = this._select_rand_from_array(this.targetDigits);
//    let blueTarget = this._select_rand_from_array(this.targetDigits, redTarget);
    let distColor = 0;
    for (distColor = 0; distColor < 3; distColor++) {
        if (distColor != optColor && distColor != nonOptColor) {break;}
    }

    // prepare all squares
    // first add distractor squares
    let distSquares = [];

    for (let i = 0; i < 18; i++) {
        distSquares.push(new ChartSquare(this._select_rand_from_array(this.normalDigits), this.colors[distColor]));
    }

    for (let i = 0; i < 17; i++) {
        distSquares.push(new ChartSquare(this._select_rand_from_array(this.normalDigits), this.colors[optColor]));
    }

    for (let i = 0; i < 17; i++) {
        distSquares.push(new ChartSquare(this._select_rand_from_array(this.normalDigits), this.colors[nonOptColor]));
    }

    distSquares = util.Util.fisher_yates_shuffle(distSquares);

    let outerRing = [];
    let middleRing = [];
    let innerRing = [];

    switch (optEcc) {
        case 1:
            innerRing.push(new ChartSquare(optDigit, this.colors[optColor]));
            break;
        case 2:
            middleRing.push(new ChartSquare(optDigit, this.colors[optColor]));
            break;
        case 3:
            outerRing.push(new ChartSquare(optDigit, this.colors[optColor]));
    }

    switch (nonOptEcc) {
        case 1:
            innerRing.push(new ChartSquare(nonOptDigit, this.colors[nonOptColor]));
            break;
        case 2:
            middleRing.push(new ChartSquare(nonOptDigit, this.colors[nonOptColor]));
            break;
        case 3:
            outerRing.push(new ChartSquare(nonOptDigit, this.colors[nonOptColor]));
    }

    while (innerRing.length < 12) {
        innerRing.push(distSquares.pop());
    }
    while (middleRing.length < 18) {
        middleRing.push(distSquares.pop());
    }
    while (outerRing.length < 24) {
        outerRing.push(distSquares.pop());
    }

    innerRing = util.Util.fisher_yates_shuffle(innerRing);
    middleRing = util.Util.fisher_yates_shuffle(middleRing);
    outerRing = util.Util.fisher_yates_shuffle(outerRing);

    let allSquares = innerRing.concat(middleRing.concat(outerRing));

    let redTargetDigitPos = -1;
    let blueTargetDigitPos = -1;
    for (let i=0; i < allSquares.length; i++) {
      if (allSquares[i].digit == optDigit && allSquares[i].color == this.colors[optColor]) {
        redTargetDigitPos = i;
      }
      if (allSquares[i].digit == nonOptDigit && allSquares[i].color == this.colors[nonOptColor]) {
        blueTargetDigitPos = i;
      }
    }

    return new ChartDataset(optDigit, nonOptDigit, innerRing, middleRing,
        outerRing, redTargetDigitPos, blueTargetDigitPos, optColor, nonOptColor, distColor);
  }


  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// WL: Return a whole 108 trials of a block.
  _make_block_dataset(trialConds) {
      let finalList = [];
      let currentTrialCond;
      while (trialConds.length > 0) {
          currentTrialCond = trialConds.pop();
          let optColor = currentTrialCond[0];
          let nonOptColor = currentTrialCond[1];
          let optEcc = currentTrialCond[2];
          let nonOptEcc = currentTrialCond[3];
          let optDigit = currentTrialCond[4];
          let nonOptDigit = currentTrialCond[5];
          finalList.push(this._make_chartDataset(optColor, nonOptColor, optEcc, nonOptEcc, optDigit, nonOptDigit));
      }
      console.log(finalList);
      return finalList;
  }
  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Return the next <ChartDataset> for the block.  Will return null when
  /// exhausted of datasets.
  ///
  /// WL: Yield, or pop the next <ChartDataset> in this <ChartDatasetGenerator>.
  yield_chartDataset () {
    if (this.finalList.length > 0) {
        console.log(this.finalList[this.finalList.length-1]);
        return this.finalList.pop();
    } else {
        return null;
    }
  }
}
