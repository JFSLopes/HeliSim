import { CGFobject, CGFappearance } from '../../lib/CGF.js';

export class MyCube extends CGFobject{
    constructor(scene, dimension, maxValue, color){
        super(scene);
        this.baseColor = color;
        this.maxValue = maxValue;
        this.dimension = dimension/2;
        this.initBuffers();

        // Material
        this.material = new CGFappearance(this.scene);
        this.material.setSpecular(0, 0, 0, 0);
        this.material.setShininess(10);
    }
    initBuffers(){
        this.vertices = [
            this.dimension, this.dimension, this.dimension,        //0
            this.dimension, -this.dimension, this.dimension,       //1
            -this.dimension, -this.dimension, this.dimension,      //2
            -this.dimension, this.dimension, this.dimension,       //3
            this.dimension, this.dimension, -this.dimension,       //4
            this.dimension, -this.dimension, -this.dimension,      //5
            -this.dimension, -this.dimension, -this.dimension,     //6
            -this.dimension, this.dimension, -this.dimension,      //7

            this.dimension, this.dimension, this.dimension,        //0
            this.dimension, -this.dimension, this.dimension,       //1
            this.dimension, this.dimension, -this.dimension,       //4
            this.dimension, -this.dimension, -this.dimension,      //5
            -this.dimension, -this.dimension, this.dimension,      //2
            -this.dimension, this.dimension, this.dimension,       //3
            -this.dimension, -this.dimension, -this.dimension,     //6
            -this.dimension, this.dimension, -this.dimension,      //7

            this.dimension, this.dimension, this.dimension,        //0
            -this.dimension, this.dimension, -this.dimension,      //7
            -this.dimension, this.dimension, this.dimension,       //3
            this.dimension, this.dimension, -this.dimension,       //4
            -this.dimension, -this.dimension, this.dimension,      //2
            this.dimension, -this.dimension, -this.dimension,      //5
            -this.dimension, -this.dimension, -this.dimension,     //6
            this.dimension, -this.dimension, this.dimension,       //1
        ];
        this.indices = [
            0, 1, 2,
            1, 0, 2,
            0, 3, 2,
            3, 0, 2,

            4, 5, 6,
            5, 4, 6,
            4, 7, 6,
            7, 4, 6,

            0, 4, 3,
            4, 0, 3,
            4, 7, 3,
            7, 4, 3,

            2, 5, 6,
            5, 2, 6,
            1, 2, 5,
            2, 1, 5,

            0, 1, 4,
            1, 0, 4,
            1, 5, 4,
            5, 1, 4,

            2, 3, 6,
            3, 2, 6,
            3, 7, 6,
            7, 3, 6
        ];

        this.normals = [];
        for (var index = 0; index < 4 ; index++) this.normals.push(0, 0, 1);   // Front
        for (var index = 0; index < 4 ; index++) this.normals.push(0, 0, -1);  // Back
        for (var index = 0; index < 4 ; index++) this.normals.push(1, 0, 0);   // Right
        for (var index = 0; index < 4 ; index++) this.normals.push(-1, 0, 0);  // Left
        for (var index = 0; index < 4 ; index++) this.normals.push(0, 1, 0);   // Top
        for (var index = 0; index < 4 ; index++) this.normals.push(0, -1, 0);  // Bottom

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers()
    }

    display(frame) {
        const [r, g, b] = this.baseColor;
        const attenuation = 0.5;

        // Update material colors
        this.material.setAmbient(r * attenuation, g * attenuation, b * attenuation, 1);
        this.material.setDiffuse(r * attenuation, g * attenuation, b * attenuation, 1);

        this.scene.pushMatrix();
        this.material.apply();
        super.display();
        this.scene.popMatrix();
    }
}