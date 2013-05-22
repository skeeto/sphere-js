var points = (function() {
    var points = [];
    for (var i = 0; i < 4000; i++) {
        points.push(Point.randomSpherical());
    }
    return points;
}());

/**
 * Draw a cube.
 * @param {Display} display
 */
function cube(display) {
    var s = Math.sqrt(3);
    display.line(P(-1, -1, -1).div(s), P(-1, -1,  1).div(s));
    display.line(P(-1, -1,  1).div(s), P(-1,  1,  1).div(s));
    display.line(P(-1,  1,  1).div(s), P(-1,  1, -1).div(s));
    display.line(P(-1,  1, -1).div(s), P(-1, -1, -1).div(s));
    display.line(P( 1, -1, -1).div(s), P( 1, -1,  1).div(s));
    display.line(P( 1, -1,  1).div(s), P( 1,  1,  1).div(s));
    display.line(P( 1,  1,  1).div(s), P( 1,  1, -1).div(s));
    display.line(P( 1,  1, -1).div(s), P( 1, -1, -1).div(s));
    display.line(P( 1, -1, -1).div(s), P(-1, -1, -1).div(s));
    display.line(P( 1, -1,  1).div(s), P(-1, -1,  1).div(s));
    display.line(P( 1,  1,  1).div(s), P(-1,  1,  1).div(s));
    display.line(P( 1,  1, -1).div(s), P(-1,  1, -1).div(s));
}

function step(display) {
    display.q += 0.005;
    display.f += 0.01;
    display.clear('lightgray');
    display.draw(function() {
        display.line(P(0, 0, 0), P(1, 0, 0), 'red');
        display.line(P(0, 0, 0), P(0, 1, 0), 'green');
        display.line(P(0, 0, 0), P(0, 0, 1), 'blue');
        points.forEach(function(p) {
            display.point(p);
        });
        cube(display);
    });
}

window.addEventListener('load', function() {
    var canvas = document.getElementById('display');
    var display = new Display(canvas.getContext('2d'));
    setInterval(function() { step(display); }, 15);
});
