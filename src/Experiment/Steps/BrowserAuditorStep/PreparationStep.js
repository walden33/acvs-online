/**
 * The <PreparationStep> will do the following preparation before entering the
 * experiment.
 * 
 * First, gather information from the user's web browser, and if the window
 * is not maximized, alert the user to enter full screen.
 * 
 * Second, show the user informed consent and options to accept or decline.
 * 
 * Third,
 * 
 * @package ac-spatial-cue-1
 * @version 1.1 (07/23/2020)
 * @author Walden Li
 * 
 */
exp.PreparationStep = class extends(util.AbstractStep) {

    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        this._db.EventsTable.add_new_row("Begin Preparation Step.");

        // Store browser information
        this._db.BrowserInfo = {};
        this._db.BrowserInfo.browser_name = bowser.name;
        console.log(this._db.BrowserInfo.browser_name);

    }

}