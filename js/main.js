$(document).ready(function(){
    initGame();
});

function initGame(){
    basicScene = new BasicScene();
    function animate () {
        requestAnimationFrame(animate);
        basicScene.frame();
    }
    animate();
}

function gameOver() {
    // basicScene = new BasicScene();
    console.log("game over");
}

function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
    );
}