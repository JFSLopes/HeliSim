import { CGFobject } from '../lib/CGF.js';
import { MyCabine } from './helicopter/MyCabine.js';
import { MyCabineHelice } from './helicopter/MyCabineHelice.js';
import { MyHelipad } from './helicopter/MyHelipad.js';
import { MyTail } from './helicopter/MyTail.js';
import { MyBucket } from './helicopter/MyBucket.js';
import { MyCylinder } from './forest/MyCylinder.js';
import { MyPolygonBase } from './helicopter/MyPolygonBase.js';

const Direction = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
    CRUISING: 'cruising',
    MOVING_TO_POSITION: 'moving_to_position',
    ON_GROUND: 'on_ground',
    FLOATING: 'floating',            // When the helicopter is over the water
    DROP_WATER: 'drop_water'
};


/**
 * MyHeliDummy represents a helicopter with a basic state machine to control its behavior and animations.
 * 
 * FLOW OVERVIEW:
 * - The helicopter has multiple states defined in the `Direction` enum: ASCENDING, DESCENDING, CRUISING, MOVING_TO_POSITION, and ON_GROUND.
 * 
 * - MyScene (or external controller) triggers actions (like `ascend()`, `descend(height)`, or `moving_to_position(coord)`) that:
 *      1. First call `canTransitionTo(newState)` to check if the state change is allowed from the current state.
 *      2. If allowed, update the `velocity` vector to reflect the movement, among other things.
 *      3. Set `this.state` to the new state.
 *      4. Store any extra information necessary for the transition in `this.stateData` (e.g., target height or position).
 * 
 * - The method `updatePosition()` is called each frame to:
 *      1. Update the helicopter’s position based on the current velocity.
 *      2. Call `dealWithStates()` to check if a transition should happen due to state completion (e.g., reaching cruise altitude, reaching a target position).
 * 
 * - The `dealWithStates()` method handles automatic state changes:
 *      - For ASCENDING: switches to CRUISING when target altitude is reached.
 *      - For DESCENDING: switches to ON_GROUND when target height is reached.
 *      - For MOVING_TO_POSITION: checks if the target is reached, and if so, calls an optional callback (e.g., to descend).
 * 
 * - Inclination and rotation controls (`inclineForward`, `turn`, `accelerate`) are only active in CRUISING mode.
 * 
 * - `reset()` is used internally to reset speed and orientation, while optionally resetting position.
 * 
 * - `display()` renders the helicopter with the appropriate translation, inclination, and rotation.
 * 
 * The key idea is that MyScene triggers transitions, and the state machine manages the flow, animation steps, and automatic transitions.
 */
