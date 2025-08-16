import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyRectangle } from './building/MyRectangle.js';
import { MyPlane } from './MyPlane.js'

export class MyLake extends CGFobject {
    constructor(scene, x, z, x_dimension, z_dimension, texture) {
        super(scene);
        this.x = x; // Lake position on X axis
        this.z = z; // Lake position on Z axis
        this.x_dimension = x_dimension;
        this.z_dimension = z_dimension;

        // Use a rectangle to simulate water
        this.water = new MyRectangle(scene, z_dimension, x_dimension, texture, 1.5);

        // Water animation
        this.waterTex = new CGFtexture(this.scene, "/project/textures/water.jpeg");
        this.waterMap = new CGFtexture(this.scene, "/project/textures/waterMap.jpg");
    }

    isOverLake(coor){
        if (coor.x < this.x || coor.x > this.x + this.x_dimension) return false;
        if (coor.z < this.z || coor.z > this.z + this.z_dimension) return false;
        return true;       
    }

    display() {
        this.scene.setActiveShader(this.scene.waterShader);
        this.scene.pushMatrix();
        const time = this.scene.time;
        this.scene.waterShader.setUniformsValues({
			timeFactor: time,
			uSampler2: 1
		});
		this.waterMap.bind(1);

        this.scene.translate(this.x, 1, this.z);    // Move to the correct place
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);   // -90° around Y axis just for alignment reasons
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.water.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}