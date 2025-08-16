import { CGFobject, CGFappearance} from "../../lib/CGF.js";
import { MyPyramid } from './MyPyramid.js';

export class MyFire extends CGFobject{
    constructor(scene, texture){
        super(scene);
        this.texture = texture;
        this.fire = new MyPyramid(this.scene, 6, 15, 4, null);
        this.initBuffers();
        this.initMaterials();
    }
    initMaterials(){
        this.flame = new CGFappearance(this.scene);
        this.flame.setAmbient(1, 0.5, 0, 1);
        this.flame.setDiffuse(1, 0.5, 0, 1);
        this.flame.setSpecular(1, 0.5, 0, 1);
        this.flame.setShininess(5);
        this.flame.loadTexture(this.texture);
    }

    display() {
		this.flame.apply();
		this.fire.display();
	}
}