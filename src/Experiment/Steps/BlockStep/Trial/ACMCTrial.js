/**
 * A trial class for ACMC.
 * 
 * @author Walden Y. Li
 * @version 1.1 (11/25/2021)
 * 
 * @created 11/25/2021
 */
exp.ACMCTrial = class extends exp.AbstractTrial {

    /**
     * 
     * @param {Array<disp.DisplayDataset>} stimuli
     * @param {Object} logic
     */
    constructor(stimuli, logic) {

        super();

        this._stimuli = stimuli;
        this._logic = logic;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace());

        // Create an object to store the data for this Trial
        this._trial_result = {};

        // Create an object to store tracking data
        this._trial_tracking = {};

        // Trial parameters
        this._fixation_duration = 1000;   // duration fixation cross is shown
        this._feedback_duration = 1500;

        // Trial runtime variables
        this._mouseovered = [];
        this._mouseovered_opt = 0;
        this._mouseovered_nonopt = 0;
        this._opt_targ_revealed = false;
        this._nonopt_targ_revealed = false;
        this._targs = [];

    }


    _initialize_trial() {
        d3.select(".fixation-cross-center").text("START");
        setTimeout(()=>{
            d3.select(".fixation-cross-center").text("+");
        },200);
        this._trial_result.trial_initialized_at = util.Util.get_timestamp();
        this._trial_tracking.trial_initialized_at = util.Util.get_timestamp();
        d3.selectAll("rect,text,circle")
            .on("mouseover", _process_mouseover)
            .on("click", _process_click);
    }

    _process_mouseover(d) {
        // If id is empty, this is the fixation cross
        if (d.id === undefined) return;
        // Otherwise, this is a digit. Get the digit info.
        const id = d.id.split('_');
        const color = id[0];
        const opt = id[2];
        const index = id[3];
        // Record this mouseover in the array
        // But before then, check if this is already recorded
        // If this item matches the latest in the array, it means that
        // likely no new item is mouseovered (like mouseovering the
        // square and then its digit). If this item matches some element
        // already in the array but does not match the last one, it is
        // likely that this is a re-visit.
        if (this._mouseovered.length > 0) {
            // If element index is unique, meaning it is not visited
            // before, update count
            if (!mouseovered.some(e => e[2] === index)) {
                if (opt === "opt") this._mouseovered_opt++;
                if (opt === "nonopt") this._mouseovered_nonopt++;
            }
            // If element index does not match the last one, record it
            if (index !== this._mouseovered[this._mouseovered.length - 1][2]) {
                this._mouseovered.push([color, opt, index, util.Util.get_timestamp()]);
            }
        } else {
            this._mouseovered.push([color, opt, index, util.Util.get_timestamp()]);
            if (opt === "opt") this._mouseovered_opt++;
            if (opt === "nonopt") this._mouseovered_nonopt++;
        }
        // If the mouseover is the one that should reveal a target,
        // change digit to target digit if it is not green
        if (color !== "green") {
            if (this._mouseovered_opt === parseInt(this._logic.optTargPos) &&
                !this._opt_targ_revealed) {
                d3.selectAll(".acvs-digit").filter(d => d.id.split('_')[3] === index)
                    .text(`${g._targ_digit}`)
                this._opt_targ_revealed = true;
                this._targs.push(index);
            } else {
                if (this._mouseovered_nonopt === parseInt(this._logic.nonOptTargPos) &&
                    !this._nonopt_targ_revealed) {
                    d3.selectAll(".acvs-digit").filter(d => d.id.split('_')[3] === index)
                        .text(`${g._targ_digit}`)
                    this._nonopt_targ_revealed = true;
                    this._targs.push(index);
                }
            }
        }


        // Reveal the digit
        d3.selectAll(".acvs-digit").filter(d => d.id.split('_')[3] === index).style("display", null);
    }

    _process_click(d) {
        // If id is empty, this is the fixation cross
        if (d.id === undefined) return;
        // Otherwise, this is a digit. Get the digit info.
        const id = d.id.split('_');
        const color = id[0];
        const opt = id[2];
        const index = id[3];
        if (this._targs.some(t => t === index)) _end_trial();
    }

    _end_trial() {
        trial_tracking.mouseover_seq = this._mouseovered;
        
        console.log(this._trial_result)
    }

    run_trial() {

        this._display_widget.clear();
        util.Workspace.clear_message();

        d3.select(".fixation-cross-center").on("click", initialize_trial);

    }

    set_trial_number(n) {
        this._trial_result.block_trial = n;
        this._trial_tracking.block_trial = n;
    }

    set_block_number(n) {
        this._trial_result.block_number = n;
        this._trial_tracking.block_number = n;
    }

    get_trial_completed_signal() {
        return this._trial_completed_signal;
    }

}
