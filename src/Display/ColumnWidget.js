/**
 * 
 */
disp.ColumnWidget = class {

    /**
     * 
     * @param {d3.selection} workspace 
     * @param {number} args fr values of "grid-template-columns"
     */
    constructor(workspace, ...args) {
        this._ws = workspace;
        let grid_temp_col = "";
        args.forEach(fr => grid_temp_col += `${fr}fr `);
        this._ws.style("display", "grid")
            .style("grid-template-columns", grid_temp_col);
    }

    add_div() {
        return this._ws.append("div");
    }

}
