import {CGFobject, CGFtexture} from '../../lib/CGF.js';

export class MyWindow extends CGFobject{
    constructor(scene, width, height, texturePath) {
        super(scene);
        this.width = width;
        this.height = height;
        this.texture = new CGFtexture(scene, texturePath);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0,
            this.width, 0, 0,
            0, this.height, 0,
            this.width, this.height, 0
        ];

        this.indices = [0, 1, 2, 2, 1, 3];

        this.normals = Array(4).fill([0, 0, 1]).flat();
        this.texCoords = [
            0, 1, 1, 1,
            0, 0, 1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.texture.bind();
        super.display();
    }
}

