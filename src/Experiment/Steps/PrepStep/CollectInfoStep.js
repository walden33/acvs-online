/**
 * 
 * @version 1.1 (11/25/2021)
 * @author Walden Y. Li
 */
exp.CollectInfoStep = class extends util.AbstractStep {

    constructor(db) {
        super();
        this._db = db;
    }

    _validate_form() {
        this._db._user_info.age = d3.select("#age").property("value");
        this._db._user_info.gender = d3.select("#gender").property("value");
        this._db._user_info.osuid = d3.select("#osuid").property("value");
        console.log(this._db._user_info);
        setTimeout(this.step_completed_signal.emit(), 100);
    }

    execute() {
        util.Workspace.clear_workspace();

        let paragraphs = []
        paragraphs.push("<br><br><br>");
        paragraphs.push('Please enter your age:');
        paragraphs.push('<input type="text" id="age" size="10"></input> <br>');
        paragraphs.push('Please enter your gender:');
        paragraphs.push('<input type="text" id="gender" size="10"></input> <br>');
        paragraphs.push('Please enter your osu name.id:');
        paragraphs.push('<input name="text" id="osuid" size="10"></input> <br>');
        paragraphs.push("<hr><br><br><br>");
          
        util.Workspace.append_paragraphs(paragraphs);
        util.Workspace.append_button( "Continue", this._validate_form.bind(this) );
    
    }

}
