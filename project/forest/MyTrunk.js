import { CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';

export class MyTrunk extends CGFobject {
    constructor(scene, slices, stacks, height, radius, texturePath) {
        super(scene);
        this.scene = scene;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radius = radius;

        this.cylinder = new MyCylinder(scene, slices, height, radius, texturePath);
    }

    display() {
        for (let i = 0; i < this.stacks; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, i * this.height, 0);
            this.cylinder.display();
            this.scene.popMatrix();
        }
    }
}