export class MyHelicopter extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);
        
        // Data for helicopter parts
        this.cabineDimensions = {x:5, y:2.5, z:2.5};

        this.tailDimensions = {x: 1.5*this.cabineDimensions.x, y:this.cabineDimensions.y/2, z: this.cabineDimensions.z/2};
        this.tailStartCoors = {x: this.cabineDimensions.x / 2, y:0, z:0};

        this.cabineHeliceDimensions = {x: 1.5 * this.cabineDimensions.x, y:1.5 * this.cabineDimensions.y, z: this.cabineDimensions.z};
        this.cabineHeliceStartCoors = {x: 0, y:0, z:0};

        this.padDimensions = {x: this.cabineDimensions.x, y:1.3 * this.cabineDimensions.y, z: this.cabineHeliceDimensions.z};
        this.padStartCoors = {x: 0, y:0, z:0};

        this.bucketDimensions = {x: this.cabineDimensions.x, y:4 * this.cabineDimensions.y, z: this.cabineDimensions.z / 1.5};   // Rope included
        this.bucketStartCoors = {x:0, y: -this.bucketDimensions.y, z:0};

        class Helicopter extends CGFobject{
            constructor(scene, cabineDimensions, tailDimensions, tailStartCoors, cabineHeliceDimensions, cabineHeliceStartCoors, padDimensions, padStartCoors, bucketDimensions, bucketStartCoors) {
                super(scene);
                this.cabineDimensions = cabineDimensions;

                this.parts = {
                    cabine: new MyCabine(scene, cabineDimensions),
                    tail: new MyTail(scene, tailDimensions, tailStartCoors),
                    cabineHelice: new MyCabineHelice(scene, cabineHeliceDimensions, cabineHeliceStartCoors),
                    pad: new MyHelipad(scene, padDimensions, padStartCoors),
                    bucket: new MyBucket(scene, bucketDimensions, bucketStartCoors),
                };
            }

            display(heliceAngle, showBucket, isBucketFull, velocity, drawBottom){
                this.parts.cabine.display();
                this.parts.tail.display(heliceAngle);
                this.parts.cabineHelice.display(heliceAngle);
                this.parts.pad.display();
                if (showBucket) {
                    this.scene.pushMatrix();
                    this.scene.translate(0, -this.cabineDimensions.y, 0)
                    this.parts.bucket.display(isBucketFull, velocity, drawBottom);
                    this.scene.popMatrix();
                }
            }
        }

        // Data for the helicopter parts
        this.helicopter = new Helicopter(scene, this.cabineDimensions, this.tailDimensions, this.tailStartCoors, this.cabineHeliceDimensions, this.cabineHeliceStartCoors, this.padDimensions, this.padStartCoors, this.bucketDimensions, this.bucketStartCoors);

        // Heli coordinates
        this.coor = {x: x, y: y, z: z};
        this.resetCoor = {x: x, y: y, z: z};

        // Variables for controling the movement
        this.angle = 0;                         // orientation around Y axis

        this.heliceAngle = 0;                   // Helice rotation angle (used for the top and back helices)
        this.heliceRotationSpeed = 0.15;
        this.heliceRotationMaxSpeed = 5;

        this.velocity = { x: 0, y: 0, z: 0 };   // Velocity vector, is not normalized
        this.inclination = 0;                   // angle of inclination along X axis
        this.maxSpeed = 6;

        // Data for controlling heli animations
        this.heightOffset = 20;
        this.cruiseAltitude = y + this.heightOffset;  // Maximum height (Helipad height + offset)
        this.maxVerticalSpeed = 3;     // Used for the 'L' animations
        this.state = Direction.ON_GROUND;
        this.bucketFull = false;
        this.stateData = null;      // When a state uses extra info, like the moving to target, then fills this with info
        this.speedFactor = 1;       // Default
        this.showBucket = false;
        this.lowestHeightWithBucket = this.helicopter.parts.bucket.getBucketHeight() + this.cabineDimensions.y;
        this.acceleration = this.scene.acceleration;
        this.hasOriented = false;
        this.blockInput = false;    // Used when auto pilot is on, so user input does not affect it

        // Water animation
        this.drawBottom = true;
        this.waterAnimationDuration = 1;
        this.waterAnimationFPS = 20;
        this.previousTime = Date.now();
        this.waterAnimationFrameDuration = 1 / this.waterAnimationFPS * 1000;
        this.waterPosition = null;
        this.waterFallingSpeed = {x:0, y:-this.cruiseAltitude / (this.waterAnimationDuration * this.waterAnimationFPS), z: 0};
        this.fireExtinguished = false;

        class Water extends CGFobject{
            constructor(scene, height, radius){
                super(scene);

                this.height = height;
                this.water = new MyCylinder(scene, 16, height, radius, "./textures/water.jpeg", true);
                this.baseUp = new MyPolygonBase(scene, radius, 16, "./textures/water.jpeg", true);
                this.baseDown = new MyPolygonBase(scene, radius, 16, "./textures/water.jpeg");
            }

            display(){
                this.water.display();
                this.baseDown.display();
                this.scene.pushMatrix();
                this.scene.translate(0, this.height, 0);
                this.baseUp.display();
                this.scene.popMatrix();
            }
        }
        this.water = new Water(scene, this.helicopter.parts.bucket.getBucketHeight(), this.helicopter.parts.bucket.getBucketRadius());
        this.flattingFactor = 1; // affects radius
        this.heightFactor = 1;   // affects height
    }

    isAscending(){
        return this.state == Direction.ASCENDING;
    }

    isDescending(){
        return this.state == Direction.DESCENDING;
    }

    getCoordinates(){
        return {...this.coor};
    }

    updateSpeedFactor(scalar){
        this.speedFactor = scalar;
    }

    computeTravelDistance(startSpeed, endSpeed, acceleration) {
        let speed = startSpeed;
        let distance = 0;
        const dir = endSpeed > startSpeed ? 1 : -1;
        while ((dir === 1 && speed < endSpeed) || (dir === -1 && speed > endSpeed)) {
            distance += speed;
            speed += dir * acceleration;
        }
        return distance;
    }

    reset(resetPosition) {
        if (resetPosition){
            this.coor.x = this.resetCoor.x;
            this.coor.y = this.resetCoor.y;
            this.coor.z = this.resetCoor.z;
            this.angle = 0;
            this.velocity = { x: 0, y: 0, z: 0 };
            this.bucketFull = false;
            this.state = Direction.ON_GROUND;
            this.heliceAngle = 0;
            this.showBucket = false;
            this.fireExtinguished = false;
            this.blockInput = false;
            this.hasOriented = false;
        }

        this.inclination = 0;
    }

    ascend() {
        if (this.blockInput) return;
        if (!this.canTransitionTo(Direction.ASCENDING)) return;

        // Only was vertical speed
        this.velocity = { x:0, y:0, z:0 };
        this.state = Direction.ASCENDING;
    }

    descend(height) {
        if (this.blockInput) return;
        if (!this.canTransitionTo(Direction.DESCENDING)) return;

        // Only was vertical speed
        this.velocity = { x:0, y:0, z:0 };
        this.stateData = {targetHeight: height};
        this.state = (height === this.lowestHeightWithBucket )? Direction.FLOATING : Direction.DESCENDING;

        if (this.state == Direction.DESCENDING){
            this.showBucket = false;
        }
    }

    
    moving_to_position(coor, offset){
        if (!this.canTransitionTo(Direction.MOVING_TO_POSITION)) return;

        this.stateData = {
            offset: offset,
            target: coor,
            onArrival: () => this.descend(coor.y)
        };
        this.state = Direction.MOVING_TO_POSITION;
    }

    drop_water(){
        if (this.blockInput) return;
        if (!this.canTransitionTo(Direction.DROP_WATER)) return;

        this.waterPosition = { ...this.coor };
        this.waterPosition.y -= this.bucketDimensions.y;
        // Update water speed so looks more natural
        this.waterFallingSpeed.x = this.velocity.x;
        this.waterFallingSpeed.z = this.velocity.z;

        this.state = Direction.DROP_WATER;
        this.drawBottom = false;
        this.bucketFull = false;
    }

    turn(v) {
        if (this.blockInput) return;
        if (this.state != Direction.CRUISING && this.state != Direction.DROP_WATER && this.state != Direction.MOVING_TO_POSITION) return;  // Not allow unless is at cruise altitude

        this.angle += v * this.speedFactor;

        // Update the spedd vector, it only changes direction
        const speed = Math.sqrt(this.velocity.x**2 + this.velocity.z**2);

        this.velocity.x = speed * Math.sin(this.angle);
        this.velocity.z = speed * Math.cos(this.angle);
    }

    accelerate(v) {
        if (this.blockInput) return;
        if (this.state != Direction.CRUISING && this.state != Direction.DROP_WATER && this.state != Direction.MOVING_TO_POSITION) return; // Only allows the heli to move if it is at cruise altitude

        // Compute current speed. It does not change the direction
        let currentSpeed = Math.sqrt(this.velocity.x**2 + this.velocity.z**2);

        currentSpeed = Math.min(this.maxSpeed, currentSpeed + v * this.speedFactor);
        if (currentSpeed < 0) currentSpeed = 0;

        this.velocity.x = currentSpeed * Math.sin(this.angle);
        this.velocity.z = currentSpeed * Math.cos(this.angle);

    }

    accelerate_vertically(v){
        if (this.blockInput) return;
        if (this.state != Direction.ASCENDING && this.state != Direction.DESCENDING && this.state != Direction.FLOATING) return;

        let currentSpeed;
        if (Math.sign(v) > 0){  // Ascending
            currentSpeed = Math.min(this.maxVerticalSpeed, (this.velocity.y + v) * this.speedFactor);
        } else if (Math.sign(v) < 0) {    // Descending
            currentSpeed = Math.max(-this.maxVerticalSpeed, (this.velocity.y + v) * this.speedFactor);
        }
        this.velocity.y = currentSpeed;
    }

    updatePosition() {
        // Deal with special cases
        this.dealWithStates();
        
        if (this.state == Direction.MOVING_TO_POSITION) this.blockInput = true;

        this.coor.x += this.velocity.x;
        this.coor.y += this.velocity.y;
        this.coor.z += this.velocity.z;
    }

    setStartCoors(coors){
        this.resetCoor = coors;
        this.cruiseAltitude = coors.y + this.heightOffset;
        this.reset(true);
    }

    inclineForward() {
        if (this.state != Direction.CRUISING && this.state != Direction.DROP_WATER && this.state != Direction.MOVING_TO_POSITION) return; // Cannot move unless is at cruise altitude

        this.inclination = 0.2;  // Increase the inclination
    }

    inclineBackward() {
        if (this.state != Direction.CRUISING && this.state != Direction.DROP_WATER && this.state != Direction.MOVING_TO_POSITION) return; // Cannot move unless is at cruise altitude

        this.inclination = -0.2;  // Decrease the inclination
    }

    removeInclination(){
        if (this.state != Direction.CRUISING && this.state != Direction.DROP_WATER && this.state != Direction.MOVING_TO_POSITION) return; // Cannot move unless is at cruise altitude

        this.inclination = 0;
    }


    canTransitionTo(newState) {
        switch (this.state) {
            case Direction.ASCENDING:
                return false; // Can’t interrupt ascending movement
            case Direction.DESCENDING:
                return false;
            case Direction.MOVING_TO_POSITION:
                if (newState == Direction.DESCENDING) return true; // If is moving to a place, allow it to start descending after reached the target position
                return false; // Allow to finish reaching destination
            case Direction.CRUISING:
                if (this.bucketFull){
                    if (newState == Direction.DROP_WATER) return true;
                    else return false;
                }
                if (newState == Direction.DESCENDING || newState == Direction.MOVING_TO_POSITION) return true;
                return false;
            case Direction.ON_GROUND:
                if (newState == Direction.ASCENDING) return true;
                return false;
            case Direction.FLOATING:
                if (newState == Direction.ASCENDING) return true;
                return false;
            case Direction.DROP_WATER:
                if (newState == Direction.CRUISING) return true;
                return false;
            default:
                throw new Error(`State '${this.state}' not implemented in canTransitionTo function`);
        }
    }


    dealWithStates(){
        this.heliceAngle += Math.min(this.heliceRotationMaxSpeed, this.heliceRotationSpeed + this.heliceRotationSpeed);   // Update the helice rotation
        switch (this.state){

            case Direction.ON_GROUND:
                this.heliceAngle = 0;   // Is the only state
                break;

            case Direction.ASCENDING:
                this.heliceRotationSpeed += this.heliceRotationSpeed;
                if (this.coor.y >= this.cruiseAltitude){
                    // Reset some variables
                    this.reset(false);

                    // Update the heli state
                    this.coor.y = this.cruiseAltitude;
                    this.state = Direction.CRUISING;
                    this.velocity = {x:0, y:0, z:0};    // reset 
                } else {
                    this.accelerate_vertically(this.acceleration);
                }
                break;


            case Direction.DESCENDING:
                if (this.coor.y < this.stateData.targetHeight){
                    // Reset some variables
                    this.reset(false);

                    // Update the heli state
                    this.coor.y = this.stateData.targetHeight;
                    this.state = Direction.ON_GROUND;
                    this.velocity = {x:0, y:0, z:0};    // reset 
                } else {
                    this.accelerate_vertically(-this.acceleration);
                }
                break;


            case Direction.MOVING_TO_POSITION:
                this.blockInput = false;
                const target = this.stateData.target;
                const dx = target.x - this.coor.x;
                const dz = target.z - this.coor.z;
                let distance = Math.sqrt(dx ** 2 + dz ** 2);
                const scalarSpeed = this.getScalarSpeed();

                const targetAngle = Math.atan2(dx, dz);
                let angleDiff = targetAngle - this.angle;
                angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI) - Math.PI;

                // Snap to target if we've passed it
                if (this.hasOriented && this.prevDistance !== undefined && this.prevDistance < distance){   // Must snap heli, because got over the helipad
                    this.snapToTarget(target);
                    distance = 0;
                }
                this.prevDistance = distance;

                // Close enough
                if ((distance < this.stateData.offset)) {
                    this.finishMovement();
                    break;
                }

                // Orientation logic
                if (!this.hasOriented) {
                    this.decelerateAndOrient(angleDiff, scalarSpeed);
                    break;
                }

                // Slight adjustment mid-movement if still misaligned
                if (Math.abs(angleDiff) > this.scene.turnAngle * this.speedFactorp) {
                    this.angle += angleDiff;
                }

                // Movement logic
                const accelerationStep = this.acceleration * this.speedFactor;
                const speed = Math.min(scalarSpeed, this.maxSpeed);
                const accelDist = this.computeTravelDistance(speed, this.maxSpeed, accelerationStep);
                const brakeDist = this.computeTravelDistance(speed, 0, accelerationStep);
                const availableDist = this.getAvailableDist(accelerationStep);

                this.handleAcceleration(distance, brakeDist, accelDist);

                break;


            case Direction.FLOATING:
                if (this.coor.y < this.stateData.targetHeight){
                    // Reset some variables
                    this.reset(false);

                    // Update the heli state
                    this.coor.y = this.stateData.targetHeight;
                    this.state = Direction.FLOATING;
                    this.velocity = {x:0, y:0, z:0};    // reset
                    this.bucketFull = true;
                } else if (this.coor.y != this.stateData.targetHeight){
                    this.accelerate_vertically(-this.acceleration);
                }
                break;

            case Direction.CRUISING:
                this.showBucket = true;
                break;

            case Direction.DROP_WATER:

                if (this.waterPosition.y < 0){    // Animations ended
                    if (this.scene.forest.isInside(this.waterPosition.x, this.waterPosition.z)){
                        this.fireExtinguished = true;
                    } else {
                        this.fireExtinguished = false;
                    }
                    this.state = Direction.CRUISING;
                    this.drawBottom = true;
                    this.bucketFull = false;
                    this.waterPosition = null;
                    this.flattingFactor = 1;
                    break;
                }

                const now = Date.now();
                if (now - this.previousTime > this.waterAnimationFrameDuration){
                    this.previousTime = now;
                    // Update water position
                    this.waterPosition.x += this.waterFallingSpeed.x;
                    this.waterPosition.y += this.waterFallingSpeed.y;
                    this.waterPosition.z += this.waterFallingSpeed.z;

                    const fallDistance = this.cruiseAltitude; // from cruise to ground
                    const fallen = this.cruiseAltitude - this.waterPosition.y;
                    const progress = Math.min(1, fallen / fallDistance);

                    // Flattening animation
                    this.flattingFactor = 1 + progress * 1.5;     // grows up to 2.5x width
                    this.heightFactor = 1 - progress * 0.7;       // shrinks down to 0.3x height
                }
                break;
        }
    }

    getScalarSpeed(){
        return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2);
    }

    nextPosition(accelerationStep){
        // Compute current speed. It does not change the direction
        let currentSpeed = Math.sqrt(this.velocity.x**2 + this.velocity.z**2);

        currentSpeed = Math.min(this.maxSpeed, currentSpeed + accelerationStep);
        if (currentSpeed < 0) currentSpeed = 0;

        const auxSpeed = {x:currentSpeed * Math.sin(this.angle), y:0, z:currentSpeed * Math.cos(this.angle)};
        let nextPos = {...this.coor};
        nextPos.x += auxSpeed.x;
        nextPos.z += auxSpeed.z;
        return nextPos;
    }

    getAvailableDist(accelerationStep){
        const nextPos = this.nextPosition(accelerationStep);
        const dx = this.stateData.target.x - nextPos.x;
        const dz = this.stateData.target.z - nextPos.z;
        return Math.sqrt(dx ** 2 + dz ** 2);
    }

    preventOvershoot(availableDist, distance){
        const scalar = this.getScalarSpeed();
        this.velocity.x = availableDist / distance * this.velocity.x;
        this.velocity.z = availableDist / distance * this.velocity.z;
    }

    snapToTarget(target) {
        this.coor.x = target.x;
        this.coor.z = target.z;
        this.velocity.x = 0;
        this.velocity.z = 0;
    }

    finishMovement() {
        this.removeInclination();
        this.blockInput = false;
        this.hasOriented = false;
        this.stateData.onArrival();
    }

    decelerateAndOrient(angleDiff, scalarSpeed) {
        this.accelerate(-this.acceleration);
        this.inclineBackward();
        if (scalarSpeed !== 0) return;

        this.removeInclination();

        const threshold = this.scene.turnAngle * this.speedFactor;
        if (Math.abs(angleDiff) > threshold) {
            const turnDir = angleDiff > 0 ? this.scene.turnAngle : -this.scene.turnAngle;
            this.turn(turnDir, angleDiff);
        } else {
            this.angle += angleDiff;
            this.hasOriented = true;
        }
    }

    handleAcceleration(distance, brakeDist, accelDist) {
        //console.log(distance,brakeDist, accelDist );
        if (distance < accelDist + brakeDist) {
            if (distance > brakeDist) {
                //console.log(1);
                this.inclineForward();
                this.accelerate(this.acceleration);
            } else {
                //console.log(2);
                this.inclineBackward();
                this.accelerate(-this.acceleration);
            }
        } else {
            //console.log(3);
            this.inclineForward();
            this.accelerate(this.acceleration);
        }
    }


    display() {
        if (this.waterPosition){
            this.scene.pushMatrix();
            this.scene.translate(this.waterPosition.x, this.waterPosition.y, this.waterPosition.z);
            this.scene.scale(this.flattingFactor, this.heightFactor, this.flattingFactor);
            this.water.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.coor.x, this.coor.y, this.coor.z);
        this.scene.rotate(this.angle, 0, 1, 0);
        this.scene.rotate(this.inclination, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(0, this.padDimensions.y, 0);
        this.helicopter.display(this.heliceAngle, this.showBucket, this.bucketFull, this.velocity, this.drawBottom);
        this.scene.popMatrix();
    }
}