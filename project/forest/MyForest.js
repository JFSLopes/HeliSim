import { CGFobject, CGFtexture } from "../../lib/CGF.js";
import { MyTree } from "./MyTree.js";
import { MyFlame } from './MyFlame.js';
import { MyFire } from "./MyFire.js";

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
} 

export class MyForest extends CGFobject {
    constructor(scene, lines, columns, position) {
        super(scene);
        this.scene = scene;
        this.lines = lines;
        this.columns = columns;
        this.spacing = 15; // base grid spacing
        this.maxOffset = 5; // max random offset in x and z
        this.position = position;
        this.hasFire = true;

        this.trees = []; // [{ x, z, tree }]

        // Flames info
        this.flameTexture = new CGFtexture(this.scene, './textures/flame.jpg');
        this.flame = new MyFlame(scene, this.flameTexture);
        this.flames = [];    // [{x, y, z}]

        //Big Fire
        this.fireNum = 20
        this.fire = new MyFire(this.scene, './textures/flame.jpg');
        this.fires = [];

        this.initForest();
        for (let n = 0; n < this.fireNum; n++){
            const x = getRandomArbitrary(this.getBounds().minX, this.getBounds().maxX);
            const z = getRandomArbitrary(this.getBounds().minZ, this.getBounds().maxZ);
            const y = 0;
            const rotation = Math.random() * 2 * Math.PI;
            this.fires.push({x, y, z, rotation});
        }
        this.initBuffers();
    }

    initForest() {
        this.leafTextures = ['textures/leaf1.jpg', 'textures/leaf2.jpg', 'textures/leaf3.jpg'];
        this.trunkTextures = ['textures/trunk1.jpg', 'textures/trunk2.jpg', 'textures/trunk3.jpg'];

        for (let i = 0; i < this.lines; i++) {
            for (let j = 0; j < this.columns; j++) {
                const inclination = getRandomArbitrary(-Math.PI / 8, Math.PI / 8);
                const color = [
                    getRandomArbitrary(0, 50) / 255,
                    getRandomArbitrary(100, 255) / 255,
                    getRandomArbitrary(0, 50) / 255
                ];
                const height = getRandomArbitrary(30, 60);
                const radius = getRandomArbitrary(2, 5);
                const leafText = this.leafTextures[Math.floor(Math.random() * this.leafTextures.length)];
                const trunkText = this.trunkTextures[Math.floor(Math.random() * this.trunkTextures.length)];

                const offsetX = getRandomArbitrary(-this.maxOffset, this.maxOffset);
                const offsetZ = getRandomArbitrary(-this.maxOffset, this.maxOffset);

                const x = j * this.spacing + offsetX;
                const z = i * this.spacing + offsetZ;

                const tree = new MyTree(this.scene, inclination, height, radius, color, trunkText, leafText, true);
                this.trees.push({ x, z, tree });

                // Create fire (For each tree add [0,3] flames)
                const flamePositions = tree.getFlamePositions(getRandomArbitrary(0, 15));
                for (const relPos of flamePositions) {
                    this.flames.push({
                        x: x + relPos.x,
                        y: relPos.y,
                        z: z + relPos.z,
                        angle: relPos.angle,
                        scale : Math.random() + 1
                    });
                }
            }
        }
    }

    reset(){
        this.hasFire = true;
    }

    display() { //change the parameter
        this.scene.pushMatrix();
        this.scene.translate(this.position.x, 0, this.position.z); // translate whole forest
        for (const { x, z, tree } of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(x, 0, z);
            tree.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();

        if(this.hasFire){
            // Draw all flames in a single shader pass
            this.scene.setActiveShader(this.scene.flameShader);
            this.scene.flameShader.setUniformsValues({timeFactor: this.flame.updateFrame() });

            for (const { x, y, z, angle, scale} of this.flames) {
                this.scene.pushMatrix();
                this.scene.translate(this.position.x + x, y, this.position.z + z);
                this.scene.rotate(angle, 0, 1, 0);
                this.scene.scale(scale,scale,scale);
                this.flame.display();
                this.scene.popMatrix();
            }
            this.scene.setActiveShader(this.scene.fireShader);
            this.scene.fireShader.setUniformsValues({timeFactor: this.flame.updateFrame() });
            for (const {x,y,z,rotation} of this.fires){
                this.scene.pushMatrix();
                this.scene.translate(x, y, z);
                this.scene.rotate(rotation, 0, 1, 0);
                this.fire.display();
                this.scene.popMatrix();
            }
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }

    // Returns bounding rectangle: { minX, maxX, minZ, maxZ }
    getBounds() {
        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (const { x, z } of this.trees) {
            const worldX = x + this.position.x;
            const worldZ = z + this.position.z;
            if (worldX < minX) minX = worldX;
            if (worldX > maxX) maxX = worldX;
            if (worldZ < minZ) minZ = worldZ;
            if (worldZ > maxZ) maxZ = worldZ;
        }

        return { minX, maxX, minZ, maxZ };
    }

    // Check if point is inside forest bounds
    isInside(x, z) {
        const { minX, maxX, minZ, maxZ } = this.getBounds();
        return x >= minX && x <= maxX && z >= minZ && z <= maxZ;
    }
}