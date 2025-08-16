import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MyCone } from "../MyCone.js";
import { MyCylinder } from "../forest/MyCylinder.js";
import { MyHelice } from "./MyHelice.js";
import { MyPad } from "./MyPad.js";

export class MyTail extends CGFobject{
    constructor(scene, tailDimensions, tailStartCoors){
        super(scene);
        this.startCoors = tailStartCoors;
        this.dimensions = tailDimensions;
        this.cylinderRadius = tailDimensions.z * 0.1;
        this.offset = tailDimensions.x * 0.1;
        this.cone = new MyCone(scene, 20, tailDimensions.x, tailDimensions.z);
        this.cylinder = new MyCylinder(scene, 20, tailDimensions.z, this.cylinderRadius, null);
        this.helice = new MyHelice(scene, 2 * tailDimensions.y, 2 * this.cylinderRadius, this.cylinderRadius);
        this.tail = new MyPad(scene, tailDimensions.z, 2 * this.cylinderRadius, this.cylinderRadius);
        this.initMaterials();
    }

    initMaterials(){
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setDiffuse(0.4, 0, 0, 1);
        this.tailMaterial.setAmbient(0.4, 0, 0, 1);
        this.tailMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.tailMaterial.setShininess(10);

        this.heliceMaterial = new CGFappearance(this.scene);
        this.heliceMaterial.setDiffuse(0.25, 0.25, 0.25, 1);
        this.heliceMaterial.setAmbient(0.25, 0.25, 0.25, 1);
        this.heliceMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliceMaterial.setShininess(10.0);

        this.tailMaterial2 = new CGFappearance(this.scene);
        this.tailMaterial2.setDiffuse(0.25, 0.25, 0.25, 1);
        this.tailMaterial2.setAmbient(0.25, 0.25, 0.25, 1);
        this.tailMaterial2.setSpecular(0.1, 0.1, 0.1, 1);
        this.tailMaterial2.setShininess(10);
    }
    display(heliceAngle){
        this.scene.pushMatrix();
        this.scene.translate(this.startCoors.x, this.startCoors.y, this.startCoors.z);

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.tailMaterial.apply();
        this.cone.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.dimensions.x , 0, 0);
        this.scene.translate(0, 0, this.cylinderRadius);
        this.scene.rotate(Math.PI/4,0,0,1);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.scene.translate(this.dimensions.y/2 - this.cylinderRadius, -this.cylinderRadius, 0);
        this.tailMaterial2.apply();
        this.tail.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.dimensions.x, 0, 0);
        this.scene.translate(0, 0, -this.cylinderRadius);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.scene.translate(this.dimensions.y/2 - this.cylinderRadius, this.cylinderRadius, 0);
        this.tailMaterial2.apply();
        this.tail.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.dimensions.x, 0, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.tailMaterial2.apply();
        this.cylinder.display(false);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.dimensions.x, 0, this.dimensions.z);
        this.scene.rotate(heliceAngle, 0, 0, 1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.heliceMaterial.apply();
        this.helice.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}