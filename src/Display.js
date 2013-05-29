/**
 * @param {CanvasRenderingContext2D} ctx
 * @constructor
 */
function Display(ctx) {
    this.ctx = ctx;
    this.fl = 4;
    this.scale = 0.6;
    this.translate = P(0, 0, 1.5);
    this.rotation = P(0, 0, 0);
    this.points = [];
    this.lines = [];
}

/**
 * Completely clear the display.
 * @param {Point} [color]
 * @returns {Display} this.
 * @method
 */
Display.prototype.clear = function(color) {
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
Display.prototype.project = function(point) {
    return point.rotateY(this.rotation.y).rotateX(this.rotation.x)
        .plus(this.translate).project(this.fl);
};

/**
 * Run a function in a drawing context.
 * @param {Function} f
 * @returns the result of calling f.
 * @method
 * @private
 */
Display.prototype.draw = function(f) {
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
 * @returns {Display} this.
 * @method
 * @private
 */
Display.prototype.point = function(point) {
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
 * @returns {Display} this.
 * @method
 * @private
 */
Display.prototype.line = function(a, b, color) {
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

/**
 * Render the established points onto the display.
 * @returns this.
 * @method
 */
Display.prototype.render = function() {
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
