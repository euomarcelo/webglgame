var World = Class.extend({
    // Class constructor
    init: function (args) {
        // Set the different geometries composing the room
        var waterLevel = 100,
            ground2 = new Array(),
            groundCubeSize = 100,
            groundCube = new THREE.CubeGeometry( groundCubeSize, waterLevel, groundCubeSize ),
            obstacles = [
                new THREE.BoxGeometry(64, 64, 64)
            ],
        // Set the material, the "skin"
            material = new THREE.MeshLambertMaterial(args),
            water = new THREE.PlaneGeometry(2000,2000, 1, 1),
            waterMaterial = new THREE.MeshLambertMaterial({color: 0x2194ce }),
            level = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,1,3,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0],
                [0,1,1,3,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0],
                [0,1,1,2,1,2,1,1,0,0,0,0,1,3,3,3,2,1,1,0],
                [0,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,0],
                [0,0,0,0,0,0,3,3,2,1,1,2,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1,2,3,1,2,3,3,0,0,0,0,0,0],
                [0,1,1,1,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,0],
                [0,1,1,1,1,1,1,1,3,1,1,1,1,1,3,1,1,1,1,0],
                [0,1,1,1,1,1,1,1,3,1,1,1,1,1,3,1,3,1,1,0],
                [0,1,2,1,1,2,1,1,0,0,0,0,1,1,2,1,3,1,1,0],
                [0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,3,1,1,0],
                [0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,3,1,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            ],
            participants = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];
        // Set the "world" modelisation object
        this.mesh = new THREE.Object3D();
        this.participants = participants;
        this.level = level;
        this.blankFloodMatrix = new Array(20);
        for (var i = 0; i < 20; i++) {
            this.blankFloodMatrix[i] = new Array(20);
            for(var j = 0; j < 20; j++){
                this.blankFloodMatrix[i][j] = 0;
            }
        }
        this.floodMatrix = this.blankFloodMatrix.slice(); // clone array
        this.floorCubes = new Array(20);
        for (var i = 0; i < 20; i++) {
            this.floorCubes[i] = new Array(20);
        }

        this.water = new THREE.Mesh(water,waterMaterial);
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.y = -waterLevel * 2;
        this.mesh.add(this.water);

        // Set the ground
        this.cubeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/seamless-grass.jpg') } );
        this.holeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/holetexture.png') } );
        this.rachMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/rachadura.png') } );
        this.groundCube = new THREE.Mesh(groundCube, this.cubeMaterial);
        this.holeCube = new THREE.Mesh(groundCube, this.holeMaterial);
        this.rachCube = new THREE.Mesh(groundCube, this.rachMaterial);
        this.ground2 = new Array();

        // set map blocks, holes and cracks
        for(var i = 0; i < level.length; i++){
            for(var j = 0; j < level.length; j++){
                if(level[i][j] != 0) {
                    if (level[i][j] == 1) { //ground
                        var newBlock = this.groundCube.clone();
                    }
                    else if (level[i][j] == 2) { // hole
                        var newBlock = this.holeCube.clone();
                    }
                    else if (level[i][j] == 3) { // crack
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
        // set enemies positions and the player
        this.enemies = new Array();
        this.enemysMeshes = new Array();
        for(var i = 0; i < this.participants.length; i++) {
            for (var j = 0; j < this.participants.length; j++) {
                if (this.participants[i][j] == 4) { //enemy
                    var enemy = new Enemy({
                        color: 0xC60000
                    });
                    this.mesh.add(enemy.mesh);
                    this.enemysMeshes.push(enemy.mesh.children[0]);
                    enemy.mesh.position.set((j * groundCubeSize) - 1000,
                        8,
                        (i * groundCubeSize) - 1000);
                    this.enemies.push(enemy);
                }
            }
        }

        this.obstacles = [];
        for (var i = 0; i < obstacles.length; i += 1) {
            this.obstacles.push(new THREE.Mesh(obstacles[i], material));
            this.mesh.add(this.obstacles[i]);
        }
        this.obstacles[0].position.set(0, 0, 128);

        // set enemies on the scene

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
    },
    getGroundType: function(i, j){
        if( i >= 20 || i < 0 || j >= 20 || j < 0) return "ND";
        if(this.level[i][j] == 0){
            return "water";
        }
        else if(this.level[i][j] == 1){
            return "ground";
        }
        else if(this.level[i][j] == 2){
            return "hole";
        }
        else if(this.level[i][j] == 3){
            return "rachadura";
        }
    },
    /*
    * Default color in floodMatrix is -1
    * Paints things 1/2 for ground or 0 for water/crack/hole
    * */
    floodFill: function(x, y, color1, color2){
        // return conditions
        if (x < 0 || x >= 20 || y < 0 || y >= 20) return; //out of bounds
        else if (this.floodMatrix[x][y] == color1 || this.floodMatrix[x][y] == color2) return; // já pintada
        else if (this.level[x][y] == 0 || this.level[x][y] == 2 || this.level[x][y] == 3){
            return;
        }
        // color stuff
        if(this.floodMatrix[x][y] == 0 && this.level[x][y] == 1){
            this.floodMatrix[x][y] = color1;
            this.floodFill(x + 1, y, color1, color2);
            this.floodFill(x - 1, y, color1, color2);
            this.floodFill(x, y + 1, color1, color2);
            this.floodFill(x, y - 1, color1, color2);
        }
    },
    getUnfilledFloodPosition: function () {
        for(var i = 0; i < 20; i++){
            for(var j = 0; j < 20; j++){
                // console.log(this.level[i][j]);
                // console.log(this.floodMatrix[i][j]);
                if(this.level[i][j] == 1 && this.floodMatrix[i][j] == 0){ //there is ground and it's not painted
                    return [i,j];
                }
            }
        }
        return [];
    },
    regenerateFloodMatrix: function(){
        for (var i = 0; i < 20; i++) {
            for(var j = 0; j < 20; j++){
                this.floodMatrix[i][j] = 0;
            }
        }
    },
    landslide: function(color){
        console.log("EARTHQUAKE", color);
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                if(this.floodMatrix[i][j] == color){
                    this.level[i][j] = 0;
                    this.floorCubes[i][j].position.setY(-2000);
                }
            }
        }
    },
    enemiesMove: function () {
        for(var i = 0; i < this.enemies.length; i++){
            this.enemies[i].move();
        }
    },

});