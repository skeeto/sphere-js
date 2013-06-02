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
    var count = display instanceof DisplayGL ? 10000 : 4000;
    for (var i = 0; i < count; i++) {
        display.addPoint(Point.randomSpherical(), P(0, 0, 0));
    }
    if (display instanceof Display2D) {
        display.addLine(P(0, 0, 0), P(1, 0, 0), P(1, 0, 0));
        display.addLine(P(0, 0, 0), P(0, 1, 0), P(0, 0.75, 0));
        display.addLine(P(0, 0, 0), P(0, 0, 1), P(0, 0, 1));
    }
    cube(display);
}

var display;  // for skewer
window.addEventListener('load', function() {
    var canvas = document.getElementById('display');
    display = new Display(canvas);
    if (!(display instanceof DisplayGL)) {
        var warning = document.querySelector('.warning');
        warning.style.display = 'block';
    }
    if (window.requestAnimationFrame == null) {
        window.requestAnimationFrame =
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(f) {
                setTimeout(f, 16);
            };
    }
    setup(display);
    step(display);
});
