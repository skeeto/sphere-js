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
 * Synchronously fetch data from the server.
 * @param {string} url
 * @returns {string}
 */
DisplayGL.fetch = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
};

/**
 * Compile a shader from a URL.
 * @param {number} type
 * @param {string} url
 * @returns {WebGLShader}
 */
DisplayGL.prototype.makeShader = function(type, url) {
    var gl = this.gl;
    var shader = gl.createShader(type);
    gl.shaderSource(shader, DisplayGL.fetch(url));
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        throw new Error(gl.getShaderInfoLog(shader));
    }
};

/**
 * Compile and link a program from a pair of shaders.
 * @param {string} vertUrl
 * @param {string} vergrafUrl
 * @returns {WebGLProgram}
 */
DisplayGL.prototype.makeProgram = function(vertUrl, fragUrl) {
    var gl = this.gl;
    var program = gl.createProgram();
    gl.attachShader(program, this.makeShader(gl.VERTEX_SHADER, vertUrl));
    gl.attachShader(program, this.makeShader(gl.FRAGMENT_SHADER, fragUrl));
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    } else {
        throw new Error(gl.getProgramInfoLog(program));
    }
};

/**
 * Set a uniform's data.
 * @param {string} name uniform variable name
 * @param {number|Point} value
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.uniform = function(name, value) {
    var v = this.vars[name];
    if (value instanceof Point) {
        this.gl.uniform3f(v, value.x, value.y, value.z);
    } else {
        this.gl.uniform1f(v, value);
    }
    return this;
};

/**
 * Initialize this display.
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.init = function() {
    var start = Date.now();
    var gl = this.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.vars = {};
    this.program = this.makeProgram('src/project.vert', 'src/color.frag');

    this.vars.position = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(this.vars.position);

    this.vars.translate = gl.getUniformLocation(this.program, 'translate');
    this.vars.rotate = gl.getUniformLocation(this.program, 'rotate');
    this.vars.focal = gl.getUniformLocation(this.program, 'focal');
    this.vars.scale = gl.getUniformLocation(this.program, 'scale');

    gl.useProgram(this.program);
    this.dirty = true;
    var time = (Date.now() - start) / 1000;
    console.log('Initialization took ' + time + ' seconds.');
    return this;
};

/**
 * Synchronize the local data with the GPU buffers.
 * @returns {DisplayGL} this
 */
DisplayGL.prototype.clean = function() {
    var gl = this.gl;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    var array = new Float32Array(this.points.length * 3);
    for (var i = 0; i < this.points.length; i++) {
        array[3 * i + 0] = this.points[i].point.x;
        array[3 * i + 1] = this.points[i].point.y;
        array[3 * i + 2] = this.points[i].point.z;
    }
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.vars.position, 3, gl.FLOAT, false, 0, 0);
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
    this.uniform('translate', this.translate);
    this.uniform('rotate', this.rotate);
    this.uniform('focal', this.fl);
    this.uniform('scale', this.scale * 2);
    gl.drawArrays(gl.POINTS, 0, this.points.length);
    if (gl.getError() !== gl.NO_ERROR) {
        throw new Error('WebGL rendering error');
    }
    return this;
};
