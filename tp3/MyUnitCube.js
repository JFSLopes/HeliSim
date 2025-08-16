import {CGFobject} from '../lib/CGF.js';

export class MyUnitCube extends CGFobject{
    constructor(scene){
        super(scene);
        this.initBuffers();
    }
    initBuffers(){
        this.vertices = [
            0.5, 0.5, 0.5,        //0
            0.5, -0.5, 0.5,       //1
            -0.5, -0.5, 0.5,      //2
            -0.5, 0.5, 0.5,       //3
            0.5, 0.5, -0.5,       //4
            0.5, -0.5, -0.5,      //5
            -0.5, -0.5, -0.5,     //6
            -0.5, 0.5, -0.5,      //7

            0.5, 0.5, 0.5,        //0
            0.5, -0.5, 0.5,       //1
            0.5, 0.5, -0.5,       //4
            0.5, -0.5, -0.5,      //5
            -0.5, -0.5, 0.5,      //2
            -0.5, 0.5, 0.5,       //3
            -0.5, -0.5, -0.5,     //6
            -0.5, 0.5, -0.5,      //7

            0.5, 0.5, 0.5,        //0
            -0.5, 0.5, -0.5,      //7
            -0.5, 0.5, 0.5,       //3
            0.5, 0.5, -0.5,       //4
            -0.5, -0.5, 0.5,      //2
            0.5, -0.5, -0.5,      //5
            -0.5, -0.5, -0.5,     //6
            0.5, -0.5, 0.5,       //1
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
        for (var index = 0; index < 4 ; index++) {
            this.normals.push(0,0,1);
        }
        for (var index = 0; index < 4 ; index++) {
            this.normals.push(0,0,-1);
        }
        for (var index = 0; index < 4 ; index++) {
            this.normals.push(1,0,0);
        }
        for (var index = 0; index < 4 ; index++) {
            this.normals.push(-1,0,0);
        }
        for (var index = 0; index < 4 ; index++) {
            this.normals.push(0,1,0);
        }
        for (var index = 0; index < 4 ; index++) {
            this.normals.push(0,-1,0);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers()
    }
}