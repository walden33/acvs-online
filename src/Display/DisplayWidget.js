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
 * @package acvs-online
 * @version 1.7 (07/04/2021)
 * @author Walden Y. Li
 * 
 * @update 1.7 (07/04/21) Added polygon rendering
 * @update 1.6 (06/02/21) Added "transform" property for all shapes
 * @update 1.5 Added run_rsvp() method.
 */
disp.DisplayWidget = class {
    constructor(parent, size="0 0 100 100", width="90vmin") {
        this.parent = parent;   // the parent HTML element for the widget
        this.cue;
        this.stimuli;
        // Create the svg container element and selection
        this.svg_container = this.parent.selectAll("div").data([0]).enter().append("div")
            .attr("class", "svg_container")
            .style("width", width);
        // Create the svg element and selection
        this.svg = this.svg_container.selectAll("svg").data([0]).enter().append("svg")
            .attr("viewBox", size)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("class", "ace_svg_content_responsive");
        // TODO: a previously included event listener
        // window.addEventListener("resize", this.show.bind(this));  // redraw the graphic if the window resizes.
    }

    set_cue( cue ) {
        this.cue = cue;
    }

    set_stimuli( stimuli ) {
        this.stimuli = stimuli;
    }

    /** A method to destroy this widget object. */
    destroy() {
        this.parent.selectAll(".svg_container").remove();
        // window.removeEventListener("resize", this.show.bind(this));
        return undefined;
    }

    /** A method to clear the display. */
    clear() {
        this.parent.selectAll("rect").remove();
        this.parent.selectAll("circle").remove();
        this.parent.selectAll("line").remove();
        this.parent.selectAll("text").remove();
        this.parent.selectAll("polygon").remove();
    }

    /**
     * This method clears the display and adds a string as a <text> element at
     * the display center.
     * 
     * @param {string} text
     * @param {string} x : x coordinate for the text
     * @param {string} y : y coordinate for the text
     */
    show_feedback( text, x = "50", y = "50" ) {
        this.clear();
        this.svg.append("text")
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("class", "acvs-feedback");
    }

    /**
     * The core method for the widget. It takes in a <DisplayDataset> where
     * shapes are encapsulated in customized classes, and uses d3.js to create
     * the corresponding svg elements under the parent element.
     * 
     * @param {disp.DisplayDataset} dataset
     */
    draw( dataset ) {

        // Clear the display
        this.clear();

        // Draw rects
        const rects = this.svg.selectAll("rect").data(dataset.rects);
        rects.enter().append("rect")
            .attr("x", d => d.x )
            .attr("y", d => d.y )
            .attr("width", d => d.width )
            .attr("height", d => d.height )
            .attr("fill", d => d.fill )
            .attr("class", d => d.className)
            .attr("id", d => d.id)
            .attr("transform", d => d.transform);
        rects.exit().remove();

        // Draw circles
        const circles = this.svg.selectAll("circle").data(dataset.circles);
        circles.enter().append("circle")
            .attr("cx", d => d.cx )
            .attr("cy", d => d.cy )
            .attr("r", d => d.r )
            .attr("fill", d => d.fill )
            .attr("stroke", d => d.stroke )
            .attr("stroke-width", d => d.strokeWidth )
            .attr("class", d => d.className)
            .attr("id", d => d.id)
            .attr("transform", d => d.transform);
        circles.exit().remove();

        // Draw lines
        const lines = this.svg.selectAll("line").data(dataset.lines);
        lines.enter().append("line")
            .attr("x1", d => d.x1 )
            .attr("y1", d => d.y1 )
            .attr("x2", d => d.x2 )
            .attr("y2", d => d.y2 )
            .attr("stroke", d => d.stroke )
            .attr("stroke-width", d => d.strokeWidth )
            .attr("class", d => d.className)
            .attr("id", d => d.id)
            .attr("transform", d => d.transform);
        lines.exit().remove();

        // Draw texts
        const texts = this.svg.selectAll("text").data(dataset.texts);
        texts.enter().append("text")
            .text( d => d.text )
            .attr("x", d => d.x )
            .attr("y", d => d.y )
            .attr("fill", d => d.fill )
            .attr("font-size", d => d.fontSize )
            .attr("class", d => d.className )
            .attr("id", d => d.id)
            .attr("transform", d => d.transform)
            .style("font-family", d => d.fontFamily);
        texts.exit().remove();

        // Draw polygons
        const polygons = this.svg.selectAll("polygon").data(dataset.polygons);
        polygons.enter().append("polygon")
            .attr("points", d => d.points)
            .attr("fill", d => d.fill )
            .attr("class", d => d.className )
            .attr("id", d => d.id)
            .attr("transform", d => d.transform)
        polygons.exit().remove();

    }

    /** A method to draw the cue using draw(). */
    draw_cue() {
        this.draw(this.cue);
    }

    /** A method to draw the stimuli display using draw(). */
    draw_stimuli() {
        this.draw(this.stimuli);
    }

    /**
     * 
     * @param {disp.DisplayDataset} cue
     * @param {Array<disp.DisplayDataset>} stimuli
     * @param {number} cue_duration : time cue lasts
     * @param {number} soa : stimulus-onset async., time between cue and stimuli
     * @param {number} isi: interstimulus interval for the RSVP stream
     */
    run_rsvp( cue, stimuli, cue_duration, soa, isi ) {

        setTimeout( ()=>{ this.draw( cue ) }, 0 );

        setTimeout( ()=>{ this.clear()}, cue_duration );

        for( let i = 0; i < stimuli.length; i++ ) {
            setTimeout(()=>{ this.draw( stimuli[i] ) }, isi*i + soa );
        }

    }

    dump(text) {
        this.parent.insert("div", ":first-child").html(text).style("color", "white");
    }

}
