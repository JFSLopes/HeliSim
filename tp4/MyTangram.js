import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleBig } from './MyTriangleBig.js';
import { MyTriangleSmall } from './MyTriangleSmall.js';

export class MyTangram extends CGFobject {
    constructor(scene){
        super(scene);
        this.diamond = new MyDiamond(scene);
        this.red = new MyTriangleSmall(scene,[0.25,0.75,0.5,0.5,0.75,0.75]);
        this.orange = new MyTriangleBig(scene,[1,0,0.5,0.5,1,1]);
        this.pink = new MyTriangle(scene);
        this.blue = new MyTriangleBig(scene,[0,0,1,0,0.5,0.5]);
        this.parallelogram = new MyParallelogram(scene);
        this.purple = new MyTriangleSmall(scene,[0,0,0.25,0.25,0,0.5]);
        this.intiMaterials();
    }
    intiMaterials(){
        this.material = new CGFappearance(this.scene);
        this.texture = new CGFtexture(this, 'images/tangram.png');
        this.material.setAmbient(0.1, 0.1, 0.1, 1);
        this.material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
        this.material.loadTexture('images/tangram.png');
        this.material.setTextureWrap('REPEAT', 'REPEAT');
    }

    display(){
        this.scene.pushMatrix()
        this.scene.rotate(Math.PI/2, 0, 0, 1)
        this.material.apply();
        this.red.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(Math.PI/4 + Math.PI/2, 0, 0, 1); 
        this.material.apply();
        this.orange.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2*Math.sqrt(2) - 1, -2 * Math.sqrt(2) - 1, 0);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.material.apply();
        this.pink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2), -3 * Math.sqrt(2), 0);
        this.scene.rotate(- (Math.PI/4 + Math.PI/2), 0, 0, 1);
        this.material.apply();
        this.blue.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, -4 * Math.sqrt(2) + 0.5, 0);
        this.material.apply();
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2), - 4 * Math.sqrt(2), 0);
        this.scene.rotate((Math.PI/4), 0, 0, 1);
        this.scene.scale(-1, 1, 1);
        this.material.apply();
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2) - Math.sqrt(2)/2 - 0.5, - (4 * Math.sqrt(2) + 0.5 + Math.sqrt(2)/2), 0);
        this.scene.rotate(-( Math.PI/2 + Math.PI/4 ), 0, 0, 1);
        this.material.apply();
        this.purple.display();
        this.scene.popMatrix();

        

        this.primitiveType = this.scene.gl.TRIANGLES;
    }
}