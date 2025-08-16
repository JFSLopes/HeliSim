import { CGFobject } from "../../lib/CGF.js";

export class MyPad extends CGFobject{
    constructor(scene,length, width, depth){
        super(scene);
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.initBuffers();
    }
    initBuffers(){
        this.vertices = [
            +this.length/2,  this.depth/2, -this.width/2,   // 0
            +this.length/2, -this.depth/2, -this.width/2,   // 1
            -this.length/2, -this.depth/2, -this.width/2,   // 2
            -this.length/2,  this.depth/2, -this.width/2,   // 3
        
            +this.length/2,  this.depth/2, this.width/2,   // 4
            +this.length/2, -this.depth/2, this.width/2,   // 5
            -this.length/2, -this.depth/2, this.width/2,   // 6
            -this.length/2,  this.depth/2, this.width/2,   // 7
        ]

        this.indices = [
            0, 1, 2,
            2, 3 ,0,

            5, 4, 6,
            7, 6, 4,

            5, 6, 2,
            2, 1 ,5,

            4, 0, 3,
            3, 7, 4,

            1, 0, 4,
            4, 5, 1,

            3, 2, 7,
            7, 2, 6,

        ]

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers()
    }
}