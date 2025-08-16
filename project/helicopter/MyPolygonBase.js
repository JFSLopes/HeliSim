import { CGFobject, CGFappearance } from '../../lib/CGF.js';

export class MyPolygonBase extends CGFobject {
    constructor(scene, radius, sides, texturePath, invert=false) {
        super(scene);
        this.radius = radius;
        this.sides = sides;
        this.texturePath = texturePath;
        this.invert = invert;
        this.initBuffers();
        this.initTexture();
    }

    initTexture() {
            this.texture = new CGFappearance(this.scene);
            this.texture.setAmbient(1, 1, 1, 1);    
            this.texture.setDiffuse(0.9, 0.9, 0.9, 1);
            this.texture.setSpecular(0.1, 0.1, 0.1, 1);
            this.texture.setShininess(10.0);
            this.texture.loadTexture(this.texturePath);
        }

    initBuffers() {
        const angleStep = 2 * Math.PI / this.sides;

        this.vertices = [0, 0, 0]; // center vertex
        this.normals = [0, 1, 0];
        this.texCoords = [0.5, 0.5];
        this.indices = [];

        for (let i = 0; i < this.sides; i++) {
            const angle = i * angleStep;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0);  
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 - 0.5 * Math.sin(angle));
        }

        for (let i = 1; i <= this.sides; i++) {
            const next = i === this.sides ? 1 : i + 1;
            if (this.invert){
                this.indices.push(i, 0, next);
            } else {
                this.indices.push(0, i, next);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display(){
        this.scene.pushMatrix();
        this.texture.apply();
        super.display();
        this.scene.popMatrix();
    }
}