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
    // // basicScene = new BasicScene();
    // var message = document.createElement( 'div' );
    // message.className = 'message';
    // message.textContent = "GAME OVER";
    // var object = new THREE.CSS3DObject( message );
    // basicScene.scene.add(object);
    var loader = new THREE.FontLoader();
    loader.load( './fonts/helvetiker_regular.typeface.json', function ( font ) {
        var textGeometry = new THREE.TextGeometry( "GAME OVER", {
            font: font,
            size: 150,
            height: 10,
            curveSegments: 12,
            bevelThickness: 1,
            bevelSize: 1,
            bevelEnabled: true
        });

        var textMaterial = new THREE.MeshPhongMaterial(
            { color: 0xff0000, specular: 0xffffff }
        );
        var mesh = new THREE.Mesh( textGeometry, textMaterial );
        mesh.rotation.y = mesh.rotation.y - Math.PI;

        basicScene.scene.add( mesh );
        // mesh.position.set(0,0,0);

    });
    console.log("game over");
}

function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
    );
}