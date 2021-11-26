/**
 * A step class that shows participant a multiple choice question
 * 
 * @author Walden Y. Li
 * @version 1.1 (01/07/2021)
 */
exp.MultipleChoice = class extends util.AbstractStep {

    constructor(db) {
        super();
        this._db = db;
        this._db._answer = [];

        // View
        // Default values for HTML elements
        this._inputElementName = "choices"; // the "name" attribute of <input>
        this._inputElementIDPrefix = "choice_"; // the prefix of the id of each <input>

        // Model
        // A string for question
        this._question = undefined;
        // An array with multiple [choice, correctness] pairs. Correctness
        // should be represented by booleans
        this._choices = [];
    }


    /**
     * 
     * @param {string} str : The question
     */
    set_question(str) {
        this._question = str;
    }

    /**
     * 
     * @param {Array} choices
     */
    set_choices(choices) {
        this._choices = choices;
    }

    execute() {

        util.Workspace.clear_workspace();

        // Composing HTML for the multiple choice question
        let html = "";
        html += "<div style=\"font-size: 1.6em; color: white;\">";
        // Add the question
        html += "<div>" + this._question + "</div>";
        // Randomize the choice options
        // util.Util.fisher_yates_shuffle(this._choices);
        // Add each choice option
        this._choices.forEach((choice, index) => {
            html += "<div>";
            html += "<input type=\"radio\" name=\"" + this._inputElementName +
                "\" id=\"" + this._inputElementIDPrefix + String(index) + "\">";
            html += "<label for=\"" + this._inputElementIDPrefix + String(index)
                + "\">";
            html += " " + choice[0];
            html += "</label>";
            html += "</div>";
        });
        html += "</div>";
        util.Workspace.append_html(html);

        util.Workspace.workspace().append("button")
            .text("Submit")
            .attr("class", "btn-wide")
            .on("click", () => {
                this._db._answer.push(result);
                util.Workspace.clear_workspace();
                this.step_completed_signal.emit();
            });

    }
}
