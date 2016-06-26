var Character = Class.extend({
    // Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the humanoid
        var head = new THREE.SphereGeometry(32, 16, 16),
            hand = new THREE.SphereGeometry(8, 8, 8),
            foot = new THREE.SphereGeometry(16, 4, 8, 0, Math.PI * 2, 0, Math.PI / 2),
            nose = new THREE.SphereGeometry(4, 8, 8),
        // Set the material, the "skin"
            material = new THREE.MeshLambertMaterial(args);

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.mesh.position.y = 48;
        // Set and add its head
        this.head = new THREE.Mesh(head, material);
        this.head.position.y = 0;
        this.mesh.add(this.head);
        // Set and add its hands
        this.hands = {
            left: new THREE.Mesh(hand, material),
            right: new THREE.Mesh(hand, material)
        };
        this.hands.left.position.x = -40;
        this.hands.left.position.y = -8;
        this.hands.right.position.x = 40;
        this.hands.right.position.y = -8;
        this.mesh.add(this.hands.left);
        this.mesh.add(this.hands.right);
        // Set and add its feet
        this.feet = {
            left: new THREE.Mesh(foot, material),
            right: new THREE.Mesh(foot, material)
        };
        this.feet.left.position.x = -20;
        this.feet.left.position.y = -48;
        this.feet.left.rotation.y = Math.PI / 4;
        this.feet.right.position.x = 20;
        this.feet.right.position.y = -48;
        this.feet.right.rotation.y = Math.PI / 4;
        this.mesh.add(this.feet.left);
        this.mesh.add(this.feet.right);
        // Set and add its nose
        this.nose = new THREE.Mesh(nose, material);
        this.nose.position.y = 0;
        this.nose.position.z = 32;
        this.mesh.add(this.nose);
        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);
        // Set the current animation step
        this.step = 0;
        // Set the rays : one vector for every potential direction
        this.rays = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)
        ];

        // flags
        this.alive = true;

        // And the "RayCaster", able to test for intersections
        this.lookDirection = new THREE.Vector3(0, 0, 1);
        this.rotationDifference = 0;
        this.caster = new THREE.Raycaster();
        this.caster2 = new THREE.Raycaster();

    },
    // Update the direction of the current motion
    setDirection: function (controls) {
        'use strict';
        // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
        var x = controls.left ? 1 : controls.right ? -1 : 0,
            y = 0,
            z = controls.up ? 1 : controls.down ? -1 : 0;
        this.direction.set(x, y, z);

        if(this.direction.x < 0){ // clockwise
            if(this.lookDirection.x == 0 && this.lookDirection.z == 1){
                this.lookDirection.set(-1,0,0);
            }
            else if(this.lookDirection.x == -1 && this.lookDirection.z == 0){
                this.lookDirection.set(0,0,-1);
            }
            else if(this.lookDirection.x == 0 && this.lookDirection.z == -1){
                this.lookDirection.set(1,0,0);
            }
            else if(this.lookDirection.x == 1 && this.lookDirection.z == 0){
                this.lookDirection.set(0,0,1);
            }
        }
        else if(this.direction.x > 0){ // counter-clockwise
            if(this.lookDirection.x == 0 && this.lookDirection.z == 1){
                this.lookDirection.set(1,0,0);
            }
            else if(this.lookDirection.x == -1 && this.lookDirection.z == 0){
                this.lookDirection.set(0,0,1);
            }
            else if(this.lookDirection.x == 0 && this.lookDirection.z == -1){
                this.lookDirection.set(-1,0,0);
            }
            else if(this.lookDirection.x == 1 && this.lookDirection.z == 0){
                this.lookDirection.set(0,0,-1);
            }
        }
    },
    // Process the character motions
    motion: function () {
        'use strict';
        // Update the directions if we intersect with an obstacle
        this.fallingOnWater();
        this.collision();

        // If we're not static
        if (this.direction.z !== 0) {
            // Move the character
            this.move();
        }
        if(this.direction.x !== 0){
            // Rotate the character
            this.rotate();
        }
        return true;
    },
    crushStone: function (controls){
        'use strict';
        var space = controls.space;
        // var space = controls.space ? true : false;
        // console.log("space:", space);
        if(this.alive && space){
            var posToDig = this.canDigHere();

            if(posToDig !== null){
                /* position stuff, update indexes */
                var cube = basicScene.world.floorCubes[posToDig.i][posToDig.j];
                cube.material = basicScene.world.rachMaterial;  // muda a textura do bloco
                // cube.material.needsUpdate = true; //BUG?
                basicScene.world.level[posToDig.i][posToDig.j] = 3; // posiciona a rachadura na matriz do level
                var color1 = 1, color2 = 2;
                /* CHECK FOR EARTHQUAKES! */
                var world = basicScene.world;
                world.regenerateFloodMatrix();
                var unfilledIJ = world.getUnfilledFloodPosition();
                console.log("1st pass");
                world.floodFill(unfilledIJ[0], unfilledIJ[1], color1, color2);
                var unfilledIJ = world.getUnfilledFloodPosition();
                if(unfilledIJ.length > 0){ // existe uma divisão. uma deve ser desmoronada
                    console.log("2nd pass");
                    world.floodFill(unfilledIJ[0], unfilledIJ[1], color2, color1);
                    // count colors 1 and 2 in flood matrix
                    var color1Count = 0, color2Count = 0;
                    for(var i = 0; i < 20; i++){
                        for(var j = 0; j< 20; j++){
                            if(world.floodMatrix[i][j] == color1) color1Count++;
                            else if(world.floodMatrix[i][j] == color2) color2Count++;
                        }
                    }
                    console.log("color1Count", color1Count);
                    console.log("color2Count", color2Count);
                    // earthquake strikes floodfilled blocks with less area
                    if(color1Count < color2Count){
                        world.landslide(1);
                    }
                    else {
                        world.landslide(2);
                    }
                }

            }
        }
    },
    canDigHere: function(){
        var directionImFacing = this.getDirectionThatIsFacing(); // N S W E
        var cubeImOver = this.getCubeposition(); // {i, j}
        var x1, y1, x2, y2, x3, y3;
        
        // 1st and 2nd cube in front indexes
        if(directionImFacing == "N"){
            x1 = cubeImOver.i + 1; y1 = cubeImOver.j;
            x2 = cubeImOver.i + 2; y2 = cubeImOver.j;
            x3 = cubeImOver.i + 3; y3 = cubeImOver.j;
        }
        else if(directionImFacing == "S"){
            x1 = cubeImOver.i - 1; y1 = cubeImOver.j;
            x2 = cubeImOver.i - 2; y2 = cubeImOver.j;
            x3 = cubeImOver.i - 3; y3 = cubeImOver.j;
        }
        else if(directionImFacing == "E"){
            x1 = cubeImOver.i; y1 = cubeImOver.j - 1
            x2 = cubeImOver.i; y2 = (cubeImOver.j - 2);
            x3 = cubeImOver.i; y3 = (cubeImOver.j - 3);
        }
        else if(directionImFacing == "W"){
            x1 = cubeImOver.i; y1 = cubeImOver.j + 1;
            x2 = cubeImOver.i; y2 = (cubeImOver.j + 2);
            x3 = cubeImOver.i; y3 = (cubeImOver.j + 3);
        }
        var cube1stInFront = {i: x1, j: y1}, cube2ndInFront = {i: x2, j: y2}, cube3rdInFront = {i: x3, j: y3};
        var cube1stType = basicScene.world.getGroundType(cube1stInFront.i, cube1stInFront.j);
        var cube2ndType = basicScene.world.getGroundType(cube2ndInFront.i, cube2ndInFront.j) ;
        var cube3rdType = basicScene.world.getGroundType(cube3rdInFront.i, cube3rdInFront.j) ;

        if(this.isOverAHole() && cube1stType == "ground" &&
            ((cube2ndType == "rachadura" || cube2ndType == "water" || cube2ndType == "hole")
             || cube3rdType == "hole")
        ){
            return cube1stInFront;
        }
        else return null;
    },
    fallingOnWater: function(){
        'use strict';
        var collisions,
        // Maximum distance from the origin before we consider collision
             distance = 64,
        // Get the obstacles array from our world
             ground = basicScene.world.getGround();

        this.caster2.set(this.mesh.position, new THREE.Vector3(0, -1, 0));
        collisions = this.caster2.intersectObjects(ground);

        if ( !(collisions.length > 0) || (collisions.length > 0 && collisions[0].distance > distance)){
            this.fall();
            // console.log(this.mesh.position.y);
            if(this.mesh.position.y < -300){
                this.alive = false;
                gameOver();
            }
        }
    },
    // Test and avoid collisions
    collision: function () {
        'use strict';
        var collisions, i,
        // Maximum distance from the origin before we consider collision
            distance = 32,
        // Get the obstacles array from our world
            obstacles = basicScene.world.getObstacles();

        var direction = this.getDirectionThatIsFacing();
        if(direction == "N"){
            var raysFront =  [new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 1), new THREE.Vector3(-1, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0)];
            var raysBack =  [new THREE.Vector3(1, 0, -1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, -1)];
        }
        else if(direction == "S"){
            var raysFront = [new THREE.Vector3(1, 0, -1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0)];
            var raysBack = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 1), new THREE.Vector3(-1, 0, 1)];
        }
        else if(direction == "E"){
            var raysFront = [new THREE.Vector3(-1, 0, -1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-1, 0, 1), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
            var raysBack = [new THREE.Vector3(1, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, -1)];
        }
        else if(direction == "W"){
            var raysFront = [new THREE.Vector3(1, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, -1), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];
            var raysBack = [new THREE.Vector3(-1, 0, -1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-1, 0, 1)];
        }

        for (i = 0; i < raysFront.length; i += 1) {
            // We reset the raycaster to this direction
            this.caster.set(this.mesh.position, raysFront[i]);
            // Test if we intersect with any obstacle mesh
            collisions = this.caster.intersectObjects(obstacles);
            // And disable that direction if we do
            if (collisions.length > 0 && collisions[0].distance <= distance && this.direction.z == 1) {
                this.direction.z = 0;
            }
        }
        for (i = 0; i < raysBack.length; i += 1) {
            // We reset the raycaster to this direction
            this.caster.set(this.mesh.position, raysBack[i]);
            // Test if we intersect with any obstacle mesh
            collisions = this.caster.intersectObjects(obstacles);
            // And disable that direction if we do
            if (collisions.length > 0 && collisions[0].distance <= distance && this.direction.z == -1) {
                this.direction.z = 0;
            }
        }
    },
    // Rotate the character
    rotate: function () {
        'use strict';
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        var angle = Math.atan2(this.lookDirection.x, this.lookDirection.z),
            difference = angle - this.mesh.rotation.y;
        // console.log("mesh rotation:", this.mesh.rotation.y);
        // console.log("angle:", angle);
        // If we're doing more than a 180°
        if (Math.abs(difference) > Math.PI) {
            // We proceed to a direct 360° rotation in the opposite way
            if (difference > 0) { this.mesh.rotation.y += 2 * Math.PI; } else { this.mesh.rotation.y -= 2 * Math.PI; }
            // And we set a new smarter (because shorter) difference
            difference = angle - this.mesh.rotation.y;
            // In short : we make sure not to turn "left" to go "right"
        }

        // Now if we haven't reach our target angle
        if (difference !== 0) {
            // We slightly get closer to it
            this.mesh.rotation.y += difference / 4;

        }
    },
    move: function () {
        'use strict';
        // We update our Object3D's position from our "direction"
        var oldPosIJ = this.getCubeposition();
        if(this.lookDirection.x != 0){
            this.mesh.position.x += this.lookDirection.x * 4 * this.direction.z;
        }
        else if(this.lookDirection.z != 0){
            this.mesh.position.z += this.lookDirection.z * 4 * this.direction.z;
        }
        var curPosIJ = this.getCubeposition();
        basicScene.world.participants[oldPosIJ.i][oldPosIJ.j] = 0;
        basicScene.world.participants[curPosIJ.i][curPosIJ.j] = 5;

        // Now some trigonometry, using our "step" property ...
        this.step += 1 / 4;
        // ... to slightly move our feet and hands
        this.feet.left.position.setZ(Math.sin(this.step) * 16);
        this.feet.right.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 16);
        this.hands.left.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 8);
        this.hands.right.position.setZ(Math.sin(this.step) * 8);

    },
    getCubeposition: function(){
        return ({
            i: Math.round((this.mesh.position.z + 1000)/100),
            j: Math.round((this.mesh.position.x + 1000)/100)
        });
    },
    getTypeOfCubeImOver: function(){
       'use strict';
       var indexIJ = this.getCubeposition();
       var cubeCode = basicScene.world.level[indexIJ.i][indexIJ.j];
       if(cubeCode == 1) { return("ground"); }
       else if (cubeCode == 2) { return("hole");}
       else if (cubeCode == 3) { return("rachadura"); }
    },
    isOverAHole: function(){
        'use strict';
        var typeOfCube = this.getTypeOfCubeImOver();
        if(typeOfCube == "hole") return true;
        else return false;
    },
    fall: function(){
        'use strict';
        this.mesh.position.y += -10;
    },
    getDirectionThatIsFacing: function(){
        if(this.lookDirection.x == 0 && this.lookDirection.z == 1) return "N";
        else if(this.lookDirection.x == -1 && this.lookDirection.z == 0) return "E";
        else if(this.lookDirection.x == 0 && this.lookDirection.z == -1) return "S";
        else if(this.lookDirection.x == 1 && this.lookDirection.z == 0) return "W";
    },
});