/**
 * Created by bot on 25/06/2016.
 */
var Enemy = Class.extend({
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

        this.mesh.position.setY(8);

        // And the "RayCaster", able to test for intersections
        this.lookDirection = new THREE.Vector3(0, 0, 1);
        this.rotationDifference = 0;
        this.caster = new THREE.Raycaster();
        this.caster2 = new THREE.Raycaster();

        this.speed = 3;
        this.positionToGo;
        this.directionToGo = "";
    },
    move: function(){
        'use strict';
        var level = basicScene.world.level;
        var participants = basicScene.world.participants;
        var currIJ = this.getCubeposition();

        // detecta se player está a quatro casas de distância
        // se sim, vai até ele
        // se não, define uma direção aleatória e anda até chegar a ela, respeitando colisões
        // vê se chegou no destino, senão pega outra posição
        if( (this.positionToGo == undefined) ||
            (currIJ.i == this.positionToGo.i && currIJ.j == this.positionToGo.j)){
            this.defineRandomDirectionToGo();
        }
        // this.defineRandomDirectionToGo();
        switch (this.directionToGo){
            case "N":
                this.mesh.position.z += this.speed;
                break;
            case "S":
                this.mesh.position.z += this.speed * -1;
                break;
            case "W":
                this.mesh.position.x += this.speed;
                break;
            case "E":
                this.mesh.position.x += this.speed * -1;
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
    },
    defineRandomDirectionToGo: function () {
        'use strict';
        var level = basicScene.world.level;
        // var participants = basicScene.world.participants;
        var directions = ["N", "S", "W", "E"];
        var currIJ = this.getCubeposition();

        var directionIsInvalid = true;
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
            (level[i][j] != 6) &&
            (participants[i][j] != 4)
        ) {
            return true;
        }
        else {
            return false;
        }
    },
});