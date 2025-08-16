import { CGFobject, CGFappearance } from '../../lib/CGF.js';

export class MyPyramid extends CGFobject {
    constructor(scene, slices, height, radius, texturePath = null, drawBothSides=false) {
        super(scene);
        this.scene = scene;
        this.slices = slices;
        this.height = height;
        this.radius = radius;
        this.texturePath = texturePath;
        this.drawBothSides = drawBothSides;

        if (texturePath) {
            this.texture = new CGFappearance(scene);
            this.texture.loadTexture(texturePath);
            this.texture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        }

        this.initBuffers();
    }

    initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    const angleStep = 2 * Math.PI / this.slices;
    let index = 0;

    // ----- Side Faces -----
    for (let i = 0; i < this.slices; i++) {
        const angle1 = i * angleStep;
        const angle2 = ((i + 1) % this.slices) * angleStep;

        const x1 = Math.cos(angle1) * this.radius;
        const z1 = -Math.sin(angle1) * this.radius;
        const x2 = Math.cos(angle2) * this.radius;
        const z2 = -Math.sin(angle2) * this.radius;

        // Apex vertex
        this.vertices.push(0, this.height, 0);
        this.normals.push(0, 1, 0); // rough normal
        this.texCoords.push(0.5, 1.0);

        // First base vertex of triangle
        this.vertices.push(x1, 0, z1);
        this.normals.push(x1, this.height / 2, z1);
        this.texCoords.push(0.0, 0.0);

        // Second base vertex of triangle
        this.vertices.push(x2, 0, z2);
        this.normals.push(x2, this.height / 2, z2);
        this.texCoords.push(1.0, 0.0);

        // Triangle indices
        this.indices.push(index, index + 1, index + 2);
        if (this.drawBothSides) this.indices.push(index + 1, index, index + 2);
        index += 3;
    }

    // ----- Base -----
    const baseCenterIndex = index;
    this.vertices.push(0, 0, 0);
    this.normals.push(0, -1, 0);
    this.texCoords.push(0.5, 0.5);
    index++;

    for (let i = 0; i < this.slices; i++) {
        const angle1 = i * angleStep;
        const angle2 = ((i + 1) % this.slices) * angleStep;

        const x1 = Math.cos(angle1) * this.radius;
        const z1 = -Math.sin(angle1) * this.radius;
        const x2 = Math.cos(angle2) * this.radius;
        const z2 = -Math.sin(angle2) * this.radius;

        // First outer base vertex
        this.vertices.push(x1, 0, z1);
        this.normals.push(0, -1, 0);
        this.texCoords.push((x1 / this.radius + 1) / 2, (z1 / this.radius + 1) / 2);
        const v1 = index++;
        
        // Second outer base vertex
        this.vertices.push(x2, 0, z2);
        this.normals.push(0, -1, 0);
        this.texCoords.push((x2 / this.radius + 1) / 2, (z2 / this.radius + 1) / 2);
        const v2 = index++;

        // Triangle for base
        this.indices.push(baseCenterIndex, v1, v2);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}


    display() {
        if (this.texture) this.texture.apply();
        super.display();
    }
}
