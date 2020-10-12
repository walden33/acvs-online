/**
 * A class that contains parameters for the settings of the display.
 * Previously named <disp.Display>
 */
disp.DisplaySetting = class {
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
        this.fixation_cross_size = this.digit_size;
        this.ring_square_numbers = [12, 18, 24];
        this.subring_radius_proportion = [0.5, 0.75, 1];
        this.square_color = "rgb(128, 128, 128)";
        // Specific to spatial cue paradigm
        this.cue_radius = this.square_size / 1.5;
        this.cue_stroke_color = "white";
        this.cue_stroke_width = 0.2;
        // Specific to spatial letter cue and temporal paradigm
        this.letter_cue_color = "white";
        // this.letter_cue_font_size = this.digit_size;
    }
}