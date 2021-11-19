/**
 * A class that encapsulates all the elements that will be used by d3 to draw on
 * the display.
 * 
 * @package acvs-online
 * @version 1.6 (07/04/2021)
 * @author Walden Li
 * 
 * @update 1.6 (07/04/21) included polygons; updated duplicate()
 * @update 1.5 added a duplicate() method and removed the logic object
 * @update 1.4 added a setter method to logic
 * @update 1.3 added a "logic" object to the constructor
 * @update 1.2 fixed bugs in methods for adding arrays
 */
disp.DisplayDataset = class {

    constructor( lines=[], texts=[], rects=[], circles=[], polygons=[] ) {
        this.lines = lines;
        this.texts = texts;
        this.rects = rects;
        this.circles = circles;
        this.polygons = polygons;
    }

    // Setter methods.
    set_lines(lines) { this.lines = lines }

    set_texts(texts) { this.texts = texts }

    set_rects(rects) { this.rects = rects }

    set_circles(circles) { this.circles = circles }

    set_polygons(polygons) { this.polygons = polygons }

    // Methods for adding an array of objects to the display.
    add_lines(lines) { this.lines = this.lines.concat(lines) }

    add_texts(texts) { this.texts = this.texts.concat(texts) }

    add_rects(rects) { this.rects = this.rects.concat(rects) }

    add_circles(circles) { this.circles = this.circles.concat(circles) }

    add_polygons(polygons) { this.polygons = this.polygons.concat(polygons) }

    // Methods for adding one object to the display.
    add_a_line(line) { this.lines.push(line) }

    add_a_text(text) { this.texts.push(text) }

    add_a_rect(rect) { this.rects.push(rect) }

    add_a_circle(circle) { this.circles.push(circle) }

    add_a_polygon(polygon) { this.polygons.push(polygon) }

    duplicate() {
        return new disp.DisplayDataset(
            JSON.parse(JSON.stringify(this.lines)),
            JSON.parse(JSON.stringify(this.texts)),
            JSON.parse(JSON.stringify(this.rects)),
            JSON.parse(JSON.stringify(this.circles)),
            JSON.parse(JSON.stringify(this.polygons))
        );
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
        this.add_polygons( dispDataset.polygons );
        if (remove) { dispDataset = null }
    }

}
