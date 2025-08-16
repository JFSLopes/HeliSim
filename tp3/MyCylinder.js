import {CGFobject} from '../lib/CGF.js';


export class MyCylinder extends CGFobject{
    constructor(scene,slices,stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        var rad = 2*Math.PI / this.slices;
        for(var z = 0; z < this.stacks +1; z++){
            for (var index = 0; index < this.slices; index++){
                this.vertices.push(Math.cos(rad*index), Math.sin(rad*index),z);
            }
        }

        this.indices = []

        for (var lateral = 0; lateral < this.slices; lateral++){
            var lateral_adjust = (lateral+1) % this.slices;
            this.indices.push(lateral)
            this.indices.push(lateral + (this.stacks)*this.slices);
            this.indices.push(lateral_adjust + (this.stacks)*this.slices );
            this.indices.push(lateral_adjust + (this.stacks)*this.slices );
            this.indices.push(lateral_adjust)
            this.indices.push(lateral)
        }
        for (var lateral = 0; lateral < this.slices; lateral++){
            var lateral_adjust = (lateral+1) % this.slices;
            this.indices.push(lateral + (this.stacks)*this.slices);
            this.indices.push(lateral)
            this.indices.push(lateral_adjust+ (this.stacks)*this.slices);
            this.indices.push(lateral_adjust)
            this.indices.push(lateral_adjust + (this.stacks)*this.slices);
            this.indices.push(lateral)
        }


        this.normals = [];

        for(var andar = 0; andar < this.stacks+1; andar++){
            for(var vertices = 0; vertices < this.slices; vertices++){
                this.normals.push(Math.cos(vertices*rad),Math.sin(vertices*rad),0);
            }
        }
                
        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}