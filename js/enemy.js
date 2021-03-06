/**
 * Created by bot on 25/06/2016.
 */
var Enemy = Class.extend({
    // Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the humanoid
        this.basicSize = 64;
        var
            head = new THREE.SphereGeometry(this.basicSize + 5, 16, 16),
            hand = new THREE.SphereGeometry(this.basicSize/4, 8, 8),
            foot = new THREE.SphereGeometry(this.basicSize/4, 4, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        // Set the material, the "skin"
            material = new THREE.MeshLambertMaterial(args);
        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        // Set and add its head
        this.head = new THREE.Mesh(head, material);
        this.head.position.y = (1/4 * this.basicSize + 4);
        this.mesh.add(this.head);
        // Set and add its hands
        this.hands = {
            left: new THREE.Mesh(hand, material),
            right: new THREE.Mesh(hand, material)
        };
        this.hands.left.position.x = -64 - 10;
        this.hands.left.position.y = this.basicSize/2 - 10;
        this.hands.right.position.x = 64 + 10;
        this.hands.right.position.y = this.basicSize/2 - 10;
        this.mesh.add(this.hands.left);
        this.mesh.add(this.hands.right);
        // Set and add its feet
        this.feet = {
            left: new THREE.Mesh(foot, material),
            right: new THREE.Mesh(foot, material)
        };
        this.feet.left.position.x = -64 + 20;
        this.feet.left.position.y = -48;
        this.feet.left.rotation.y = Math.PI / 4;
        this.feet.right.position.x = 64 - 20;
        this.feet.right.position.y = -48;
        this.feet.right.rotation.y = Math.PI / 4;
        this.mesh.add(this.feet.left);
        this.mesh.add(this.feet.right);
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

        this.alive = true;
        this.lookDirection = new THREE.Vector3(0, 0, 1);
        this.caster = new THREE.Raycaster(); // And the "RayCaster", able to test for intersections
        this.caster2 = new THREE.Raycaster();
        this.caster3 = new THREE.Raycaster();

        this.speed = 1.5;
        this.speedOnCrack = 0.3;
        this.falling = false;
        this.positionToGo;
        this.directionToGo = "";
        this.gotPushed = false;
        this.gotPushedSpeed = 20;
    },
    move: function(){
        'use strict';
        var participants = basicScene.world.participants;
        var currIJ = this.getCubeposition();
        var isItColliding = this.isColliding();
        if(this.alive && !this.isOverTheWater()) {
            // define direction to go:
            // toward player
            if (!this.gotPushed && (!isItColliding && this.isPlayerNear())){
                this.defineDirectionTowardPlayer();
            }
            // random patrol
            else if ((this.positionToGo == undefined) ||
                (currIJ.i == this.positionToGo.i && currIJ.j == this.positionToGo.j)) { // only change direction if enemy got to where he was heading
                this.gotPushed = false;
                this.defineRandomDirectionToGo();
            }
            else if(isItColliding){
                this.defineNonCollidingRandomDirectionToGo();
            }

            switch (this.directionToGo) {
                case "N":
                    this.mesh.position.z += this.speed * this.isOverCrack() * this.isBeingPushed();
                    break;
                case "S":
                    this.mesh.position.z += this.speed * -1 * this.isOverCrack() * this.isBeingPushed();
                    break;
                case "W":
                    this.mesh.position.x += this.speed * this.isOverCrack() * this.isBeingPushed();
                    break;
                case "E":
                    this.mesh.position.x += this.speed * -1 * this.isOverCrack() * this.isBeingPushed();
                    break;
            }
            var newCurrIJ = this.getCubeposition();
            participants[currIJ.i][currIJ.j] = 0;
            participants[newCurrIJ.i][newCurrIJ.j] = 4;

            // Now some trigonometry, using our "step" property ...
            this.step += 1 / 4;
            // ... to slightly move our feet and hands
            this.feet.left.position.setZ(Math.sin(this.step) * 16);
            this.feet.right.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 16);
            this.hands.left.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 8);
            this.hands.right.position.setZ(Math.sin(this.step) * 8);
        }
        else { // enemy is falling
            if(this.falling) this.fall();
        }
    },
    isColliding: function(){
        var obstacles = basicScene.world.getObstacles();
        var collisions;
        var rays =[
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)
        ];
        for (var i = 0; i < 8; i ++) {
            // We reset the raycaster to this direction
            this.caster3.set(this.mesh.position, rays[i]);
            // Test if we intersect with any obstacle mesh
            collisions = this.caster3.intersectObjects(obstacles);
            // And disable that direction if we do
            if (collisions.length > 0 && collisions[0].distance <= this.basicSize + 10) {
                return true;
            }
        }
        return false;
    },
    defineDirectionTowardPlayer: function(){
        var playerPosition = basicScene.user.getCubeposition();
        var currIJ = this.getCubeposition();
        var iDelta = playerPosition.i - currIJ.i;
        var jDelta = playerPosition.j - currIJ.j;
        var random = Math.floor(Math.random() * 2);
        var loopCount = 0;
        var directionIsInvalid = true;

        while(directionIsInvalid) {
            if(random == 1){
                if (iDelta > 0 && this.isDirectionValidToGo(currIJ.i + 1, currIJ.j)) {
                    this.positionToGo = {i: currIJ.i + 1, j: currIJ.j};
                    this.directionToGo = "N";
                }
                else if (iDelta < 0 && this.isDirectionValidToGo(currIJ.i - 1, currIJ.j)) {
                    this.positionToGo = {i: currIJ.i - 1, j: currIJ.j};
                    this.directionToGo = "S";
                }
            }
            else {
                if (jDelta > 0 && this.isDirectionValidToGo(currIJ.i, currIJ.j + 1)) {
                    this.positionToGo = {i: currIJ.i, j: currIJ.j + 1};
                    this.directionToGo = "W";
                }
                else if (jDelta < 0 && this.isDirectionValidToGo(currIJ.i, currIJ.j - 1)) {
                    this.positionToGo = {i: currIJ.i, j: currIJ.j - 1};
                    this.directionToGo = "E";
                }
            }
            loopCount++;
            if(loopCount > 256){
                break;
            }

        }
    },
    defineRandomDirectionToGo: function () {
        'use strict';
        var directions = ["N", "S", "W", "E"];
        var currIJ = this.getCubeposition();

        var directionIsInvalid = true;
        var loopCount = 0;
        while(directionIsInvalid) {
            var randomDirection = directions[Math.floor(Math.random() * 4)];
            switch (randomDirection) {
                case "N":
                    if (this.isDirectionValidToGo(currIJ.i + 1, currIJ.j)) {
                        this.positionToGo = {i: currIJ.i + 1, j: currIJ.j};
                        this.directionToGo = "N";
                        directionIsInvalid = false;
                    }
                    break;
                case "S":
                    if (this.isDirectionValidToGo(currIJ.i - 1, currIJ.j)) {
                        this.positionToGo = {i: currIJ.i - 1, j: currIJ.j};
                        this.directionToGo = "S";
                        directionIsInvalid = false;
                    }
                    break;
                case "W":
                    if (this.isDirectionValidToGo(currIJ.i, currIJ.j + 1)) {
                        this.positionToGo = {i: currIJ.i, j: currIJ.j + 1};
                        this.directionToGo = "W";
                        directionIsInvalid = false;
                    }
                    break;
                case "E":
                    if (this.isDirectionValidToGo(currIJ.i, currIJ.j - 1)) {
                        this.positionToGo = {i: currIJ.i, j: currIJ.j - 1};
                        this.directionToGo = "E";
                        directionIsInvalid = false;
                    }
                    break;
            }
            loopCount++;
            if(loopCount > 128){
                this.positionToGo = {i: currIJ.i, j: currIJ.j}; // stay in place if surrounded
                break;
            }
        }
    },
    defineNonCollidingRandomDirectionToGo: function(){
        'use strict';
        var directions = ["N", "S", "W", "E"];
        var currIJ = this.getCubeposition();

        var directionIsInvalid = true;
        var loopCount = 0;
        while(directionIsInvalid) {
            var randomDirection = directions[Math.floor(Math.random() * 4)];
            switch (randomDirection) {
                case "N":
                    if (this.directionToGo != "N" && this.isDirectionValidToGo(currIJ.i + 1, currIJ.j)) {
                        this.positionToGo = {i: currIJ.i + 1, j: currIJ.j};
                        this.directionToGo = "N";
                        directionIsInvalid = false;
                    }
                    break;
                case "S":
                    if (this.directionToGo != "S" && this.isDirectionValidToGo(currIJ.i - 1, currIJ.j)) {
                        this.positionToGo = {i: currIJ.i - 1, j: currIJ.j};
                        this.directionToGo = "S";
                        directionIsInvalid = false;
                    }
                    break;
                case "W":
                    if (this.directionToGo != "W" && this.isDirectionValidToGo(currIJ.i, currIJ.j + 1)) {
                        this.positionToGo = {i: currIJ.i, j: currIJ.j + 1};
                        this.directionToGo = "W";
                        directionIsInvalid = false;
                    }
                    break;
                case "E":
                    if (this.directionToGo != "E" && this.isDirectionValidToGo(currIJ.i, currIJ.j - 1)) {
                        this.positionToGo = {i: currIJ.i, j: currIJ.j - 1};
                        this.directionToGo = "E";
                        directionIsInvalid = false;
                    }
                    break;
            }
            loopCount++;
            if(loopCount > 128){
                this.positionToGo = {i: currIJ.i, j: currIJ.j}; // stay in place if surrounded
                break;
            }
        }
    },
    getCubeposition: function(){
        return ({
            i: Math.round((this.mesh.position.z + 1000)/100),
            j: Math.round((this.mesh.position.x + 1000)/100)
        });
    },
    isDirectionValidToGo: function(i, j){
        var level = basicScene.world.level;
        var participants = basicScene.world.participants;
        if (
            (i > 0 && i < 19 && j > 0 && j < 19) &&
            (level[i][j] == 1 || level[i][j] == 2 || level[i][j] == 3) &&
            // (level[i][j] != 0) &&
            (participants[i][j] != 6) &&
            (participants[i][j] != 4)
        ) {
            return true;
        }
        else {
            return false;

        }
    },
    isPlayerNear: function(){
        var playerPosition = basicScene.user.getCubeposition();
        var currIJ = this.getCubeposition();
        if(
            (Math.abs(playerPosition.i - currIJ.i) <= 4) &&
            (Math.abs(playerPosition.j - currIJ.j) <= 4)
            ){
            return true;
        }
        else {
            return false;
        }
    },
    isOverTheWater: function(){
        var collisions,
        // Maximum distance from the origin before we consider collision
            distance = 64,
        // Get the obstacles array from our world
            ground = basicScene.world.getGround();
        var level = basicScene.world.level;
        var currIJ = this.getCubeposition();
        // this.caster2.set(this.mesh.position, new THREE.Vector3(0, -1, 0));
        // collisions = this.caster2.intersectObjects(ground);

        if (level[currIJ.i][currIJ.j] == 0){
            this.alive = false;
            basicScene.world.participants[currIJ.i][currIJ.j] = 0;
            this.falling = true;
            this.playFallingSound();
            return true;
        }
        else return false;
    },
    playFallingSound: function(){
        basicScene.sfxs.fall.play();
    },
    fall: function(){
        'use strict';
        if(this.mesh.position.y > -300){
            this.mesh.position.y += -10;
        }
        else {
            this.falling = false;
            basicScene.isLevelCleared();
            console.log("DED X_X");
        }

    },
    isOverCrack: function(){
        var currIJ = this.getCubeposition();
        var level = basicScene.world.level;

        if(level[currIJ.i][currIJ.j] == 3 || level[currIJ.i][currIJ.j] == 2){ // if over a crack, reduce the speed
            return this.speedOnCrack;
        }
        else {
            return 1;
        }
    }, 
    pushedTo: function(x, y, direction){
        this.gotPushed = true;
        this.positionToGo = {i: x, j: y};
        this.directionToGo = direction;
    },
    isBeingPushed: function () {
        if(this.gotPushed){
            return this.gotPushedSpeed;
        }
        else return 1;
    }
});