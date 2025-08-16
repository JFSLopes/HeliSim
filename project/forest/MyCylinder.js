import { CGFobject, CGFappearance } from '../../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, height, radius, texturePath, drawBothSides = false) {
        super(scene);
        this.slices = slices;
        this.height = height;
        this.radius = radius;
        this.texturePath = texturePath;
        this.drawBothSides = drawBothSides;
        this.initBuffers();
        this.initTexture();
    }

    initTexture() {
        this.texture = new CGFappearance(this.scene);
        if (this.texturePath != null) {
            this.texture.setAmbient(0.3, 0.3, 0.3, 1);
        } else {
            this.texture.setAmbient(1, 1, 1, 1);
        }
        this.texture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.texture.setSpecular(0.1, 0.1, 0.1, 1);
        this.texture.setShininess(10.0);
        if (this.texturePath != null) this.texture.loadTexture(this.texturePath);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleStep = 2 * Math.PI / this.slices;

        for (let i = 0; i <= this.slices; i++) {
            const angle = i * angleStep;
            const x = Math.cos(angle);
            const z = Math.sin(angle);

            // Bottom vertex
            this.vertices.push(this.radius * x, 0, this.radius * z);
            this.normals.push(x, 0, z);
            this.texCoords.push(i / this.slices, 1);

            // Top vertex
            this.vertices.push(this.radius * x, this.height, this.radius * z);
            this.normals.push(x, 0, z);
            this.texCoords.push(i / this.slices, 0);
        }

        // Create indices
        for (let i = 0; i < this.slices; i++) {
            const base = i * 2;
            this.indices.push(base, base + 1, base + 2);
            this.indices.push(base + 2, base + 1, base + 3);

            if (this.drawBothSides){
                this.indices.push(base + 1, base, base + 2);
                this.indices.push(base + 1, base + 2, base + 3);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display(applyTexture=true) {
        if(applyTexture) this.texture.apply();
        super.display();
    }
}