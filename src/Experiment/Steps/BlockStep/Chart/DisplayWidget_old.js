/**
 * DisplayWidget is a class that encapsulates the logic for the visual display.
 * It is instantiated once in a <Trail>.
 * Previously, this module was responsible for not only the graphics but also
 * some ad-hoc data calculation. In the new version, <DisplayWidget> only
 * handles the graphic display.
 * Depending on the version of the ACVS experiment, <DisplayWidget> takes in a
 * <DisplayDataset> that contains a number of <disp.Square>, <disp.Digit>,
 * <disp.Circle>, <disp.Line>, etc. for d3 to draw on the screen.
 * 
 * @package ac-spatial-cue-1
 * @version 1.2 (07/20/2020)
 * @author Walden Li
 */
exp.DisplayWidget = class {
    constructor(parent_element) {
    this.parent_element = parent_element;  // this is where the graphic will be drawn.
    this.cue = 0;   // a <DisplayDataset> for the cue
    this.stimili = 0;  // a <DisplayDataset> for the stimuli array
    window.addEventListener("resize", this.show.bind(this));  // redraw the graphic if the window resizes.
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// This method can be called to "destroy" the this object.
  ///
  destroy() {
    this.parent_element.selectAll(".ace_svg_container").data([]).exit().remove();
    window.removeEventListener("resize", this.show.bind(this));
    return undefined;
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// This method will clear the squares from the graphic, the cross will
  /// remain.
  ///
  clear() {
    this.parent_element.selectAll("text").data([]).exit().remove();
    this.parent_element.selectAll("rect").data([]).exit().remove();
    this.parent_element.selectAll("circle").data([]).exit().remove();
    this.parent_element.selectAll("line").data([]).exit().remove();
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// This method clears the squares from the graphic, if the arguement
  /// text is not "undefined" or "null" then, the cross will be replaced
  /// with "text".
  ///
  clear_and_show_text(text) {
    this.clear();
    if (text != undefined && text != null) {

      let data = [{}]
      d3.select("svg").selectAll("text").data([{}]).enter().append("text")
        .attr("x", 38 * .9 + this.square_size / 2 + "")
        .attr("y", 52 * .9 + this.square_size / 2 + "")
        .attr("class", "ace_pretty_text")
        .attr("font-size", this.square_size * 1.5 + "")
        .text(text)
        .exit().remove();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// A setter method.
  ///
  set_ring_radius(radius) { this.ring_radius = radius; }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// A setter method.
  ///
  set_square_size(size) { this.square_size = size; }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// A setter method.
  ///
  set_cross_color(color) { this.cross_color = color; }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// A setter method.
  ///
  set_data(data) { this.data = data; }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// WL: A setter method.
  ///
  set_square_colors(colors) { this.square_colors = colors; }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// When called this method will display the graphic to the client.
  ///
  show_cross_only() {
    this.clear();
    let svg;
    { // create the svg element for D3 to work with:
      let div = this.parent_element.selectAll("div").data([1]);
      div.enter().append("div")
        .attr("class", "ace_svg_container")
        .append("svg")
        .attr("viewBox", "0 0 100 100")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "ace_svg_content_responsive");
      div.exit().remove();
      svg = d3.select("svg");
    }

    { // draw the cross:
      let a = this.square_size / 2;
      let line1 = {
        x1: 49 * .9 + a + "", x2: 51 * .9 + a + "",
        y1: 50 * .9 + a + "", y2: 50 * .9 + a + "",
        sw: .2, c: this.cross_color
      };

      let line2 = {
        y1: 49 * .9 + a + "", y2: 51 * .9 + a + "",
        x1: 50 * .9 + a + "", x2: 50 * .9 + a + "",
        sw: .2, c: this.cross_color
      };

      let cross = svg.selectAll("line").data([line1, line2]);
      cross.attr("x1", function (d) { return d.x1; })
        .attr("x2", function (d) { return d.x2; })
        .attr("y1", function (d) { return d.y1; })
        .attr("y2", function (d) { return d.y2; })
        .attr("stroke", function (d) { return d.c; })
        .attr("stroke-width", function (d) { return d.sw; });
      cross.enter().append("line")
        .attr("x1", function (d) { return d.x1; })
        .attr("x2", function (d) { return d.x2; })
        .attr("y1", function (d) { return d.y1; })
        .attr("y2", function (d) { return d.y2; })
        .attr("stroke", function (d) { return d.c; })
        .attr("stroke-width", function (d) { return d.sw; });
      cross.exit().remove();
    }
  }

  show_cue_only() {
    this.clear();
    let svg;
    { // create the svg element for D3 to work with:
      let div = this.parent_element.selectAll("div").data([1]);
      div.enter().append("div")
        .attr("class", "ace_svg_container")
        .append("svg")
        .attr("viewBox", "0 0 100 100")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "ace_svg_content_responsive");
      div.exit().remove();
      svg = d3.select("svg");
    }

    { // draw the cue

      let a = this.square_size / 2;

      class Circle {
        constructor(cx, cy, r, fill, stroke = null, sw = null) {
          this.cx = cx;
          this.cy = cy;
          this.r = r;
          this.fill = fill;
          this.stroke = stroke;
          this.sw = sw;
        }
      }
      function generate_data_for_the_cue(squareSize, allColor, optColorIndex, nonOptColorIndex, distColorIndex) {
        let result = [];
        let x = [50 * .9 + a - .5 * a + "", 50 * .9 + a + "", 50 * .9 + a + .5 * a + ""]; // left, center, right
        let y = [50 * .9 + a - .5 * a + "", 50 * .9 + a + "", 50 * .9 + a + .5 * a + ""]; // up, center, down
        // create a circle outline
        result.push(new Circle(x[1], y[1], squareSize / 1.5 + "", null, "white", ".1"));
        if (Math.random() < .5) {
          result.push(new Circle(x[1], y[0], ".5", allColor[optColorIndex])); // optimal cue up center
          if (Math.random() < .5) {
            result.push(new Circle(x[0], y[2], ".5", allColor[nonOptColorIndex])); // down left
            result.push(new Circle(x[2], y[2], ".5", allColor[distColorIndex])); // down right
          } else {
            result.push(new Circle(x[2], y[2], ".5", allColor[nonOptColorIndex])); // down right
            result.push(new Circle(x[0], y[2], ".5", allColor[distColorIndex])); // down left
          }
        }
        else {
          result.push(new Circle(x[1], y[2], ".5", allColor[optColorIndex])); // optimal cue down center
          if (Math.random() < .5) {
            result.push(new Circle(x[0], y[0], ".5", allColor[nonOptColorIndex])); // up left
            result.push(new Circle(x[2], y[0], ".5", allColor[distColorIndex])); // up right
          } else {
            result.push(new Circle(x[2], y[0], ".5", allColor[nonOptColorIndex])); // up right
            result.push(new Circle(x[0], y[0], ".5", allColor[distColorIndex])); // up left
          }
        }
        return result;
      }

      let data = generate_data_for_the_cue(this.square_size, this.square_colors, this.data.optColorIndex,
        this.data.nonOptColorIndex, this.data.distColorIndex);

      let circles = svg.selectAll("circle").data(data);
      circles.enter().append("circle")
        .attr("cx", function (d) { return d.cx })
        .attr("cy", function (d) { return d.cy })
        .attr("r", function (d) { return d.r })
        .attr("fill", function (d) { return d.fill })
        .attr("stroke", function (d) { return d.stroke })
        .attr("stroke-width", function (d) { return d.sw });

      // create a horizontal line
      let radius = this.square_size / 1.5;
      let line = {
        x1: 50 * .9 + a - radius + "", x2: 50 * .9 + a + radius + "",
        y1: 50 * .9 + a + "", y2: 50 * .9 + a + "",
        sw: ".1", c: "white"
      };

      const cueLine = svg.append("line").data([line]);
      cueLine
        .attr("x1", function (d) { return d.x1; })
        .attr("x2", function (d) { return d.x2; })
        .attr("y1", function (d) { return d.y1; })
        .attr("y2", function (d) { return d.y2; })
        .attr("stroke", function (d) { return d.c; })
        .attr("stroke-width", function (d) { return d.sw; });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  /// When called this method will display the graphic to the client.
  ///
  show() {
    // // this.clear();
    let svg;
    // let a = this.square_size / 2; // I still don't know what "a" means
    // { // create the svg element for D3 to work with:
    //   let div = this.parent_element.selectAll("div").data([1]);
    //   div.enter().append("div")
    //     .attr("class", "ace_svg_container")
    //     .append("svg")
    //     .attr("viewBox", "0 0 100 100")
    //     .attr("preserveAspectRatio", "xMinYMin meet")
    //     .attr("class", "ace_svg_content_responsive");
    //   div.exit().remove();
      svg = d3.select("svg");
    // }


    // { // draw the cue

    //   let a = this.square_size / 2;

    //   class Circle {
    //     constructor(cx, cy, r, fill, stroke = null, sw = null) {
    //       this.cx = cx;
    //       this.cy = cy;
    //       this.r = r;
    //       this.fill = fill;
    //       this.stroke = stroke;
    //       this.sw = sw;
    //     }
    //   }
    //   function generate_data_for_the_cue(squareSize, allColor, optColorIndex, nonOptColorIndex, distColorIndex) {
    //     let result = [];
    //     let x = [50 * .9 + a - .5 * a + "", 50 * .9 + a + "", 50 * .9 + a + .5 * a + ""]; // left, center, right
    //     let y = [50 * .9 + a - .5 * a + "", 50 * .9 + a + "", 50 * .9 + a + .5 * a + ""]; // up, center, down
    //     // create a circle outline
    //     result.push(new Circle(x[1], y[1], squareSize / 1.5 + "", null, "white", ".1"));
    //     if (Math.random() < .5) {
    //       result.push(new Circle(x[1], y[0], ".5", allColor[optColorIndex])); // optimal cue up center
    //       if (Math.random() < .5) {
    //         result.push(new Circle(x[0], y[2], ".5", allColor[nonOptColorIndex])); // down left
    //         result.push(new Circle(x[2], y[2], ".5", allColor[distColorIndex])); // down right
    //       } else {
    //         result.push(new Circle(x[2], y[2], ".5", allColor[nonOptColorIndex])); // down right
    //         result.push(new Circle(x[0], y[2], ".5", allColor[distColorIndex])); // down left
    //       }
    //     }
    //     else {
    //       result.push(new Circle(x[1], y[2], ".5", allColor[optColorIndex])); // optimal cue down center
    //       if (Math.random() < .5) {
    //         result.push(new Circle(x[0], y[0], ".5", allColor[nonOptColorIndex])); // up left
    //         result.push(new Circle(x[2], y[0], ".5", allColor[distColorIndex])); // up right
    //       } else {
    //         result.push(new Circle(x[2], y[0], ".5", allColor[nonOptColorIndex])); // up right
    //         result.push(new Circle(x[0], y[0], ".5", allColor[distColorIndex])); // up left
    //       }
    //     }
    //     return result;
    //   }

    //   let data = generate_data_for_the_cue(this.square_size, this.square_colors, this.data.optColorIndex,
    //     this.data.nonOptColorIndex, this.data.distColorIndex);

    //   let circles = svg.selectAll("circle").data(data);
    //   circles.enter().append("circle")
    //     .attr("cx", function (d) { return d.cx })
    //     .attr("cy", function (d) { return d.cy })
    //     .attr("r", function (d) { return d.r })
    //     .attr("fill", function (d) { return d.fill })
    //     .attr("stroke", function (d) { return d.stroke })
    //     .attr("stroke-width", function (d) { return d.sw });

    //   // create a horizontal line
    //   let radius = this.square_size / 1.5;
    //   let line = {
    //     x1: 50 * .9 + a - radius + "", x2: 50 * .9 + a + radius + "",
    //     y1: 50 * .9 + a + "", y2: 50 * .9 + a + "",
    //     sw: ".1", c: "white"
    //   };

    //   const cueLine = svg.append("line").data([line]);
    //   cueLine
    //     .attr("x1", function (d) { return d.x1; })
    //     .attr("x2", function (d) { return d.x2; })
    //     .attr("y1", function (d) { return d.y1; })
    //     .attr("y2", function (d) { return d.y2; })
    //     .attr("stroke", function (d) { return d.c; })
    //     .attr("stroke-width", function (d) { return d.sw; });
    // }

    { // draw the squares:
      // Helper class to represent an svg square.
      class Square {
        constructor(fill, x, y, digit, w, h) {
          this.fill = fill;
          this.x = x;
          this.y = y;
          this.text = digit;
          this.w = w;
          this.h = h;
        }
      }

      let sz = this.square_size + "";
      // Helper function to generate/format data for the svg squares in the
      // graphic.
      function generate_data_for_all_squares(dataset, radius, cx, cy) {
        let angle = 2 * Math.PI / dataset.length;
        let result = []
        for (let i = 0; i < dataset.length; i++) {
          let x = (Math.cos(angle * i + Math.PI / 2) * radius + cx) * 0.9;
          let y = (Math.sin(angle * i + Math.PI / 2) * radius + cy) * 0.9;
          result.push(new Square(dataset[i].color, x, y, dataset[i].digit, sz, sz));
        }
        return result;
      }//generate_data_for_all_squares

      // Format the data:
      let r = this.ring_radius;
      let data = generate_data_for_all_squares(this.data.outerRingSquares, r * 1.00, 50, 50).concat(
        generate_data_for_all_squares(this.data.middleRingSquares, r * 0.75, 50, 50).concat(
          generate_data_for_all_squares(this.data.innerRingSquares, r * 0.50, 50, 50)));

      // Draw the rectangles on the screen:
      let rects = svg.selectAll("rect").data(data);
      rects.enter().append("rect")
        .attr("width", function (d) { return d.w })
        .attr("height", function (d) { return d.h })
        .attr("x", function (d) { return d.x + "" })
        .attr("y", function (d) { return d.y + "" })
        .attr("fill", function (d) { return d.fill });
      rects.exit().remove();

      // Draw the text on the screen:
      let text_shift = 0.65;
      let text = svg.selectAll("text").data(data);
      text.attr("x", (function (d) { return d.x + this.square_size / 3.25 + "" }).bind(this))
        .attr("y", (function (d) { return d.y + this.square_size / 1.35 + "" }).bind(this))
        .attr("fill", "red")
        .attr("class", "ace_pretty_text")
        .attr("font-size", this.square_size * text_shift + "")
        .text(function (d) { return d.text });
      text.enter().append("text")
        .attr("x", (function (d) { return d.x + this.square_size / 3.25 + "" }).bind(this))
        .attr("y", (function (d) { return d.y + this.square_size / 1.35 + "" }).bind(this))
        .attr("fill", "red")
        .attr("class", "ace_pretty_text")
        .attr("font-size", this.square_size * text_shift + "")
        .text(function (d) { return d.text });
      text.exit().remove();
    }
  }



}
