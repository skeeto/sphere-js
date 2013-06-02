precision mediump float;

attribute vec3 position;

uniform float focal;
uniform vec3 translate;
uniform vec3 rotate;

void main() {
    vec3 trans = position + translate;
    gl_Position = vec4(focal * trans.x / (focal + trans.z),
                       focal * trans.y / (focal + trans.z),
                       trans.z, 1.0);
    gl_PointSize = 4.0;
}
