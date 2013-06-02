/**
 * Add a cube to the display.
 * @param {Display} display
 */
function cube(display) {
    var s = Math.sqrt(3);
    var color = P(0, 0, 0);
    display.addLine(P(-1, -1, -1).div(s), P(-1, -1,  1).div(s), color);
    display.addLine(P(-1, -1,  1).div(s), P(-1,  1,  1).div(s), color);
    display.addLine(P(-1,  1,  1).div(s), P(-1,  1, -1).div(s), color);
    display.addLine(P(-1,  1, -1).div(s), P(-1, -1, -1).div(s), color);
    display.addLine(P( 1, -1, -1).div(s), P( 1, -1,  1).div(s), color);
    display.addLine(P( 1, -1,  1).div(s), P( 1,  1,  1).div(s), color);
    display.addLine(P( 1,  1,  1).div(s), P( 1,  1, -1).div(s), color);
    display.addLine(P( 1,  1, -1).div(s), P( 1, -1, -1).div(s), color);
    display.addLine(P( 1, -1, -1).div(s), P(-1, -1, -1).div(s), color);
    display.addLine(P( 1, -1,  1).div(s), P(-1, -1,  1).div(s), color);
    display.addLine(P( 1,  1,  1).div(s), P(-1,  1,  1).div(s), color);
    display.addLine(P( 1,  1, -1).div(s), P(-1,  1, -1).div(s), color);
}

/**
 * Perform one animation step.
 */
function step(display) {
    function rotate(scale) {
        return (Date.now() / 1000 / scale) % (Math.PI * 2);
    }
    display.rotate = P(rotate(4), rotate(Math.sqrt(60)));
    display.render();
    window.requestAnimationFrame(function() {
        step(display);
    });
}

/**
 * Setup the display data.
 */
function setup(display) {
    display.clearData();
    for (var i = 0; i < 4000; i++) {
        display.addPoint(Point.randomSpherical(), P(0, 0, 0));
    }
    display.addLine(P(0, 0, 0), P(1, 0, 0), P(1, 0, 0));
    display.addLine(P(0, 0, 0), P(0, 1, 0), P(0, 0.75, 0));
    display.addLine(P(0, 0, 0), P(0, 0, 1), P(0, 0, 1));
    cube(display);
}

var display;
window.addEventListener('load', function() {
    var canvas = document.getElementById('display');
    display = new Display(canvas);
    if (window.requestAnimationFrame == null) {
        window.requestAnimationFrame =
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
    }
    setup(display);
    step(display);
});
