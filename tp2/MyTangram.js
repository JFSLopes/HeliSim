import {CGFobject} from '../lib/CGF.js';
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
    }

    display(){
        this.scene.pushMatrix()
        this.scene.rotate(Math.PI/2, 0, 0, 1)
        this.scene.setDiffuse(1,0,0,1);
        this.red.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(Math.PI/4 + Math.PI/2, 0, 0, 1); 
        this.scene.setDiffuse(1,0.584,0,1);
        this.orange.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2*Math.sqrt(2) - 1, -2 * Math.sqrt(2) - 1, 0);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.setDiffuse(1,0,0.765,1);
        this.pink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2), -3 * Math.sqrt(2), 0);
        this.scene.rotate(- (Math.PI/4 + Math.PI/2), 0, 0, 1);
        this.scene.setDiffuse(0,0,1,1);
        this.blue.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, -4 * Math.sqrt(2) + 0.5, 0);
        this.scene.setDiffuse(0,1,0,1);
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2), - 4 * Math.sqrt(2), 0);
        this.scene.rotate((Math.PI/4), 0, 0, 1);
        this.scene.scale(-1, 1, 1);
        this.scene.setDiffuse(1,1,0,1);
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2) - Math.sqrt(2)/2 - 0.5, - (4 * Math.sqrt(2) + 0.5 + Math.sqrt(2)/2), 0);
        this.scene.rotate(-( Math.PI/2 + Math.PI/4 ), 0, 0, 1);
        this.scene.setDiffuse(0.8,0,1,1);
        this.purple.display();
        this.scene.popMatrix();

        this.primitiveType = this.scene.gl.TRIANGLES;
    }
}