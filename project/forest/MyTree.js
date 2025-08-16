import { CGFobject, CGFtexture } from '../../lib/CGF.js';
import { MyTrunk } from './MyTrunk.js';
import { MyPyramid } from './MyPyramid.js';

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export class MyTree extends CGFobject {
    constructor(scene, inclination, height, radius, color, trunkTexture, leafTexture, inclinationAxis = "x") {
        super(scene);

        this.inclination = inclination;
        this.height = height;
        this.radius = radius;
        this.color = color;
        this.trunkTexture = trunkTexture;
        this.leafTexture = leafTexture;
        this.inclinationAxis = inclinationAxis;

        // Trunk parameters
        this.trunkHeight = height * 0.6;
        this.trunkStacks = 4;
        this.trunkSlices = 16;
        this.stackHeight = this.trunkHeight / this.trunkStacks;

        // Leaf parameters
        this.leafHeight = height * 0.3;
        this.leafRadius = radius * 2.5;
        this.leafSlices = 6;

        // Create trunk and pyramid
        this.trunk = new MyTrunk(scene, this.trunkSlices, this.trunkStacks, this.trunkHeight / this.trunkStacks, radius, trunkTexture);
        this.pyramid = new MyPyramid(scene, this.leafSlices, this.leafHeight, this.leafRadius, leafTexture);
    }

    display() {
        this.scene.pushMatrix();
       
        // Incline along selected axis
        if (this.inclinationAxis === "x") {
            this.scene.rotate(this.inclination, 1, 0, 0);
        } else if (this.inclinationAxis === "z") {
            this.scene.rotate(this.inclination, 0, 0, 1);
        }

        // Display trunk
        this.trunk.display();

        // Display the pyramid at each stack above the first
        for (let i = 1; i < this.trunkStacks; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, this.stackHeight * i, 0);
            this.pyramid.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    getFlamePositions(numFlames) {
        const positions = [];

        for (let i = 0; i < numFlames; i++) {
            const leafIndex = getRandomArbitrary(0, this.trunkStacks-1); // which pyramid
            const leafSide = getRandomArbitrary(0, this.leafSlices); // which slice
            const heightOffset = getRandomArbitrary(0.0, this.leafHeight); // position along height

            const baseY = leafIndex * this.stackHeight + this.leafHeight / 2;
            const shrink = 1 - heightOffset / this.leafHeight;
            const angle = leafSide * (2 * Math.PI / this.leafSlices) + ((2 * Math.PI / this.leafSlices) / 2);

            // Adjusted coordinates
            const x = Math.sin(angle) * this.leafRadius * shrink;
            const y = baseY + heightOffset;
            const z = Math.cos(angle) * this.leafRadius * shrink;

            positions.push({ x, y, z, angle });
        }

        return positions;
    }
}