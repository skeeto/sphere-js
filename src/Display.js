/**
 * Construct the fastest available display object.
 * @returns {Display}
 * @constructor
 */
function Display(canvas) {
    return new Display2D(canvas.getContext('2d'));
}

Display.prototype.fl = 4;
Display.prototype.scale = 0.6;
Display.prototype.translate = P(0, 0, 1.5);
Display.prototype.rotate = P(0, 0, 0);
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
 * @returns this.
 * @method
 */
Display.prototype.addPoint = function(point, color) {
    this.points.push({point: point, color: color.toColor()});
    return this;
};

/**
 * @param {Point} a
 * @param {Point} b
 * @returns this.
 * @method
 */
Display.prototype.addLine = function(a, b, color) {
    this.lines.push({a: a, b: b, color: color.toColor()});
    return this;
};

/**
 * @returns this.
 * @method
 */
Display.prototype.clearData = function() {
    this.points.length = 0;
    this.lines.length = 0;
    return this;
};
