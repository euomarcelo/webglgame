var World = Class.extend({
    // Class constructor
    init: function (args) {
        // Set the different geometries composing the room
        var level = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];
        this.colorTableForLevelCreation = {
            '91dff5': 0, //water
            'b6e71b': 1, //ground
            '8d0418': 2, //hole
            'ac7857': 3, //crack
            'ff1614': 4, //enemy
            'ffffff': 5, //player
            '18bb3d': 6 //obstacle
        };
        this.colorTableForHud = {
            0:'91dff5', //water
            1:'b6e71b', //ground
            2:'8d0418', //hole
            3:'ac7857', //crack
            4:'ff1614', //enemy
            5:'ffffff', //player
            6:'18bb3d'  //obstacle
        };
        this.hudPixelData;
        this.hudCanvas =  document.getElementById("hudMap");
        this.hudContext = this.hudCanvas.getContext('2d');
        this.hudUnit = 8;

        // some defaults
        this.groundCubeSize = 100;
        this.waterLevel = 100;
        this.obstacles = new Array();
        this.enemies = new Array();
        this.enemysMeshes = new Array();

        // Set the material
        this.cubeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/seamless-grass.jpg') } );
        this.holeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/holetexture.png') } );
        this.rachMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./images/rachadura.png') } );
        this.ground2 = new Array();
        this.material = new THREE.MeshLambertMaterial(args);
        this.groundCubeGeometry = new THREE.CubeGeometry( this.groundCubeSize, this.waterLevel, this.groundCubeSize );
        this.obstacleGeometry = new THREE.CubeGeometry( this.groundCubeSize -32, this.waterLevel, this.groundCubeSize -32);
        this.waterGeometry = new THREE.PlaneGeometry(2000,2000, 1, 1);
        this.waterMaterial = new THREE.MeshLambertMaterial({color: 0x2194ce });
        this.groundCube = new THREE.Mesh(this.groundCubeGeometry, this.cubeMaterial);
        this.holeCube = new THREE.Mesh(this.groundCubeGeometry, this.holeMaterial);
        this.rachCube = new THREE.Mesh(this.groundCubeGeometry, this.rachMaterial);

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

        // Set the "world" modelisation object
        this.mesh = new THREE.Object3D();
        this.participants = participants;
        this.level = level;
        this.createLevel();
    },
    levelSetupPit: function(){
        this.water = new THREE.Mesh(this.waterGeometry, this.waterMaterial);
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.y = -this.waterLevel * 2;
        this.mesh.add(this.water);
    },
    levelSetupFloor: function(){
        'use strict';
        // Set the ground


        // set map blocks, holes and cracks
        for(var i = 0; i < this.level.length; i++){
            for(var j = 0; j < this.level.length; j++){
                if(this.level[i][j] != 0) {
                    if (this.level[i][j] == 1) { //ground
                        var newBlock = this.groundCube.clone();
                    }
                    else if (this.level[i][j] == 2) { // hole
                        var newBlock = this.holeCube.clone();
                    }
                    else if (this.level[i][j] == 3) { // crack
                        var newBlock = this.rachCube.clone();
                    }
                    newBlock.position.set((j * this.groundCubeSize) - 1000,
                        -this.waterLevel,
                        (i * this.groundCubeSize) - 1000);
                    this.floorCubes[i][j] = newBlock;
                    this.mesh.add(newBlock);
                    this.ground2.push(newBlock);
                }
            }
        }
    },
    levelSetupEnemies: function(){
        // set enemies positions and the player
        for(var i = 0; i < this.participants.length; i++) {
            for (var j = 0; j < this.participants.length; j++) {
                if (this.participants[i][j] == 4) { //enemy
                    var enemy = new Enemy({
                        color: 0xC60000
                    });
                    this.mesh.add(enemy.mesh);
                    this.enemysMeshes.push(enemy.mesh.children[0]);
                    enemy.mesh.position.set((j * this.groundCubeSize) - 1000,
                        8,
                        (i * this.groundCubeSize) - 1000);
                    this.enemies.push(enemy);
                }
            }
        }
    },
    levelSetupObstacles: function(){
        for(var i = 0; i < this.participants.length; i++){
            for(var j = 0; j < this.participants.length; j++){
                if(this.participants[i][j] == 6) {
                    var obstacle = new THREE.Mesh(this.obstacleGeometry, this.cubeMaterial);
                    this.obstacles.push(obstacle);
                    obstacle.position.set((j * this.groundCubeSize) - 1000,
                        8,
                        (i * this.groundCubeSize) - 1000);
                    this.mesh.add(obstacle);
                }
            }
        }
    },
    createLevel: function(){
        'use strict';
        var self = this;
        var drawing = new Image();
        var level = this.level;
        var participants = this.participants;
        drawing.src = "images/level.png"; // can also be a remote URL e.g. http://
        var canvas = document.getElementById("level");
        var context = canvas.getContext('2d');
        drawing.onload = function() {
            context.drawImage(drawing,0,0);
            for(var i = 0; i < 20; i++){
                for(var j = 0; j < 20; j++){
                    var p = context.getImageData(i, j, 1, 1).data;
                    var color = ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
                    var code = self.colorTableForLevelCreation[color];
                    if(code == 4 || code == 5 || code == 6){ //participant
                        participants[i][j] = code;
                        level[i][j] = 1;
                    }
                    else {
                        level[i][j] = code;
                    }
                }
            }
            self.levelSetupFloor();
            self.levelSetupPit();
            self.levelSetupObstacles();
            self.levelSetupEnemies();

        };

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
        // console.log("EARTHQUAKE", color);
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                if(this.floodMatrix[i][j] == color){
                    this.level[i][j] = 0;
                    this.floorCubes[i][j].position.setY(-2000);
                    this.floorCubes[i][j].visible = false;
                }
            }
        }
    },
    landslideUnconnectedCracks: function(){
        for (var i = 1; i < 19; i++) {
            for (var j = 1; j < 19; j++) {
                if(this.level[i][j] == 2 || this.level[i][j] == 3){
                    if(this.level[i+1][j] != 1 && this.level[i-1][j] != 1 && this.level[i][j+1] != 1 && this.level[i][j-1] != 1){
                        if(this.level[i][j] == 3){
                            this.level[i][j] = 0;
                            this.floorCubes[i][j].position.setY(-2000);
                            this.floorCubes[i][j].visible = false;
                        }
                        else if(this.level[i+1][j+1] != 1 && this.level[i-1][j-1] != 1 && this.level[i+1][j-1] != 1 && this.level[i-1][j+1] != 1){
                            this.level[i][j] = 0;
                            this.floorCubes[i][j].position.setY(-2000);
                            this.floorCubes[i][j].visible = false;
                        }
                    }
                }
            }
        }
    },
    destroyFloatingObstacles: function(){
        var level = this.level;
        var obstacles = this.obstacles;
        for(var i = 0; i < obstacles.length; i++){
            var posI = Math.round((obstacles[i].position.z + 1000)/100);
            var posJ = Math.round((obstacles[i].position.x + 1000)/100);
            if(level[posI][posJ] == 0){
                obstacles[i].visible = false;
                this.participants[posI][posJ] = 0;
            }
        }
    },
    enemiesMove: function () {
        for(var i = 0; i < this.enemies.length; i++){
            this.enemies[i].move();
        }
    },
    drawHud: function(){
        var participants = this.participants;
        var level = this.level;
        var context = this.hudContext;
        if(this.hudPixelData === undefined){
            this.hudPixelDate = new Array(6);
            for(var x = 0; x <= 6; x ++){
                var imgData = context.createImageData(8, 8);
                switch(x){
                    case 0:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 145;
                            imgData.data[i + 1] = 223;
                            imgData.data[i + 2] = 245;
                            imgData.data[i + 3] = 255;
                        }
                        break;
                    case 1:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 182;
                            imgData.data[i + 1] = 231;
                            imgData.data[i + 2] = 27;
                            imgData.data[i + 3] = 255;
                        }
                        break;
                    case 2:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 141;
                            imgData.data[i + 1] = 4;
                            imgData.data[i + 2] = 24;
                            imgData.data[i + 3] = 255;
                        }
                        break;
                    case 3:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 172;
                            imgData.data[i + 1] = 120;
                            imgData.data[i + 2] = 87;
                            imgData.data[i + 3] = 255;
                        }
                        break;
                    case 4:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 255;
                            imgData.data[i + 1] = 22;
                            imgData.data[i + 2] = 20;
                            imgData.data[i + 3] = 255;
                        }
                        break;
                    case 5:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 255;
                            imgData.data[i + 1] = 255;
                            imgData.data[i + 2] = 255;
                            imgData.data[i + 3] = 255;
                        }
                        break;
                    case 6:
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = 24;
                            imgData.data[i + 1] = 187;
                            imgData.data[i + 2] = 0;
                            imgData.data[i + 3] = 61;
                        }
                        break;
                }
                this.hudPixelDate[x] = imgData;
            }
        }

        for(var i = 0; i < 20; i+=1){
            for(var j = 0; j < 20; j+=1){
                var pcode = participants[i][j];
                var lcode = level[i][j];
                if(pcode != 0){
                    context.putImageData(this.hudPixelDate[pcode], i*8, j*8);
                }
                else {
                    context.putImageData(this.hudPixelDate[lcode], i*8, j*8);
                }
            }
        }
        // hudContext.rotate(Math.PI/2);
    }

});