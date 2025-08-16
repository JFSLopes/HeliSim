import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';


export class MyUnitCubeQuad extends CGFobject{
    constructor(scene, texture1, texture2, texture3, texture4, texture5, texture6 ){
        super(scene);
        this.initBuffers();
        this.initMaterials(texture1, texture2, texture3, texture4, texture5, texture6);
    }

    initBuffers(){
        this.quad = new MyQuad(this.scene);
    }

    initMaterials(texture1,texture2,texture3,texture4,texture5,texture6){

        this.material1 = new CGFappearance(this.scene)
        this.material1.setAmbient(0.1, 0.1, 0.1, 1);
        this.material1.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material1.setSpecular(0.1, 0.1, 0.1, 1);
        this.material1.setShininess(10.0);
        this.material1.setTextureWrap('REPEAT', 'REPEAT');
        this.material1.setTexture(texture1);

        this.material2 = new CGFappearance(this.scene)
        this.material2.setAmbient(0.1, 0.1, 0.1, 1);
        this.material2.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material2.setSpecular(0.1, 0.1, 0.1, 1);
        this.material2.setShininess(10.0);
        this.material2.setTextureWrap('REPEAT', 'REPEAT');
        this.material2.setTexture(texture2);


        this.material3 = new CGFappearance(this.scene)
        this.material3.setAmbient(0.1, 0.1, 0.1, 1);
        this.material3.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material3.setSpecular(0.1, 0.1, 0.1, 1);
        this.material3.setShininess(10.0);
        this.material3.setTextureWrap('REPEAT', 'REPEAT');
        this.material3.setTexture(texture3);


        this.material4 = new CGFappearance(this.scene)
        this.material4.setAmbient(0.1, 0.1, 0.1, 1);
        this.material4.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material4.setSpecular(0.1, 0.1, 0.1, 1);
        this.material4.setShininess(10.0);
        this.material4.setTextureWrap('REPEAT', 'REPEAT');
        this.material4.setTexture(texture4);

        this.material5 = new CGFappearance(this.scene)
        this.material5.setAmbient(0.1, 0.1, 0.1, 1);
        this.material5.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material5.setSpecular(0.1, 0.1, 0.1, 1);
        this.material5.setShininess(10.0);
        this.material5.setTextureWrap('REPEAT', 'REPEAT');
        this.material5.setTexture(texture5);

        this.material6 = new CGFappearance(this.scene)
        this.material6.setAmbient(0.1, 0.1, 0.1, 1);
        this.material6.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material6.setSpecular(0.1, 0.1, 0.1, 1);
        this.material6.setShininess(10.0);
        this.material6.setTextureWrap('REPEAT', 'REPEAT');
        this.material6.setTexture(texture6);
    }
    
    display(){

        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.scene.rotate(Math.PI,0,0,1);
        this.scene.rotate(Math.PI,1,0,0);
        this.material5.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);
        this.material2.apply();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.material3.apply();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.material4.apply();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.material1.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.material6.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.quad.display();
        this.scene.popMatrix();        
    }
}