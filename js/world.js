var World = Class.extend({
    // Class constructor
    init: function (args) {
        // Set the different geometries composing the room
        var waterLevel = 100,
            ground2 = new Array(),
            groundCubeSize = 100,
            groundCube = new THREE.CubeGeometry( groundCubeSize, waterLevel, groundCubeSize ),
            obstacles = [
                new THREE.CubeGeometry(64, 64, 64)
            ],
        // Set the material, the "skin"
            material = new THREE.MeshLambertMaterial(args),
            cubeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/seamless-grass.jpg') } ),
            holeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/holetexture.png') } ),
            rachMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/rachadura.png') } ),
            water = new THREE.PlaneGeometry(2000,2000, 1, 1),
            waterMaterial = new THREE.MeshLambertMaterial({color: 0x2194ce }),
            level = [
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,1,3,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0],
                [0,1,1,3,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0],
                [0,1,1,2,1,2,1,1,0,0,0,0,3,3,3,3,2,1,1,0],
                [0,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,0],
                [0,0,0,0,0,0,3,3,2,1,1,2,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
                [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,2,1,1,2,3,3,0,0,0,0,0,0],
                [0,1,1,1,1,3,1,1,3,1,1,1,1,1,3,1,1,1,1,0],
                [0,1,1,1,1,3,1,1,3,1,1,1,1,1,3,1,1,1,1,0],
                [0,1,1,1,1,3,1,1,3,1,1,1,1,1,3,1,3,1,1,0],
                [0,1,2,3,3,2,1,1,0,0,0,0,1,1,2,1,3,1,1,0],
                [0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,3,1,1,0],
                [0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,3,1,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            ],
            i;
        this.level = level;
        
        this.floorCubes = new Array(20);
        for (var i = 0; i < 20; i++) {
            this.floorCubes[i] = new Array(20);
        }

        // Set the "world" modelisation object
        this.mesh = new THREE.Object3D();

        this.water = new THREE.Mesh(water,waterMaterial);
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.y = -waterLevel * 2;
        this.mesh.add(this.water);

        // Set the ground
        this.groundCube = new THREE.Mesh(groundCube, cubeMaterial);
        this.holeCube = new THREE.Mesh(groundCube, holeMaterial);
        this.rachCube = new THREE.Mesh(groundCube, rachMaterial);
        this.ground2 = new Array();

        for(var i = 0; i < level.length; i++){
            for(var j = 0; j < level.length; j++){
                if(level[i][j] != 0) {
                    if (level[i][j] == 1) { //ground
                        var newBlock = this.groundCube.clone();
                    }
                    else if (level[i][j] == 2) { // hole
                        var newBlock = this.holeCube.clone();
                    }
                    else if (level[i][j] == 3) { // hole
                        var newBlock = this.rachCube.clone();
                    }
                    newBlock.position.set((j * groundCubeSize) - 1000,
                        -waterLevel,
                        (i * groundCubeSize) - 1000);
                    this.floorCubes[i][j] = newBlock;
                    this.mesh.add(newBlock);
                    this.ground2.push(newBlock);
                }
            }
        }

        this.obstacles = [];
        for (var i = 0; i < obstacles.length; i += 1) {
            this.obstacles.push(new THREE.Mesh(obstacles[i], material));
            this.mesh.add(this.obstacles[i]);
        }
        this.obstacles[0].position.set(0, 32, 128);


    },
    getObstacles: function () {
        'use strict';
        return this.obstacles;
    },
    getWater: function(){
        'use strict';
        return this.water;
    },
    getGround: function(){
        'use strict';
        return this.ground2;
    }
});