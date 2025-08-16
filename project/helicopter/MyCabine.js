import {CGFappearance, CGFobject, CGFtexture} from '../../lib/CGF.js';
import { MyWindowPatch } from './MyWindowPatch.js';

export class MyCabine extends CGFobject {
    constructor(scene, cabineDimensions){
        super(scene);
        this.slices = 20;
        this.stacks = 20;
        this.scaleFactor = cabineDimensions.x / cabineDimensions.z;
        this.radius = cabineDimensions.z;
        this.window = new MyWindowPatch(this.scene,cabineDimensions.z);
        this.initMaterials()
        this.initBuffers()
    }

    initMaterials(){
        this.cabineMaterial = new CGFappearance(this.scene);
        this.cabineMaterial.setDiffuse(0.4, 0, 0, 1);
        this.cabineMaterial.setAmbient(0.4, 0, 0, 1);
        this.cabineMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.cabineMaterial.setShininess(10.0);
    }

    initBuffers(){
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        const delta_y = 2 * Math.PI / this.slices; // theta
        const delta_z = Math.PI / this.stacks;     // phi

        for (let stack = 0; stack <= this.stacks; stack++) {
            let phi = stack * delta_z;
            let sin_phi = Math.sin(phi);
            let cos_phi = Math.cos(phi);

            for (let slice = 0; slice <= this.slices; slice++) {
                let theta = slice * delta_y;

                let x = this.radius * sin_phi * Math.cos(theta);
                let z = this.radius * sin_phi * Math.sin(theta);
                let y = this.radius * cos_phi;

                this.vertices.push(x, y, z);

                // Normals (unit vector from origin to point)
                this.normals.push(x / this.radius, y / this.radius, z / this.radius);


                // Texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }


        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let first = (stack * (this.slices + 1)) + slice;
                let second = first + this.slices + 1;

                // Outside view
                this.indices.push(first + 1, second, first);
                this.indices.push(first + 1, second + 1, second);                

            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display(){
        this.scene.pushMatrix();
        this.scene.scale(this.scaleFactor, 1, 1);

        this.scene.pushMatrix();
        this.scene.translate(-0.08,0,0);

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.window.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(- 3 * Math.PI / 4, 0, 1, 0);
        this.window.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.cabineMaterial.apply();
        super.display();
        this.scene.popMatrix();
    }
}