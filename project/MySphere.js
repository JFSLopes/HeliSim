import {CGFobject} from '../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, radius, inverted = false){
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.inverted = inverted;
        this.initBuffers()
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

                // Normals: invert if necessary
                if (this.inverted)
                    this.normals.push(-x / this.radius, -y / this.radius, -z / this.radius);
                else
                    this.normals.push(x / this.radius, y / this.radius, z / this.radius);

                // Texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }


        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let first = (stack * (this.slices + 1)) + slice;
                let second = first + this.slices + 1;

                if (this.inverted) {
                    // Inverted winding order (Inside)
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                } else {
                    // Normal winding order (Outside)
                    this.indices.push(second, first, first + 1);
                    this.indices.push(second + 1, second, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}