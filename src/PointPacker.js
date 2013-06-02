function PointPacker() {
    this.array = [];
}

PointPacker.prototype.push = function(point) {
    this.array.push(point.x, point.y, point.z);
    return this;
};

PointPacker.prototype.pushAll = function(array, f) {
    for (var i = 0; i < array.length; i++) {
        var points = f(array[i]);
        for (var p = 0; p < points.length; p++) {
            this.push(points[p]);
        }
    }
    return this;
};

PointPacker.prototype.pack = function(gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(this.array), gl.STATIC_DRAW);
    return buffer;
};
