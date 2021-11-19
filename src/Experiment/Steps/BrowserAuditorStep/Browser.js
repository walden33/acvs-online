///////////////////////////////////////////////////////////////////////////////
///
/// The Browser class is used to encapsulate query-able information about
/// the user's web browser.
///
exp.Browser = class {
  constructor () {
    this.browser_name = bowser.name;
    this.browser_info = bowser;

    this.dev_pixel_ratio = window.devicePixelRatio;

    this.raw_screen_height = $(window).height();

    this.raw_screen_width = $(window).width();

    this.screen_height = Math.round(this.dev_pixel_ratio * this.raw_screen_height);

    this.screen_width = Math.round(this.dev_pixel_ratio * this.raw_screen_width);
  }
}
