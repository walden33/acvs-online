/**
 * A class that encapsulates all the elements that will be used by d3 to draw on
 * the display.
 * 
 * @package ac-spatial-cue-1
 * @version 1.4 (07/21/2020)
 * @author Walden Li
 * 
 * @update 1.4 added a setter method to logic
 * @update 1.3 added a "logic" object to the constructor
 * @update 1.2 fixed bugs in methods for adding arrays
 */
disp.DisplayDataset = class {

    constructor() {
        this.lines = [];
        this.texts = [];
        this.rects = [];
        this.circles = [];
        // The logic object contains properties of this display at an abstract level
        this.logic = {};
    }

    // Setter methods.
    set_lines(lines) { this.lines = lines }

    set_texts(texts) { this.texts = texts }

    set_rects(rects) { this.rects = rects }

    set_circles(circles) { this.circles = circles }

    // Methods for adding an array of objects to the display.
    add_lines(lines) { this.lines = this.lines.concat(lines) }

    add_texts(texts) { this.texts = this.texts.concat(texts) }

    add_rects(rects) { this.rects = this.rects.concat(rects) }

    add_circles(circles) { this.circles = this.circles.concat(circles) }

    // Methods for adding one object to the display.
    add_a_line(line) { this.lines.push(line) }

    add_a_text(text) { this.texts.push(text) }

    add_a_rect(rect) { this.rects.push(rect) }

    add_a_circle(circle) { this.circles.push(circle) }

    /**
     *  A method for adding a property to the logic object.
     * 
     * @param {string} field : the name of the property, e.g., "OptTargIndex"
     * @param {*} value : the value of the property
     */
    set_logic( field, value ) {
        this.logic[field] = value;
    }

}