/**
 * @param {CanvasRenderingContext2D} ctx
 * @constructor
 */
function Display2D(ctx) {
    this.ctx = ctx;
    this.points = [];
    this.lines = [];
}

Display2D.prototype = Object.create(Display.prototype);
Display2D.prototype.constructor = Display2D;

/**
 * Completely clear the display.
 * @param {Point} [color]
 * @returns {Display2D} this.
 * @method
 */
Display2D.prototype.clear = function(color) {
    this.ctx.fillStyle = color ? color.toColor() : 'lightgray';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    return this;
};

/**
 * Project a 3D point onto this display.
 * @param {Point} point
 * @returns {Point} A 2-dimensional point.
 * @method
 * @private
 */
Display2D.prototype.project = function(point) {
    return point.rotateY(this.rotate.y).rotateX(this.rotate.x)
        .plus(this.translate).project(this.fl);
};

/**
 * Run a function in a drawing context.
 * @param {Function} f
 * @returns the result of calling f.
 * @method
 * @private
 */
Display2D.prototype.draw = function(f) {
    this.ctx.save();
    var w = this.ctx.canvas.width,
        h = this.ctx.canvas.height;
    this.ctx.translate(w / 2, h / 2);
    this.ctx.scale(this.scale * w, this.scale * h);
    try {
        var result = f();
    } finally {
        this.ctx.restore();
        return result;
    }
};

/**
 * Draw a 3D point on the display.
 * @param {Point} point
 * @returns {Display2D} this.
 * @method
 * @private
 */
Display2D.prototype.point = function(point) {
    var proj = this.project(point);
    this.ctx.beginPath();
    this.ctx.arc(proj.x, proj.y, 0.0025 / this.scale, 0, Math.PI * 2);
    this.ctx.fill();
    return this;
};

/**
 * Draw a line between two points.
 * @param {Point} a
 * @param {Point} b
 * @param {Point} color
 * @returns {Display2D} this.
 * @method
 * @private
 */
Display2D.prototype.line = function(a, b, color) {
    var a2 = this.project(a);
    var b2 = this.project(b);
    this.ctx.lineWidth = 0.003 / this.scale;
    this.ctx.beginPath();
    this.ctx.moveTo(a2.x, a2.y);
    this.ctx.lineTo(b2.x, b2.y);
    this.ctx.stroke();
    return this;
};

/**
 * Render the established points onto the display.
 * @returns this.
 * @method
 */
Display2D.prototype.render = function() {
    this.clear();
    this.draw(function() {
        for (var i = 0; i < this.lines.length; i++) {
            var e = this.lines[i];
            this.ctx.strokeStyle = e.color;
            this.line(e.a, e.b);
        }
        for (i = 0; i < this.points.length; i++) {
            e = this.points[i];
            this.ctx.fillStyle = e.color;
            this.point(e.point);
        }
    }.bind(this));
    return this;
};
