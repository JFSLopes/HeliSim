import { CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../forest/MyCylinder.js';
import { MyPyramid } from '../forest/MyPyramid.js';
import { MyPolygonBase } from './MyPolygonBase.js';

export class MyBucket extends CGFobject {
    constructor(scene, bucketDimensions, bucketStartCoors) {
        super(scene);
        this.ropeLength = bucketDimensions.y;
        this.ropeRadius = bucketDimensions.z * 0.1;
        this.bucketRadius = bucketDimensions.z;
        this.bucketHeight = bucketDimensions.y * 0.2;
        this.startCoors = bucketStartCoors;

        // Rope
        this.rope = new MyCylinder(scene, 10, this.ropeLength, this.ropeRadius, 'textures/rope.jpg');

        // Bucket body
        this.bucketBody = new MyCylinder(scene, 6, this.bucketHeight * 0.8, this.bucketRadius, 'textures/metal.jpg', true);

        // Bucket bottom
        this.bucketBottom = new MyPyramid(scene, 6, this.bucketHeight * 0.2, this.bucketRadius, 'textures/metal.jpg', true);

        // Water
        this.water = new MyPolygonBase(scene, this.bucketRadius, 6, 'textures/water.jpeg');
    }

    display(isBucketFull, velocity, drawBottom) {
        //console.log(velocity);
        this.scene.pushMatrix();

        // --- Apply inclination based on velocity ---
        const velX = velocity.x;
        const velZ = velocity.z;
        const tiltAmount = Math.min(Math.sqrt(velX ** 2 + velZ ** 2) * 0.05, Math.PI/36); // max 5

        // CRotation axis perpendicular to velocity
        const axisX = -velZ;
        const axisZ = velX;
        const axisLength = Math.sqrt(axisX ** 2 + axisZ ** 2);
        if (axisLength > 0.0001) {
            this.scene.rotate(tiltAmount, axisX / axisLength, 0, axisZ / axisLength);
        }
        
        this.scene.translate(this.startCoors.x, this.startCoors.y, this.startCoors.z)

        // --- Draw rope ---
        this.rope.display();

        // --- Draw bucket body ---
        this.bucketBody.display();

        // --- Draw bucket bottom (flipped) ---
        if (drawBottom){
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.bucketBottom.display();
        }

        // --- Draw water if full ---
        if (isBucketFull) {
            this.scene.pushMatrix();
            this.scene.translate(0, -(this.bucketHeight * 0.8), 0);
            this.water.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    getBucketHeight(){
        return this.bucketHeight / 2;
    }

    getBucketRadius(){
        return this.bucketRadius;
    }
}