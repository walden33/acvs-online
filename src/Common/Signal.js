///////////////////////////////////////////////////////////////////////////////
///
/// Simple implementation of a "Signals and Slots" callback system.
///
util.Signal = class {
  constructor () {
    this._connected_slots = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Use to connect a callback to this signal.
  ///
  connect (new_slot) {
    this._connected_slots.push(new_slot);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Use to call all callbacks connected to this signal.
  ///
  emit () {
    for (let i = 0; i < this._connected_slots.length; i++) {
      this._connected_slots[i].apply(null, arguments);
    }
  }
}
