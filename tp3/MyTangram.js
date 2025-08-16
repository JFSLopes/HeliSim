import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleBig } from './MyTriangleBig.js';
import { MyTriangleSmall } from './MyTriangleSmall.js';

export class MyTangram extends CGFobject {
    constructor(scene){
        super(scene);
        this.diamond = new MyDiamond(scene);
        this.red = new MyTriangleSmall(scene);
        this.orange = new MyTriangleBig(scene);
        this.pink = new MyTriangle(scene);
        this.blue = new MyTriangleBig(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.purple = new MyTriangleSmall(scene);
        this.initMaterials();
    }

    initMaterials(){
        this.material1 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material1.setAmbient(1.0,0,0,1.0);

        this.material2 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material2.setAmbient(1, 0.584, 0, 1.0);


        this.material3 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material3.setAmbient(1, 0, 0.765, 1.0);

        this.material4 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material4.setAmbient(0, 0, 1, 1.0);


        this.material5 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material5.setAmbient(0, 1, 0, 1.0);


        this.material6 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material6.setAmbient(0, 1, 1, 1.0);


        this.material7 = new CGFappearance(this.scene);
        this.material1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material7.setAmbient(0.8, 0, 1, 1.0);
    }

    display(){

        this.scene.pushMatrix()
        this.scene.rotate(Math.PI/2, 0, 0, 1)
        this.material1.apply();
        this.red.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(Math.PI/4 + Math.PI/2, 0, 0, 1); 
        this.material2.apply();
        this.orange.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2*Math.sqrt(2) - 1, -2 * Math.sqrt(2) - 1, 0);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.material3.apply();
        this.pink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2), -3 * Math.sqrt(2), 0);
        this.scene.rotate(- (Math.PI/4 + Math.PI/2), 0, 0, 1);
        this.material4.apply();
        this.blue.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, -4 * Math.sqrt(2) + 0.5, 0);
        //this.material5.apply();
        this.scene.customMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2), - 4 * Math.sqrt(2), 0);
        this.scene.rotate((Math.PI/4), 0, 0, 1);
        this.scene.scale(-1, 1, 1);
        this.material6.apply();
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2) - Math.sqrt(2)/2 - 0.5, - (4 * Math.sqrt(2) + 0.5 + Math.sqrt(2)/2), 0);
        this.scene.rotate(-( Math.PI/2 + Math.PI/4 ), 0, 0, 1);
        this.material7.apply();
        this.purple.display();
        this.scene.popMatrix();


        this.primitiveType = this.scene.gl.TRIANGLES;

    }

    enableNormalViz(){
        this.parallelogram.enableNormalViz();
        this.diamond.enableNormalViz();
        this.red.enableNormalViz();
        this.purple.enableNormalViz();
        this.orange.enableNormalViz();
        this.blue.enableNormalViz();
        this.pink.enableNormalViz();

    }

    disableNormalViz(){
        this.parallelogram.disableNormalViz();
        this.diamond.disableNormalViz();
        this.red.disableNormalViz();
        this.purple.disableNormalViz();
        this.orange.disableNormalViz();
        this.blue.disableNormalViz();
        this.pink.disableNormalViz();
    }
}