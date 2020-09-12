///////////////////////////////////////////////////////////////////////////////
///
/// <HtmlGui> contains simple high-level helper methods for manipulating the
/// html representing the user-interface.
///
exp.HtmlGui = class HtmlGui {

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Return the main div for the gui
  ///
  static guiDiv () {
    return d3.select('#gui');
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Create and show a header area with the given text
  ///
  static show_header (text) {
    // clear any existing header
    HtmlGui.clear_header();
    // add a new header <div>
    d3.select("body")
      .insert("div", ":first-child")
      .attr("class", "ace_header")
      .attr("id", "headerDiv")
      .html(text);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Clear the header area
  ///
  static clear_header () {
    d3.selectAll("#headerDiv").remove();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Return a D3 selection of the workspace, assuming it exists
  ///
  static workspace () {
    return d3.select("#workspace");
  }

/**
 * This method clears every <div> under #workspace
 * Note: In the previous version the method was to delete the whole #workspace
 * entirely and create a new identitical #workspace under its parent element.
 * This would completely remove all the class attributes and event listeners
 * manipulated by JS code, so it was not an ideal way to do it.
 */
  static clear_workspace () {
    // delete any existing workspace <div>
    d3.selectAll("#workspace *").remove();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Inserts text on the window
  ///
  static append_paragraphs (html, font_size=1.5) {
    HtmlGui.workspace().selectAll("p").data(html)
      .enter().append("p")
        .style("font-size", String(font_size)+"em")
        .html(function(d){return d;});
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Inserts an image into the window
  ///
  static append_image (img) {
    img = [img.src];
    HtmlGui.workspace().selectAll("img").data(img)
      .enter().append("img")
        .attr('src', function(d){return d;})
        .attr('class', "ace_centered_div_content");
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Inserts a button on the window
  ///
  static append_button (buttonText, onClickCallback) {
    let button = HtmlGui.workspace().selectAll("button").data([buttonText])
      .enter().append("button");
    button.text(function(d){return d;});
    button.attr("id", function(d){return d+"_button";});
    button.on("click", onClickCallback);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Create and show a message area with the given text
  ///
  static show_message (text, color="white") {
    // clear any existing header
    HtmlGui.clear_message();
    // add a new header <div>
    d3.select("body")
      .insert("div", ":first-child")
      .attr("class", "ace_message_area")
      .attr("id", "messageDiv")
      .style("color", color)
      .html(text);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Clear the message area
  ///
  static clear_message () {
    d3.selectAll("#messageDiv").data([]).exit().remove();
  }
}
