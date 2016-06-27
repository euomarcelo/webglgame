
$(document).ready(function(){
    initGame();
    // var drawing = new Image();
    // drawing.src = "images/level.png"; // can also be a remote URL e.g. http://
    // var canvas = document.getElementById("level");
    // var context = canvas.getContext('2d');
    // drawing.onload = function() {
    //     context.drawImage(drawing,0,0);
    //     var p = context.getImageData(10, 10, 1, 1).data;
    //     var color = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    //     console.log(color);
    // };


});

function initGame(){
    basicScene = new BasicScene();
    function animate () {
        requestAnimationFrame(animate);
        basicScene.frame();
    }
    animate();
}


function convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    var context = acanvas.getContext('2s')
    var p = context.getImageData(0,0, 1, 1).data;
    console.log(p);

    return canvas;
}


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}


function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
    );
}