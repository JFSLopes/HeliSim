import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MyCylinder } from "../forest/MyCylinder.js";
import { MyPad } from "./MyPad.js";


export class MyHelipad extends CGFobject {
    constructor(scene, padDimensions, padStartCoors){
        super(scene);
        this.cylinderRadius = padDimensions.z * 0.1;

        this.dimension = padDimensions;
        this.startCoor = padStartCoors;
        this.cylinder = new MyCylinder(scene, 20, -padDimensions.y, this.cylinderRadius, null);
        this.pad = new MyPad(scene, padDimensions.x, 2 * this.cylinderRadius, this.cylinderRadius);
        this.initMaterials();
    }

    initMaterials(){
        this.material = new CGFappearance(this.scene);
        this.material.setDiffuse(0.25, 0.25, 0.25, 1);
        this.material.setAmbient(0.25, 0.25, 0.25, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.startCoor.x, this.startCoor.y, this.startCoor.z);

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.dimension.z / 2);
        this.material.apply();
        this.cylinder.display(false);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.dimension.z / 2);
        this.material.apply();
        this.cylinder.display(false);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -this.dimension.y, this.dimension.z / 2);
        this.material.apply();
        this.pad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -this.dimension.y, -this.dimension.z / 2);
        this.material.apply();
        this.pad.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}