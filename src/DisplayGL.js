/**
 * @param {WebGLRenderingContext} gl
 * @constructor
 */
function DisplayGL(gl) {
    this.gl = gl;
    this.points = [];
    this.lines = [];
    this.program = null;
    this.init();
}

DisplayGL.prototype = Object.create(Display.prototype);
DisplayGL.prototype.constructor = DisplayGL;

/**
 * Initialize this display.
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.init = function() {
    var gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.lineWidth(3);

    this.programs = {};
    this.programs.dots = new Program(gl, 'src/project.vert', 'src/dot.frag');
    this.programs.lines = new Program(gl, 'src/project.vert', 'src/color.frag');

    this.dirty = true;
    return this;
};

/**
 * Synchronize the local data with the GPU buffers.
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.clean = function() {
    var start = Date.now();
    var gl = this.gl;

    var packer = new PointPacker().pushAll(this.points, function(e) {
        return [e.point];
    });
    this.programs.dots.buffer = packer.pack(gl);

    packer = new PointPacker().pushAll(this.lines, function(e) {
        return [e.a, e.b];
    });
    this.programs.lines.buffer = packer.pack(gl);

    console.log('Update took ' + ((Date.now() - start) / 1000) + ' seconds.');
    this.dirty = false;
    return this;
};

/**
 * Clear the display.
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.clear = function() {
    this.gl.clearColor(0.83, 0.83, 0.83, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    return this;
};

/**
 * Render all of the current points and lines to the display.
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.render = function() {
    var gl = this.gl;
    if (this.dirty) this.clean();
    this.clear();

    this.programs.dots.use()
        .attrib('position', this.programs.dots.buffer, 3)
        .uniform('translate', this.translate)
        .uniform('rotate', this.rotate)
        .uniform('focal', this.fl)
        .uniform('scale', this.scale * 2)
        .draw(gl.POINTS, this.points.length);

    this.programs.lines.use()
        .attrib('position', this.programs.lines.buffer, 3)
        .uniform('translate', this.translate)
        .uniform('rotate', this.rotate)
        .uniform('focal', this.fl)
        .uniform('scale', this.scale * 2)
        .uniform('color', P(0, 0, 0))
        .draw(gl.LINES, this.lines.length * 2);

    return this;
};
