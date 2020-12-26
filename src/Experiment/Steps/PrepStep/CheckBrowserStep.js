/**
 * A step class that collects the participant's browser information and prompt
 * them to enter full screen, if they have not already.
 * 
 * Some useful API documentation for reference.
 * Full-screen related:
 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 * Detect full-screen:
 * https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/fullscreenElement
 * 
 * @version 1.1 (08/04/2020)
 * @author Walden Li
 */
exp.CheckBrowserStep = class extends(util.AbstractStep) {

    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        if ( navigator.cookieEnabled === false ) {
        
        }

        const is_fullscreen = () => { return document.fullscreenElement !== null };

        // This function requests the browser to enter full screen. In Chrome,
        // the request can only be called by a user action such as a mouseclick
        // or a keypress, for security reasons.
        // This function checks if the browser is in full-screen mode. If not,
        // it will reveal the overlay div and prompt user to click to trigger
        // a full-screen request. It will then 
        const check_fullscreen = () => {
            if( !is_fullscreen() ) {
                document.getElementById("overlay").style.display = "block";
                document.getElementById("overlay").addEventListener(
                    "click", document.documentElement.requestFullscreen
                );
                document.onfullscreenchange = () => {
                    document.getElementById("overlay").style.display = "none";
                    check_fullscreen();
                }
            } else {
                document.onfullscreenchange = () => check_fullscreen();
            }
        }

        this._db.EventsTable.add_new_row("Checking Browser Step");


        // Initiate the 
        check_fullscreen();
        this.step_completed_signal.emit();
    }

}
