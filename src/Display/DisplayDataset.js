/**
 * A class that encapsulates all the elements that will be used by d3 to draw on
 * the display.
 * 
 * @package acvs-online
 * @version 1.4 (07/21/2020)
 * @author Walden Li
 * 
 * @update 1.5 added a duplicate() method and removed the logic object
 * @update 1.4 added a setter method to logic
 * @update 1.3 added a "logic" object to the constructor
 * @update 1.2 fixed bugs in methods for adding arrays
 */
disp.DisplayDataset = class {

    constructor( lines=[], texts=[], rects=[], circles=[], diamonds=[] ) {
        this.lines = lines;
        this.texts = texts;
        this.rects = rects;
        this.circles = circles;
        this.diamonds = diamonds;
    }

    // Setter methods.
    set_lines(lines) { this.lines = lines }

    set_texts(texts) { this.texts = texts }

    set_rects(rects) { this.rects = rects }

    set_circles(circles) { this.circles = circles }

    set_diamonds(diamonds) { this.diamonds = diamonds }

    // Methods for adding an array of objects to the display.
    add_lines(lines) { this.lines = this.lines.concat(lines) }

    add_texts(texts) { this.texts = this.texts.concat(texts) }

    add_rects(rects) { this.rects = this.rects.concat(rects) }

    add_circles(circles) { this.circles = this.circles.concat(circles) }

    add_diamonds(diamonds) { this.diamonds = this.diamonds.concat(diamonds) }

    // Methods for adding one object to the display.
    add_a_line(line) { this.lines.push(line) }

    add_a_text(text) { this.texts.push(text) }

    add_a_rect(rect) { this.rects.push(rect) }

    add_a_circle(circle) { this.circles.push(circle) }

    add_a_diamond(diamond) { this.diamonds.push(diamond) }

    duplicate() {
        return new disp.DisplayDataset(this.lines, this.texts, this.rects,
            this.circles, this.diamonds);
    }

    /**
     * Merge the current <DisplayDataset> with another one.
     * 
     * @param {disp.DisplayDataset} dispDataset : the <DisplayDataset> to be merged in
     * @param {boolean} remove : if dispDataset should be deleted after being merged in
     */
    merge( dispDataset, remove = true ) {
        this.add_lines( dispDataset.lines );
        this.add_texts( dispDataset.texts );
        this.add_rects( dispDataset.rects );
        this.add_circles( dispDataset.circles );
        this.add_diamonds( dispDataset.diamonds );
        if (remove) { dispDataset = null }
    }

}
