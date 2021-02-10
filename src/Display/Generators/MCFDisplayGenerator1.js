/**
 * The <DisplayGenerator> class for Mouse Click Foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.3 (02/08/2021)
 * 
 * @update 1.3 Made this class an extension of the base class
 *  <MCFDisplayGenerator>.
 * @update 1.2 Added a black object to the back of each display object to allow
 *  some degree of deviation in mouse clicking.
 */
disp.MCFDisplayGenerator1 = class extends disp.MCFDisplayGenerator {

    constructor(n_trials, targ_sq_color, targ_cir_color) {

        super();

        // Generator parameters
        this._n_total_trials = n_trials;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._dist_sq_color = targ_cir_color;
        this._dist_cir_color = targ_sq_color;

        // An array of displays in the block this generator is responsible for
        this._block_displays = this._make_block_displays();

    }

    _make_block_displays() {
        let result = [];
        for (let i = 0; i < this._n_total_trials; i++) {
            result.push(this._make_trial_display());
        }
        return result;
    }

    _make_trial_display() {
        let result = new disp.DisplayDataset();
        const gridPos = this._get_grid_pos();
        let items = util.Util.range(this._n_total_items);
        util.Util.fisher_yates_shuffle(items);

        // 1. Add target squares
        for (let i = 0; i < this._n_targ_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            // Add target shape
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._targ_sq_color,
                "targ_sq_" + this._targ_sq_color,
                "pos_" + String(grid_no)
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                "targ_sq_" + this._targ_sq_color,
                "pos_" + String(grid_no) + "_bg"
            ));
        }

        // 2. Add distractor squares
        for (let i = 0; i < this._n_dist_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._dist_sq_color,
                "dist_sq_" + this._dist_sq_color,
                "pos_" + String(grid_no)
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                "dist_sq_" + this._dist_sq_color,
                "pos_" + String(grid_no) + "_bg"
            ));
        }

        // 3. Add target circles
        for (let i = 0; i < this._n_targ_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_circle(new disp.Circle(
                x + '',
                y + '',
                this._circle_radius,
                this._targ_cir_color,
                this._targ_cir_color,
                null,
                "targ_cir_" + this._targ_cir_color,
                "pos_" + String(grid_no)
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                "targ_cir_" + this._targ_cir_color,
                "pos_" + String(grid_no) + "_bg"
            ));
        }

        // 4. Add distractor circles
        for (let i = 0; i < this._n_dist_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_circle(new disp.Circle(
                x + '',
                y + '',
                this._circle_radius,
                this._dist_cir_color,
                this._dist_cir_color,
                null,
                "dist_cir_" + this._dist_cir_color,
                "pos_" + String(grid_no)
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                "dist_cir_" + this._dist_cir_color,
                "pos_" + String(grid_no) + "_bg"
            ));
        }        

        return result;
    }

}
