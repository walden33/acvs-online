/**
 * The <DisplayGenerator> class for Mouse Click Foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.0 (01/31/2021)
 */
disp.MCFDisplayGenerator = class {

    constructor(n_trials, targ_sq_color, targ_cir_color) {
        // Generator parameters
        this._n_total_trials = n_trials;

        // Display settings
        this._screen_x = 100;   // length of the main axis (horizontal)
        this._screen_y = 80;    // length of the cross axis (vertical)
        this._screen_x_border = 0;  // length of blank space on x axis from the left OR right border
        this._screen_y_border = 5;  // length of blank space on y axis from the top OR bottom border
        this._max_x_jitter = 3.5;
        this._max_y_jitter = 3.5/1.25;

        // Stimuli settings
        this._n_items_x = 10;   // number of items on the main axis
        this._n_items_y = 8;    // number of items on the cross axis
        this._n_total_items = this._n_items_x * this._n_items_y;
        this._n_targ_sq = 20;
        this._n_targ_cir = 20;
        this._n_dist_sq = 20;
        this._n_dist_cir = 20;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._dist_sq_color = targ_cir_color;
        this._dist_cir_color = targ_sq_color;
        this._circle_radius = 0.7;
        this._square_size = 2;

        // An array of displays in the block this generator is responsible for
        this._block_displays = this._make_block_displays();
    }

    _get_grid_pos() {
        let result = new Map();
        let i = 0;  // grid number, to be set as the keys of the output <Map>
        let x = this._screen_x_border + ((this._screen_x - 2 * this._screen_x_border) / this._n_items_x) / 2;   // initialize x coord.
        for (let j = 0; j < this._n_items_x; j++) {
            let y = this._screen_y_border + ((this._screen_y - 2 * this._screen_y_border) / this._n_items_y) / 2;   // initialize y coord.
            for (let k = 0; k < this._n_items_y; k++) {
                result.set(i, [x, y]);
                i++;
                y += (this._screen_y - 2 * this._screen_y_border) / this._n_items_y;
            }
            x += (this._screen_x - 2 * this._screen_x_border) / this._n_items_x;  // inc. x coord. to the next col.
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
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._targ_sq_color,
                "targ_sq_" + this._targ_sq_color,
                "pos_" + String(grid_no)
            ))
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
            ))
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
            ))
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
            ))
        }

        return result;
    }

    _make_block_displays() {
        let result = [];
        for (let i = 0; i < this._n_total_trials; i++) {
            result.push(this._make_trial_display());
        }
        return result;
    }


    /**
     * "Public" method. Returns one <DisplayDataset> of this block if there is
     * any left, returns null otherwise.
     */
    yield_trial_display() {
        if (this._block_displays.length > 0) {
            return this._block_displays.pop();
        } else {
            return null;
        }
    }

}
