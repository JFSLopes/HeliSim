import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';

export class MyWindowPatch extends CGFobject {
    constructor(scene, radius = 1) {
        super(scene);
        this.radius = radius;
        this.slices = 10;
        this.stacks = 10;
        this.initMaterials();
        this.initBuffers();
    }

    initMaterials() {
        this.windowTexture = new CGFtexture(this.scene, 'textures/cabine_window.jpg');
        this.windowMaterial = new CGFappearance(this.scene);
        this.windowMaterial.setDiffuse(1, 1, 1, 1);
        this.windowMaterial.setAmbient(1, 1, 1, 1);
        this.windowMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.windowMaterial.setShininess(10.0);
        this.windowMaterial.setTexture(this.windowTexture);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const thetaMin = Math.PI / 4;
        const thetaMax = Math.PI / 2;
        const phiMin = Math.PI / 4;
        const phiMax = Math.PI / 2;

        const uMin = 0.3;
        const uMax = 0.5;
        const vMin = 0.4;
        const vMax = 0.6;

        for (let stack = 0; stack <= this.stacks; stack++) {
            const phi = phiMin + (phiMax - phiMin) * (stack / this.stacks);

            for (let slice = 0; slice <= this.slices; slice++) {
                const theta = thetaMin + (thetaMax - thetaMin) * (slice / this.slices);

                const x = this.radius * Math.sin(phi) * Math.cos(theta);
                const z = this.radius * Math.sin(phi) * Math.sin(theta);
                const y = this.radius * Math.cos(phi);

                this.vertices.push(x, y, z);
                this.normals.push(x / this.radius, y / this.radius, z / this.radius);

                const u = uMin + (uMax - uMin) * (slice / this.slices);
                const v = vMin + (vMax - vMin) * (stack / this.stacks);
                this.texCoords.push(u, v);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = (stack * (this.slices + 1)) + slice;
                const second = first + this.slices + 1;

                this.indices.push(first + 1, second, first);
                this.indices.push(first + 1, second + 1, second);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.windowMaterial.apply();
        super.display();
    }
}
