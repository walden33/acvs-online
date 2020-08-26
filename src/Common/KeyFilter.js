///////////////////////////////////////////////////////////////////////////////
///
/// A KeyFilter is a wrapper class for a keypress EventListener.
///
/// Example usage:
/// ...
/// let myKeyFilter = new KeyFilter( myCallback );
/// myKeyFilter.turn_on()
/// // When user presses "any" key
/// // myKeyFilter will immediately call myCallback("any")
/// ...
/// myKeyFilter.turn_off()
/// // User presses "any" key
/// // nothing happens
/// ...
/// myKeyFilter = myKeyFilter.destroy() // will remove the event listener and
///                                     // sets myKeyFilter to undefined.
///
util.KeyFilter = class {
  constructor ( on_keypress_callback, key_filter_on=true ) {
    this._key_filter_on = key_filter_on; /// enable or disable this KeyFilter.
    this._callback = on_keypress_callback;  /// This method is called whenever a key is pressed if the logger is on.
    this.bound_callback = this._catch_keypress.bind(this);
    window.addEventListener('keypress', this.bound_callback);  /// adds a listener for key presses.
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Turn this filter ON.
  ///
  turn_on () {
    this._key_filter_on = true;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Turn this filter OFF.
  ///
  turn_off () {
    this._key_filter_on = false;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Private method to be triggered from the EventListener. It will call the
  /// callback on a keypress event if the KeyFiler is on.  This function
  /// forwards the key identity (i.e. "a" "b" "c") to the callback as an
  /// argument.
  ///
  _catch_keypress (key_num) {
    if (this._key_filter_on == true){
      this._callback(key_num.key);
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// This method cleans up the class when the client is done with it.
  ///
  destroy () {
    window.removeEventListener("keypress", this.bound_callback);
    return undefined;
  }
}
