/**
 * A class that includes static methods to manipulate the workspace of the
 * experiment.
 * 
 * @package acvs-online
 * @author Walden Li
 * @version 1.4
 */
util.Workspace = class Workspace {

    static guiDiv() {
        return d3.select('#gui');
    }

    static show_header(text) {
        // clear any existing header
        Workspace.clear_header();
        // add a new header <div>
        d3.select("body")
            .insert("div", ":first-child")
            .attr("class", "ace_header")
            .attr("id", "headerDiv")
            .html(text);
    }


    static clear_header() {
        d3.selectAll("#headerDiv").remove();
    }

    static workspace() {
        return d3.select("#workspace");
    }

    /**
     * This method clears every <div> under #workspace
     * Note: In the previous version the method was to delete the whole #workspace
     * entirely and create a new identitical #workspace under its parent element.
     * This would completely remove all the class attributes and event listeners
     * manipulated by JS code, so it was not an ideal way to do it.
     */
    static clear_workspace() {
        // delete any existing workspace <div>
        d3.selectAll("#workspace *").remove();
    }


    static append_paragraphs(html, font_size = 1.5) {
        Workspace.workspace().selectAll("p").data(html)
            .enter().append("p")
            .style("font-size", String(font_size) + "em")
            .html(function (d) { return d; });
    }


    static append_html(html) {
        document.getElementById("workspace").innerHTML =
            document.getElementById("workspace").innerHTML + html;
    }


    static append_image(img) {
        img = [img.src];
        Workspace.workspace().selectAll("img").data(img)
            .enter().append("img")
            .attr('src', function (d) { return d; })
            .attr('class', "ace_centered_div_content");
    }


    static append_button(buttonText, onClickCallback) {
        let button = Workspace.workspace().selectAll("button").data([buttonText])
            .enter().append("button");
        button.text(function (d) { return d; });
        button.attr("id", function (d) { return d + "_button"; });
        button.on("click", onClickCallback);
    }

    static show_message(text, color = "white") {
        // clear any existing header
        Workspace.clear_message();
        // add a new header <div>
        d3.select("body")
            .insert("div", ":first-child")
            .attr("class", "ace_message_area")
            .attr("id", "messageDiv")
            .style("color", color)
            .html(text);
    }

    static clear_message() {
        d3.selectAll("#messageDiv").data([]).exit().remove();
    }

    static hide_cursor() {
        Workspace.workspace().style("cursor", "none");
    }

    static show_cursor() {
        Workspace.workspace().style("cursor", "default");
    }
}
