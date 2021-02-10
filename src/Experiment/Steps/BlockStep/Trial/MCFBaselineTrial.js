/**
 * A trial controller class for Mouse Click Foraging baseline task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (02/09/2021)
 */
exp.MCFBaselineTrial = class extends exp.AbstractTrial {

    constructor(stimuli) {

        super();

        this._stimuli = stimuli;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace(), "0 0 100 80", "125vmin");

        // Create an object to store the data for this Trial
        this._trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._feedback_duration = 1500;

        // Trial runtime variables
        // None

    }

    _show_fixation() {
        const fixation = new disp.DisplayDataset();
        fixation.add_a_text(new disp.Text(
            '+', 50, 40, 'white', 3, undefined, "fixation-cross-center"
        ));
        this._display_widget.clear();
        this._display_widget.draw(fixation);
        // Note: When the onclick callback function is set without "bind(this)",
        // the this._fixation_clicked_callback function will think "this" as
        // the SVGTextElement, i.e., the fixation cross.  Adding "bind(this)"
        // sets this class to be the object to which "this" keyword can refer to
        // inside this._fixation_clicked_callback function.
        d3.select(".fixation-cross-center").on("click", this._fixation_clicked_callback.bind(this));
    }

    _fixation_clicked_callback() {
        this._display_widget.clear();
        this._display_widget.draw(this._stimuli);
        this._trial_data.stimuli_rendered_timestamp = performance.now();
        d3.select(".mcf_baseline_target_cross").on("click", this._target_clicked_callback.bind(this));
    }

    _target_clicked_callback(data) {
        this._trial_data.trial_completed_timestamp = performance.now();
        // Record trial result
        this._trial_data.targ_info = data.id;
        this._trial_data.rt = (this._trial_data.trial_completed_timestamp - this._trial_data.stimuli_rendered_timestamp)/1000;
        util.Util.play_mario_sound();
        this._display_widget.clear();
        setTimeout((() => {
            this._display_widget = this._display_widget.destroy();
            this._trial_completed_signal.emit(this._trial_data);
        }).bind(this), this._feedback_duration);
    }

    run_trial() {

        this._display_widget.clear();
        util.Workspace.clear_message();

        this._show_fixation();
    }

    set_trial_number(n) {
        this._trial_data.blockTrial = n;
    }

    set_block_number(n) {
        this._trial_data.blockNumber = n;
    }

    get_trial_completed_signal() {
        return this._trial_completed_signal;
    }

}
