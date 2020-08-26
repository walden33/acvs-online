/**
 * A class that represents an ACVS square. All the information, including its x
 * and y coordinates, side length (here denoted by w and h), color, digit on it,
 * whether it is a target square, whether it is an optimal target, etc.
 * 
 * 
 */
disp.Rect = class {
    /**
     * 
     * @param {String} x 
     * @param {String} y 
     * @param {String} w 
     * @param {String} h 
     * @param {String} fill : the color of the <rect>
     */
    constructor(x, y, w, h, fill) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.fill = fill;
    }
}


disp.Circle = class {
    /**
     * 
     * @param {Number} cx
     * @param {Number} cy 
     * @param {Number} r 
     * @param {String} fill 
     * @param {String} stroke 
     * @param {String} strokeWidth : <svg> <circle> attr "stroke-width" 
     */
    constructor(cx, cy, r, fill, stroke, strokeWidth) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }
}


disp.Line = class {
    /**
     * 
     * @param {String} x1 
     * @param {String} y1 
     * @param {String} x2 
     * @param {String} y2 
     * @param {String} stroke 
     * @param {String} strokeWidth : <svg> <line> attr "stroke-width" 
     */
    constructor(x1, y1, x2, y2, stroke, strokeWidth) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }
}


disp.Text = class {
    /**
     * 
     * @param {String} text 
     * @param {String} x 
     * @param {String} y 
     * @param {String} fill 
     * @param {String} fontSize : <svg> -> <text> attr "font-size"
     * @param {String} className : <svg> -> <text> attr "class"
     */
    constructor(text, x, y, fill, fontSize, className) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.fontSize = fontSize;
        this.className = className;
    }
}