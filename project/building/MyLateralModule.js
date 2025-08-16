import { CGFobject } from '../../lib/CGF.js';
import { MyFloor } from './MyFloor.js';

export class MyLateralModule extends CGFobject {
    constructor(scene, width, height, depth, numFloors, windowsPerFloor, windowTexturePath, buildingColor, wallTexturePath) {
        super(scene);
        this.width = width;
        this.floorHeight = height / numFloors;
        this.depth = depth;
        this.numFloors = numFloors;
        this.windowsPerFloor = windowsPerFloor;
        this.windowTexture = windowTexturePath;
        this.buildingColor = buildingColor;

        this.floor = new MyFloor(scene, width, this.floorHeight, depth, windowsPerFloor, windowTexturePath, buildingColor, wallTexturePath);
    }

    display() {
        // Draws all floors stacked up
        for (let i = 0; i < this.numFloors; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, i * this.floorHeight, 0);
            this.floor.display();
            this.scene.popMatrix();
        }
    }
}