/**
 * 
 */
disp.ACGradDisplayGenerator = class {

    constructor() {
        // screen center coordinates
        this._screen_center_x = 50;
        this._screen_center_y = 50;
        // ACVS rings
        this._ring_radius = 45;
        this._num_rings = 3;
        this._square_size = 4;
        // digits
        this._digit_size = this.square_size * 0.65;
        this._digit_color = "white";
        this._digit_font = "Arial, Helvetica, sans-serif",
        this._digit_class_name = "acvs-digit";
        // for non-Chrome browsers, text location needs to be adjusted in order to center on squares
        this._digit_shift_x = 0;
        this._digit_shift_y = this.digit_size * 0.35;
        // fixation cross (as text "+")
        this._fixation_cross_class_name = "fixation-cross-center";
        this._fixation_cross_size = this.digit_size;
        this._ring_square_numbers = [12, 18, 24];
        this._subring_radius_proportion = [0.5, 0.75, 1];
        this._square_color = "rgb(128, 128, 128)";
    }

    _get_grid_pos() {
        let result = new Map();
        const r = this._ring_radius;
        const cx = this._screen_center_x;
        const cy = this._screen_center_y;
        const sz = this._square_size;
        const p = this._subring_radius_proportion;
        let i = 1;  // grid number, to be set as the key of the output <Map>
        for (let j = 0; j < this._num_rings; j++) {   // three rings, from inner to outer
            let n = this._ring_square_numbers[j];    // get # of squares in this ring
            for (let k = 0; k < n; k++) {
                // Create an Object to store grid info
                let grid = {};
                let angle = 2 * Math.PI / n;
                grid.x = Math.cos(angle * k + Math.PI / 2) * r * p[j] + cx;
                grid.y = Math.sin(angle * k + Math.PI / 2) * r * p[j] + cy;
                grid.rect_x = grid.x - sz / 2;
                grid.rect_y = grid.y - sz / 2;
                grid.ecc = j + 1;     // eccentricity
                grid.alpha = angle * k;
                // Set the Object as the value of the key (grid number)
                result.set(i, grid);
                i++;
            }

        }
        return result;
    }

    /**
     * Return an array of grid info for either left or right side, or both
     * 
     * @param {boolean} randomize Whether indexes are randomized
     * 
     * @returns number[] | number[][]
     */
    _get_grid_pos_by_side(randomize = true, side = undefined) {
        const gridPos = this._get_grid_pos();
        const left = [], right = [];
        for (let i = 1; i <= gridPos.size; i++) {
            // get grid alpha angle defined as clockwise rotation from the
            // vertical line pointing south (in rad)
            const alpha = gridPos.get(i).alpha;
            if(alpha > 0 && alpha < 3.141) left.push(i);
            else if(alpha > 0 && alpha > 3.142) right.push(i);
        }
        if (randomize) {
            util.Util.fisher_yates_shuffle(left);
            util.Util.fisher_yates_shuffle(right);
        }
        if (side === 0) {
            return left;
        } else if (side === 1) {
            return right;
        } else {
            return [left, right];
        }
    }

    /**
     * Return an array of an array of grid info based on their eccentricity.
     * By default, all possible eccentricities will be returned.
     * 
     * @param {boolean} randomize If indexes should be randomized
     * @param {number} ecc Which eccentricity to return, if specified
     * 
     * @returns number[] | number[][]
     */
    _get_grid_pos_by_ecc(randomize=true, ecc=undefined) {
        // Initialize return array
        const result = new Array(this._num_rings);
        for(let i = 0; i < result.length; i++) result[i] = new Array();
        for(let [i, g] of this._get_grid_pos()) {
            result[g.ecc-1].push(i);
        };
        if (randomize) {
            result.forEach( arr => util.Util.fisher_yates_shuffle(arr) );
        }
        if (ecc !== undefined) result = result[ecc-1];
        return result;
    }



}