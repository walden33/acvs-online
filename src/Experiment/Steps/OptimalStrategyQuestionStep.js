/**
 * A step class that shows participant a multiple choice question
 * 
 * @author Walden Y. Li
 * @version 1.1 (01/07/2020)
 */
exp.OptimalStrategyQuestion = class extends util.AbstractStep {

    /**
     * 
     * @param {*} db : database object
     * @param {*} optTargColor : optimal target color for this question.
     *      (0, 1 = RED, BLUE in Standard ACVS and 0, 1, 2 = MAG, CYAN, ORANGE
     *      in Color Cue ACVS)
     */
    constructor(db, optTargColor) {
        super();
        this._db = db;
        this._opt_targ_color = optTargColor;
        this._db._answer = [];
    }

    execute() {

        util.Workspace.clear_header();
        util.Workspace.clear_workspace();

        const ws = util.Workspace.workspace();
        ws.style("display", "grid")
            .style("grid-template-columns", "5fr 2fr");

        const acvsDiv = ws.append("div").attr("id", "question_display");
        const questionDiv = ws.append("div").attr("id", "question_body");

        const acvs_widget = new disp.DisplayWidget(acvsDiv);
        acvs_widget.draw(disp.StandardDisplayGenerator.generate_one_display(this._opt_targ_color));
        const question_widget = new disp.MultipleChoiceWidget(questionDiv);
        question_widget.set_question("To find a target as efficiently as possible, which color should you search for?");
        question_widget.set_choices([
            ["Red", this._opt_targ_color === 0 ? true : false],
            ["Blue", this._opt_targ_color === 0 ? false : true],
            ["None of these answers", false]
        ]);
        question_widget.render();

        questionDiv.append("button")
            .text("Submit")
            .attr("class", "btn-wide")
            .on("click", () => {
                const result = question_widget.check_correctness();
                this._db._answer.push(result);
                console.log(this._db)
                if (result === true) {
                    // Remove grid layout and clear workspace
                    ws.style("display", null)
                        .style("grid-template-columns", null);
                    util.Workspace.clear_workspace();
                    // Send complete signal
                    this.step_completed_signal.emit();
                }
                else {
                    question_widget.show_error_msg("Incorrect. Please try again.");
                }
            });

    }
}
