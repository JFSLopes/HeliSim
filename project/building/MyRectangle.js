import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';

export class MyRectangle extends CGFobject {
    constructor(scene, width, height, texturePath, maxTexCoor = 1) {
        super(scene);
        this.width = width;
        this.height = height;
        this.texture = texturePath;
        this.maxTexCoor = maxTexCoor;

        this.initBuffers();
        this.loadTexture();
    }

    initBuffers() {
        const w = this.width;
        const h = this.height;

        this.vertices = [
            0, 0, 0,
            w, 0, 0,
            0, h, 0,
            w, h, 0
        ];

        this.indices = [
            0, 1, 2,
            2, 1, 3
        ];

        this.normals = [
            0, 0, 1,  0, 0, 1,
            0, 0, 1,  0, 0, 1
        ];

        this.texCoords = [
            0, this.maxTexCoor,  this.maxTexCoor, this.maxTexCoor,
            0, 0,                this.maxTexCoor, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    loadTexture() {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(1, 1, 1, 1);
        this.appearance.setDiffuse(1, 1, 1, 1);
        this.appearance.setSpecular(0, 0, 0, 1);
        this.appearance.setShininess(10.0);
        this.appearance.setTexture(new CGFtexture(this.scene, this.texture));
        this.appearance.setTextureWrap("REPEAT", "REPEAT");
    }

    display() {
        this.appearance.apply();
        super.display();
    }
}