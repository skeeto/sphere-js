precision mediump float;

attribute vec3 position;

uniform float focal;
uniform vec3 translate;
uniform vec3 rotate;
uniform float scale;

vec3 rot(vec3 v, float a) {
    return vec3(v.x, v.y * cos(a) - v.z * sin(a), v.y * sin(a) + v.z * cos(a));
}

void main() {
    vec3 trans = rot(position, rotate.x);
    trans = rot(trans.yzx, rotate.y).zxy;
    trans += translate;
    gl_Position = vec4(focal * trans.x * scale / (focal + trans.z),
                       focal * trans.y * scale / (focal + trans.z),
                       0.0, 1.0);
    gl_PointSize = 3.0 * scale;
}
