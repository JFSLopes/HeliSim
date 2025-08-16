import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

export class MyPanorama extends CGFobject{
    constructor(scene, texture){
        super(scene);
        this.sphere = new MySphere(scene, 20, 20, 200, true);

        // Texture
        this.sphereMaterial = new CGFappearance(scene);
        this.sphereMaterial.setTexture(texture);
    }

    display(){
        this.scene.pushMatrix();
        this.sphereMaterial.apply();

		// Camera position
		const pos = this.scene.camera.position;

        //this.scene.translate(pos[0], pos[1], pos[2]);
		this.sphere.display();
        this.scene.popMatrix();
    }
}