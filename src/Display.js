/**
 * @param {CanvasRenderingContext2D} ctx
 * @constructor
 */
function Display(ctx) {
    this.ctx = ctx;
    this.fl = 1;
    this.translate = P(0, 0, 1.5);
    this.rotation = P(0, 0, 0);
}

/**
 * Completely clear the display.
 * @returns {Display} this.
 * @method
 */
Display.prototype.clear = function() {
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    return this;
};

/**
 * Project a 3D point onto this display.
 * @param {Point} point
 * @returns {Point} A 2-dimensional point.
 * @method
 */
Display.prototype.project = function(point) {
    return point.rotateY(this.rotation.y).rotateX(this.rotation.x)
        .plus(this.translate).project(this.fl);
};

/**
 * Run a function in a drawing context.
 * @param {Function} f
 * @returns the result of calling f.
 * @method
 */
Display.prototype.draw = function(f) {
    this.ctx.save();
    var w = this.ctx.canvas.width,
        h = this.ctx.canvas.height;
    this.ctx.translate(w / 2, h / 2);
    this.ctx.scale(w, h);
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
 * @returns {Display} this.
 * @method
 */
Display.prototype.point = function(point) {
    var proj = this.project(point);
    this.ctx.beginPath();
    this.ctx.arc(proj.x, proj.y, 0.0025, 0, Math.PI * 2);
    this.ctx.fill();
    return this;
};

/**
 * Draw a line between two points.
 * @param {Point} a
 * @param {Point} b
 * @returns {Display} this.
 * @method
 */
Display.prototype.line = function(a, b) {
    var a2 = this.project(a);
    var b2 = this.project(b);
    this.ctx.lineWidth = 0.003;
    this.ctx.beginPath();
    this.ctx.moveTo(a2.x, a2.y);
    this.ctx.lineTo(b2.x, b2.y);
    this.ctx.stroke();
    return this;
};
