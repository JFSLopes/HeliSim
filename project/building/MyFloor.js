import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyRectangle } from './MyRectangle.js';

export class MyFloor extends CGFobject {
    constructor(scene, width, height, depth, windowsPerFloor, texturePath, buildingColor, wallTexture, sign="", isCentral = false) {
        super(scene);

        // Change the color
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.appearance.setDiffuse(...buildingColor, 1.0);
        this.appearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.appearance.setShininess(10.0);
        this.appearance.loadTexture(wallTexture);

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.windowsPerFloor = windowsPerFloor;
        this.texture = texturePath;
        this.buildingColor = buildingColor;
        this.sign = sign;
        this.isCentral = isCentral;

        if (isCentral){
            this.createDoor(scene);
        } else {
            this.createWindows(scene);
        }

        this.initBuffers();
    }

    createWindows(scene){
        this.windows = [];

        const windowHeight = this.height * 0.5; // fixed: 50% of floor height
        const spacingRatio = 0.1;               // 10% of floor width reserved for total spacing
        const totalSpacing = this.width * spacingRatio;
        const spacing = totalSpacing / (this.windowsPerFloor + 1); // spacing between and around

        let availableWidth = this.width - spacing * (this.windowsPerFloor + 1);
        let windowWidth = availableWidth / this.windowsPerFloor;

        // Ensure window is at most square
        windowWidth = Math.min(windowWidth, windowHeight);

        // Recalculate spacing if windowWidth got clamped
        availableWidth = windowWidth * this.windowsPerFloor;
        const leftoverSpace = this.width - availableWidth;
        const adjustedSpacing = leftoverSpace / (this.windowsPerFloor + 1);

        const y = (this.height - windowHeight) / 2;

        for (let i = 0; i < this.windowsPerFloor; i++) {
            const x = adjustedSpacing * (i + 1) + windowWidth * i;
            const win = new MyWindow(scene, windowWidth, windowHeight, this.texture);
            this.windows.push({ window: win, x: x, y: y });
        }
    }


    createDoor(scene) {
        const doorWidth = this.width * 0.3;
        const doorHeight = this.height * 0.5;
        const signHeight = this.height * 0.3;
        const signWidth = this.width * 0.7;
    
        const doorX = (this.width - doorWidth) / 2;
        const doorY = 0;
    
        const signX = (this.width - signWidth) / 2;
        const signY = doorHeight + (this.height - doorHeight - signHeight) / 2;
    
        this.door = {
            rectangle: new MyRectangle(scene, doorWidth, doorHeight, this.texture),
            x: doorX,
            y: doorY
        };
    
        this.sign = {
            rectangle: new MyRectangle(scene, signWidth, signHeight, this.sign),
            x: signX,
            y: signY
        };
    }


    initBuffers() {
        // Build the structure
        const w = this.width, h = this.height, d = this.depth;
        // Vertices duplicated per face
        this.vertices = [
            0, 0, 0,   w, 0, 0,   0, h, 0,   w, h, 0,   // Front face (normal: 0, 0, 1)
            w, 0, -d,  0, 0, -d,  w, h, -d,  0, h, -d,  // Back face (normal: 0, 0, -1)
            0, 0, -d,  0, 0, 0,   0, h, -d,  0, h, 0,   // Left face (normal: -1, 0, 0)
            w, 0, 0,   w, 0, -d,  w, h, 0,   w, h, -d,  // Right face (normal: 1, 0, 0)
            0, h, 0,   w, h, 0,   0, h, -d,  w, h, -d,  // Top face (normal: 0, 1, 0)
            0, 0, -d,  w, 0, -d,  0, 0, 0,   w, 0, 0,   // Bottom face (normal: 0, -1, 0)
        ];

        this.normals = [
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
            -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
            0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
            0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
        ];

        this.indices = [
            0, 1, 2,  2, 1, 3,       // Front
            4, 5, 6,  6, 5, 7,       // Back
            8, 9,10, 10, 9,11,       // Left
            12,13,14, 14,13,15,      // Right
            16,17,18, 18,17,19,      // Top
            20,21,22, 22,21,23       // Bottom
        ];

        this.texCoords = [
            // Front face
            0, 1,  1, 1,  0, 0,  1, 0,
            // Back face
            0, 1,  1, 1,  0, 0,  1, 0,
            // Left face
            0, 1,  1, 1,  0, 0,  1, 0,
            // Right face
            0, 1,  1, 1,  0, 0,  1, 0,
            // Top face
            0, 1,  1, 1,  0, 0,  1, 0,
            // Bottom face
            0, 1,  1, 1,  0, 0,  1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    display() {
        this.appearance.apply();
        super.display(); // draws the base cube

        if (this.isCentral){

            // Draw door
            this.scene.pushMatrix();
            this.scene.translate(this.door.x, this.door.y, 0.2);
            this.door.rectangle.display();
            this.scene.popMatrix();

            // Draw sign
            this.scene.pushMatrix();
            this.scene.translate(this.sign.x, this.sign.y, 0.2);
            this.sign.rectangle.display();
            this.scene.popMatrix();

        } else {

            for (let { window, x, y } of this.windows) {
                this.scene.pushMatrix();
                this.scene.translate(x, y, 0.15); // slightly in front of front face
                window.display();
                this.scene.popMatrix();
            }

        }
    }
}