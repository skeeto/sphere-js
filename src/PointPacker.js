/**
 * A tool for converting a collection of Points into a WebGL buffer.
 * @constructor
 */
function PointPacker() {
    this.array = [];
}

/**
 * Add a point to be packed into the buffer.
 * @param {Point} point
 */
PointPacker.prototype.push = function(point) {
    this.array.push(point.x, point.y, point.z);
    return this;
};

/**
 * Push a collection of points into the buffer. The key function
 * must return an array of 0 or more points.
 * @param {Array} array
 * @param {Function} key extracts multiple points from array elements
 */
PointPacker.prototype.pushAll = function(array, key) {
    for (var i = 0; i < array.length; i++) {
        var points = key(array[i]);
        for (var p = 0; p < points.length; p++) {
            this.push(points[p]);
        }
    }
    return this;
};

/**
 * Create a WebGL buffer from the packed points.
 * @param {WebGLRenderingContext} gl
 * @returns {WebGLBuffer}
 */
PointPacker.prototype.pack = function(gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(this.array), gl.STATIC_DRAW);
    return buffer;
};
