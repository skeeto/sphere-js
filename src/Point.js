/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @constructor
 */
function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

/**
 * Shorthand Point construction.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Point}
 */
function P(x, y, z) {
    return new Point(x, y, z);
}

/**
 * @returns {string}
 * @method
 */
Point.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")";
};

/**
 * @returns {number} the distance from the origin.
 * @method
 */
Point.prototype.abs = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

/**
 * @param {number} s Divisor.
 * @returns {Point} a new point.
 * @method
 */
Point.prototype.div = function(s) {
    return new Point(this.x / s, this.y / s, this.z / s);
};

/**
 * @param {number} s Multiplier.
 * @returns {Point} a new point.
 * @method
 */
Point.prototype.mult = function(s) {
    return new Point(this.x * s, this.y * s, this.z * s);
};

/**
 * Project this point onto a 2D surface, with the camera pointed at
 * the origin along the z-axis.
 * @param {number} v Distance between camera and surface.
 * @param {number} d Distance between origin and surface.
 * @returns {Point}
 * @method
 */
Point.prototype.project = function(v, d) {
    return new Point((v * this.x) / (d + v + this.z),
                     (v * this.y) / (d + v + this.z));
};

/**
 * @param {number} a A rotation angle (radians).
 * @returns {Point} this point rotated about the X axis.
 * @method
 */
Point.prototype.rotateX = function(a) {
    return new Point(this.x,
                     this.y * Math.cos(a) - this.z * Math.sin(a),
                     this.y * Math.sin(a) + this.z * Math.cos(a));
};

/**
 * @param {number} a A rotation angle (radians).
 * @returns {Point} this point rotated about the Y axis.
 * @method
 */
Point.prototype.rotateY = function(a) {
    return new Point(this.z * Math.sin(a) + this.x * Math.cos(a),
                     this.y,
                     this.z * Math.cos(a) - this.x * Math.sin(a));
};

/**
 * @returns {Point} A uniformly random point on the outside of a unit sphere.
 */
Point.random = function() {
    function r() { return Math.random() * 2 - 1; }
    do {
        var p = new Point(r(), r(), r());
    } while (p.abs() > 1);
    return p.div(p.abs());
};

/**
 * @returns {Point} A biased random point on the outside of a unit sphere.
 */
Point.randomSpherical = function() {
    var q = Math.random() * Math.PI * 2,
        f = Math.random() * Math.PI * 2;
    return new Point(Math.sin(q) * Math.cos(f),
                     Math.sin(q) * Math.sin(f),
                     Math.cos(q));
};
