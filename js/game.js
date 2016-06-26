var basicScene;
var BasicScene = Class.extend({
    // Class constructor
    init: function () {
        'use strict';
        // Create a scene, a camera, a light and a WebGL renderer with Three.JS
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
        this.scene.add(this.camera);
        this.light = new THREE.PointLight();
        this.light.position.set(-256, 256, -256);
        this.scene.add(this.light);
        this.renderer = new THREE.WebGLRenderer();
        // Define the container for the renderer
        this.container = jQuery('#basic-scene');
        this.keyAllowed = {37: true, 39: true};

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
        this.setFocus(this.user.mesh);
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
                a: false,
                w: false,
                s: false,
                d: false
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
                case 65:
                    controls.a = true;
                    break;
                case 83:
                    controls.s = true;
                    break;
                case 68:
                    controls.d = true;
                    break;
                case 87:
                    controls.w = true;
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
                case 65:
                    controls.a = false;
                    break;
                case 83:
                    controls.s = false;
                    break;
                case 68:
                    controls.d = false;
                    break;
                case 87:
                    controls.w = false;
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
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    },
    // Updating the camera to follow and look at a given Object3D / Mesh
    setFocus: function (object) {
        'use strict';
        this.camera.position.set(object.position.x, object.position.y + 1256, object.position.z - 1528); //528
        this.camera.lookAt(object.position);
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
        this.renderer.render(this.scene, this.camera);
    }

});
