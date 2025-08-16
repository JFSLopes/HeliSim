import {CGFobject} from '../lib/CGF.js';
/**
 * TriangleRectangleAux
 * @constructor
 * @param scene - Reference to MyScene object
 * @param size - Represents the size of the triangle to be displayed
 */
export class MyTriangleAux extends CGFobject {
    constructor(scene, size) {
        super(scene);
        this.initBuffers(size);
    }
    
    initBuffers(size) {
        this.vertices = [
            0, size, 0,	//0
            -size, 0, 0,	//1
            size, 0, 0,	//2
            0, size, 0,	//0
            -size, 0, 0,	//1
            size, 0, 0,	//2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 0, 2
        ];

        this.normals = [];
        for(var index = 0; index < 3; index++){
            this.normals.push(0,0,1);        
        }
        for(var index = 0; index < 3; index++){
            this.normals.push(0,0,-1);        
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}