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
    display.rotation = display.rotation.plus(P(0.005, 0.01, 0));
    display.ctx.fillStyle = 'lightgray';
    display.clear();
    display.draw(function() {
        display.ctx.strokeStyle = 'red';
        display.line(P(0, 0, 0), P(1, 0, 0));
        display.ctx.strokeStyle = 'green';
        display.line(P(0, 0, 0), P(0, 1, 0));
        display.ctx.strokeStyle = 'blue';
        display.line(P(0, 0, 0), P(0, 0, 1));

        display.ctx.fillStyle = 'black';
        points.forEach(function(p) {
            display.point(p);
        });

        display.ctx.strokeStyle = 'black';
        cube(display);
    });
    window.requestAnimationFrame(function() {
        step(display);
    });
}

var display;
window.addEventListener('load', function() {
    var canvas = document.getElementById('display');
    display = new Display(canvas.getContext('2d'));
    if (window.requestAnimationFrame == null) {
        window.requestAnimationFrame =
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
    }
    step(display);
});
