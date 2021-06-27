/**
 * 
 */
disp.ColumnWidget = class {

    /**
     * 
     * @param {d3.selection} workspace 
     * @param {Array<number>} fr_values 
     */
    constructor(workspace, fr_values) {
        this._ws = workspace;
        this._n_col = fr_values.length;
        let grid_temp_col = "";
        fr_values.forEach(fr => grid_temp_col += `${fr}fr `);
        this._ws.style("display", "grid")
            .style("grid-template-columns", grid_temp_col);
    }

    add_div() {
        return this._ws.append("div");
    }

}