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

    this.programs = {};
    this.programs.dots = new Program(gl, 'src/project.vert', 'src/dot.frag');
    this.programs.dots.attrib('position')
        .uniform('translate')
        .uniform('rotate')
        .uniform('focal')
        .uniform('scale');

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
    this.programs.dots.attrib('position', packer.pack(), 3);

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
        .uniform('translate', this.translate)
        .uniform('rotate', this.rotate)
        .uniform('focal', this.fl)
        .uniform('scale', this.scale * 2);
    gl.drawArrays(gl.POINTS, 0, this.points.length);
    if (gl.getError() !== gl.NO_ERROR) {
        throw new Error('WebGL rendering error');
    }

    return this;
};
