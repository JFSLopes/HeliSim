import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        // Checkbox
        this.gui.add(this.scene,'displayPlane').name('Display Plane');
        this.gui.add(this.scene,'displayPanorama').name('Display Panorama');

        // Slider
        this.gui.add(this.scene, 'speedFactor', 0.1, 3).onChange(this.scene.onSpeedFactorChanged.bind(this.scene));

        // Color picker
        this.gui.addColor(this.scene, 'buildingColor').name("Building Color");

        // Sliders
        this.gui.add(this.scene, 'buildingSize', 60, 100).step(1).name("Building Size");
        this.gui.add(this.scene, 'numFloors', 3, 10).step(1).name("Floors");
        this.gui.add(this.scene, 'numWindows', 0, 10).step(1).name("Windows");
        this.gui.add(this.scene, 'selectedWindow', this.scene.windowTextures).name('Window Texture').onChange(this.scene.windowSelected.bind(this.scene));
        this.gui.add(this.scene, 'selectedWall', this.scene.wallTextures).name('Wall Texture').onChange(this.scene.wallSelected.bind(this.scene));
        this.gui.add(this.scene, 'povChange').name("POV Change");
        this.gui.add(this.scene, 'updateScene').name("Update Scene");

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}