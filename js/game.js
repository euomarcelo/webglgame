var basicScene;
var BasicScene = Class.extend({
    // Class constructor
    init: function () {
        'use strict';
        // Create a scene, a camera, a light and a WebGL renderer with Three.JS
        this.scene = new THREE.Scene();
        // CAMERAS
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
        this.scene.add(this.camera);
        this.camera1stPerson = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
        this.scene.add(this.camera1stPerson);
        this.camera3rdPerson = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
        this.scene.add(this.camera3rPerson);
        this.cameraTypes = ['3rd', '1st', 'top'];
        this.currentCamera = 2;
        this.cameraChanged = false;

        // LIGHT
        this.light = new THREE.PointLight();
        this.light.position.set(-256, 256, -256);
        this.scene.add(this.light);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.container = jQuery('#basic-scene'); // renderer container
        this.keyAllowed = {37: true, 39: true, 70: true};

        // Create the "world" : a 3D representation of the place we'll be putting our character in
        this.world = new World({
            color: 0xF5F5F5
        });
        this.scene.add(this.world.mesh);
        // Create the user's character
        this.user = new Character({
            color: 0xFFFC19 //0x7A43B6
        });
        this.scene.add(this.user.mesh);
        // Define the size of the renderer
        this.setAspect();
        // Insert the renderer in the container
        this.container.prepend(this.renderer.domElement);
        // Set the camera to look at our user's character
        this.setFocus();
        // Start the events handlers
        this.setControls();

        // flags
        this.gameOver = false;
        this.levelCleared = false;
    },
    // Event handlers
    setControls: function () {
        'use strict';
        var self = this;
        // Within jQuery's methods, we won't be able to access "this"
        var user = this.user,
        // State of the different controls
            controls = {
                left: false,
                up: false,
                right: false,
                down: false,
                space: false,
                weapon: false,
                a: false,
                w: false,
                s: false,
                d: false,
                camera: false
            };
        // When the user push a key down
        jQuery(document).keydown(function (e) {
            var prevent = true;
            // Update the state of the attached control to "true"
            switch (e.keyCode) {
                case 37:
                    if (self.keyAllowed [parseInt(e.keyCode)] === false) return;
                    self.keyAllowed [parseInt(e.keyCode)] = false;
                    controls.left = true;
                    break;
                case 38:
                    controls.up = true;
                    break;
                case 39:
                    if (self.keyAllowed [parseInt(e.keyCode)] === false) return;
                    self.keyAllowed [parseInt(e.keyCode)] = false;
                    controls.right = true;
                    break;
                case 40:
                    controls.down = true;
                    break;
                case 32:
                    controls.space = true;
                    break;
                case 65: // A
                    if (self.keyAllowed [parseInt(e.keyCode)] === false) return;
                    self.keyAllowed [parseInt(e.keyCode)] = false;
                    controls.left = true;
                    break;
                case 83: // S
                    controls.down = true;
                    break;
                case 68: // D
                    if (self.keyAllowed [parseInt(e.keyCode)] === false) return;
                    self.keyAllowed [parseInt(e.keyCode)] = false;
                    controls.right = true;
                    break;
                case 87: // W
                    controls.up = true;
                    break;
                case 70: // F WEAPON
                    if (self.keyAllowed [parseInt(e.keyCode)] === false) return;
                    self.keyAllowed [parseInt(e.keyCode)] = false;
                    controls.weapon = true;
                    break;
                case 86: // V
                    if (self.keyAllowed [parseInt(e.keyCode)] === false) return;
                    self.keyAllowed [parseInt(e.keyCode)] = false;
                    controls.camera = true;
                    break;
                default:
                    prevent = false;
            }
            // Avoid the browser to react unexpectedly
            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }
            // Update the character's direction
            user.setDirection(controls);
            user.crushStone(controls);
            self.changeCamera(controls);
        });
        // When the user release a key up
        jQuery(document).keyup(function (e) {
            var prevent = true;
            // Update the state of the attached control to "false"
            switch (e.keyCode) {
                case 37:
                    self.keyAllowed [parseInt(e.keyCode)] = true;
                    controls.left = false;
                    break;
                case 38:
                    controls.up = false;
                    break;
                case 39:
                    self.keyAllowed [parseInt(e.keyCode)] = true;
                    controls.right = false;
                    break;
                case 40:
                    controls.down = false;
                    break;
                case 32:
                    controls.space = false;
                    break;
                case 65: // A
                    self.keyAllowed [parseInt(e.keyCode)] = true;
                    controls.left = false;
                    break;
                case 83: // S
                    controls.down = false;
                    break;
                case 68: // D
                    self.keyAllowed [parseInt(e.keyCode)] = true;
                    controls.right = false;
                    break;
                case 87: // W
                    controls.up = false;
                    break;
                case 70:
                    self.keyAllowed [parseInt(e.keyCode)] = true;
                    controls.weapon = false;
                    break;
                case 86:
                    self.keyAllowed [parseInt(e.keyCode)] = true;
                    controls.camera = false;
                    break;
                default:
                    prevent = false;
            }
            // Avoid the browser to react unexpectedly
            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }
            // Update the character's direction
            user.setDirection(controls);
            user.crushStone(controls);
        });
        // On resize
        jQuery(window).resize(function () {
            // Redefine the size of the renderer
            basicScene.setAspect();
        });
    },
    // Defining the renderer's size
    setAspect: function () {
        'use strict';
        // Fit the container's full width
        var w = this.container.width(),
        // Fit the initial visible area's height
            h = jQuery(window).height();
        // Update the renderer and the camera
        var max = Math.max(h,800);
        this.renderer.setSize(max, max);
        this.camera.aspect = max / max;
        this.camera.updateProjectionMatrix();
    },
    // Updating the camera to follow and look at a given Object3D / Mesh
    setFocus: function () {
        'use strict';
        var player = this.user.mesh;

        // top camera
        this.camera.position.set(player.position.x, player.position.y + 1800, player.position.z - 528); //528
        this.camera.lookAt(player.position);

        // 3rd person
        var relativeCameraOffset = new THREE.Vector3(0,50,-200);
        var cameraOffset = relativeCameraOffset.applyMatrix4( player.matrixWorld );
        this.camera3rdPerson.position.x = cameraOffset.x;
        this.camera3rdPerson.position.y = cameraOffset.y;
        this.camera3rdPerson.position.z = cameraOffset.z;
        this.camera3rdPerson.lookAt( player.position );

        // 1st person
        relativeCameraOffset = new THREE.Vector3(0,0,-1);
        cameraOffset = relativeCameraOffset.applyMatrix4( player.matrixWorld );
        this.camera1stPerson.position.x = cameraOffset.x;
        this.camera1stPerson.position.y = cameraOffset.y;
        this.camera1stPerson.position.z = cameraOffset.z;
        this.camera1stPerson.lookAt( player.position );

    },
    changeCamera: function(controls){
        'use strict';
        if(controls.camera == true){
            console.log("CHANGE THE CAMERA", this.currentCamera);
            this.currentCamera = (this.currentCamera + 1) % 3;
            if(this.currentCamera == 1){
                // hide the mesh
                this.user.mesh.children[5].visible = false; // hide the nose
            }
            else {
                this.user.mesh.children[5].visible = true; // hide the nose
            }
        }
    },
    // Update and draw the scene
    frame: function () {
        'use strict';
        // Run a new step of the user's motions
        if(this.user.alive){
            this.user.motion();
            this.world.enemiesMove();
        }

        // Set the camera to look at our user's character
        this.setFocus(this.user.mesh);
        // And draw !
        if(this.currentCamera == 2){
            this.renderer.render(this.scene, this.camera);
        }
        else if(this.currentCamera == 0){
            this.renderer.render(this.scene, this.camera3rdPerson);
        }
        else {
            this.renderer.render(this.scene, this.camera1stPerson);
        }

    }

});
