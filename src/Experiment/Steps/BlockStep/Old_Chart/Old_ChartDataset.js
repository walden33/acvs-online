/// <ChartSquare> is a datastructure holding the info to describe a square on
/// the chart
class ChartSquare {
  constructor( digit, color ) {
    let _this = this;
    _this.digit = digit;
    _this.color = color;

  }
}

/// <ChartDataset> is a collection of <ChartSquare> organizing them into the
/// three rings and storing the two target digits.
class ChartDataset {
  constructor( optTargDigit, nonOptTargDigit, innerRingSquares,
      middleRingSquares, outerRingSquares, optTargPos,
      nonOptTargPos, optColorIndex, nonOptColorIndex, distColorIndex) {
    let _this = this;
    _this.optTargDigit = optTargDigit;
    _this.optTargPos = optTargPos;
    _this.nonOptTargDigit = nonOptTargDigit;
    _this.nonOptTargPos = nonOptTargPos;
    _this.innerRingSquares  = innerRingSquares;
    _this.middleRingSquares = middleRingSquares;
    _this.outerRingSquares  = outerRingSquares;
    _this.optColorIndex = optColorIndex;
    _this.nonOptColorIndex = nonOptColorIndex;
    _this.distColorIndex = distColorIndex;
  }
}
