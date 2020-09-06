///////////////////////////////////////////////////////////////////////////////
///
/// A class full of static utility methods.
///
util.Util = class Util {
  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Return the sum of a numeric array.
  ///
  static sum (arr) {
    if (arr.length == 0) {return 0;} // edge case
    let result = 0.0;
    arr.forEach(function(item) {
      result += item;
    });
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Returns the mean of the array, arr.
  ///
  static mean (arr) {
    if (arr.length == 0) {throw RangeError("Can not calculate mean of empty array.");}
    let result = Util.sum(arr) / arr.length;
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Returns the standard deviation of arr.
  ///
  static stdev (arr) {
    if (arr.length == 0) {throw RangeError("Can not calculate stdev of empty array.");}
    let m = Util.mean(arr);
    let result = 0.0;
    arr.forEach(function(item){
      result += Math.abs(item - m);
    });
    result /= arr.length;
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Returns the standard error of the mean of arr
  ///
  static std_error_of_the_mean (arr) {
    if (arr.length == 0) {throw RangeError("Can not calculate standard error of the mean of empty array.");}
    let result = Util.stdev(arr) / Math.sqrt(arr.length);
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Returns a integer pseudo-randomly drawn from the range [min, max) or
  /// [min, max]
  ///
  static gen_random_int (min, max, inclusive=false) {
    if (inclusive == false){
      return Math.floor(Math.random() * (max-min)) + min;
    } else {
      return Math.floor(Math.random() * (max-min+1)) + min;
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Returns a float pseudo-randomly drawn from the range [min, max) or
  /// [min, max]
  ///
  static gen_random_float (min, max, inclusive=false) {
    if (inclusive == false){
      return Math.random() * (max-min) + min;
    } else {
      return Math.random() * (max-min+1) + min;
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Randomly shuffles the array, arr, in-place using the Fisher-Yates
  /// algorithm. Note the original array (not a copy) is modified.
  ///
  static fisher_yates_shuffle (arr) {
    let j = undefined;
    let k = undefined;
    for (let i = arr.length-1; i >=0; i--){
      j = Util.gen_random_int(0,i,true);
      k = arr[j];
      arr[j] = arr[i];
      arr[i] = k;
    }
    return arr;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Tries to determin if the current window object is associated with the
  /// main browser window or a iframe window.  Returns true if it looks like an
  /// iframe.
  ///
  static window_is_iframe() {
    try{
      return window.self !== window.top;
    } catch(err) {
      return true;
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Plays a beep audio sound.
  ///
  static play_beep_sound() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Returns today's date as a string
  ///
  static today() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = String(today.getFullYear());
    return yyyy + '-' + mm + '-' + dd;
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Sets a cookie. Uses btoa to mangle the key.
  ///
  /// Credit: https://www.w3schools.com/js/js_cookies.asp
  ///
  static set_cookie(key, value, expires_in_N_days) {
    let d = new Date();
    d.setTime(d.getTime() + (expires_in_N_days*24*60*60*1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = btoa(key) + "=" + value + ";" + expires + ";path=/";
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// Retrieves a cookie. Uses btoa to un-mangle the key.
  ///
  /// Credit: https://www.w3schools.com/js/js_cookies.asp
  ///
  static get_cookie(key) {
    key = btoa(key) + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(key) == 0) {
        return c.substring(key.length, c.length);
      }
    }
    return "";
  }

  /**
   * 
   * @param {Array<*>} array 
   * @param {*} exclude : an object of array to be excluded when selecting
   * @param {boolean} replace : whether to remove the selected item from array
   */
  static select_rand_from_array (array, exclude=null, replace=true) {
    let rand_index = Util.gen_random_int(0, array.length);
    let result = array[rand_index];
    if (result === exclude){
      return Util.select_rand_from_array(array, exclude);
    }
    if (!replace) array.splice( rand_index, 1 );
    return result;
  }

}
