import { CGFappearance, CGFobject } from "../../lib/CGF.js";

export class MyFlame extends CGFobject {
    constructor(scene, texture){
        super(scene);
        this.texture = texture;
        this.initBuffers();
        this.initMaterials();

		this.FPS = 5;
		this.currentFPS = 0;
		this.frameDuration = 1/this.FPS * 1000;	// miliseconds
		this.time = Date.now();
    }

    initBuffers() {
		this.vertices = [
			0, 0, 0,	//0
			0, 1, 0,	//1
			1, 0, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			2, 0, 1,
			0, 2, 1
		];

		this.texCoords = [
			0.5, 1.0,
			0.0, 0.0,
			1.0, 0.0
		];
		
		this.updateTexCoordsGLBuffers();

		this.normals = [];
		for (var index = 0; index < 3; index++) {
			this.normals.push(0,0,1);
		}
		for (var index = 0; index < 3; index++) {
			this.normals.push(0,0,-1);
		}

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

    initMaterials(){
        this.flame = new CGFappearance(this.scene);
        this.flame.setAmbient(1, 0.5, 0, 1);
        this.flame.setDiffuse(1, 0.5, 0, 1);
        this.flame.setSpecular(1, 0.5, 0, 1);
        this.flame.setShininess(5);
        this.flame.setTexture(this.texture);
    }
    
	display() {
		this.flame.apply();
		super.display();
	}

	updateFrame(){
		const now = Date.now();

		// Only update timeFactor every frameDuration ms
		if (now - this.time >= this.frameDuration) {
			this.currentFPS++;
			this.time = now;
		}
		
		return this.currentFPS;
	}
}