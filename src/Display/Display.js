/**
 * This is a class that handles the logic of an ACVS stimuli display.
 * 
 * @package ac-spatial-cue-1
 * @version 1.2 (07/03/20)
 * @author Walden Li
 */
disp.Display = class { 

    constructor() {
        // screen center coordinates
        this.screen_center_x = 50;
        this.screen_center_y = 50;
        // ACVS rings
        this.ring_radius = 45;
        this.square_size = 4;
        // digits
        this.digit_size = this.square_size * 0.65;
        this.digit_color = "white";
        this.digit_class_name = "acvs-digit";
        // for non-Chrome browsers, text location needs to be adjusted in order to center on squares
        this.digit_shift_x = 0;
        this.digit_shift_y = this.digit_size * 0.35;
        // fixation cross (as text "+")
        this.fixation_cross_class_name = "fixation-cross-center";
        this.ring_square_numbers = [ 12, 18, 24 ];
        this.subring_radius_proportion = [ 0.5, 0.75, 1 ];
        this.square_color = "rgb(128, 128, 128)";
        // Specific to spatial cue paradigm
        this.cue_radius = this.square_size/1.5;
        this.cue_stroke_color = "white";
        this.cue_stroke_width = 0.2;
        // Specific to spatial letter cue and temporal paradigm
        this.letter_cue_color = "white";
        // this.letter_cue_font_size = this.digit_size;
    }

    /** Some setter methods. */
    set_ring_radius(r) { this.ring_radius = r }

    set_square_size(sz) { this.square_size = sz }

    /**
     * This method calculates grid position coordinates and store them in a two
     * dimensional Array.
     * 
     * Some variables in the "grid" object:
     * 
     * rect_x & rect_y: the x and y coordinates of the top left corner of
     * each square in the display. This calculation is needed for the widget to
     * draw a square, or <rect>, because an html <rect> element needs only this
     * point to determine the position of a <rect>, and so does d3.
     * Note that different from the MATLAB version, where a "fillRect" method
     * needs the top left AND bottom right corners of a rectangle for it to draw
     * on the screen.
     * 
     * alpha: the angle formed by the vertical line pointing y positive from
     * fixation moving to the line pointing the grid point from fixation (rad).
     * 
     * @returns {Map<number,object>} result : key-value pairs of grid indexes and their information
     */
    get_grid_pos() {
        let result = new Map();
        const r = this.ring_radius;
        const cx = this.screen_center_x, cy = this.screen_center_y;
        const sz = this.square_size;
        const p = this.subring_radius_proportion;
        let i = 1;  // grid number, to be set as the key of the output <Map>
        for (let j = 0; j < 3; j++) {   // three rings, from inner to outer
            let n = this.ring_square_numbers[j];    // get # of squares in this ring
            for (let k = 0; k < n; k++ ) {
                // Create an Object to store grid info
                let grid = {};
                let angle = 2 * Math.PI / n;
                grid.x = Math.cos(angle * k + Math.PI / 2) * r * p[j] + cx;
                grid.y = Math.sin(angle * k + Math.PI / 2) * r * p[j] + cy;
                grid.rect_x = grid.x - sz/2;
                grid.rect_y = grid.y - sz/2;
                grid.ecc = j+1;     // eccentricity
                grid.alpha = angle*k;
                // Set the Object as the value of the key (grid number)
                result.set(i, grid);
                i++;
            }

        }
        return result;
    }


}
