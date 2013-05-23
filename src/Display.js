/**
 * @param {CanvasRenderingContext2D} context
 * @constructor
 */
function Display(context) {
    this.ctx = context;
    this.view = 1;
    this.dist = 1.5;
    this.q = 0;
    this.f = 0;
}

/**
 * Completely clear the display.
 * @param {string} [color] The background color to use.
 * @returns {Display} this.
 * @method
 */
Display.prototype.clear = function(color) {
    this.ctx.fillStyle = color || 'lightgray';
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
    return point.rotateY(this.f).rotateX(this.q).project(this.view, this.dist);
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
    var result = f();
    this.ctx.restore();
    return result;
};

/**
 * Draw a 3D point on the display.
 * @param {Point} point
 * @param {string} [color]
 * @returns {Display} this.
 * @method
 */
Display.prototype.point = function(point, color) {
    var proj = this.project(point);
    this.ctx.fillStyle = color || 'black';
    this.ctx.beginPath();
    this.ctx.arc(proj.x, proj.y, 0.0025, 0, Math.PI * 2);
    this.ctx.fill();
    return this;
};

/**
 * Draw a line between two points.
 * @param {Point} a
 * @param {Point} b
 * @param {string} [color]
 * @returns {Display} this.
 * @method
 */
Display.prototype.line = function(a, b, color) {
    var a2 = this.project(a);
    var b2 = this.project(b);
    this.ctx.strokeStyle = color || 'black';
    this.ctx.lineWidth = 0.003;
    this.ctx.beginPath();
    this.ctx.moveTo(a2.x, a2.y);
    this.ctx.lineTo(b2.x, b2.y);
    this.ctx.stroke();
    return this;
};
