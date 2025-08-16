import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MyCylinder } from "../forest/MyCylinder.js";
import { MyHelice } from "./MyHelice.js";

export class MyCabineHelice extends CGFobject{
    constructor(scene, cabineHeliceDimensions, cabineHeliceStartCoors){
        super(scene);

        this.dimension = cabineHeliceDimensions;
        
        this.cabineHeliceStartCoors = cabineHeliceStartCoors;
        this.heliceWidth = cabineHeliceDimensions.z * 0.1;
        this.helice = new MyHelice(scene, cabineHeliceDimensions.x, 2 * this.heliceWidth, this.heliceWidth / 2);

        this.cylinder = new MyCylinder(scene, 20, cabineHeliceDimensions.y, this.heliceWidth, null);
        this.initMaterials();
    }
    initMaterials(){
        this.material = new CGFappearance(this.scene);
        this.material.setDiffuse(0.25, 0.25, 0.25, 1);
        this.material.setAmbient(0.25, 0.25, 0.25, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
    }
    display(heliceAngle){
        this.scene.pushMatrix();
        this.scene.translate(this.cabineHeliceStartCoors.x, this.cabineHeliceStartCoors.y, this.cabineHeliceStartCoors.z);   // All parts use this translation
        this.material.apply();
        this.cylinder.display();

        this.scene.pushMatrix();
        this.scene.translate(0, this.dimension.y, 0);
        this.scene.rotate(heliceAngle, 0, 1, 0);
        this.material.apply();
        this.helice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.9 * this.dimension.y, 0);
        this.scene.rotate(Math.PI/2 + heliceAngle, 0, 1, 0);
        this.material.apply();
        this.helice.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}