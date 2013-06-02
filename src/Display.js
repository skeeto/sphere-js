/**
 * Construct the fastest available display object.
 * @returns {Display}
 * @constructor
 */
function Display(canvas) {
    return new Display2D(canvas.getContext('2d'));
}

Display.error = function(message) {
    message = message || 'unimplemented method';
    return function() {
        throw new Error(message);
    };
};

Display.prototype.clear = Display.error();
Display.prototype.addPoint = Display.error();
Display.prototype.addLine = Display.error();
