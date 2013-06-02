/**
 * Construct the fastest available display object.
 * @returns {Display}
 * @constructor
 */
function Display(canvas) {
    var gl = canvas.getContext('webgl');
    if (gl == null) {
        return new Display2D(canvas.getContext('2d'));
    } else {
        return new DisplayGL(gl);
    }
}

Display.prototype.fl = 4;
Display.prototype.scale = 0.6;
Display.prototype.translate = P(0, 0, 1.5);
Display.prototype.rotate = P(0, 0, 0);
Display.prototype.dirty = true;
Display.prototype.points = null;
Display.prototype.lines = null;

Display.error = function(message) {
    message = message || 'unimplemented method';
    return function() {
        throw new Error(message);
    };
};

Display.prototype.clear = Display.error();
Display.prototype.render = Display.error();

/**
 * @param {Point} point
 * @param {Point} color
 * @returns {Display} this
 * @method
 */
Display.prototype.addPoint = function(point, color) {
    this.dirty = true;
    this.points.push({point: point, color: color.toColor()});
    return this;
};

/**
 * @param {Point} a
 * @param {Point} b
 * @returns {Display} this
 * @method
 */
Display.prototype.addLine = function(a, b, color) {
    this.dirty = true;
    this.lines.push({a: a, b: b, color: color.toColor()});
    return this;
};

/**
 * @returns {Display} this
 * @method
 */
Display.prototype.clearData = function() {
    this.dirty = true;
    this.points.length = 0;
    this.lines.length = 0;
    return this;
};
