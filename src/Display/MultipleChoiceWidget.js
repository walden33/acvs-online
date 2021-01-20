/**
 * MultipleChoiceWidget class is responsible for the view of a multiple choice
 * question. It takes in questions and answers with their correctness and
 * show them on the parent HTML element.
 * 
 * @package acvs-online
 * @version 1.1 (01/19/2021)
 * @author Walden Y. Li
 */
disp.MultipleChoiceWidget = class {

    constructor(parent) {
        this._parent = parent;
        this._main_div = this._parent.append("div")
            .style("font-size", "1.6em")
            .style("color", "white");
        // Default values for HTML elements
        this._inputElementName = "choices"; // the "name" attribute of <input>
        this._inputElementIDPrefix = "choice_"; // the prefix of the id of each <input>

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
     * @param {Array} data : An array of [choice, correctness] pairs
     */
    set_choices(data) {
        this._choices = data;
    }

    check_correctness() {
        let radios = document.getElementsByName(this._inputElementName);
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return this._choices[i][1];
            }
        }
        return false;
    }

    render() {

        const questionDiv = this._main_div.append("div");

        // Add the question
        questionDiv.html(this._question);

        // Randomize the choice options
        util.Util.fisher_yates_shuffle(this._choices);

        // Add each choice option
        this._choices.forEach((choice, index) => {
            const choiceDiv = this._main_div.append("div");
            choiceDiv.append("input")
                .attr("type", "radio")
                .attr("name", this._inputElementName)
                .attr("id", this._inputElementIDPrefix + String(index));
            choiceDiv.append("label")
                .attr("for", this._inputElementIDPrefix + String(index))
                .html(choice[0]);
        });

    }

    show_error_msg(html) {
        util.Workspace.append_line(error_msg, 1.6, "red", 1000);
        const id = "s_" + util.Util.random_string(8);
        this._main_div.append("div")
            .attr("id", id)
            .style("font-size", String(font_size) + "em")
            .style("color", color)
            .html(html);
        setTimeout(() => {
            this._main_div.select("#" + id).remove()
        }, 1000);
    }

}
